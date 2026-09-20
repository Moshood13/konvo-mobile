import { assertFails, assertSucceeds, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { serverTimestamp, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
	ALICE,
	BOB,
	CAROL,
	MALLORY,
	createTestEnv,
	dbAs,
	dbUnauthed,
	directId,
	lastMessageStamp,
	newConversationPayload,
	newMessagePayload,
	seedConversation,
	seedMessage,
} from "./helpers";

let env: RulesTestEnvironment;

const DM = directId(ALICE, BOB);
const GROUP = "group_1";

beforeAll(async () => {
	env = await createTestEnv();
});

afterAll(async () => {
	await env.cleanup();
});

beforeEach(async () => {
	await env.clearFirestore();
	await seedConversation(env, { conversationId: DM, type: "direct", memberIds: [ALICE, BOB] });
	await seedConversation(env, {
		conversationId: GROUP,
		type: "group",
		memberIds: [ALICE, BOB, CAROL],
		admins: [ALICE],
	});
});

describe("users", () => {
	it("denies everything to an unauthenticated caller", async () => {
		await assertFails(getDoc(doc(dbUnauthed(env), `users/${ALICE}`)));
	});

	it("lets any signed-in user read a profile (chat headers, member lists)", async () => {
		await assertSucceeds(getDoc(doc(dbAs(env, MALLORY), `users/${ALICE}`)));
	});

	it("refuses a profile created as already complete", async () => {
		await assertFails(
			setDoc(doc(dbAs(env, ALICE), `users/${ALICE}`), { uid: ALICE, profileComplete: true }),
		);
	});

	it("refuses to let a user rewrite their own uid or creation time", async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			await ctx
				.firestore()
				.doc(`users/${ALICE}`)
				.set({
					uid: ALICE,
					displayName: "Alice",
					profileComplete: true,
					createdAt: new Date("2020-01-01"),
				});
		});

		await assertFails(updateDoc(doc(dbAs(env, ALICE), `users/${ALICE}`), { uid: BOB }));
		await assertFails(
			updateDoc(doc(dbAs(env, ALICE), `users/${ALICE}`), { createdAt: new Date() }),
		);
		await assertSucceeds(
			updateDoc(doc(dbAs(env, ALICE), `users/${ALICE}`), { displayName: "Alice B" }),
		);
	});

	it("refuses an over-long display name or about text", async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			await ctx
				.firestore()
				.doc(`users/${ALICE}`)
				.set({ uid: ALICE, displayName: "Alice", profileComplete: true, createdAt: new Date() });
		});
		await assertFails(
			updateDoc(doc(dbAs(env, ALICE), `users/${ALICE}`), { displayName: "x".repeat(51) }),
		);
		await assertFails(
			updateDoc(doc(dbAs(env, ALICE), `users/${ALICE}`), {
				displayName: "Alice",
				about: "x".repeat(161),
			}),
		);
	});

	it("refuses to let one user edit another's profile", async () => {
		await assertFails(updateDoc(doc(dbAs(env, BOB), `users/${ALICE}`), { displayName: "hacked" }));
	});
});

/**
 * Direct-conversation ids are derived from the two uids, so they are guessable by
 * anyone. These tests pin down that guessing one buys you nothing.
 */
describe("conversation creation", () => {
	it("lets a user start a direct conversation with the canonical id", async () => {
		const cid = directId(ALICE, CAROL);
		await assertSucceeds(
			setDoc(
				doc(dbAs(env, ALICE), `conversations/${cid}`),
				newConversationPayload(ALICE, [ALICE, CAROL].sort(), { id: cid }),
			),
		);
	});

	it("refuses a direct conversation whose id does not match its members", async () => {
		// Mallory tries to squat on Alice and Bob's DM id while putting themselves in it.
		const squatted = directId(ALICE, BOB);
		await env.clearFirestore();
		await assertFails(
			setDoc(
				doc(dbAs(env, MALLORY), `conversations/${squatted}`),
				newConversationPayload(MALLORY, [ALICE, MALLORY].sort(), { id: squatted }),
			),
		);
	});

	it("refuses a conversation the creator is not a member of", async () => {
		const cid = directId(BOB, CAROL);
		await assertFails(
			setDoc(
				doc(dbAs(env, MALLORY), `conversations/${cid}`),
				newConversationPayload(MALLORY, [BOB, CAROL].sort(), { id: cid }),
			),
		);
	});

	it("refuses a mismatched memberCount", async () => {
		const cid = directId(ALICE, CAROL);
		await assertFails(
			setDoc(
				doc(dbAs(env, ALICE), `conversations/${cid}`),
				newConversationPayload(ALICE, [ALICE, CAROL].sort(), { id: cid, memberCount: 9 }),
			),
		);
	});

	it("refuses an admin who is not a member", async () => {
		await assertFails(
			setDoc(
				doc(dbAs(env, ALICE), "conversations/g_new"),
				newConversationPayload(ALICE, [ALICE, BOB], {
					id: "g_new",
					type: "group",
					admins: [MALLORY],
				}),
			),
		);
	});

	it("refuses a group over the 20-member cap", async () => {
		const many = Array.from({ length: 25 }, (_, i) => `u${i}`);
		await assertFails(
			setDoc(
				doc(dbAs(env, ALICE), "conversations/g_big"),
				newConversationPayload(ALICE, [ALICE, ...many], {
					id: "g_big",
					type: "group",
					admins: [ALICE],
				}),
			),
		);
	});

	it("refuses a conversation created with a last message already set", async () => {
		const cid = directId(ALICE, CAROL);
		await assertFails(
			setDoc(
				doc(dbAs(env, ALICE), `conversations/${cid}`),
				newConversationPayload(ALICE, [ALICE, CAROL].sort(), {
					id: cid,
					lastMessage: lastMessageStamp(ALICE),
				}),
			),
		);
	});
});

describe("conversation access and membership", () => {
	it("hides a conversation from a non-member", async () => {
		await assertFails(getDoc(doc(dbAs(env, MALLORY), `conversations/${DM}`)));
		await assertSucceeds(getDoc(doc(dbAs(env, ALICE), `conversations/${DM}`)));
	});

	it("refuses an outsider adding themselves to an existing conversation", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, MALLORY), `conversations/${GROUP}`), {
				memberIds: [ALICE, BOB, CAROL, MALLORY],
				memberCount: 4,
				admins: [ALICE],
			}),
		);
	});

	it("refuses a plain member adding somebody", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, BOB), `conversations/${GROUP}`), {
				memberIds: [ALICE, BOB, CAROL, MALLORY],
				memberCount: 4,
				admins: [ALICE],
			}),
		);
	});

	it("lets an admin add a member", async () => {
		await assertSucceeds(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${GROUP}`), {
				memberIds: [ALICE, BOB, CAROL, MALLORY],
				memberCount: 4,
				admins: [ALICE],
			}),
		);
	});

	it("refuses a membership change that leaves memberCount inconsistent", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${GROUP}`), {
				memberIds: [ALICE, BOB],
				memberCount: 3,
				admins: [ALICE],
			}),
		);
	});

	it("refuses an admin orphaning the group with no admins left", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${GROUP}`), {
				memberIds: [ALICE, BOB, CAROL],
				memberCount: 3,
				admins: [],
			}),
		);
	});

	it("refuses a member promoting themselves to admin", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, BOB), `conversations/${GROUP}`), {
				memberIds: [ALICE, BOB, CAROL],
				memberCount: 3,
				admins: [ALICE, BOB],
			}),
		);
	});

	it("lets a member leave a group, removing only themselves", async () => {
		await assertSucceeds(
			updateDoc(doc(dbAs(env, BOB), `conversations/${GROUP}`), {
				memberIds: [ALICE, CAROL],
				memberCount: 2,
				admins: [ALICE],
			}),
		);
	});

	it("refuses 'leaving' that actually removes somebody else", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, BOB), `conversations/${GROUP}`), {
				memberIds: [ALICE, BOB],
				memberCount: 2,
				admins: [ALICE],
			}),
		);
	});

	it("refuses leaving a direct conversation", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, BOB), `conversations/${DM}`), {
				memberIds: [ALICE],
				memberCount: 1,
				admins: [],
			}),
		);
	});

	it("lets only an admin rename a group", async () => {
		await assertFails(updateDoc(doc(dbAs(env, BOB), `conversations/${GROUP}`), { name: "Bob's" }));
		await assertSucceeds(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${GROUP}`), { name: "Renamed" }),
		);
	});

	it("lets any member stamp the last message, but not an outsider", async () => {
		const stamp = { lastMessage: lastMessageStamp(BOB), updatedAt: serverTimestamp() };
		await assertSucceeds(updateDoc(doc(dbAs(env, BOB), `conversations/${DM}`), stamp));
		await assertFails(updateDoc(doc(dbAs(env, MALLORY), `conversations/${DM}`), stamp));
	});

	it("refuses smuggling a membership change through the fanout path", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, BOB), `conversations/${DM}`), {
				lastMessage: lastMessageStamp(BOB),
				updatedAt: serverTimestamp(),
				memberIds: [ALICE, BOB, MALLORY],
			}),
		);
	});
});

/**
 * With no Cloud Functions, the sender's own device performs the message fanout, so
 * fellow members must be able to write the fanout fields of each other's inbox
 * documents. These tests pin down exactly how far that relaxation goes.
 */
describe("inbox (users/{uid}/conversations)", () => {
	it("is readable only by its owner", async () => {
		await assertSucceeds(getDoc(doc(dbAs(env, ALICE), `users/${ALICE}/conversations/${DM}`)));
		await assertFails(getDoc(doc(dbAs(env, BOB), `users/${ALICE}/conversations/${DM}`)));
	});

	it("lets the owner clear their badge but not inflate it", async () => {
		const ref = doc(dbAs(env, ALICE), `users/${ALICE}/conversations/${DM}`);
		await assertFails(updateDoc(ref, { unreadCount: 42 }));
		await assertSucceeds(updateDoc(ref, { unreadCount: 0, lastReadAt: serverTimestamp() }));
	});

	it("lets a fellow member deliver a message into your inbox (the fanout)", async () => {
		await assertSucceeds(
			updateDoc(doc(dbAs(env, BOB), `users/${ALICE}/conversations/${DM}`), {
				lastMessage: lastMessageStamp(BOB),
				updatedAt: serverTimestamp(),
				unreadCount: 4,
			}),
		);
	});

	it("refuses a NON-member writing to anyone's inbox", async () => {
		await assertFails(
			updateDoc(doc(dbAs(env, MALLORY), `users/${ALICE}/conversations/${DM}`), {
				unreadCount: 999,
			}),
		);
		await assertFails(
			setDoc(doc(dbAs(env, MALLORY), `users/${ALICE}/conversations/${DM}_x`), {
				conversationId: `${DM}_x`,
				unreadCount: 0,
			}),
		);
	});

	it("refuses a fellow member touching your per-chat preferences", async () => {
		const ref = doc(dbAs(env, BOB), `users/${ALICE}/conversations/${DM}`);
		await assertFails(updateDoc(ref, { mutedUntil: new Date(Date.now() + 1e6) }));
		await assertFails(updateDoc(ref, { archived: true }));
		await assertFails(updateDoc(ref, { pinned: true }));
		await assertFails(updateDoc(ref, { clearedBefore: serverTimestamp() }));
		// lastReadAt is the owner's receipt pointer, not a fanout field.
		await assertFails(updateDoc(ref, { lastReadAt: serverTimestamp() }));
	});

	it("refuses an inbox doc whose conversationId does not match its path", async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			await ctx.firestore().doc(`users/${CAROL}/conversations/${DM}`).delete();
		});
		await assertFails(
			setDoc(doc(dbAs(env, BOB), `users/${CAROL}/conversations/${DM}`), {
				conversationId: "some-other-conversation",
				unreadCount: 1,
			}),
		);
	});
});

describe("messages", () => {
	it("lets a member send, and rejects a non-member", async () => {
		await assertSucceeds(
			setDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/m1`), {
				...newMessagePayload("m1", ALICE),
				createdAt: serverTimestamp(),
			}),
		);
		await assertFails(
			setDoc(doc(dbAs(env, MALLORY), `conversations/${DM}/messages/m2`), {
				...newMessagePayload("m2", MALLORY),
				createdAt: serverTimestamp(),
			}),
		);
	});

	it("refuses a message sent under someone else's name", async () => {
		await assertFails(
			setDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/m3`), {
				...newMessagePayload("m3", BOB),
				createdAt: serverTimestamp(),
			}),
		);
	});

	it("refuses a backdated message — createdAt must be serverTimestamp()", async () => {
		await assertFails(
			setDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/m4`), {
				...newMessagePayload("m4", ALICE),
				createdAt: new Date("2020-01-01"),
			}),
		);
	});

	it("refuses a non-admin forging a system message", async () => {
		const system = {
			kind: "member_added",
			actorId: BOB,
			actorName: "Bob",
			targetIds: [MALLORY],
			targetNames: ["M"],
			value: null,
		};
		await assertFails(
			setDoc(doc(dbAs(env, BOB), `conversations/${GROUP}/messages/m5`), {
				...newMessagePayload("m5", BOB, { type: "system", text: null, system }),
				createdAt: serverTimestamp(),
			}),
		);
		// An admin may, because system messages accompany a membership change.
		await assertSucceeds(
			setDoc(doc(dbAs(env, ALICE), `conversations/${GROUP}/messages/m5b`), {
				...newMessagePayload("m5b", ALICE, { type: "system", text: null, system }),
				createdAt: serverTimestamp(),
			}),
		);
	});

	it("refuses text over the 4096 character cap", async () => {
		await assertFails(
			setDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/m6`), {
				...newMessagePayload("m6", ALICE, { text: "x".repeat(4097) }),
				createdAt: serverTimestamp(),
			}),
		);
	});

	it("refuses a message whose id does not match its document", async () => {
		await assertFails(
			setDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/m7`), {
				...newMessagePayload("something-else", ALICE),
				createdAt: serverTimestamp(),
			}),
		);
	});

	it("never allows a hard delete", async () => {
		await seedMessage(env, DM, { id: "m8", senderId: ALICE });
		await assertFails(deleteDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/m8`)));
	});

	it("hides messages from a non-member", async () => {
		await seedMessage(env, DM, { id: "m9", senderId: ALICE });
		await assertFails(getDoc(doc(dbAs(env, MALLORY), `conversations/${DM}/messages/m9`)));
	});
});

describe("delete for me", () => {
	it("lets a member hide a message for themselves only", async () => {
		await seedMessage(env, DM, { id: "d1", senderId: ALICE });
		await assertSucceeds(
			updateDoc(doc(dbAs(env, BOB), `conversations/${DM}/messages/d1`), { deletedFor: [BOB] }),
		);
	});

	it("refuses to let a member hide a message for somebody else", async () => {
		await seedMessage(env, DM, { id: "d2", senderId: ALICE });
		await assertFails(
			updateDoc(doc(dbAs(env, BOB), `conversations/${DM}/messages/d2`), { deletedFor: [ALICE] }),
		);
	});

	it("refuses to let a member wipe an existing deletedFor entry", async () => {
		await seedMessage(env, DM, { id: "d3", senderId: ALICE });
		await updateDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/d3`), {
			deletedFor: [ALICE],
		});
		await assertFails(
			updateDoc(doc(dbAs(env, BOB), `conversations/${DM}/messages/d3`), { deletedFor: [BOB] }),
		);
	});
});

describe("delete for everyone", () => {
	const retraction = {
		deletedForEveryone: true,
		deletedForEveryoneAt: serverTimestamp(),
		text: null,
		image: null,
	};

	it("lets the sender retract a fresh message", async () => {
		await seedMessage(env, DM, { id: "r1", senderId: ALICE });
		await assertSucceeds(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/r1`), retraction),
		);
	});

	it("refuses to let a recipient retract someone else's message", async () => {
		await seedMessage(env, DM, { id: "r2", senderId: ALICE });
		await assertFails(
			updateDoc(doc(dbAs(env, BOB), `conversations/${DM}/messages/r2`), retraction),
		);
	});

	it("refuses a retraction outside the one-hour window", async () => {
		const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
		await seedMessage(env, DM, { id: "r3", senderId: ALICE, createdAt: twoHoursAgo });
		await assertFails(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/r3`), retraction),
		);
	});

	it("refuses a retraction that leaves the text in place", async () => {
		await seedMessage(env, DM, { id: "r4", senderId: ALICE });
		await assertFails(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${DM}/messages/r4`), {
				deletedForEveryone: true,
				deletedForEveryoneAt: serverTimestamp(),
			}),
		);
	});
});

describe("receipts", () => {
	it("lets every member read every member's pointers (group read receipts)", async () => {
		await assertSucceeds(getDoc(doc(dbAs(env, ALICE), `conversations/${GROUP}/receipts/${BOB}`)));
	});

	it("hides receipts from a non-member", async () => {
		await assertFails(getDoc(doc(dbAs(env, MALLORY), `conversations/${GROUP}/receipts/${BOB}`)));
	});

	it("lets a member write only their own receipt", async () => {
		await assertSucceeds(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${GROUP}/receipts/${ALICE}`), {
				lastReadAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			}),
		);
		// Forging somebody else's read receipt would make your message show as read.
		await assertFails(
			updateDoc(doc(dbAs(env, ALICE), `conversations/${GROUP}/receipts/${BOB}`), {
				lastReadAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			}),
		);
	});
});

describe("default deny", () => {
	it("denies an unmatched collection", async () => {
		await assertFails(getDoc(doc(dbAs(env, ALICE), "somethingElse/doc")));
		await assertFails(setDoc(doc(dbAs(env, ALICE), "somethingElse/doc"), { a: 1 }));
	});
});
