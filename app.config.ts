import "dotenv/config";

export default ({ config }) => {
	const appEnv = process.env.APP_ENV || "development";

	// Needed at config time for the App Links intent filter, which cannot read from
	// `extra`. Falls back so that a build without a populated .env still evaluates.
	const firebaseAuthDomain = process.env.FIREBASE_AUTH_DOMAIN || "konvo-21162.firebaseapp.com";

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
		plugins: [
			"expo-secure-store",
			[
				"expo-image-picker",
				{
					photosPermission: "Konvo needs access to your photos so you can send them in chats.",
					cameraPermission: "Konvo needs camera access so you can take and send photos.",
					// The plugin adds RECORD_AUDIO by default, for video capture. Konvo
					// sends still images only, and an unexplained microphone permission is
					// alarming to users and awkward at store review.
					microphonePermission: false,
				},
			],
			[
				"expo-contacts",
				{
					contactsPermission:
						"Konvo uses your contacts to show which of the people you know are already on Konvo. Numbers are hashed on your device before they are checked.",
				},
			],
			[
				"expo-notifications",
				{
					icon: "./src/assets/konvo-icon.png",
					color: "#2B868C",
				},
			],
		],
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
			// expo-contacts requests both READ and WRITE. Konvo only ever reads the
			// address book, to find which contacts already use the app, so the write
			// permission is dropped rather than left dangling in the manifest.
			blockedPermissions: ["android.permission.WRITE_CONTACTS"],
			// Android App Links for the Firebase auth domain, so tapping an emailed
			// sign-in link reopens Konvo instead of a browser. Firebase Dynamic Links,
			// which used to do this, has been shut down.
			//
			// Baked in now to avoid a second build. It stays dormant until the app's
			// SHA-256 fingerprint is registered in the Firebase console — that is what
			// makes Firebase serve a matching /.well-known/assetlinks.json, which is
			// what Android verifies against. Until then the link opens a browser and
			// the paste fallback on the sign-in screen is the way in.
			intentFilters: [
				{
					action: "VIEW",
					autoVerify: true,
					data: [
						{
							scheme: "https",
							host: firebaseAuthDomain,
							pathPrefix: "/__/auth/",
						},
					],
					category: ["BROWSABLE", "DEFAULT"],
				},
			],
		},
		ios: {
			bundleIdentifier: iosBundleId,
			supportsTablet: true,
			// The matching half of the App Links setup. Requires an Apple Developer
			// account to take effect, so it is inert on a free plan.
			associatedDomains: [`applinks:${firebaseAuthDomain}`],
		},
		extra: {
			appEnv,
			eas: {
				projectId: "ee44161a-3f3c-477b-b245-25a599638661",
			},
			// Images go to Cloudinary rather than Firebase Storage, which needs the
			// paid Blaze plan on projects created after October 2024. Neither value
			// is a secret: an unsigned upload preset is designed to ship in a client,
			// which is why the preset itself restricts formats, size and folder.
			cloudinary: {
				cloudName: process.env.CLOUDINARY_CLOUD_NAME,
				uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
			},
			firebase: {
				apiKey: process.env.FIREBASE_API_KEY,
				authDomain: process.env.FIREBASE_AUTH_DOMAIN,
				projectId: process.env.FIREBASE_PROJECT_ID,
				storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
				messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
				appId: process.env.FIREBASE_APP_ID,
				databaseURL: process.env.FIREBASE_DATABASE_URL,
			},
			sentry: {
				dsn: process.env.SENTRY_DSN,
			},
			google: {
				webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
				iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
				androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
			},
		},
	};
};
