import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { usersCollection } from "./paths";
import type { UserDoc } from "./types";

interface CreateUserProfileInput {
	email: string;
	displayName: string;
}

/**
 * Creates the Firestore profile for a user, but ONLY if one does not already exist.
 *
 * The existence check is not an optimisation, it is required. A blind `setDoc(...,
 * { merge: true })` on every sign-in would reset `profileComplete` to false and bounce
 * a fully onboarded user back into the setup screens — and it would also rewrite
 * `createdAt`, which firestore.rules rejects outright via `unchanged('createdAt')`,
 * so every returning sign-in would fail with a permission error.
 *
 * Returns true when a new profile was written.
 */
export const createUserProfile = async (
	uid: string,
	{ email, displayName }: CreateUserProfileInput,
): Promise<boolean> => {
	const ref = doc(db, usersCollection, uid);
	const existing = await getDoc(ref);
	if (existing.exists()) return false;

	const name = displayName.trim();

	await setDoc(ref, {
		uid,
		email,
		displayName: name,
		displayNameLower: name.toLowerCase(),
		phoneE164: null,
		phoneHash: null,
		photoUrl: null,
		photoPublicId: null,
		about: "",
		defaultLanguage: null,
		// The navigator keeps them in the onboarding stack until this flips.
		profileComplete: false,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});

	return true;
};

export interface CompleteOnboardingInput {
	displayName: string;
	/** E.164, e.g. "+2348012345678". Collected but not verified. */
	phoneE164: string;
	/** SHA-256 of phoneE164, so contact discovery never needs the raw number. */
	phoneHash: string;
	photoUrl: string | null;
	photoPublicId: string | null;
	about?: string;
}

/**
 * Finishes onboarding. Flipping `profileComplete` is what moves the navigator from
 * the onboarding stack to the chat list — the profile listener sees the change and
 * the gate swaps stacks, with no imperative navigation.
 */
export const completeOnboarding = async (
	uid: string,
	input: CompleteOnboardingInput,
): Promise<void> => {
	const name = input.displayName.trim();

	await updateDoc(doc(db, usersCollection, uid), {
		displayName: name,
		displayNameLower: name.toLowerCase(),
		phoneE164: input.phoneE164,
		phoneHash: input.phoneHash,
		photoUrl: input.photoUrl,
		photoPublicId: input.photoPublicId,
		about: input.about ?? "Hey there! I'm using Konvo.",
		profileComplete: true,
		updatedAt: serverTimestamp(),
	});
};

export type UpdateProfileInput = Partial<
	Pick<UserDoc, "displayName" | "about" | "photoUrl" | "photoPublicId" | "phoneE164" | "phoneHash">
>;

export const updateUserProfile = async (uid: string, input: UpdateProfileInput): Promise<void> => {
	const patch: Record<string, unknown> = { ...input, updatedAt: serverTimestamp() };

	if (input.displayName !== undefined) {
		const name = input.displayName.trim();
		patch.displayName = name;
		patch.displayNameLower = name.toLowerCase();
	}

	await updateDoc(doc(db, usersCollection, uid), patch);
};

/**
 * Returns the raw wire shape: timestamps are still Firestore `Timestamp` objects.
 * The converter layer that maps them to epoch ms lands with the chat work; until
 * then no screen should read `createdAt` off this.
 */
export const getUserProfile = async (uid: string): Promise<UserDoc | null> => {
	const snapshot = await getDoc(doc(db, usersCollection, uid));
	return snapshot.exists() ? (snapshot.data() as UserDoc) : null;
};
