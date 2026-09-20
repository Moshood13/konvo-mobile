/**
 * The Konvo Firestore domain model.
 *
 * This file is the single source of truth for document shapes and is compiled by
 * BOTH programs: the Expo app, and `functions/` (whose tsconfig pulls it in via
 * `include`).
 *
 * Keep it TYPE-ONLY — no imports, no `const`, no `enum`. Both programs compile it,
 * so any runtime value here would have to be valid in two very different
 * environments at once: React Native under Metro, and Node 20 under the Admin SDK.
 * An import of `firebase/firestore` for a `Timestamp` type, for instance, would drag
 * the client SDK into the Cloud Functions build. Hence the structural
 * `FirestoreTimestamp` below instead of either SDK's concrete class.
 *
 * Two representations exist for every timestamped document:
 *   - `*Doc`  — the wire shape, with Firestore `Timestamp` values.
 *   - the UI shape, with `number` (epoch ms), produced by `converters.ts`.
 * No `Timestamp` object should ever reach a screen.
 */

/** Structurally compatible with both firebase/firestore and firebase-admin Timestamps. */
export interface FirestoreTimestamp {
	seconds: number;
	nanoseconds: number;
	toMillis(): number;
	toDate(): Date;
}

export type ConversationType = "direct" | "group";
export type MemberRole = "member" | "admin";
export type MessageType = "text" | "image" | "system";

/** Local-only send states. Never persisted to Firestore. */
export type OutgoingStatus = "queued" | "sending" | "sent" | "failed";

/** What a bubble renders as a tick. Derived from receipts, not stored per message. */
export type ReceiptState = "sending" | "failed" | "sent" | "delivered" | "read";

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------

export interface UserDoc {
	uid: string;
	email: string;
	displayName: string;
	/** Lowercased `displayName`, so prefix search needs no extra index gymnastics. */
	displayNameLower: string;
	/** E.164, e.g. "+2348012345678". Collected at onboarding but NOT verified. */
	phoneE164: string | null;
	/** SHA-256 of `phoneE164`. Contact discovery matches on this so the raw numbers
	 *  of people who are not users never leave the device. */
	phoneHash: string | null;
	photoUrl: string | null;
	/** Cloudinary public_id, kept so a replacement overwrites rather than duplicates. */
	photoPublicId: string | null;
	about: string;
	defaultLanguage: string | null;
	/** False between first sign-in and finishing profile setup. Gates the navigator. */
	profileComplete: boolean;
	createdAt: FirestoreTimestamp;
	updatedAt: FirestoreTimestamp;
}

/**
 * users/{uid}/devices/{deviceId} — one per install, so a token refresh overwrites in
 * place rather than accumulating dead entries in an array field.
 *
 * Nothing sends push notifications yet: doing so needs a server to hold the
 * credentials, and the free plan has no Cloud Functions. The shape is defined now so
 * that adding a sender later requires no data migration.
 */
export interface DeviceDoc {
	deviceId: string;
	expoPushToken: string;
	platform: "ios" | "android";
	appVersion: string;
	createdAt: FirestoreTimestamp;
	lastSeenAt: FirestoreTimestamp;
}

// ---------------------------------------------------------------------------
// conversations
// ---------------------------------------------------------------------------

export interface LastMessage {
	id: string;
	senderId: string;
	/** Denormalized so the chat list needs no user lookups. */
	senderName: string;
	type: MessageType;
	/** Truncated to 120 chars by the fanout function. */
	preview: string;
	createdAt: FirestoreTimestamp;
	deleted: boolean;
}

export interface ConversationDoc {
	id: string;
	type: ConversationType;
	/**
	 * THE source of truth for membership, and therefore for every authorization
	 * decision in firestore.rules. It lives here rather than in a subcollection
	 * because a batch's rules are evaluated against the pre-batch database state:
	 * a child document's rule cannot verify a parent that the same batch is creating,
	 * and the `!exists(parent)` escape hatch that would paper over it lets an attacker
	 * pre-seed themselves into a not-yet-created conversation with a guessable id.
	 *
	 * Not queried with array-contains — the per-user inbox serves the chat list.
	 */
	memberIds: string[];
	/** Subset of memberIds. Empty for direct conversations. */
	admins: string[];
	memberCount: number;
	createdBy: string;
	createdAt: FirestoreTimestamp;
	/** Equals lastMessage.createdAt. Sort key mirrored onto every inbox doc. */
	updatedAt: FirestoreTimestamp;
	/** Group only; null for direct conversations. */
	name: string | null;
	photoUrl: string | null;
	lastMessage: LastMessage | null;
}

/**
 * conversations/{cid}/receipts/{uid} — readable by every member.
 *
 * Monotonic pointers rather than a `readBy` array on each message. Marking 100
 * messages read in a 50-member group costs 50 writes here instead of 5,000
 * array-unions on hot documents, and the cost does not grow with history. Every
 * tick state and the per-member Message Info screen are derivable by comparing
 * these two pointers against a message's createdAt.
 */
export interface ReceiptDoc {
	uid: string;
	lastReadAt: FirestoreTimestamp | null;
	/** Written by the recipient's own client, never by the push function — a push
	 *  ticket does not prove the payload reached the device. */
	lastDeliveredAt: FirestoreTimestamp | null;
	updatedAt: FirestoreTimestamp;
}

/**
 * users/{uid}/conversations/{cid} — the private per-user chat index.
 *
 * The chat list renders from one listener on this collection. Unread counts live
 * here rather than in a map on the shared conversation doc because rules cannot
 * restrict a member to mutating only their own key of a map.
 */
export interface InboxDoc {
	conversationId: string;
	type: ConversationType;
	/** Group name, or the peer's displayName for a direct conversation. */
	title: string;
	photoUrl: string | null;
	peerUid: string | null;
	lastMessage: LastMessage | null;
	updatedAt: FirestoreTimestamp;
	unreadCount: number;
	lastReadAt: FirestoreTimestamp | null;
	mutedUntil: FirestoreTimestamp | null;
	pinned: boolean;
	archived: boolean;
	/** "Clear chat": hide everything at or before this instant. Filtered with a
	 *  range on createdAt, the same field the query orders by, so no composite index. */
	clearedBefore: FirestoreTimestamp | null;
	/** False after leaving a group: history stays visible, the composer does not. */
	active: boolean;
	role: MemberRole;
}

// ---------------------------------------------------------------------------
// messages
// ---------------------------------------------------------------------------

/**
 * A Cloudinary asset. No separate thumbnail is uploaded: Cloudinary derives one from
 * the same asset on request (`.../upload/w_320,q_50,f_auto/...`), so there is one
 * upload per image rather than two, and the thumbnail is generated lazily and cached
 * at their CDN. Build derived URLs with the helper in src/services/media, never by
 * string-concatenating at a call site.
 */
export interface ImagePayload {
	publicId: string;
	url: string;
	/** Of the full image, so the list can reserve layout and not jump on load. */
	width: number;
	height: number;
	bytes: number;
}

/** A snapshot, not a live reference. If the quoted message is later retracted the
 *  quote keeps its text, matching WhatsApp. */
export interface ReplyQuote {
	messageId: string;
	senderId: string;
	senderName: string;
	type: MessageType;
	/** Up to ~90 chars, or "" for an image-only message. */
	preview: string;
	thumbUrl: string | null;
}

export interface ForwardRef {
	conversationId: string;
	messageId: string;
	originalSenderId: string;
	originalSenderName: string;
}

export type SystemEventKind =
	| "group_created"
	| "member_added"
	| "member_removed"
	| "member_left"
	| "group_renamed"
	| "group_photo_changed"
	| "admin_granted";

export interface SystemEvent {
	kind: SystemEventKind;
	actorId: string;
	actorName: string;
	targetIds: string[];
	targetNames: string[];
	/** New group name, or similar. */
	value: string | null;
}

export interface MessageDoc {
	/** Client-generated uuid v7: monotonic, so it doubles as a stable sort tiebreaker
	 *  and lets the optimistic bubble and the server document share a key. */
	id: string;
	senderId: string;
	/** Denormalized so group bubbles render a name without a join. */
	senderName: string;
	type: MessageType;
	text: string | null;
	image: ImagePayload | null;
	replyTo: ReplyQuote | null;
	forwardedFrom: ForwardRef | null;
	/** Server-emitted only; rules reject a client-written system message. */
	system: SystemEvent | null;
	/** serverTimestamp(). Reads back as null in the local echo — sort by
	 *  `createdAt ?? clientCreatedAt` or pending messages jump on server ack. */
	createdAt: FirestoreTimestamp;
	clientCreatedAt: number;
	deletedForEveryone: boolean;
	deletedForEveryoneAt: FirestoreTimestamp | null;
	/** "Delete for me". Firestore has no array-not-contains, so this is filtered
	 *  client-side; a 30-document page may therefore render fewer than 30 rows. */
	deletedFor: string[];
}

// ---------------------------------------------------------------------------
// UI-facing shapes (Timestamp -> epoch ms), produced by converters.ts
// ---------------------------------------------------------------------------

type WithMillis<T> = {
	[K in keyof T]: T[K] extends FirestoreTimestamp
		? number
		: T[K] extends FirestoreTimestamp | null
			? number | null
			: T[K] extends LastMessage | null
				? LastMessageView | null
				: T[K];
};

export type LastMessageView = WithMillis<LastMessage>;
export type UserProfile = WithMillis<UserDoc>;
export type Conversation = WithMillis<ConversationDoc>;
/** A group member as the member-list UI renders them: their profile plus their role. */
export interface GroupMember {
	uid: string;
	displayName: string;
	photoUrl: string | null;
	about: string;
	role: MemberRole;
}
export type Receipt = WithMillis<ReceiptDoc>;
export type InboxItem = WithMillis<InboxDoc>;
export type Message = WithMillis<MessageDoc>;

/** A message as the list renders it: the server document plus local send state. */
export interface ChatMessage extends Message {
	localStatus?: OutgoingStatus;
	/** 0..1 while an image is uploading. */
	uploadProgress?: number;
	/** Shown instead of image.url until the upload completes. */
	localImageUri?: string | null;
}
