import * as yup from "yup";
import { isPossiblePhoneNumber } from "libphonenumber-js";

export interface ProfileSetupFormValues {
	displayName: string;
	phone: string;
}

export const emptyProfileSetupFormValue: ProfileSetupFormValues = {
	displayName: "",
	phone: "",
};

// The explicit ObjectSchema<T> return type matters: without it yup infers the fields
// as optional and the resolver no longer matches useForm's generic.
export const getProfileSetupSchema = (): yup.ObjectSchema<ProfileSetupFormValues> => {
	return yup.object().shape({
		displayName: yup
			.string()
			.trim()
			.min(1, "Enter your name")
			// 50 is not arbitrary — firestore.rules rejects anything longer, so a laxer
			// client limit would surface as an opaque "permission denied" on save.
			.max(50, "That name is too long (50 characters max)")
			.required("Enter your name"),
		phone: yup
			.string()
			.trim()
			.required("Enter your phone number")
			.test(
				"possible-phone",
				"Include your country code, e.g. +234 801 234 5678",
				(value) => !!value && isPossiblePhoneNumber(value),
			),
	});
};
