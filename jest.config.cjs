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
	// A ratchet, not a target: set just under what the suite currently achieves, so
	// adding untested code fails the build instead of quietly diluting the number.
	// Raise these each time a phase lands its tests. Never lower them to make a red
	// build pass — that is how the previous 80% ended up meaningless (it never ran,
	// because `yarn test` was a stub that echoed and exited 0).
	//
	// Much of the remaining uncovered code is Firebase listeners and screens, which
	// are covered by the emulator rules suite and by manual device testing rather
	// than by unit tests.
	coverageThreshold: {
		global: {
			branches: 6,
			functions: 15,
			lines: 17,
			statements: 17,
		},
	},
	moduleNameMapper: {
		"\\.svg$": "<rootDir>/jest/__mocks__/svgMock.js",
	},
};
