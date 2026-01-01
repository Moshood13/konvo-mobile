// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from "@expo/metro-config";
import { withSentryConfig } from "@sentry/react-native/metro";

// const {
// 	wrapWithReanimatedMetroConfig,
// } = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);
const { transformer, resolver } = config;

const newTransformer = {
	...transformer,
	babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

const newResolver = {
	...resolver,
	assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
	sourceExts: [...resolver.sourceExts, "svg"],
};

const newConfig = {
	...config,
	transformer: newTransformer,
	resolver: newResolver,
};

// module.exports = wrapWithReanimatedMetroConfig(withSentryConfig(newConfig));
module.exports = withSentryConfig(newConfig);
