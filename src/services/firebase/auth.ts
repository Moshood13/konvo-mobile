import {
	AuthCredential,
	User,
	UserCredential,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithCredential,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "./config";
import { createUserProfile } from "./users";

/** Maps Firebase auth error codes to user-facing messages. */
export const mapFirebaseAuthError = (error: unknown): string => {
	const code = error instanceof FirebaseError ? error.code : "";

	switch (code) {
		case "auth/invalid-email":
			return "That email address doesn't look right.";
		case "auth/email-already-in-use":
			return "An account already exists with this email.";
		case "auth/weak-password":
			return "Password should be at least 6 characters.";
		case "auth/invalid-credential":
		case "auth/wrong-password":
		case "auth/user-not-found":
			return "Incorrect email or password.";
		case "auth/user-disabled":
			return "This account has been disabled.";
		case "auth/too-many-requests":
			return "Too many attempts. Please try again later.";
		case "auth/network-request-failed":
			return "Network error. Check your connection and try again.";
		default:
			return "Something went wrong. Please try again.";
	}
};

export const signUpWithEmail = async (
	email: string,
	password: string,
	username: string,
): Promise<User> => {
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	await updateProfile(user, { displayName: username });
	await createUserProfile(user.uid, { email: user.email ?? email, username });
	return user;
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
	const { user } = await signInWithEmailAndPassword(auth, email, password);
	return user;
};

export const sendResetEmail = async (email: string): Promise<void> => {
	await sendPasswordResetEmail(auth, email);
};

export const signOutUser = async (): Promise<void> => {
	await signOut(auth);
};

/**
 * Completes a federated sign-in (e.g. Google) with a provider credential and
 * ensures a Firestore profile exists for first-time users.
 */
export const signInWithProviderCredential = async (
	credential: AuthCredential,
): Promise<UserCredential> => {
	const result = await signInWithCredential(auth, credential);
	const { user } = result;
	await createUserProfile(user.uid, {
		email: user.email ?? "",
		username: user.displayName ?? user.email?.split("@")[0] ?? "",
	});
	return result;
};
