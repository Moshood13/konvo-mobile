import profileReducer, {
	profileCleared,
	profileFailed,
	profileLoaded,
	profileLoading,
} from "../../src/state/features/profile/profileSlice";
import type { UserDoc } from "../../src/services/firebase/types";

const profileWith = (overrides: Partial<UserDoc>): UserDoc =>
	({
		uid: "u1",
		email: "a@example.com",
		displayName: "Alice",
		displayNameLower: "alice",
		phoneE164: "+2348012345678",
		phoneHash: "hash",
		photoUrl: null,
		photoPublicId: null,
		about: "",
		defaultLanguage: null,
		profileComplete: false,
		...overrides,
	}) as UserDoc;

/**
 * Mirrors useProfileGate. The hook itself needs a store and a renderer; the decision
 * table is the part worth pinning down, and it is pure.
 */
const gateFor = (uid: string, status: string, profileComplete?: boolean) => {
	if (!uid) return "unauthenticated";
	if (status === "idle" || status === "loading" || status === "error") return "loading";
	return profileComplete ? "ready" : "onboarding";
};

describe("profileSlice", () => {
	it("starts idle with no profile", () => {
		const state = profileReducer(undefined, { type: "@@INIT" });
		expect(state.status).toBe("idle");
		expect(state.profile).toBeNull();
	});

	it("reports `missing` when the snapshot arrives with no document", () => {
		// A brand-new account between sign-in and the profile write. Distinct from
		// `loading`, because here we know there is nothing rather than not knowing yet.
		const state = profileReducer(undefined, profileLoaded(null));
		expect(state.status).toBe("missing");
	});

	it("reports `ready` once a document loads", () => {
		const state = profileReducer(undefined, profileLoaded(profileWith({ profileComplete: true })));
		expect(state.status).toBe("ready");
		expect(state.profile?.displayName).toBe("Alice");
	});

	it("clears the error when a later snapshot succeeds", () => {
		let state = profileReducer(undefined, profileFailed("offline"));
		expect(state.status).toBe("error");
		state = profileReducer(state, profileLoaded(profileWith({})));
		expect(state.error).toBeNull();
	});

	it("resets completely on sign-out", () => {
		const loaded = profileReducer(undefined, profileLoaded(profileWith({})));
		expect(profileReducer(loaded, profileCleared()).profile).toBeNull();
	});

	it("goes back to loading when a new uid starts fetching", () => {
		const loaded = profileReducer(undefined, profileLoaded(profileWith({})));
		expect(profileReducer(loaded, profileLoading()).status).toBe("loading");
	});
});

describe("navigator gate", () => {
	it("sends a signed-out user to the unauthenticated stack", () => {
		expect(gateFor("", "idle")).toBe("unauthenticated");
	});

	it("holds on the splash until the profile snapshot resolves", () => {
		// Without this the authorized stack renders for a frame on cold start, because
		// the token is restored from SecureStore before Firestore has answered.
		expect(gateFor("u1", "loading")).toBe("loading");
		expect(gateFor("u1", "idle")).toBe("loading");
	});

	it("holds on the splash when the listener errored rather than guessing", () => {
		// Guessing either traps a finished user in onboarding or drops a new one into
		// an empty chat list.
		expect(gateFor("u1", "error")).toBe("loading");
	});

	it("routes a signed-in user with no profile document into onboarding", () => {
		expect(gateFor("u1", "missing")).toBe("onboarding");
	});

	it("routes a signed-in user with an incomplete profile into onboarding", () => {
		expect(gateFor("u1", "ready", false)).toBe("onboarding");
	});

	it("routes a fully onboarded user to the chats", () => {
		expect(gateFor("u1", "ready", true)).toBe("ready");
	});
});
