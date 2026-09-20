import { StyleSheet, View } from "react-native";
import { TitleText, ActionText } from "../../components";
import { ColorConstants, ColorTheme } from "../../constants";
import { AuthScreenContainer } from "./components/AuthScreenContainer";
import { WelcomeScreenNavigationProps } from "../../navigations/UnauthorizedStackNavigation";
import { useCallback } from "react";
import { AuthImage } from "../../assets/images";

export const WelcomeScreen = ({ navigation }: WelcomeScreenNavigationProps) => {
	// One destination, because sign-up and sign-in are the same act now: there are no
	// passwords, so a first sign-in creates the account and the gate routes it into
	// onboarding. Keeping two buttons would imply a distinction that does not exist.
	const navigateToSignIn = useCallback(() => {
		navigation.navigate("SignInScreen");
	}, [navigation]);

	return (
		<AuthScreenContainer authBackgroundImage={AuthImage}>
			<View style={styles.contentContainer}>
				<TitleText text="Konvo" style={styles.brand} />
				<View style={styles.buttonContainer}>
					<ActionText onPress={navigateToSignIn} text="GET STARTED" style={styles.logIn} />
				</View>
			</View>
		</AuthScreenContainer>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 32,
		gap: 64,
	},
	// Sits on the full-bleed photo background, so it opts out of the dark text default.
	brand: {
		fontSize: 64,
		color: ColorTheme.text.inverse,
	},
	buttonContainer: {
		flexDirection: "column",
		gap: 36,
	},
	signUp: {
		padding: 16,
		borderColor: ColorConstants.white,
		borderWidth: 2,
		width: "100%",
		textAlign: "center",
		borderRadius: 100,
	},
	logIn: {
		padding: 16,
		backgroundColor: ColorConstants.white,
		width: "100%",
		textAlign: "center",
		borderRadius: 100,
		color: ColorConstants.darkBrown500,
	},
});
