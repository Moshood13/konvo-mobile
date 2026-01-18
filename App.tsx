import { NavigationContainer } from "./src/navigations/NavigationContainer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/state/store";

export default function App() {
	const reactNavigationIntegration = Sentry.reactNavigationIntegration({
		enableTimeToInitialDisplay: true,
	});

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<SafeAreaProvider>
					<NavigationContainer reactNavigationIntegration={reactNavigationIntegration} />
				</SafeAreaProvider>
			</PersistGate>
		</Provider>
	);
}
