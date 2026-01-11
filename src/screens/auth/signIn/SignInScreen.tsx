import { StyleSheet, View } from "react-native";
import { AuthScreenContainer } from "../components/AuthScreenContainer";
import { ColorConstants } from "../../../constants";

export const SignInScreen = () => {
	return (
		<AuthScreenContainer>
			<View style={styles.loginContainer}>
				
			</View>
		</AuthScreenContainer>
	);
};

const styles = StyleSheet.create({
	loginContainer: {
		backgroundColor: ColorConstants.white
	}
})