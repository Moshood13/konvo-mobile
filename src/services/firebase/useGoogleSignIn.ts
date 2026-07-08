import { useEffect, useState } from "react";
import Constants from "expo-constants";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider } from "firebase/auth";
import { mapFirebaseAuthError, signInWithProviderCredential } from "./auth";

WebBrowser.maybeCompleteAuthSession();

interface GoogleClientIds {
	webClientId?: string;
	iosClientId?: string;
	androidClientId?: string;
}

interface UseGoogleSignIn {
	promptGoogleSignIn: () => void;
	loading: boolean;
	error: string | null;
	/** True when no Google client IDs are configured (button should stay disabled). */
	disabled: boolean;
	clearError: () => void;
}

/**
 * Drives the Google sign-in flow: opens the OAuth prompt via expo-auth-session,
 * then exchanges the returned id_token for a Firebase credential.
 */
export const useGoogleSignIn = (): UseGoogleSignIn => {
	const google = Constants.expoConfig?.extra?.google as GoogleClientIds | undefined;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [request, response, promptAsync] = Google.useAuthRequest({
		webClientId: google?.webClientId,
		iosClientId: google?.iosClientId,
		androidClientId: google?.androidClientId,
	});

	useEffect(() => {
		if (!response) return;

		if (response.type === "success") {
			const idToken =
				response.authentication?.idToken ?? (response.params?.id_token as string | undefined);

			if (!idToken) {
				setLoading(false);
				setError("Google sign-in failed. Please try again.");
				return;
			}

			const credential = GoogleAuthProvider.credential(idToken);
			signInWithProviderCredential(credential)
				.catch((err) => setError(mapFirebaseAuthError(err)))
				.finally(() => setLoading(false));
		} else if (response.type === "error") {
			setLoading(false);
			setError("Google sign-in was cancelled or failed.");
		} else {
			// dismiss / cancel
			setLoading(false);
		}
	}, [response]);

	const promptGoogleSignIn = () => {
		setError(null);
		setLoading(true);
		void promptAsync();
	};

	return {
		promptGoogleSignIn,
		loading,
		error,
		disabled: !request,
		clearError: () => setError(null),
	};
};
