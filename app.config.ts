import "dotenv/config";

export default ({ config }) => {
	const appEnv = process.env.APP_ENV || "development";

	let appName = "Konvo (dev)";
	let icon = "./assets/konvo-icon.png";
	let androidPackage = "com.konvo.dev";
	let iosBundleId = "com.konvo.dev";

	if (appEnv === "staging") {
		appName = "konvo (staging)";
		icon = "./assets/konvo-icon.png";
		androidPackage = "com.konvo.staging";
		iosBundleId = "com.konvo.staging";
	} else if (appEnv === "production") {
		appName = "Konvo";
		icon = "./assets/konvo-icon.png";
		androidPackage = "com.konvo";
		iosBundleId = "com.konvo";
	}

	return {
		...config,
		name: appName,
		slug: "konvo",
		version: "1.0.0",
		owner: "mosh1234",
		orientation: "portrait",
		icon,
		scheme: "konvo",
		platforms: ["ios", "android"],
		updates: {
			fallbackToCacheTimeout: 0,
		},
		splash: {
			image: "./assets/konvo-splashIcon.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		android: {
			package: androidPackage,
			adaptiveIcon: {
				foregroundImage: "./assets/konvo-icon.png",
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
				projectId: "ee44161a-3f3c-477b-b245-25a599638661",
			},
		},
	};
};
