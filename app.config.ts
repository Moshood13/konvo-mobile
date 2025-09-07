import "dotenv/config";

export default ({ config }) => {
	let appEnv = process.env.APP_ENV || "development";

	let appName = "Penny Save (dev)";
	let icon = "./assets/icon-dev.png";
	let androidPackage = "com.pennysave.dev";
	let iosBundleId = "com.pennysave.dev";

	if (appEnv === "staging") {
		appName = "Penny Save (staging)";
		icon = "./assets/icon-staging.png";
		androidPackage = "com.pennysave.staging";
		iosBundleId = "com.pennysave.staging";
	} else if (appEnv === "production") {
		appName = "Penny Save";
		icon = "./assets/icon.png";
		androidPackage = "com.pennysave";
		iosBundleId = "com.pennysave";
	}

	return {
		...config,
		name: appName,
		slug: "pennysave-mobile",
		version: "1.0.0",
		orientation: "portrait",
		icon,
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
			package: androidPackage,
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
		},
		ios: {
			bundleIdentifier: iosBundleId,
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
