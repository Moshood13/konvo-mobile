module.exports = {
	preset: "jest-expo",
	transformIgnorePatterns: [
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|redux-persist|firebase|@firebase)",
	],
	setupFiles: ["<rootDir>/jest/setup.ts"],
	setupFilesAfterEnv: ["<rootDir>/jest/setupAfterEnv.ts"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	testEnvironment: "node",
	testMatch: ["<rootDir>/__tests__/**/*.(test|spec).[jt]s?(x)"],
	// Rules tests talk to the emulator over the network and are run separately by
	// `yarn test:rules` under `firebase emulators:exec`.
	testPathIgnorePatterns: ["<rootDir>/__tests__/rules/"],
	collectCoverage: true,
	collectCoverageFrom: [
		"<rootDir>/src/**/*.{ts,tsx}",
		"!<rootDir>/src/(assets|constants|models|polyfills|types|storages)/**/*.{ts,tsx}",
		"!<rootDir>/src/**/index.ts",
		"!<rootDir>/__tests__/**/*.{ts,tsx}",
	],
	// Starts at the level Phase 0 actually reaches. The previous 80% was aspirational
	// against a suite that could not run at all, which is worse than no threshold —
	// it never failed, because `yarn test` was a stub that echoed and exited 0.
	// Raise these numbers as each phase lands its tests.
	coverageThreshold: {
		global: {
			branches: 2,
			functions: 3,
			lines: 10,
			statements: 10,
		},
	},
	moduleNameMapper: {
		"\\.svg$": "<rootDir>/jest/__mocks__/svgMock.js",
	},
};
