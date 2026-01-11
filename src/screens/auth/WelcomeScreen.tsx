import { StyleSheet, View } from "react-native";
import { TitleText, ActionText } from "../../components";
import { ColorConstants } from "../../constants";
import { AuthScreenContainer } from "./components/AuthScreenContainer";
import { WelcomeScreenNavigationProps } from "../../navigations/UnauthorizedStackNavigation";
import { useCallback } from "react";

export const WelcomeScreen = ({ navigation }: WelcomeScreenNavigationProps) => {

	const navigateToLoginScreen = useCallback(() => {
		navigation.navigate("LoginScreen");
	}, []);

	const navigateToSignUpScreen = useCallback(() => {
		navigation.navigate("SignUpScreen");
	}, []);

	return (
		<AuthScreenContainer>
			<View style={styles.contentContainer}>
				<TitleText text="Konvo" style={{ fontSize: 64 }} />
				<View style={styles.buttonContainer}>
					<ActionText onPress={navigateToSignUpScreen} text="SIGN UP" style={styles.signUp} />
					<ActionText onPress={navigateToLoginScreen} text="LOG IN" style={styles.logIn} />
				</View>
			</View>
		</AuthScreenContainer>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		flex: 0.4,
		justifyContent: "space-around",
		alignItems: "center",
		padding: 32,
	},
	buttonContainer: {
		flexDirection: "column",
		gap: 32,
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
