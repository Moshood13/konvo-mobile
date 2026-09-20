import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserDoc } from "../../../services/firebase/types";

/**
 * `idle`     — no signed-in user.
 * `loading`  — signed in, but the users/{uid} snapshot has not arrived yet. The
 *              navigator shows the splash rather than guessing which stack to render.
 * `missing`  — signed in and the snapshot arrived, but no profile document exists.
 *              A brand-new account, before onboarding writes one.
 * `ready`    — a profile document is loaded.
 * `error`    — the listener failed (offline on a cold start, or a rules change).
 */
export type ProfileStatus = "idle" | "loading" | "missing" | "ready" | "error";

/**
 * The live users/{uid} document, kept OUT of the persisted tree on purpose:
 * `persistedSecured` serialises into a single expo-secure-store key that warns above
 * 2 KB and can fail on Android Keystore. Firebase restores the session itself, and
 * useProfileListener refills this within a frame of the auth state resolving.
 */
interface ProfileState {
	status: ProfileStatus;
	profile: UserDoc | null;
	error: string | null;
}

const initialState: ProfileState = {
	status: "idle",
	profile: null,
	error: null,
};

const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		profileLoading(state) {
			state.status = "loading";
			state.error = null;
		},
		profileLoaded(state, action: PayloadAction<UserDoc | null>) {
			state.profile = action.payload;
			state.status = action.payload ? "ready" : "missing";
			state.error = null;
		},
		profileFailed(state, action: PayloadAction<string>) {
			state.status = "error";
			state.error = action.payload;
		},
		profileCleared() {
			return initialState;
		},
	},
});

export const { profileLoading, profileLoaded, profileFailed, profileCleared } =
	profileSlice.actions;

export default profileSlice.reducer;
