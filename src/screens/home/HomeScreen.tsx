import { StyleSheet, View } from "react-native";
import { MainContainer, PrimaryButton, BoldText } from "../../components";
import { RegularText } from "../../components/text/RegularText";
import { ColorConstants, SpacingConstants } from "../../constants";
import { useAppSelector } from "../../hooks";
import { signOutUser } from "../../services/firebase";

/**
 * Temporary placeholder for the authorized area. Confirms login worked and hosts
 * Logout. Replaced by the real chat UI in a later bit.
 */
export const HomeScreen = () => {
	const email = useAppSelector((s) => s.persistedSecured.userIdentity.value.identity.email);

	// The auth listener flips the gate back to the unauthorized stack after sign-out.
	const onLogout = () => {
		void signOutUser();
	};

	return (
		<MainContainer>
			<View style={styles.container}>
				<BoldText text="Konvo" style={styles.title} />
				<RegularText text="You're signed in." style={styles.subtitle} />
				{!!email && <RegularText text={email} style={styles.email} />}
				<PrimaryButton onPress={onLogout} text="LOG OUT" style={styles.logoutButton} />
			</View>
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: SpacingConstants.loginFormGap,
		paddingHorizontal: SpacingConstants.loginFormPaddingHorizontal,
	},
	title: {
		fontSize: 48,
	},
	subtitle: {
		fontSize: 16,
	},
	email: {
		fontSize: 14,
		color: ColorConstants.darkBrown100,
	},
	logoutButton: {
		backgroundColor: ColorConstants.darkBrown100,
		borderRadius: SpacingConstants.loginButtonBorderRadius,
		marginTop: SpacingConstants.loginFormContainerGap,
	},
});
