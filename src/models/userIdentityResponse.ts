import { UserToken } from "./userToken";

export interface UserIdentityResponse {
	id: string;
	email: string;
	userToken: UserToken;
}
