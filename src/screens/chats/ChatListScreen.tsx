import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BoldText, MainContainer, PrimaryButton, Subtitle } from "../../components";
import { ColorConstants, ColorTheme, Radius, Space, SpacingConstants } from "../../constants";
import { useAppSelector } from "../../hooks";
import { signOutUser } from "../../services/firebase";

/**
 * Placeholder for the authorized area. Confirms that sign-in and onboarding both
 * completed and that the profile round-tripped through Firestore. Replaced by the
 * real conversation list in the chat phase.
 */
export const ChatListScreen = () => {
	const profile = useAppSelector((s) => s.profile.profile);

	return (
		<MainContainer>
			<View style={styles.container}>
				<Ionicons name="chatbubbles-outline" size={64} color={ColorConstants.green100} />
				<BoldText text={`Hi ${profile?.displayName || "there"}`} style={styles.title} />
				<Subtitle
					text="You're all set up. Your conversations will appear here."
					style={styles.subtitle}
				/>
				{!!profile?.phoneE164 && <Subtitle text={profile.phoneE164} style={styles.detail} />}
				<PrimaryButton text="LOG OUT" onPress={() => void signOutUser()} style={styles.logout} />
			</View>
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: Space.md,
		paddingHorizontal: SpacingConstants.loginFormPaddingHorizontal,
	},
	title: { fontSize: 28 },
	subtitle: { textAlign: "center", color: ColorTheme.text.secondary },
	detail: { color: ColorTheme.text.tertiary },
	logout: {
		marginTop: Space.xxl,
		backgroundColor: ColorConstants.darkBrown100,
		borderRadius: Radius.pill,
	},
});
