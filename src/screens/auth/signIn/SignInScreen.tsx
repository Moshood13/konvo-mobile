import { Animated, StyleSheet, Switch, View } from "react-native";
import { AuthScreenContainer } from "../components/AuthScreenContainer";
import { AuthBackgroundImage } from "../../../assets/images";
import { ColorConstants, ColorTheme, SpacingConstants } from "../../../constants";
import { RegularText } from "../../../components/text/RegularText";
import { ActionText, BoldText, PaperInput, PrimaryButton, SecureInput } from "../../../components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emptySignInFormValue, getSignInSchema } from "./validation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SocialAuth } from "../socialAuth/SocialAuth";
import { SignInScreenNavigationProps } from "../../../navigations/UnauthorizedStackNavigation";

export const SignInScreen = ({ navigation }: SignInScreenNavigationProps) => {
	const screenBackgroundColor = ColorConstants.white;
	const [rememberMe, setRememberMe] = useState(false);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const signInSchema = useMemo(() => getSignInSchema(), []);
	const svgTranslateY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(svgTranslateY, {
			toValue: isInputFocused ? -80 : 0, // move up when focused
			duration: 250,
			useNativeDriver: true,
		}).start();
	}, [isInputFocused]);

	const { control, formState } = useForm({
		defaultValues: emptySignInFormValue,
		resolver: yupResolver(signInSchema),
		mode: "onChange",
	});

	const onNavigateToSignUpScreen = useCallback(() => {
		navigation.navigate("SignUpScreen");
	}, []);
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
							error={formState.errors.signInEmail?.message}
							placeholder="Email Address"
							label="Email Address"
							normalPlaceholderTextColor={ColorConstants.darkBrown100}
							labelBackgroundColor={screenBackgroundColor}
							onFocus={() => setIsInputFocused(true)}
							onBlur={() => setIsInputFocused(false)}
						/>
						<SecureInput
							control={control}
							name="password"
							placeholder="Password"
							error={formState.errors.signInPassword?.message}
							label="Password"
							normalPlaceholderTextColor={ColorConstants.darkBrown100}
							labelBackgroundColor={screenBackgroundColor}
							onFocus={() => setIsInputFocused(true)}
							onBlur={() => setIsInputFocused(false)}
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
								onPress={() => {}}
								style={{ color: ColorTheme.auth.forgotPasswordTextColor }}
							/>
						</View>
					</View>
					<View style={styles.shadow}>
						<PrimaryButton onPress={() => {}} text="LOG IN" style={styles.loginButton} />
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
						<SocialAuth />
					</View>
					<ActionText
						text="I don't have an account yet"
						onPress={onNavigateToSignUpScreen}
						style={{ color: ColorTheme.auth.signUpTextColor, textDecorationLine: "underline" }}
					/>
				</View>
			</View>
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
