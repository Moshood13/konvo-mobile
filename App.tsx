import { NavigationContainer } from "./src/navigations/NavigationContainer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";

export default function App() {
	const reactNavigationIntegration = Sentry.reactNavigationIntegration({
		enableTimeToInitialDisplay: true,
	});

	return (
		<SafeAreaProvider>
			<NavigationContainer reactNavigationIntegration={reactNavigationIntegration} />
		</SafeAreaProvider>
	);
}
