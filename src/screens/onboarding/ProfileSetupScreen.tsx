import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Snackbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import {
	BoldText,
	MainContainer,
	PaperInput,
	PrimaryButton,
	RegularText,
	Subtitle,
} from "../../components";
import {
	ChatMetrics,
	ColorConstants,
	ColorTheme,
	Radius,
	Space,
	SpacingConstants,
} from "../../constants";
import { useAppSelector } from "../../hooks";
import { completeOnboarding, hashPhone, toE164 } from "../../services/firebase";
import { isCloudinaryConfigured, uploadAvatar } from "../../services/media";
import {
	emptyProfileSetupFormValue,
	getProfileSetupSchema,
	ProfileSetupFormValues,
} from "./validation";

/**
 * Shown once, between signing in and reaching the chat list.
 *
 * Writing `profileComplete: true` at the end is what moves the navigator on: the
 * profile listener sees the change and the gate swaps stacks. There is no
 * navigation.navigate() here by design — the gate is the single source of truth for
 * which stack is mounted.
 */
export const ProfileSetupScreen = () => {
	const uid = useAppSelector((s) => s.persistedSecured.userIdentity.value.identity.id);
	const email = useAppSelector((s) => s.persistedSecured.userIdentity.value.identity.email);

	const [photoUri, setPhotoUri] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	// No explicit generic — see the note in SignInScreen.
	const { control, handleSubmit, formState } = useForm({
		defaultValues: emptyProfileSetupFormValue,
		resolver: yupResolver(getProfileSetupSchema()),
		mode: "onBlur",
	});

	const onPickPhoto = useCallback(async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			setMessage("Konvo needs access to your photos to set a profile picture.");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			// MediaTypeOptions is deprecated in SDK 53; the string-array form replaces it.
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled && result.assets[0]) {
			setPhotoUri(result.assets[0].uri);
		}
	}, []);

	const onSubmit = useCallback(
		async (values: ProfileSetupFormValues) => {
			if (!uid) return;

			const e164 = toE164(values.phone);
			if (!e164) {
				setMessage("That phone number doesn't look right. Include your country code.");
				return;
			}

			setSaving(true);
			try {
				let photoUrl: string | null = null;
				let photoPublicId: string | null = null;

				if (photoUri) {
					if (!isCloudinaryConfigured()) {
						// Better to finish onboarding without a photo than to trap the user
						// on this screen because an env var is missing.
						setMessage("Photo upload isn't configured yet — saving without a picture.");
					} else {
						setUploadProgress(0);
						const uploaded = await uploadAvatar(photoUri, uid, setUploadProgress);
						photoUrl = uploaded.url;
						photoPublicId = uploaded.publicId;
					}
				}

				await completeOnboarding(uid, {
					displayName: values.displayName,
					phoneE164: e164,
					phoneHash: await hashPhone(e164),
					photoUrl,
					photoPublicId,
				});
				// No navigation call: the profile listener flips the gate.
			} catch (error) {
				setMessage(error instanceof Error ? error.message : "Couldn't save your profile.");
			} finally {
				setSaving(false);
				setUploadProgress(null);
			}
		},
		[uid, photoUri],
	);

	const uploading = uploadProgress !== null;

	return (
		<MainContainer>
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
						<BoldText text="Set up your profile" style={styles.title} />
						<Subtitle
							text="Your name and photo are shown to people you chat with."
							style={styles.subtitle}
						/>
					</View>

					<Pressable onPress={onPickPhoto} style={styles.avatarWrapper} disabled={saving}>
						{photoUri ? (
							<Image source={{ uri: photoUri }} style={styles.avatar} />
						) : (
							<View style={[styles.avatar, styles.avatarPlaceholder]}>
								<Ionicons name="camera-outline" size={36} color={ColorConstants.green100} />
							</View>
						)}
						{uploading && (
							<View style={styles.avatarOverlay}>
								<ActivityIndicator color={ColorConstants.white} />
							</View>
						)}
						<RegularText
							text={photoUri ? "Change photo" : "Add a photo"}
							style={styles.avatarHint}
						/>
					</Pressable>

					<View style={styles.form}>
						<PaperInput
							name="displayName"
							control={control}
							label="Your name"
							placeholder="e.g. Moshood A."
							autoCapitalize="words"
							error={formState.errors.displayName?.message}
							disabled={saving}
						/>
						<PaperInput
							name="phone"
							control={control}
							label="Phone number"
							placeholder="+234 801 234 5678"
							keyboardType="phone-pad"
							error={formState.errors.phone?.message}
							disabled={saving}
						/>
						<Subtitle
							text="Your number lets friends find you on Konvo. It's never shown publicly and we don't send it anywhere in readable form."
							style={styles.help}
						/>
						{!!email && <RegularText text={`Signed in as ${email}`} style={styles.email} />}
					</View>

					<PrimaryButton
						text="START CHATTING"
						onPress={handleSubmit(onSubmit)}
						loading={saving}
						disabled={saving}
						style={styles.submit}
					/>
				</ScrollView>
			</KeyboardAvoidingView>

			<Snackbar visible={!!message} onDismiss={() => setMessage(null)} duration={5000}>
				{message}
			</Snackbar>
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	flex: { flex: 1 },
	scroll: {
		flexGrow: 1,
		justifyContent: "center",
		paddingHorizontal: SpacingConstants.loginFormPaddingHorizontal,
		paddingVertical: Space.xxl,
		gap: Space.xl,
	},
	header: { gap: Space.sm },
	title: { fontSize: 28 },
	subtitle: { color: ColorTheme.text.secondary },
	avatarWrapper: { alignItems: "center", gap: Space.sm },
	avatar: {
		width: ChatMetrics.avatarLg,
		height: ChatMetrics.avatarLg,
		borderRadius: ChatMetrics.avatarLg / 2,
	},
	avatarPlaceholder: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: ColorConstants.lightBlue,
		borderWidth: 1,
		borderColor: ColorConstants.green100,
	},
	avatarOverlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.35)",
		borderRadius: ChatMetrics.avatarLg / 2,
	},
	avatarHint: { color: ColorTheme.text.brand },
	form: { gap: SpacingConstants.loginFormGap },
	help: { fontSize: 12, color: ColorTheme.text.tertiary },
	email: { color: ColorTheme.text.tertiary },
	submit: {
		backgroundColor: ColorConstants.green100,
		borderRadius: Radius.pill,
	},
});
