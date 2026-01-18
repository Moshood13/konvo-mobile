import * as SecureStore from "expo-secure-store";
import { Storage } from "redux-persist";

const defaultReplacer = (key, replaceCharacter) => {
	return key.replace(/[^a-z0-9.\-_]/gi, replaceCharacter);
};

export const ReduxSecureStorage: Storage = {
	setItem: (key, value) => {
		return SecureStore.setItemAsync(defaultReplacer(key, "_"), value);
	},
	getItem: (key) => {
		return SecureStore.getItemAsync(defaultReplacer(key, "_"));
	},
	removeItem: (key) => {
		return SecureStore.deleteItemAsync(defaultReplacer(key, "_"));
	},
};
