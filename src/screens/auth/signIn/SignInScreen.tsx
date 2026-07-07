import { StyleSheet, Switch, View } from "react-native";
import { Snackbar } from "react-native-paper";
import { AuthScreenContainer } from "../components/AuthScreenContainer";
import { AuthBackgroundImage } from "../../../assets/images";
import { ColorConstants, ColorTheme, SpacingConstants } from "../../../constants";
import { RegularText } from "../../../components/text/RegularText";
import { ActionText, BoldText, PaperInput, PrimaryButton, SecureInput } from "../../../components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emptySignInFormValue, getSignInSchema, SignInAuthValues } from "./validation";
import { useCallback, useMemo, useState } from "react";
import { SocialAuth } from "../socialAuth/SocialAuth";
import { SignInScreenNavigationProps } from "../../../navigations/UnauthorizedStackNavigation";
import {
	mapFirebaseAuthError,
	sendResetEmail,
	signInWithEmail,
	useGoogleSignIn,
} from "../../../services/firebase";

export const SignInScreen = ({ navigation }: SignInScreenNavigationProps) => {
	const screenBackgroundColor = ColorConstants.white;
	const [rememberMe, setRememberMe] = useState(false);
	const signInSchema = useMemo(() => getSignInSchema(), []);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const google = useGoogleSignIn();

	const { control, formState, handleSubmit, getValues } = useForm({
		defaultValues: emptySignInFormValue,
		resolver: yupResolver(signInSchema),
		mode: "onChange",
	});

	// On success, the auth listener flips the navigation gate to the authorized stack.
	const onSubmit = useCallback(async (values: SignInAuthValues) => {
		setMessage(null);
		setLoading(true);
		try {
			await signInWithEmail(values.email, values.password);
		} catch (error) {
			setMessage(mapFirebaseAuthError(error));
		} finally {
			setLoading(false);
		}
	}, []);

	const onForgotPassword = useCallback(async () => {
		const email = getValues("email");
		if (!email) {
			setMessage("Enter your email address first, then tap Forgot Password.");
			return;
		}
		try {
			await sendResetEmail(email);
			setMessage("Password reset email sent. Check your inbox.");
		} catch (error) {
			setMessage(mapFirebaseAuthError(error));
		}
	}, [getValues]);

	const onNavigateToSignUpScreen = useCallback(() => {
		navigation.navigate("SignUpScreen");
	}, [navigation]);
	return (
		<AuthScreenContainer
			authBackgroundImage={AuthBackgroundImage}
			overlayStyle={{ backgroundColor: screenBackgroundColor, opacity: 0.9 }}
		>
			<View style={styles.loginContainer}>
				<View style={styles.loginTextContainer}>
					<RegularText text="Welcome Back" style={styles.welcomeText} />
					<BoldText text="Log In!" style={styles.loginText} />
				</View>
				<View style={styles.loginFormContainer}>
					<View style={styles.loginForm}>
						<PaperInput
							name="email"
							control={control}
							error={formState.errors.email?.message}
							placeholder="Email Address"
							label="Email Address"
							normalPlaceholderTextColor={ColorConstants.darkBrown100}
							labelBackgroundColor={screenBackgroundColor}
						/>
						<SecureInput
							control={control}
							name="password"
							placeholder="Password"
							error={formState.errors.password?.message}
							label="Password"
							normalPlaceholderTextColor={ColorConstants.darkBrown100}
							labelBackgroundColor={screenBackgroundColor}
						/>
						<View style={styles.altContainer}>
							<View style={styles.rememberMeContainer}>
								<Switch
									value={rememberMe}
									onValueChange={setRememberMe}
									thumbColor={ColorTheme.auth.switchThumbColor}
									trackColor={{
										false: ColorTheme.auth.falseTrackColor,
										true: ColorTheme.auth.trueTrackColor,
									}}
								/>
								<RegularText
									text="Remember Me"
									style={{ fontSize: 14, color: ColorTheme.auth.rememberMeTextColor }}
								/>
							</View>
							<ActionText
								text="Forgot Password?"
								onPress={onForgotPassword}
								style={{ color: ColorTheme.auth.forgotPasswordTextColor }}
							/>
						</View>
					</View>
					<View style={styles.shadow}>
						<PrimaryButton
							onPress={handleSubmit(onSubmit)}
							loading={loading}
							text="LOG IN"
							style={styles.loginButton}
						/>
					</View>
					<View style={styles.socialAuthContainer}>
						<View style={styles.socialAuthText}>
							<View style={styles.line} />
							<RegularText
								text="or connect with"
								style={{ color: ColorTheme.auth.authTextColor }}
							/>
							<View style={styles.line} />
						</View>
						<SocialAuth
							onGooglePress={google.promptGoogleSignIn}
							googleLoading={google.loading}
							googleDisabled={google.disabled}
						/>
					</View>
					<ActionText
						text="I don't have an account yet"
						onPress={onNavigateToSignUpScreen}
						style={{ color: ColorTheme.auth.signUpTextColor, textDecorationLine: "underline" }}
					/>
				</View>
			</View>
			<Snackbar
				visible={!!message || !!google.error}
				onDismiss={() => {
					setMessage(null);
					google.clearError();
				}}
				duration={4000}
			>
				{message ?? google.error}
			</Snackbar>
		</AuthScreenContainer>
	);
};

const styles = StyleSheet.create({
	loginContainer: { justifyContent: "space-around", flex: 1 },
	loginTextContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	welcomeText: {
		fontSize: 16,
		textAlign: "center",
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
		color: ColorTheme.auth.signInWelcomeScreenTextColor,
	},
	loginText: {
		fontSize: 64,
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
		color: ColorTheme.auth.loginTextColor,
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
		backgroundColor: ColorTheme.auth.loginButtonBackgroundColor,
		borderRadius: SpacingConstants.loginButtonBorderRadius,
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
		backgroundColor: ColorTheme.auth.lineBackgroundColor,
	},
	shadow: {
		shadowColor: ColorTheme.auth.shadowColor,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
		elevation: 6,
		borderRadius: SpacingConstants.loginButtonBorderRadius,
	},
});
