import { ColorConstants } from "./colors";

export class ColorTheme {
	static mainContainer = {
		backgroundColor: ColorConstants.white,
	};

	static text = {
		white: ColorConstants.white,
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
