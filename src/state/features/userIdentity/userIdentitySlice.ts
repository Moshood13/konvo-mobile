import { emptyUserInfoResponse, UserIdentityResponse, UserInfoResponse } from "../../../models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserIdentityState {
	value: {
		identity: UserIdentityResponse;
		info: UserInfoResponse;
	};
}

/** Session payload derived from a signed-in Firebase user. */
export interface FirebaseAuthPayload {
	uid: string;
	email: string;
	idToken: string;
	refreshToken: string;
}

export const initialState: UserIdentityState = {
	value: {
		identity: {
			id: "",
			email: "",
			userToken: { accessToken: "", refreshToken: "" },
		},
		info: { ...emptyUserInfoResponse },
	},
};

const userIdentitySlice = createSlice({
	name: "user-identity",
	initialState,
	reducers: {
		authSuccess(state, action: PayloadAction<FirebaseAuthPayload>) {
			const { uid, email, idToken, refreshToken } = action.payload;
			state.value.identity = {
				id: uid,
				email,
				userToken: { accessToken: idToken, refreshToken },
			};
		},
		logout(state) {
			state.value = { ...initialState.value };
		},
		setAccountUser: (state, action: PayloadAction<UserInfoResponse>) => {
			state.value.info = { ...action.payload };
		},
	},
});

export const { authSuccess, logout, setAccountUser } = userIdentitySlice.actions;

export default userIdentitySlice.reducer;
