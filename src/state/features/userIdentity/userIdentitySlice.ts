import {
	emptyUserInfoResponse,
	UserIdentityResponse,
	UserInfoResponse,
	UserToken,
} from "../../../models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserIdentityState {
	value: {
		identity: UserIdentityResponse;
		info: UserInfoResponse;
	};
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
		tokenGenerationSuccess(state, action: PayloadAction<UserToken>) {
			const decodedToken = jwtDecode(action.payload.accessToken);
			state.value.identity = {
				id: decodedToken["sub"],
				email: decodedToken["email"],
				userToken: { ...action.payload },
			};
		},
		tokenGenerationFailed(state) {
			state.value = { ...initialState.value };
		},
		tokenRefreshSuccess(state, action: PayloadAction<UserToken>) {
			const decodedToken = jwtDecode(action.payload.accessToken);
			state.value.identity = {
				id: decodedToken["sub"],
				email: decodedToken["email"],
				userToken: { ...action.payload },
			};
		},
		tokenRefreshFailed(state) {
			state.value = { ...initialState.value };
		},
		logout(state) {
			state.value = { ...initialState.value };
		},
		setAccountUser: (state, action: PayloadAction<UserInfoResponse>) => {
			state.value.info = { ...action.payload };
		},
	},
});

export const {
	tokenGenerationSuccess,
	tokenGenerationFailed,
	tokenRefreshSuccess,
	tokenRefreshFailed,
	logout,
	setAccountUser,
} = userIdentitySlice.actions;

export default userIdentitySlice.reducer;
