import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { useMMKVBoolean } from "react-native-mmkv";

import { UnauthorizeStackNavigation } from "./UnauthorizedStackNavigation";
import { SharedPreferenceConstants } from "../constants";
import { useAppSelector } from "../hooks";
import { OnboardingScreen } from "../screens";
import { AuthorizedStackNavigation } from "./AuthorizedStackNavigation";
export type AppNavigatorParamList = {
	OnboardingScreen: undefined;
	AuthorizedStack: undefined;
	UnAuthorizedStack: undefined;
};

export type AuthorizedStackNavigationProps = NativeStackScreenProps<
	AppNavigatorParamList,
	"AuthorizedStack"
>;
export type UnAuthorizedStackNavigationProps = NativeStackScreenProps<
	AppNavigatorParamList,
	"UnAuthorizedStack"
>;

const AppNavigatorStack = createNativeStackNavigator<AppNavigatorParamList>();

export const AppNavigator = () => {
	const [hasSeenOnboardingScreen] = useMMKVBoolean(
		SharedPreferenceConstants.hasSeenOnboardingScreen,
	);

	console.log("hasSeenOnardingScreen", hasSeenOnboardingScreen);

	const { accessToken } = useAppSelector(
		(s) => s.persistedSecured.userIdentity.value.identity.userToken,
	);

	// if (!hasSeenOnboardingScreen) {
	// 	return (
	// 		<AppNavigatorStack.Navigator
	// 			id={null}
	// 			screenOptions={{ headerShown: false }}
	// 			initialRouteName="OnboardingScreen"
	// 		>
	// 			<AppNavigatorStack.Group>
	// 				<AppNavigatorStack.Screen
	// 					name="OnboardingScreen"
	// 					component={OnboardingScreen}
	// 					options={{ animation: "slide_from_right", gestureEnabled: false }}
	// 				/>
	// 				<AppNavigatorStack.Screen
	// 					name="UnAuthorizedStack"
	// 					component={UnauthorizeStackNavigation}
	// 					options={{ animation: "slide_from_right", gestureEnabled: false }}
	// 				/>
	// 			</AppNavigatorStack.Group>
	// 		</AppNavigatorStack.Navigator>
	// 	);
	// }

	if (!accessToken) {
		return (
			<AppNavigatorStack.Navigator
				id={null}
				screenOptions={{ headerShown: false }}
				initialRouteName="UnAuthorizedStack"
			>
				<AppNavigatorStack.Screen
					name="UnAuthorizedStack"
					component={UnauthorizeStackNavigation}
					options={{ animation: "slide_from_right", gestureEnabled: false }}
				/>
			</AppNavigatorStack.Navigator>
		);
	}

	return (
		<AppNavigatorStack.Navigator
			id={null}
			screenOptions={{ headerShown: false }}
			initialRouteName="UnAuthorizedStack"
		>
			<AppNavigatorStack.Screen
				name="AuthorizedStack"
				component={AuthorizedStackNavigation}
				options={{ animation: "slide_from_right", gestureEnabled: false }}
			/>
			<AppNavigatorStack.Screen
				name="UnAuthorizedStack"
				component={UnauthorizeStackNavigation}
				options={{ animation: "slide_from_right", gestureEnabled: false }}
			/>
		</AppNavigatorStack.Navigator>
	);
};
