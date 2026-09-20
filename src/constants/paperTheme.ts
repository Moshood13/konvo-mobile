import { configureFonts, MD3LightTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";
import { ColorConstants } from "./colors";
import { FontsConstants } from "./fonts";

// Paper derives every variant from these, so setting the family once here means
// Paper-owned text (HelperText, Snackbar, TextInput labels) matches our own
// Text components instead of falling back to the system font.
const fontConfig = {
	default: { fontFamily: FontsConstants.brFirma.regular },
	bodySmall: { fontFamily: FontsConstants.brFirma.regular },
	bodyMedium: { fontFamily: FontsConstants.brFirma.regular },
	bodyLarge: { fontFamily: FontsConstants.brFirma.regular },
	labelSmall: { fontFamily: FontsConstants.brFirma.medium },
	labelMedium: { fontFamily: FontsConstants.brFirma.medium },
	labelLarge: { fontFamily: FontsConstants.brFirma.medium },
	titleSmall: { fontFamily: FontsConstants.brFirma.semiBold },
	titleMedium: { fontFamily: FontsConstants.brFirma.semiBold },
	titleLarge: { fontFamily: FontsConstants.brFirma.semiBold },
};

export const paperTheme: MD3Theme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: ColorConstants.green100,
		onPrimary: ColorConstants.white,
		secondary: ColorConstants.green500,
		error: ColorConstants.red,
		background: ColorConstants.white,
		surface: ColorConstants.white,
		onSurface: ColorConstants.black900,
		onSurfaceVariant: ColorConstants.black50,
		outline: ColorConstants.darkBrown100,
	},
	fonts: configureFonts({ config: fontConfig }),
};
