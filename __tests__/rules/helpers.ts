import { readFileSync } from "fs";
import { resolve } from "path";
import {
	initializeTestEnvironment,
	RulesTestEnvironment,
	RulesTestContext,
} from "@firebase/rules-unit-testing";

export const PROJECT_ID = "konvo-rules-test";

export const ALICE = "alice_uid";
export const BOB = "bob_uid";
export const CAROL = "carol_uid";
/** Not a member of any conversation the tests create. */
export const MALLORY = "mallory_uid";

/** Must match src/services/firebase/paths.ts and the rule `directIdMatches`. */
export const directId = (a: string, b: string) => `dm_${[a, b].sort().join("_")}`;

export const createTestEnv = (): Promise<RulesTestEnvironment> =>
	initializeTestEnvironment({
		projectId: PROJECT_ID,
		firestore: {
			rules: readFileSync(resolve(__dirname, "../../firestore.rules"), "utf8"),
			host: "127.0.0.1",
			port: 8080,
		},
	});

export const dbAs = (env: RulesTestEnvironment, uid: string) =>
	env.authenticatedContext(uid).firestore();

export const dbUnauthed = (env: RulesTestEnvironment) => env.unauthenticatedContext().firestore();

/**
 * Seeds a conversation plus each member's receipt and inbox document, with rules
 * disabled. Mirrors what the client does across two writes (conversation first, then
 * the member-scoped batch) without having to satisfy the rules to set up a test.
 */
export const seedConversation = async (
	env: RulesTestEnvironment,
	options: {
		conversationId: string;
		type: "direct" | "group";
		memberIds: string[];
		admins?: string[];
	},
) => {
	const { conversationId, type, memberIds, admins = [] } = options;

	await env.withSecurityRulesDisabled(async (context: RulesTestContext) => {
		const db = context.firestore();
		const conversation = db.doc(`conversations/${conversationId}`);

		await conversation.set({
			id: conversationId,
			type,
			memberIds,
			admins,
			memberCount: memberIds.length,
			createdBy: memberIds[0],
			createdAt: new Date(),
			updatedAt: new Date(),
			name: type === "group" ? "Test group" : null,
			photoUrl: null,
			lastMessage: null,
		});

		for (const member of memberIds) {
			await conversation.collection("receipts").doc(member).set({
				uid: member,
				lastReadAt: null,
				lastDeliveredAt: null,
				updatedAt: new Date(),
			});

			await db.doc(`users/${member}/conversations/${conversationId}`).set({
				conversationId,
				type,
				title: "Test",
				photoUrl: null,
				peerUid: null,
				lastMessage: null,
				updatedAt: new Date(),
				unreadCount: 3,
				lastReadAt: null,
				mutedUntil: null,
				pinned: false,
				archived: false,
				clearedBefore: null,
				active: true,
				role: admins.includes(member) ? "admin" : "member",
			});
		}
	});
};

/** Seeds a message directly, bypassing the create rules. */
export const seedMessage = async (
	env: RulesTestEnvironment,
	conversationId: string,
	message: { id: string; senderId: string; createdAt?: Date; text?: string },
) => {
	await env.withSecurityRulesDisabled(async (context: RulesTestContext) => {
		await context
			.firestore()
			.doc(`conversations/${conversationId}/messages/${message.id}`)
			.set({
				id: message.id,
				senderId: message.senderId,
				senderName: message.senderId,
				type: "text",
				text: message.text ?? "hello",
				image: null,
				replyTo: null,
				forwardedFrom: null,
				system: null,
				createdAt: message.createdAt ?? new Date(),
				clientCreatedAt: Date.now(),
				deletedForEveryone: false,
				deletedForEveryoneAt: null,
				deletedFor: [],
			});
	});
};

/** A message payload shaped the way the client sends one. */
export const newMessagePayload = (
	id: string,
	senderId: string,
	overrides: Record<string, unknown> = {},
) => ({
	id,
	senderId,
	senderName: "Sender",
	type: "text",
	text: "hello",
	image: null,
	replyTo: null,
	forwardedFrom: null,
	system: null,
	clientCreatedAt: Date.now(),
	deletedForEveryone: false,
	deletedForEveryoneAt: null,
	deletedFor: [],
	...overrides,
});

/** A conversation payload shaped the way the client creates one. */
export const newConversationPayload = (
	createdBy: string,
	memberIds: string[],
	overrides: Record<string, unknown> = {},
) => ({
	type: "direct",
	createdBy,
	memberIds,
	admins: [],
	memberCount: memberIds.length,
	createdAt: new Date(),
	updatedAt: new Date(),
	name: null,
	photoUrl: null,
	lastMessage: null,
	...overrides,
});

export const lastMessageStamp = (senderId: string) => ({
	id: "stamp",
	senderId,
	senderName: "Sender",
	type: "text",
	preview: "hi",
	createdAt: new Date(),
	deleted: false,
});
