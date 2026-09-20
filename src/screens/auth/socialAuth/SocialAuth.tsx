import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ButtonContainer } from "../../../components/button/ButtonContainer";
import { RegularText } from "../../../components/text/RegularText";
import { ColorConstants, ColorTheme } from "../../../constants";

interface SocialAuthProps {
	onGooglePress?: () => void;
	googleLoading?: boolean;
	googleDisabled?: boolean;
}

export const SocialAuth = ({ onGooglePress, googleLoading, googleDisabled }: SocialAuthProps) => {
	return (
		<View style={styles.socialAuthContainer}>
			{/* Facebook auth is wired in a later bit. */}
			<ButtonContainer style={styles.facebookAuth} onPress={() => {}}>
				<Ionicons name="logo-facebook" size={16} color={ColorTheme.icon.whiteIcon} />
				<RegularText text="Facebook" style={styles.socialAuthText} />
			</ButtonContainer>
			<ButtonContainer
				style={styles.googleAuth}
				onPress={onGooglePress ?? (() => {})}
				disabled={googleDisabled || googleLoading}
			>
				{googleLoading ? (
					<ActivityIndicator size="small" color={ColorConstants.white} />
				) : (
					<>
						<Ionicons name="logo-google" size={16} color={ColorTheme.icon.whiteIcon} />
						<RegularText text="Google" style={styles.socialAuthText} />
					</>
				)}
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
		width: "49%",
	},
	googleAuth: {
		backgroundColor: ColorTheme.button.googleButtonColor,
		flexDirection: "row",
		gap: 4,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		borderRadius: 24,
		width: "49%",
	},
	// Text components default to dark; these sit on solid brand-coloured buttons.
	socialAuthText: {
		color: ColorTheme.text.inverse,
	},
});
