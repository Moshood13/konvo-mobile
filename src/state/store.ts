import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistedSecured } from "./reducers/persistedSecuredReducer";
import { logout } from "./features/userIdentity/userIdentitySlice";
import profileReducer from "./features/profile/profileSlice";
import persistStore from "redux-persist/lib/persistStore";

const appReducer = combineReducers({
	persistedSecured: persistedSecured.reducer,
	// Deliberately NOT under persistedSecured: that subtree serialises into one
	// expo-secure-store key with a ~2 KB practical ceiling. Only identity belongs
	// there. The profile is re-fetched by its listener on every launch anyway.
	profile: profileReducer,
});

const rootReducer: typeof appReducer = (state, action) => {
	if (action.type === logout.type) {
		persistedSecured.clearItems();

		return appReducer(undefined, action);
	}

	return appReducer(state, action);
};

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REGISTER"],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
