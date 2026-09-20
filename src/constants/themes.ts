import { ColorConstants } from "./colors";

export class ColorTheme {
	static mainContainer = {
		backgroundColor: ColorConstants.white,
	};

	/**
	 * `primary` is the default for every component in `src/components/text`.
	 * These used to default to white because every screen sat on the teal auth
	 * background; chat screens are light, so the default is now dark and screens
	 * on a photo/teal background opt into `inverse` explicitly.
	 */
	static text = {
		primary: ColorConstants.black900,
		secondary: ColorConstants.black50,
		tertiary: ColorConstants.grey500,
		inverse: ColorConstants.white,
		brand: ColorConstants.green100,
		danger: ColorConstants.red,
		/** @deprecated Use `inverse`. Kept so existing call sites keep compiling. */
		white: ColorConstants.white,
	};

	static chat = {
		screenBackground: ColorConstants.grey100,
		bubbleOut: ColorConstants.green25,
		bubbleIn: ColorConstants.white,
		bubbleBorder: "rgba(0,0,0,0.04)",
		composerBackground: ColorConstants.white,
		composerField: ColorConstants.grey50,
		tickUnread: ColorConstants.grey300,
		tickRead: ColorConstants.tickBlue,
		tickPending: ColorConstants.grey500,
		tickFailed: ColorConstants.red,
		dateChipBackground: "rgba(0,0,0,0.06)",
		dateChipText: ColorConstants.black50,
		unreadBadge: ColorConstants.green100,
		separator: ColorConstants.grey50,
		systemMessageBackground: "rgba(0,0,0,0.05)",
		quoteBar: ColorConstants.green100,
		quoteBackground: "rgba(0,0,0,0.04)",
	};

	static icon = {
		whiteIcon: ColorConstants.white,
	};

	static button = {
		facebookButtonColor: ColorConstants.facebookBlue,
		googleButtonColor: ColorConstants.googleRed,
	};

	static inputField = {
		focusBorderColor: ColorConstants.green100,
		normalBorderColor: ColorConstants.darkBrown100,
		inputTextColor: ColorConstants.white,
	};

	static auth = {
		loginBackgroundColor: ColorConstants.white,
		signUpBackgroundColor: ColorConstants.green100,
		switchThumbColor: ColorConstants.green100,
		falseTrackColor: ColorConstants.white50,
		trueTrackColor: ColorConstants.green100,
		rememberMeTextColor: ColorConstants.black50,
		authTextColor: ColorConstants.black50,
		forgotPasswordTextColor: ColorConstants.green100,
		signUpTextColor: ColorConstants.black50,
		loginButtonBackgroundColor: ColorConstants.green100,
		lineBackgroundColor: ColorConstants.darkBrown100,
		signUpPlaceholderTextColor: ColorConstants.white,
		signInWelcomeScreenTextColor: ColorConstants.black50,
		loginTextColor: ColorConstants.black900,
		shadowColor: ColorConstants.black900,
	};
}
