import { GenderType } from "../../enum/genderType";
import { ItemWithId } from "../../itemInterfaces";

export interface UserInfoResponse extends ItemWithId {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	dateOfBirth: string;
	gender: GenderType;
	referralCode: string;
}

export const emptyUserInfoResponse: UserInfoResponse = {
	id: "",
	email: "",
	firstName: "",
	lastName: "",
	phoneNumber: "",
	dateOfBirth: null,
	gender: undefined,
	referralCode: "",
};
