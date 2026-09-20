/**
 * Every Firestore path in one place. Call sites never build a path string by hand —
 * a typo in a collection name fails as "permission denied" from a rule that does not
 * match, which is one of the least obvious errors to debug in this stack.
 */

export const usersCollection = "users";
export const conversationsCollection = "conversations";

export const userDoc = (uid: string) => `${usersCollection}/${uid}`;
export const userDevicesCollection = (uid: string) => `${userDoc(uid)}/devices`;
export const userDeviceDoc = (uid: string, deviceId: string) =>
	`${userDevicesCollection(uid)}/${deviceId}`;

/** users/{uid}/conversations/{cid} — the private per-user chat-list index. */
export const inboxCollection = (uid: string) => `${userDoc(uid)}/conversations`;
export const inboxDoc = (uid: string, conversationId: string) =>
	`${inboxCollection(uid)}/${conversationId}`;

export const conversationDoc = (conversationId: string) =>
	`${conversationsCollection}/${conversationId}`;
export const receiptsCollection = (conversationId: string) =>
	`${conversationDoc(conversationId)}/receipts`;
export const receiptDoc = (conversationId: string, uid: string) =>
	`${receiptsCollection(conversationId)}/${uid}`;
export const messagesCollection = (conversationId: string) =>
	`${conversationDoc(conversationId)}/messages`;
export const messageDoc = (conversationId: string, messageId: string) =>
	`${messagesCollection(conversationId)}/${messageId}`;

/**
 * Deterministic id for a 1:1 conversation, so two people tapping "message" at the
 * same moment converge on one document instead of creating two.
 *
 * firestore.rules enforces this exact format for `type: "direct"` — the id pins the
 * membership and the membership pins the id. Without that, anyone could compute two
 * other people's future DM id and create it with themselves inside. Any change here
 * must be mirrored in the `directIdMatches` rule function.
 */
export const directConversationId = (a: string, b: string): string =>
	`dm_${[a, b].sort().join("_")}`;

/** RTDB paths. Presence and typing only. */
export const presencePath = (uid: string) => `status/${uid}`;
export const typingPath = (conversationId: string) => `typing/${conversationId}`;
export const typingUserPath = (conversationId: string, uid: string) =>
	`${typingPath(conversationId)}/${uid}`;
