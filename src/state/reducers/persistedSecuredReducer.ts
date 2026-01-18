import { combineReducers } from "@reduxjs/toolkit";
import { ReduxLocalState } from "../../types/state";
import userIdentitySlice from "../features/userIdentity/userIdentitySlice";
import { PersistConfig, PersistedState, persistReducer } from "redux-persist";
import { ReduxSecureStorage } from "../../storages";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";

const reducers = {
	userIdentity: userIdentitySlice,
};

type LocalState = PersistedState & ReduxLocalState<typeof reducers>;

const securePersistConfig: PersistConfig<LocalState> = {
	key: "secure",
	storage: ReduxSecureStorage,
	version: 1,
	stateReconciler: autoMergeLevel1,
};

export const persistedSecured = {
	clearItems: () => securePersistConfig.storage.removeItem("persist:secure"),
	reducer: persistReducer(securePersistConfig, combineReducers(reducers)),
};
