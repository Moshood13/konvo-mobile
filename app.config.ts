import "dotenv/config";

export default ({ config }) => {
	let appEnv = process.env.APP_ENV || "development";

	let appName = "Konvo (dev)";
	let icon = "./assets/icon.png";
	let androidPackage = "com.konvo.dev";
	let iosBundleId = "com.konvo.dev";

	if (appEnv === "staging") {
		appName = "konvo (staging)";
		icon = "./assets/icon.png";
		androidPackage = "com.konvo.staging";
		iosBundleId = "com.konvo.staging";
	} else if (appEnv === "production") {
		appName = "Konvo";
		icon = "./assets/icon.png";
		androidPackage = "com.konvo";
		iosBundleId = "com.konvo";
	}

	return {
		...config,
		name: appName,
		slug: "Konvo",
		version: "1.0.0",
		orientation: "portrait",
		icon,
		scheme: "konvo",
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
