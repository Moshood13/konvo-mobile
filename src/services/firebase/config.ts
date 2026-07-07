import Constants from "expo-constants";
import { getApps, initializeApp } from "firebase/app";
import { initializeAuth, Persistence } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
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
}

const firebaseConfig = Constants.expoConfig?.extra?.firebase as FirebaseConfig | undefined;

if (!firebaseConfig?.apiKey) {
	throw new Error(
		"Missing Firebase config. Copy .env.example to .env, fill in your Firebase values, and restart the Expo dev server.",
	);
}

// initializeApp is not idempotent; guard against Fast Refresh re-running this module.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// getAuth does NOT persist sessions on React Native — we must use initializeAuth
// with AsyncStorage-backed persistence so the user stays logged in across restarts.
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
