import Constants from "expo-constants";
import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, initializeAuth, Persistence } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import {
	connectFirestoreEmulator,
	initializeFirestore,
	memoryLocalCache,
} from "firebase/firestore";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import type { Database } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

// getReactNativePersistence exists in Firebase's React Native build (which Metro
// resolves) but is absent from the web type surface, so we read it via a typed cast.
const getReactNativePersistence = (
	firebaseAuth as unknown as {
		getReactNativePersistence: (storage: unknown) => Persistence;
	}
).getReactNativePersistence;

interface FirebaseConfig {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
	/** Absent until Realtime Database is enabled; only presence and typing need it. */
	databaseURL?: string;
}

const firebaseConfig = Constants.expoConfig?.extra?.firebase as FirebaseConfig | undefined;

if (!firebaseConfig?.apiKey) {
	throw new Error(
		"Missing Firebase config. Copy .env.example to .env, fill in your Firebase values, and restart the Expo dev server.",
	);
}

/**
 * Always in the project's authorized-domain list, which is why email-link
 * `continueUrl`s are built from it rather than from a custom scheme.
 */
export const authDomain = firebaseConfig.authDomain;

// initializeApp is not idempotent; guard against Fast Refresh re-running this module.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// getAuth does NOT persist sessions on React Native — we must use initializeAuth
// with AsyncStorage-backed persistence. This is what makes sign-in a one-time event:
// the session survives app restarts and device reboots until an explicit sign-out.
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

export const db = initializeFirestore(app, {
	// WebChannel streaming silently hangs behind some corporate proxies and on the
	// Android emulator. Auto-detect falls back to long polling instead of dying.
	// If listeners still hang on a given network, escalate to experimentalForceLongPolling.
	experimentalAutoDetectLongPolling: true,
	// React Native has no IndexedDB, so persistentLocalCache is not an option here —
	// this is the ONLY cache the JS SDK can give us. Consequence: the cache is empty
	// on cold start and queued writes are lost if the process is killed. The MMKV
	// outbox in src/services/outbox is the durability layer that compensates.
	localCache: memoryLocalCache(),
});

/**
 * Presence and typing live in Realtime Database rather than Firestore because
 * Firestore has no onDisconnect primitive — a force-quit would otherwise leave a user
 * showing as "online" until a scheduled sweeper noticed, and on the free plan there is
 * no sweeper to run.
 *
 * Resolved lazily and cached. Realtime Database is not needed for sign-in, profiles or
 * messaging, so a project that has not enabled it yet still boots; only presence and
 * typing fail, and they fail with an actionable message instead of a null reference.
 */
let rtdbInstance: Database | null = null;

export const getRtdb = (): Database => {
	if (!firebaseConfig.databaseURL) {
		throw new Error(
			"Realtime Database is not configured. Enable it in the Firebase console and set FIREBASE_DATABASE_URL in .env, then restart the dev server. Presence and typing indicators need it; the rest of the app does not.",
		);
	}
	rtdbInstance ??= getDatabase(app);
	return rtdbInstance;
};

/** True when presence and typing can be used. */
export const isRealtimeDatabaseConfigured = (): boolean => Boolean(firebaseConfig.databaseURL);

// Deliberately absent:
//   getStorage  — Cloud Storage requires the Blaze plan on projects created after
//                 October 2024. Images go to Cloudinary; see src/services/media.
//   getFunctions — Cloud Functions require Blaze. Everything a callable would have
//                 done (conversation creation, message fanout) is a batched client
//                 write guarded by firestore.rules.

if (__DEV__ && process.env.EXPO_PUBLIC_USE_EMULATORS === "1") {
	// Android emulators reach the host machine through 10.0.2.2, not localhost.
	const host = process.env.EXPO_PUBLIC_EMULATOR_HOST ?? "localhost";

	connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
	connectFirestoreEmulator(db, host, 8080);
	if (isRealtimeDatabaseConfigured()) {
		connectDatabaseEmulator(getRtdb(), host, 9000);
	}
}

export default app;
