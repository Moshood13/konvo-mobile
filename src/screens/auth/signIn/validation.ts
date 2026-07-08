import * as yup from "yup";

export interface SignInAuthValues {
	email: string;
	password: string;
}
export const emptySignInFormValue: SignInAuthValues = {
	email: "",
	password: "",
};

export const getSignInSchema = (): yup.ObjectSchema<SignInAuthValues> => {
	return yup.object().shape({
		email: yup.string().email("Invalid email").required("Email is required"),
		password: yup.string().trim().required("Password is required"),
	});
};
