import { NavigationContainer } from "./src/navigations/NavigationContainer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/state/store";
import { useAuthListener } from "./src/services/firebase";

const AppContent = ({
	reactNavigationIntegration,
}: {
	reactNavigationIntegration: ReturnType<typeof Sentry.reactNavigationIntegration>;
}) => {
	// Must live inside <Provider> — bridges Firebase auth state into Redux.
	useAuthListener();

	return <NavigationContainer reactNavigationIntegration={reactNavigationIntegration} />;
};

export default function App() {
	const reactNavigationIntegration = Sentry.reactNavigationIntegration({
		enableTimeToInitialDisplay: true,
	});

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<SafeAreaProvider>
					<AppContent reactNavigationIntegration={reactNavigationIntegration} />
				</SafeAreaProvider>
			</PersistGate>
		</Provider>
	);
}
