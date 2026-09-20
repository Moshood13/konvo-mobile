import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MainContainer, TitleText } from "../components";
import { ColorConstants, Space } from "../constants";

/**
 * Rendered while the gate is "loading": the auth session has been restored from
 * storage but the Firestore profile snapshot has not arrived, so we cannot yet tell
 * whether this user still needs onboarding. Showing this beats guessing — the
 * previous two-way gate flashed the authorized stack for a frame before correcting.
 */
export const SplashScreen = () => {
	return (
		<MainContainer>
			<View style={styles.container}>
				<TitleText text="Konvo" style={styles.brand} />
				<ActivityIndicator color={ColorConstants.green100} />
			</View>
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: Space.xl,
	},
	brand: {
		fontSize: 48,
		color: ColorConstants.green100,
	},
});
