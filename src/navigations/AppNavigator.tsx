import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";

import { UnauthorizeStackNavigation } from "./UnauthorizedStackNavigation";
import { OnboardingStackNavigation } from "./OnboardingStackNavigation";
import { AuthorizedStackNavigation } from "./AuthorizedStackNavigation";
import { useProfileGate } from "../hooks";
import { SplashScreen } from "../screens";

export type AppNavigatorParamList = {
	LoadingScreen: undefined;
	UnAuthorizedStack: undefined;
	OnboardingStack: undefined;
	AuthorizedStack: undefined;
};

export type AuthorizedStackNavigationProps = NativeStackScreenProps<
	AppNavigatorParamList,
	"AuthorizedStack"
>;
export type UnAuthorizedStackNavigationProps = NativeStackScreenProps<
	AppNavigatorParamList,
	"UnAuthorizedStack"
>;
export type OnboardingStackNavigationProps = NativeStackScreenProps<
	AppNavigatorParamList,
	"OnboardingStack"
>;

const AppNavigatorStack = createNativeStackNavigator<AppNavigatorParamList>();

const screenOptions = { headerShown: false, gestureEnabled: false } as const;

/**
 * The single place that decides which stack is mounted.
 *
 * Exactly one stack is registered at a time, deliberately. Registering several and
 * relying on `initialRouteName` was the previous arrangement and it worked only by
 * accident — the first registered screen won regardless of the stated initial route.
 * Mounting one stack means the swap is driven purely by state, so signing in, or
 * finishing onboarding, moves the user with no imperative navigation anywhere.
 */
export const AppNavigator = () => {
	const gate = useProfileGate();

	if (gate === "loading") {
		return (
			<AppNavigatorStack.Navigator id={null} screenOptions={screenOptions}>
				<AppNavigatorStack.Screen name="LoadingScreen" component={SplashScreen} />
			</AppNavigatorStack.Navigator>
		);
	}

	if (gate === "unauthenticated") {
		return (
			<AppNavigatorStack.Navigator id={null} screenOptions={screenOptions}>
				<AppNavigatorStack.Screen name="UnAuthorizedStack" component={UnauthorizeStackNavigation} />
			</AppNavigatorStack.Navigator>
		);
	}

	if (gate === "onboarding") {
		return (
			<AppNavigatorStack.Navigator id={null} screenOptions={screenOptions}>
				<AppNavigatorStack.Screen name="OnboardingStack" component={OnboardingStackNavigation} />
			</AppNavigatorStack.Navigator>
		);
	}

	return (
		<AppNavigatorStack.Navigator id={null} screenOptions={screenOptions}>
			<AppNavigatorStack.Screen name="AuthorizedStack" component={AuthorizedStackNavigation} />
		</AppNavigatorStack.Navigator>
	);
};
