import { useCallback, useEffect, useRef, useState } from "react";
import * as Linking from "expo-linking";
import { completeEmailLinkSignIn, isEmailSignInLink, mapFirebaseAuthError } from "./auth";

interface EmailLinkState {
	/** True while a tapped link is being exchanged for a session. */
	completing: boolean;
	error: string | null;
	/**
	 * Set when a valid link arrived but we have no record of which address requested
	 * it — the user opened it on a different device or after clearing app data. The
	 * UI must ask for the email and call `completeWithEmail`.
	 */
	needsEmail: boolean;
	clearError: () => void;
	completeWithEmail: (email: string) => Promise<void>;
}

/**
 * Completes passwordless sign-in when the user taps the link in their inbox.
 *
 * Handles both entry points, which is easy to get wrong:
 *  - warm start, where the app is already running and `Linking` emits an event;
 *  - cold start, where the link launched the app and the event has already fired, so
 *    it can only be recovered from `getInitialURL()`.
 *
 * Guarded by a ref so a link is processed exactly once. Without that, a re-render or
 * a duplicate event would call signInWithEmailLink twice and the second call fails
 * with `auth/invalid-action-code` — the code is single-use — surfacing a spurious
 * "link expired" error on an otherwise successful sign-in.
 */
export const useEmailLinkHandler = (): EmailLinkState => {
	const [completing, setCompleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [needsEmail, setNeedsEmail] = useState(false);
	const pendingLink = useRef<string | null>(null);
	const handled = useRef(new Set<string>());

	const handleLink = useCallback(async (link: string) => {
		if (handled.current.has(link)) return;
		if (!isEmailSignInLink(link)) return;

		handled.current.add(link);
		pendingLink.current = link;
		setCompleting(true);
		setError(null);

		try {
			const result = await completeEmailLinkSignIn(link);
			// null means we don't know which address asked for this link.
			setNeedsEmail(result === null);
		} catch (e) {
			setError(mapFirebaseAuthError(e));
		} finally {
			setCompleting(false);
		}
	}, []);

	useEffect(() => {
		// Cold start: the app was launched by the link, so no event will arrive.
		void Linking.getInitialURL().then((url) => {
			if (url) void handleLink(url);
		});

		// Warm start: the app was already open.
		const subscription = Linking.addEventListener("url", ({ url }) => void handleLink(url));
		return () => subscription.remove();
	}, [handleLink]);

	const completeWithEmail = useCallback(async (email: string) => {
		const link = pendingLink.current;
		if (!link) return;

		setCompleting(true);
		setError(null);
		try {
			await completeEmailLinkSignIn(link, email);
			setNeedsEmail(false);
		} catch (e) {
			setError(mapFirebaseAuthError(e));
		} finally {
			setCompleting(false);
		}
	}, []);

	const clearError = useCallback(() => setError(null), []);

	return { completing, error, needsEmail, clearError, completeWithEmail };
};
