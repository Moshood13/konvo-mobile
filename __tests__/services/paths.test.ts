import {
	conversationDoc,
	directConversationId,
	inboxDoc,
	messageDoc,
	receiptDoc,
	typingUserPath,
	userDoc,
} from "../../src/services/firebase/paths";

describe("directConversationId", () => {
	/**
	 * This is the highest-stakes pure function in the app. firestore.rules enforces
	 * the same format in `directIdMatches`, and the two must agree exactly: if they
	 * drift, either every direct conversation fails to create, or the rule stops
	 * pinning membership to the id and someone can squat on another pair's DM.
	 */
	it("is stable regardless of argument order", () => {
		expect(directConversationId("bob", "alice")).toBe(directConversationId("alice", "bob"));
	});

	it("sorts the uids ascending, matching the rule's ids[0] < ids[1] check", () => {
		expect(directConversationId("bob", "alice")).toBe("dm_alice_bob");
	});

	it("uses the exact dm_<a>_<b> shape the security rule reconstructs", () => {
		// The rule builds 'dm_' + ids[0] + '_' + ids[1] and compares to the doc id.
		const a = "AAAAAAAAAAAAAAAAAAAAAAAAAAAA";
		const b = "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ";
		expect(directConversationId(a, b)).toBe(`dm_${a}_${b}`);
	});

	it("stays well inside Firestore's 1500-byte document-name limit", () => {
		// Firebase uids are 28 chars, so a real id is ~59 bytes.
		const id = directConversationId("a".repeat(28), "b".repeat(28));
		expect(Buffer.byteLength(id, "utf8")).toBeLessThan(1500);
	});
});

describe("path builders", () => {
	it("nests the per-user inbox under the user, not the conversation", () => {
		// The inbox is private to its owner; putting it under conversations/ would
		// make it readable by every member.
		expect(inboxDoc("u1", "c1")).toBe("users/u1/conversations/c1");
	});

	it("builds conversation-scoped subcollection paths", () => {
		expect(conversationDoc("c1")).toBe("conversations/c1");
		expect(messageDoc("c1", "m1")).toBe("conversations/c1/messages/m1");
		expect(receiptDoc("c1", "u1")).toBe("conversations/c1/receipts/u1");
	});

	it("builds user paths", () => {
		expect(userDoc("u1")).toBe("users/u1");
	});

	it("builds RTDB typing paths that match database.rules.json", () => {
		expect(typingUserPath("c1", "u1")).toBe("typing/c1/u1");
	});
});
