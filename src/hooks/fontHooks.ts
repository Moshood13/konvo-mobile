import { useFonts } from "expo-font";
import { FontsConstants } from "../constants";

export const useCustomFont = () => {
	const [isLoaded, error] = useFonts({
		[FontsConstants.brFirma.thin]: require("../assets/fonts/BRFirma/BRFirma-Thin.ttf"),
		[FontsConstants.brFirma.extraLight]: require("../assets/fonts/BRFirma/BRFirma-ExtraLight.ttf"),
		[FontsConstants.brFirma.light]: require("../assets/fonts/BRFirma/BRFirma-Light.ttf"),
		[FontsConstants.brFirma.regular]: require("../assets/fonts/BRFirma/BRFirma-Regular.ttf"),
		[FontsConstants.brFirma.medium]: require("../assets/fonts/BRFirma/BRFirma-Medium.ttf"),
		[FontsConstants.brFirma.semiBold]: require("../assets/fonts/BRFirma/BRFirma-SemiBold.ttf"),
		[FontsConstants.brFirma.bold]: require("../assets/fonts/BRFirma/BRFirma-Bold.ttf"),
		[FontsConstants.brFirma.black]: require("../assets/fonts/BRFirma/BRFirma-Black.ttf"),
	});

	return { isLoaded, error };
};
