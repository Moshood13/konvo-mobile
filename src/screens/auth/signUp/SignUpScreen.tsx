import { StyleSheet, View } from "react-native";
import { AuthScreenContainer } from "../components/AuthScreenContainer";
import { ColorConstants, ColorTheme, SpacingConstants } from "../../../constants";
import { RegularText } from "../../../components/text/RegularText";
import { ActionText, BoldText, PaperInput, PrimaryButton, SecureInput } from "../../../components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emptySignUpFormValue, getSignUpSchema } from "./validation";
import { useCallback, useMemo } from "react";
import { SocialAuth } from "../socialAuth/SocialAuth";
import { SignUpScreenNavigationProps } from "../../../navigations/UnauthorizedStackNavigation";

export const SignUpScreen = ({ navigation }: SignUpScreenNavigationProps) => {
	const screenBackgroundColor = ColorTheme.auth.signUpBackgroundColor;
	const signUpSchema = useMemo(() => getSignUpSchema(), []);

	const { control, formState } = useForm({
		defaultValues: emptySignUpFormValue,
		resolver: yupResolver(signUpSchema),
		mode: "onChange",
	});

	const onNavigateToSignInScreen = useCallback(() => {
		navigation.navigate("SignInScreen");
	}, []);
	return (
		<AuthScreenContainer overlayStyle={{ backgroundColor: screenBackgroundColor }}>
			<View style={styles.container}>
				<View style={styles.sinUpTextContainer}>
					<RegularText text="Welcome" style={styles.welcomeText} />
					<BoldText text="Sign Up!" style={styles.signUpText} />
				</View>
				<View style={styles.loginFormContainer}>
					<View style={styles.loginForm}>
						<PaperInput
							name="username"
							control={control}
							error={formState.errors.username?.message}
							placeholder="Username"
							label="Username"
							focusPlaceholderTextColor={ColorConstants.white}
							focusBorderColor={ColorConstants.white}
							normalBorderColor={ColorConstants.white}
							labelBackgroundColor={screenBackgroundColor}
							labelTextColor={ColorConstants.white}
							textColor={ColorConstants.white}
						/>
						<PaperInput
							name="email"
							control={control}
							error={formState.errors.email?.message}
							placeholder="Email Address"
							label="Email Address"
							focusPlaceholderTextColor={ColorConstants.white}
							focusBorderColor={ColorConstants.white}
							normalBorderColor={ColorConstants.white}
							labelBackgroundColor={screenBackgroundColor}
							labelTextColor={ColorConstants.white}
							textColor={ColorConstants.white}
						/>
						<SecureInput
							control={control}
							name="password"
							placeholder="Password"
							error={formState.errors.password?.message}
							label="Password"
							focusPlaceholderTextColor={ColorConstants.white}
							focusBorderColor={ColorConstants.white}
							normalBorderColor={ColorConstants.white}
							labelBackgroundColor={screenBackgroundColor}
							labelTextColor={ColorConstants.white}
							iconColor={ColorConstants.white}
							textColor={ColorConstants.white}
						/>
					</View>
					<PrimaryButton
						onPress={() => {}}
						text="SIGN UP"
						style={styles.loginButton}
						textStyle={{ color: ColorConstants.black50 }}
					/>
					<View style={styles.socialAuthContainer}>
						<View style={styles.socialAuthText}>
							<View style={styles.line} />
							<RegularText text="or connect with" style={{ color: ColorConstants.white }} />
							<View style={styles.line} />
						</View>
						<SocialAuth />
					</View>
					<ActionText
						text="I Already have an account"
						onPress={onNavigateToSignInScreen}
						style={{ color: ColorConstants.white, textDecorationLine: "underline" }}
					/>
				</View>
			</View>
		</AuthScreenContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "space-around",
		flex: 1,
	},
	sinUpTextContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	welcomeText: {
		fontSize: 16,
		textAlign: "center",
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
		color: ColorConstants.white50
	},
	signUpText: {
		fontSize: 64,
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
		color: ColorConstants.white
	},
	loginFormContainer: {
		paddingHorizontal: SpacingConstants.loginFormPaddingHorizontal,
		gap: SpacingConstants.loginFormContainerGap,
		justifyContent: "center",
	},
	loginForm: {
		gap: SpacingConstants.loginFormGap,
	},
	altContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	rememberMeContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: SpacingConstants.rememberMeContainerGap,
	},
	loginButton: {
		backgroundColor: ColorConstants.white,
		borderRadius: SpacingConstants.loginButtonBorderRadius,
		color: ColorConstants.black50,
	},
	socialAuthContainer: {
		flexDirection: "column",
		gap: SpacingConstants.socialAuthContainerGap,
	},
	socialAuthText: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: SpacingConstants.socialAuthTextGap,
	},
	line: {
		width: SpacingConstants.socialAuthTextLineWidth,
		height: 1,
		backgroundColor: ColorConstants.white,
	},
});
