import { useCallback, useEffect } from "react";
import { NavigationContainer } from "./src/navigations/NavigationContainer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/state/store";
import { useAuthListener, useEmailLinkHandler, useProfileListener } from "./src/services/firebase";
import { useCustomFont } from "./src/hooks";
import { paperTheme } from "./src/constants";
import { initSentry } from "./src/services/monitoring";

// Keep the native splash up until the fonts are ready, so the first frame the user
// sees is already in BRFirma rather than flashing the system font and reflowing.
void SplashScreen.preventAutoHideAsync();

// Constructed once at module scope. Building it inside App() would hand a fresh
// integration to the NavigationContainer on every render.
const reactNavigationIntegration = Sentry.reactNavigationIntegration({
	enableTimeToInitialDisplay: true,
});

initSentry(reactNavigationIntegration);

const AppContent = () => {
	// All three must live inside <Provider>.
	// Firebase auth state -> Redux identity.
	useAuthListener();
	// users/{uid} -> Redux profile, which drives the navigator gate.
	useProfileListener();
	// Completes passwordless sign-in when the user taps the link in their inbox.
	// Mounted at the root rather than on the sign-in screen, because a cold start from
	// the link renders the splash first and the screen never gets a chance to handle it.
	useEmailLinkHandler();

	return <NavigationContainer reactNavigationIntegration={reactNavigationIntegration} />;
};

function App() {
	const { isLoaded, error } = useCustomFont();

	useEffect(() => {
		if (error) {
			// A missing font file must not wedge the app behind the splash screen forever.
			Sentry.captureException(error);
		}
	}, [error]);

	const onLayoutRootView = useCallback(() => {
		if (isLoaded || error) {
			void SplashScreen.hideAsync();
		}
	}, [isLoaded, error]);

	if (!isLoaded && !error) {
		return null;
	}

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<SafeAreaProvider onLayout={onLayoutRootView}>
					<PaperProvider theme={paperTheme}>
						<AppContent />
					</PaperProvider>
				</SafeAreaProvider>
			</PersistGate>
		</Provider>
	);
}

export default Sentry.wrap(App);
