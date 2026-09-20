// uuid v12 reads crypto.getRandomValues() at module scope; Node's test environment
// needs the same polyfill the app installs in index.ts.
import "react-native-get-random-values";

// include this line for mocking react-native-gesture-handler
import "react-native-gesture-handler/jestSetup";

// include this section and the NativeAnimatedHelper section for mocking react-native-reanimated
jest.mock("react-native-reanimated", () => {
	const Reanimated = require("react-native-reanimated/mock");

	// The mock for `call` immediately calls the callback which is incorrect
	// So we override it with a no-op
	Reanimated.default.call = () => {};

	return Reanimated;
});

// The old `react-native/Libraries/Animated/NativeAnimatedHelper` mock is gone:
// RN 0.79 moved that module to src/private/animated, and jest-expo's preset now
// silences the useNativeDriver warning on its own.

jest.mock("@sentry/react-native", () => ({
	addBreadcrumb: jest.fn(),
	captureException: jest.fn(),
	init: jest.fn(),
	setUser: jest.fn(),
	wrap: (component: unknown) => component,
	reactNavigationIntegration: jest.fn(() => ({ registerNavigationContainer: jest.fn() })),
}));

// src/services/firebase/config.ts throws at import time without these, and unit
// tests should never reach a real Firebase project.
jest.mock("expo-constants", () => ({
	__esModule: true,
	default: {
		expoConfig: {
			extra: {
				appEnv: "test",
				functionsRegion: "europe-west1",
				eas: { projectId: "test-project" },
				firebase: {
					apiKey: "test-api-key",
					authDomain: "test.firebaseapp.com",
					projectId: "test-project",
					storageBucket: "test.appspot.com",
					messagingSenderId: "0",
					appId: "1:0:web:0",
					databaseURL: "https://test-default-rtdb.firebaseio.com",
				},
				google: {},
				sentry: {},
			},
		},
	},
}));

// MMKV is a Nitro native module with no JS fallback; back it with a plain Map so
// the outbox and cache layers are testable off-device.
jest.mock("react-native-mmkv", () => {
	class MMKV {
		private store = new Map<string, string | number | boolean>();
		getString = (k: string) => this.store.get(k) as string | undefined;
		set = (k: string, v: string | number | boolean) => void this.store.set(k, v);
		delete = (k: string) => void this.store.delete(k);
		getAllKeys = () => Array.from(this.store.keys());
		clearAll = () => this.store.clear();
		contains = (k: string) => this.store.has(k);
	}
	return { MMKV };
});
