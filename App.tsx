import { SignInScreen } from "./src/screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
	return (
		<SafeAreaProvider>
			<SignInScreen />
		</SafeAreaProvider>
	);
}
