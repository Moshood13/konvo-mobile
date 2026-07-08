import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./config";

export interface UserProfile {
	uid: string;
	email: string;
	username: string;
	/** Set in a later bit (default-language selection). Null until the user picks one. */
	defaultLanguage: string | null;
	createdAt: unknown;
}

const usersCollection = "users";

interface CreateUserProfileInput {
	email: string;
	username: string;
}

/**
 * Creates the Firestore profile document for a user. Uses merge so calling it again
 * on a returning social-auth user won't clobber existing fields.
 */
export const createUserProfile = async (
	uid: string,
	{ email, username }: CreateUserProfileInput,
): Promise<void> => {
	await setDoc(
		doc(db, usersCollection, uid),
		{
			uid,
			email,
			username,
			defaultLanguage: null,
			createdAt: serverTimestamp(),
		},
		{ merge: true },
	);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
	const snapshot = await getDoc(doc(db, usersCollection, uid));
	return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
};
