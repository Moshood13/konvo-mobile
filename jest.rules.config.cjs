// Security-rule tests run against the emulator over the network, in plain Node —
// no React Native preset, no jsdom, no coverage. Driven by `yarn test:rules`,
// which wraps this in `firebase emulators:exec`.
module.exports = {
	testEnvironment: "node",
	testMatch: ["<rootDir>/__tests__/rules/**/*.(test|spec).[jt]s?(x)"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	transform: {
		"^.+\\.tsx?$": ["babel-jest", { presets: ["babel-preset-expo"] }],
	},
	// Emulator round trips are slower than a unit test; the default 5s flakes.
	testTimeout: 20000,
};
