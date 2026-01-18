import * as yup from "yup";

export interface SignInAuthValues {
	signInEmail: string;
	signInPassword: string;
}
export const emptySignInFormValue: SignInAuthValues = {
	signInEmail: "",
	signInPassword: "",
};

export const getSignInSchema = (): yup.ObjectSchema<SignInAuthValues> => {
	return yup.object().shape({
		signInEmail: yup.string().email("Invalid email").required("Email is required"),
		signInPassword: yup.string().trim().required("Password is required"),
	});
};
