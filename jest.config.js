module.exports = {
	preset: "jest-expo",
	transformIgnorePatterns: [
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@shopify/react-native-skia|redux-persist|zeego)",
	],
	setupFiles: ["<rootDir>/jest/setup.ts", "@shopify/react-native-skia/jestSetup.js"],
	setupFilesAfterEnv: ["<rootDir>/jest/setupAfterEnv.ts"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	testEnvironment: "node",
	testMatch: ["<rootDir>/__tests__/**/*.(test|spec).[jt]s?(x)"],
	collectCoverage: true,
	collectCoverageFrom: [
		"<rootDir>/src/**/*.{ts,tsx}",
		"!<rootDir>/src/(assets|constants|models|polyfills|types|storages|state)/**/*.{ts,tsx}",
		"!<rootDir>/src/**/index.ts",
		"!<rootDir>/src/services/ioc/**/*.{ts,tsx}",
		"!<rootDir>/__tests__/**/*.{ts,tsx}",
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	moduleNameMapper: {
		"\\.svg$": "<rootDir>/jest/__mocks__/svgMock.js",
	},
};
