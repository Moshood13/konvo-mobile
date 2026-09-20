import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
	profileCleared,
	profileFailed,
	profileLoaded,
	profileLoading,
} from "../../state/features/profile/profileSlice";
import { db } from "./config";
import { usersCollection } from "./paths";
import type { UserDoc } from "./types";

/**
 * Mirrors the signed-in user's Firestore profile into Redux.
 *
 * A live listener rather than a one-shot get, for one specific reason: the navigator
 * gates on `profileComplete`. The moment the onboarding screen writes that field, the
 * snapshot fires and the navigator swaps stacks on its own — no imperative
 * navigation, no race between the write resolving and a manual navigate(). Same
 * arrangement as useAuthListener, which is why both are mounted side by side.
 */
export const useProfileListener = (): void => {
	const dispatch = useAppDispatch();
	const uid = useAppSelector((s) => s.persistedSecured.userIdentity.value.identity.id);

	useEffect(() => {
		if (!uid) {
			dispatch(profileCleared());
			return;
		}

		dispatch(profileLoading());

		const unsubscribe = onSnapshot(
			doc(db, usersCollection, uid),
			(snapshot) => {
				dispatch(profileLoaded(snapshot.exists() ? (snapshot.data() as UserDoc) : null));
			},
			(error) => {
				// Most often a cold start with no network, or rules that have not been
				// deployed yet. Surfaced as a retryable state rather than a silent hang.
				dispatch(profileFailed(error.message));
			},
		);

		return unsubscribe;
	}, [dispatch, uid]);
};
