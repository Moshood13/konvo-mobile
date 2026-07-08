import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "../../hooks";
import { authSuccess, logout } from "../../state/features/userIdentity/userIdentitySlice";
import { auth } from "./config";

/**
 * Bridges Firebase's auth session into Redux. Firebase is the source of truth:
 * it restores and refreshes the session on its own, and this listener keeps the
 * persisted Redux gate (used for an instant cold-start decision) in sync.
 */
export const useAuthListener = (): void => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) {
				dispatch(logout());
				return;
			}

			const idToken = await user.getIdToken();
			dispatch(
				authSuccess({
					uid: user.uid,
					email: user.email ?? "",
					idToken,
					refreshToken: user.refreshToken,
				}),
			);
		});

		return unsubscribe;
	}, [dispatch]);
};
