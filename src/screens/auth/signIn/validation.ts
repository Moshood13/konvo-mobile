import * as yup from "yup";

export interface SignInFormValues {
	email: string;
}

export const emptySignInFormValue: SignInFormValues = {
	email: "",
};

// The explicit ObjectSchema<T> return type matters: without it yup infers the field
// as optional and the resolver no longer matches useForm's generic.
export const getSignInSchema = (): yup.ObjectSchema<SignInFormValues> => {
	return yup.object().shape({
		email: yup
			.string()
			.trim()
			.email("That email address doesn't look right")
			.required("Enter your email address"),
	});
};
