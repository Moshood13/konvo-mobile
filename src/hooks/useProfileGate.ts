import { useAppSelector } from "./reduxHooks";

/**
 * Which top-level stack the navigator should render.
 *
 * `loading` exists to fix a real flicker: the auth token is restored synchronously
 * from SecureStore, so without it the authorized stack renders for a frame or two
 * before Firebase has confirmed the session and the profile has arrived.
 *
 * `onboarding` is the state the original two-way gate could not express — signed in,
 * but with no name, phone or photo yet.
 */
export type Gate = "loading" | "unauthenticated" | "onboarding" | "ready";

export const useProfileGate = (): Gate => {
	const uid = useAppSelector((s) => s.persistedSecured.userIdentity.value.identity.id);
	const { status, profile } = useAppSelector((s) => s.profile);

	if (!uid) return "unauthenticated";

	// `error` also lands here: without a profile snapshot we cannot tell onboarding
	// from ready, and guessing would either trap a finished user on the setup screen
	// or drop a new one into an empty chat list.
	if (status === "idle" || status === "loading" || status === "error") return "loading";

	return profile?.profileComplete ? "ready" : "onboarding";
};
