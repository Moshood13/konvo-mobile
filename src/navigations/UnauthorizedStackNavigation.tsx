import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignInScreen, WelcomeScreen } from "../screens";

export type UnauthorizedStackParamList = {
	WelcomeScreen: undefined;
	SignInScreen: undefined;
};

export type WelcomeScreenNavigationProps = NativeStackScreenProps<
	UnauthorizedStackParamList,
	"WelcomeScreen"
>;

export type SignInScreenNavigationProps = NativeStackScreenProps<
	UnauthorizedStackParamList,
	"SignInScreen"
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
			{/* One screen for both routes in: Google, and an emailed sign-in link.
			    There are no passwords, so there is no separate sign-up flow — a first
			    sign-in creates the account and the gate routes it into onboarding. */}
			<UnauthorizedStack.Screen
				name="SignInScreen"
				component={SignInScreen}
				options={{ animation: "slide_from_right" }}
			/>
		</UnauthorizedStack.Navigator>
	);
};
