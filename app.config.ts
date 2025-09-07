import "dotenv/config";

export default ({ config }) => {
	let appEnv = process.env.APP_ENV || "development";

	let appName = "Penny Save (dev)";
	let icon = "./assets/icon-dev.png";

	if (appEnv === "staging") {
		appName = "Penny Save (staging)";
		icon = "./assets/icon-staging.png";
	} else if (appEnv === "production") {
		appName = "Penny Save";
		icon = "./assets/icon.png";
	}

	return {
		...config,
		name: appName,
		slug: "pennysave-mobile",
		version: "1.0.0",
		orientation: "portrait",
		icon: icon,
		scheme: "pennysave",
		platforms: ["ios", "android"],
		updates: {
			fallbackToCacheTimeout: 0,
		},
		splash: {
			image: "./assets/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
		},
		ios: {
			supportsTablet: true,
		},
		extra: {
			appEnv,
			eas: {
				projectId: "c47e297e-4145-4d47-935d-bd1ecc0367fc",
			},
		},
	};
};
