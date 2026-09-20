import {
	AuthCredential,
	UserCredential,
	isSignInWithEmailLink,
	sendSignInLinkToEmail,
	signInWithCredential,
	signInWithEmailLink,
	signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, authDomain } from "./config";
import { createUserProfile } from "./users";

/** Maps Firebase auth error codes to user-facing messages. */
export const mapFirebaseAuthError = (error: unknown): string => {
	const code = error instanceof FirebaseError ? error.code : "";

	switch (code) {
		case "auth/invalid-email":
			return "That email address doesn't look right.";
		case "auth/user-disabled":
			return "This account has been disabled.";
		case "auth/invalid-action-code":
		case "auth/expired-action-code":
			return "That sign-in link has expired or has already been used. Request a new one.";
		case "auth/too-many-requests":
			return "Too many attempts. Please try again in a few minutes.";
		case "auth/network-request-failed":
			return "Network error. Check your connection and try again.";
		case "auth/operation-not-allowed":
			return "This sign-in method isn't enabled for the project yet.";
		case "auth/account-exists-with-different-credential":
			return "You already have an account using a different sign-in method.";
		default:
			return "Something went wrong. Please try again.";
	}
};

/**
 * The `continueUrl` Firebase embeds in the emailed link.
 *
 * It MUST be https on a domain in the project's authorized list — a custom scheme is
 * rejected outright with `auth/unauthorized-continue-uri`. (Verified against the live
 * project: konvo:// and exp:// are both refused; the firebaseapp.com domain is
 * accepted.) `authDomain` is always authorized, so deriving it from the config means
 * this cannot drift from the project.
 *
 * Note what this does NOT do: it does not make the link open the app. Firebase
 * Dynamic Links, which used to handle that, has been shut down, so returning to the
 * app requires Android App Links / iOS Universal Links on this domain — which in turn
 * requires the app's signing fingerprint registered in the Firebase console. Until
 * that is set up, tapping the link opens a browser and the paste fallback on the
 * sign-in screen is the way back in.
 */
const buildContinueUrl = () => `https://${authDomain}/auth/email-link`;

/**
 * The email address must survive the round trip through the inbox, because the user
 * may open the link on a different app instance from the one that requested it.
 * AsyncStorage rather than SecureStore: it is not a secret, and SecureStore's small
 * value ceiling is reserved for the session tokens.
 */
const PENDING_EMAIL_KEY = "konvo.auth.pendingEmail";

export const setPendingEmail = (email: string) => AsyncStorage.setItem(PENDING_EMAIL_KEY, email);
export const getPendingEmail = () => AsyncStorage.getItem(PENDING_EMAIL_KEY);
export const clearPendingEmail = () => AsyncStorage.removeItem(PENDING_EMAIL_KEY);

/**
 * Step one of passwordless sign-in: Firebase emails a one-time link.
 *
 * Chosen over a 6-digit code because a code needs a server to generate and verify it,
 * and Cloud Functions require the paid plan. Firebase sends this itself, from its own
 * infrastructure, which also means it is far less likely to land in spam than a code
 * sent from an unverified domain would be.
 */
export const sendEmailSignInLink = async (email: string): Promise<void> => {
	const normalized = email.trim().toLowerCase();

	await sendSignInLinkToEmail(auth, normalized, {
		handleCodeInApp: true,
		url: buildContinueUrl(),
	});

	await setPendingEmail(normalized);
};

export const isEmailSignInLink = (link: string): boolean => {
	try {
		return isSignInWithEmailLink(auth, link.trim());
	} catch {
		// Called on arbitrary pasted text, which may not be a URL at all.
		return false;
	}
};

/**
 * Step two: complete sign-in from the tapped link. Returns null when the stored email
 * is missing — the link was opened on a device that never requested it, and the UI has
 * to ask for the address again before it can finish.
 */
export const completeEmailLinkSignIn = async (
	link: string,
	emailOverride?: string,
): Promise<UserCredential | null> => {
	const email = emailOverride?.trim().toLowerCase() ?? (await getPendingEmail());
	if (!email) return null;

	const result = await signInWithEmailLink(auth, email, link.trim());
	await clearPendingEmail();
	await ensureProfileFor(result);
	return result;
};

/**
 * Completes sign-in from a link the user copied out of their email client and pasted
 * into the app.
 *
 * This exists because tapping the link cannot reach the app yet: Firebase Dynamic
 * Links is gone, so the emailed https link opens a browser until Android App Links /
 * iOS Universal Links are configured against the auth domain — which needs the app's
 * signing fingerprint, and therefore a real build. Pasting is the honest interim
 * path, and it produces a genuine account rather than an anonymous one.
 *
 * Remove it once App Links are verified; nothing else depends on it.
 */
export const completePastedSignInLink = async (
	rawLink: string,
	emailOverride?: string,
): Promise<UserCredential | null> => {
	const link = rawLink.trim();
	if (!isEmailSignInLink(link)) {
		throw new Error(
			"That doesn't look like a Konvo sign-in link. Copy the whole link from the email, including the https:// part.",
		);
	}
	return completeEmailLinkSignIn(link, emailOverride);
};

/**
 * Completes a federated sign-in (Google) with a provider credential.
 */
export const signInWithProviderCredential = async (
	credential: AuthCredential,
): Promise<UserCredential> => {
	const result = await signInWithCredential(auth, credential);
	await ensureProfileFor(result);
	return result;
};

/**
 * Creates the Firestore profile for a brand-new account, with `profileComplete: false`
 * so the navigator routes them into onboarding. Merges, so a returning user's existing
 * name and photo are never clobbered by the provider's defaults.
 */
const ensureProfileFor = async ({ user }: UserCredential): Promise<void> => {
	await createUserProfile(user.uid, {
		email: user.email ?? "",
		displayName: user.displayName ?? "",
	});
};

export const signOutUser = async (): Promise<void> => {
	await signOut(auth);
};
