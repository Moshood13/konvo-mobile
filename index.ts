// Must be the very first import: uuid v12 reads crypto.getRandomValues() at module
// scope, and React Native has no such global until this polyfill installs it.
import "react-native-get-random-values";

import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
