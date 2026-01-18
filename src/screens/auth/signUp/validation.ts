import * as yup from "yup";

export interface SignUpAuthValues {
	username: string;
	email: string;
	password: string;
}
export const emptySignUpFormValue: SignUpAuthValues = {
	username: "",
	email: "",
	password: "",
};

export const getSignUpSchema = (): yup.ObjectSchema<SignUpAuthValues> => {
	return yup.object().shape({
		username: yup.string().trim().required("Username is required"),
		email: yup.string().email("Invalid email").required("Email is required"),
		password: yup.string().trim().required("Password is required"),
	});
};
