import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignInScreen, SignUpScreen, WelcomeScreen } from "../screens";

export type UnauthorizedStackParamList = {
	WelcomeScreen: undefined;
	SignInScreen: undefined;
	SignUpScreen: undefined;
};

export type WelcomeScreenNavigationProps = NativeStackScreenProps<
	UnauthorizedStackParamList,
	"WelcomeScreen"
>;

export type SignInScreenNavigationProps = NativeStackScreenProps<
	UnauthorizedStackParamList,
	"SignInScreen"
>;

export type SignUpScreenNavigationProps = NativeStackScreenProps<
	UnauthorizedStackParamList,
	"SignUpScreen"
>;

const UnauthorizedStack = createNativeStackNavigator<UnauthorizedStackParamList>();

export const UnauthorizeStackNavigation = () => {
	return (
		<UnauthorizedStack.Navigator
			id={null}
			screenOptions={{ headerShown: false }}
			initialRouteName="WelcomeScreen"
		>
			<UnauthorizedStack.Screen
				name="WelcomeScreen"
				component={WelcomeScreen}
				options={{ animation: "slide_from_right" }}
			/>
			<UnauthorizedStack.Screen
				name="SignInScreen"
				component={SignInScreen}
				options={{ animation: "slide_from_right" }}
			/>
			<UnauthorizedStack.Screen
				name="SignUpScreen"
				component={SignUpScreen}
				options={{ animation: "slide_from_right" }}
			/>
		</UnauthorizedStack.Navigator>
	);
};
