import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ButtonContainer } from "../../../components/button/ButtonContainer";
import { RegularText } from "../../../components/text/RegularText";
import { ColorTheme } from "../../../constants";

export const SocialAuth = () => {
	return (
		<View style={styles.socialAuthContainer}>
			<ButtonContainer style={styles.facebookAuth} onPress={() => {}}>
				<Ionicons name="logo-facebook" size={16} color={ColorTheme.icon.whiteIcon} />
				<RegularText text="Facebook" />
			</ButtonContainer>
			<ButtonContainer style={styles.googleAuth} onPress={() => {}}>
				<Ionicons name="logo-google" size={16} color={ColorTheme.icon.whiteIcon} />
				<RegularText text="Google"  />
			</ButtonContainer>
		</View>
	);
};

const styles = StyleSheet.create({
	socialAuthContainer: {
		flexDirection: "row",
        justifyContent: "space-between",
	},
	facebookAuth: {
		backgroundColor: ColorTheme.button.facebookButtonColor,
		flexDirection: "row",
		gap: 4,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
        borderRadius: 24,
        width: "49%"
	},
	googleAuth: {
		backgroundColor: ColorTheme.button.googleButtonColor,
		flexDirection: "row",
		gap: 4,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		borderRadius: 24,
        width: "49%"
	},
	SocialAuthText: {},
});
