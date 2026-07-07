import "dotenv/config";

export default ({ config }) => {
	const appEnv = process.env.APP_ENV || "development";

	let appName = "Konvo (dev)";
	let icon = "./src/assets/konvo-icon.png";
	let androidPackage = "com.konvo.dev";
	let iosBundleId = "com.konvo.dev";

	if (appEnv === "staging") {
		appName = "konvo (staging)";
		icon = "./src/assets/konvo-icon.png";
		androidPackage = "com.konvo.staging";
		iosBundleId = "com.konvo.staging";
	} else if (appEnv === "production") {
		appName = "Konvo";
		icon = "./src/assets/konvo-icon.png";
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
		plugins: ["expo-secure-store"],
		updates: {
			fallbackToCacheTimeout: 0,
		},
		splash: {
			image: "./src/assets/konvo-splashIcon.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		android: {
			package: androidPackage,
			adaptiveIcon: {
				foregroundImage: "./src/assets/konvo-icon.png",
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
			firebase: {
				apiKey: process.env.FIREBASE_API_KEY,
				authDomain: process.env.FIREBASE_AUTH_DOMAIN,
				projectId: process.env.FIREBASE_PROJECT_ID,
				storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
				messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
				appId: process.env.FIREBASE_APP_ID,
			},
			google: {
				webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
				iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
				androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
			},
		},
	};
};
