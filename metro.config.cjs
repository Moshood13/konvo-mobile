const { getDefaultConfig } = require("@expo/metro-config");
const { withSentryConfig } = require("@sentry/react-native/metro");

const config = getDefaultConfig(__dirname);
const { transformer, resolver } = config;

config.transformer = {
	...transformer,
	babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
	...resolver,
	assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
	// "cjs" + disabling package exports avoids Firebase's
	// "Component auth has not been registered yet" error under Metro.
	sourceExts: [...resolver.sourceExts, "svg", "cjs"],
	unstable_enablePackageExports: false,
};

module.exports = withSentryConfig(config);
