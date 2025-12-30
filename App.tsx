import { StyleSheet, View } from "react-native";
import { SplashScreen } from "./src/screens";

export default function App() {
	return (
		<View style={styles.container}>
			<SplashScreen />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
