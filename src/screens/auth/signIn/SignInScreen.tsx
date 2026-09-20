import { useCallback, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Snackbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import {
	ActionText,
	BoldText,
	PaperInput,
	PrimaryButton,
	RegularText,
	Subtitle,
} from "../../../components";
import { ColorConstants, ColorTheme, Radius, Space, SpacingConstants } from "../../../constants";
import { AuthImage } from "../../../assets/images";
import { AuthScreenContainer } from "../components/AuthScreenContainer";
import { SocialAuth } from "../socialAuth/SocialAuth";
import {
	completePastedSignInLink,
	mapFirebaseAuthError,
	sendEmailSignInLink,
	useGoogleSignIn,
} from "../../../services/firebase";
import { emptySignInFormValue, getSignInSchema, SignInFormValues } from "./validation";

/**
 * First-run sign-in. Two passwordless routes, no passwords anywhere:
 *  - Google, one tap;
 *  - an emailed sign-in link, for anyone without a Google account.
 *
 * A 6-digit code would need a server to generate and verify it, and Cloud Functions
 * are not available on the free plan. Either way this screen is seen exactly once:
 * the session is persisted to AsyncStorage and never expires on its own.
 */
export const SignInScreen = () => {
	const [message, setMessage] = useState<string | null>(null);
	const [linkSentTo, setLinkSentTo] = useState<string | null>(null);
	const [sending, setSending] = useState(false);
	const [pastedLink, setPastedLink] = useState("");
	const [completingPaste, setCompletingPaste] = useState(false);
	const google = useGoogleSignIn();

	// No explicit generic: letting useForm infer from defaultValues keeps the resolver
	// output type aligned. Naming the generic makes yup's optional-by-default inference
	// clash with the required fields in the interface.
	const { control, handleSubmit, formState } = useForm({
		defaultValues: emptySignInFormValue,
		resolver: yupResolver(getSignInSchema()),
		mode: "onBlur",
	});

	const onSendLink = useCallback(async ({ email }: SignInFormValues) => {
		setSending(true);
		try {
			await sendEmailSignInLink(email);
			setLinkSentTo(email.trim().toLowerCase());
		} catch (error) {
			setMessage(mapFirebaseAuthError(error));
		} finally {
			setSending(false);
		}
	}, []);

	const onPasteLink = useCallback(async () => {
		setCompletingPaste(true);
		try {
			const result = await completePastedSignInLink(pastedLink, linkSentTo ?? undefined);
			if (!result) {
				setMessage("We lost track of which email this link is for. Request a new one.");
			}
			// On success the auth listener flips the gate; this screen unmounts.
		} catch (error) {
			setMessage(
				error instanceof Error && error.message.startsWith("That doesn't look")
					? error.message
					: mapFirebaseAuthError(error),
			);
		} finally {
			setCompletingPaste(false);
		}
	}, [pastedLink, linkSentTo]);

	if (linkSentTo) {
		return (
			<AuthScreenContainer authBackgroundImage={AuthImage}>
				<ScrollView
					contentContainerStyle={styles.sentContainer}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<Ionicons name="mail-outline" size={64} color={ColorConstants.white} />
					<BoldText text="Check your email" style={styles.sentTitle} />
					<Subtitle text={`We sent a sign-in link to ${linkSentTo}.`} style={styles.sentBody} />

					{/* Until App Links are configured against the auth domain, tapping the
					    link opens a browser rather than Konvo. Pasting it is the reliable
					    path, so it is presented as the primary action, not buried. */}
					<View style={styles.pasteBlock}>
						<Subtitle
							text="Open the email, copy the sign-in link, and paste it here:"
							style={styles.sentBody}
						/>
						<TextInput
							value={pastedLink}
							onChangeText={setPastedLink}
							placeholder="https://konvo-…"
							placeholderTextColor={ColorConstants.white50}
							autoCapitalize="none"
							autoCorrect={false}
							multiline
							style={styles.pasteInput}
						/>
						<PrimaryButton
							text="SIGN IN"
							onPress={onPasteLink}
							loading={completingPaste}
							disabled={completingPaste || pastedLink.trim().length === 0}
							style={styles.primaryButton}
							textStyle={styles.primaryButtonText}
						/>
					</View>

					<Subtitle
						text="Nothing arrived? Check your spam folder, or go back and try a different address."
						style={styles.sentHint}
					/>
					<ActionText
						text="Use a different email"
						onPress={() => {
							setLinkSentTo(null);
							setPastedLink("");
						}}
						style={styles.backLink}
					/>
				</ScrollView>

				<Snackbar visible={!!message} onDismiss={() => setMessage(null)} duration={6000}>
					{message}
				</Snackbar>
			</AuthScreenContainer>
		);
	}

	return (
		<AuthScreenContainer authBackgroundImage={AuthImage}>
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					contentContainerStyle={styles.scroll}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<BoldText text="Konvo" style={styles.brand} />
						<Subtitle text="Simple, private messaging." style={styles.tagline} />
					</View>

					<View style={styles.form}>
						<PaperInput
							name="email"
							control={control}
							label="Email"
							placeholder="you@example.com"
							keyboardType="email-address"
							error={formState.errors.email?.message}
							textColor={ColorConstants.white}
							labelTextColor={ColorConstants.white}
							normalPlaceholderTextColor={ColorConstants.white50}
							focusPlaceholderTextColor={ColorConstants.white}
							normalBorderColor={ColorConstants.white50}
							focusBorderColor={ColorConstants.white}
						/>

						<PrimaryButton
							text="EMAIL ME A SIGN-IN LINK"
							onPress={handleSubmit(onSendLink)}
							loading={sending}
							disabled={sending}
							style={styles.primaryButton}
							textStyle={styles.primaryButtonText}
						/>

						<View style={styles.dividerRow}>
							<View style={styles.dividerLine} />
							<RegularText text="or" style={styles.dividerText} />
							<View style={styles.dividerLine} />
						</View>

						<SocialAuth
							onGooglePress={google.promptGoogleSignIn}
							googleLoading={google.loading}
							googleDisabled={google.disabled}
						/>
					</View>

					<Subtitle
						text="By continuing you agree to Konvo's Terms and Privacy Policy."
						style={styles.legal}
					/>
				</ScrollView>
			</KeyboardAvoidingView>

			<Snackbar
				visible={!!message || !!google.error}
				onDismiss={() => {
					setMessage(null);
					google.clearError();
				}}
				duration={5000}
			>
				{message ?? google.error}
			</Snackbar>
		</AuthScreenContainer>
	);
};

const styles = StyleSheet.create({
	flex: { flex: 1 },
	scroll: {
		flexGrow: 1,
		justifyContent: "center",
		paddingHorizontal: SpacingConstants.loginFormPaddingHorizontal,
		gap: Space.xxl,
	},
	header: { alignItems: "center", gap: Space.sm },
	brand: {
		fontSize: 56,
		color: ColorTheme.text.inverse,
	},
	tagline: {
		color: ColorConstants.white50,
		textAlign: "center",
	},
	form: { gap: SpacingConstants.loginFormContainerGap },
	primaryButton: {
		backgroundColor: ColorConstants.white,
		borderRadius: Radius.pill,
	},
	primaryButtonText: {
		color: ColorConstants.green100,
	},
	dividerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Space.lg,
	},
	dividerLine: {
		height: 1,
		width: SpacingConstants.socialAuthTextLineWidth,
		backgroundColor: ColorConstants.white50,
	},
	dividerText: { color: ColorConstants.white50 },
	legal: {
		textAlign: "center",
		fontSize: 12,
		color: ColorConstants.white50,
	},

	sentContainer: {
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: Space.lg,
		paddingHorizontal: SpacingConstants.loginFormPaddingHorizontal,
		paddingVertical: Space.xxl,
	},
	sentTitle: { fontSize: 28, color: ColorTheme.text.inverse },
	sentBody: { textAlign: "center", color: ColorTheme.text.inverse },
	sentHint: { textAlign: "center", fontSize: 12, color: ColorConstants.white50 },
	pasteBlock: {
		width: "100%",
		gap: Space.md,
		marginTop: Space.md,
	},
	pasteInput: {
		minHeight: 88,
		borderWidth: 1,
		borderColor: ColorConstants.white50,
		borderRadius: Radius.md,
		padding: Space.md,
		color: ColorConstants.white,
		textAlignVertical: "top",
	},
	backLink: {
		color: ColorConstants.white,
		textDecorationLine: "underline",
	},
});
