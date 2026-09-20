import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileSetupScreen } from "../screens";

/**
 * The third gate state: authenticated, but with no name, phone or photo yet.
 * Reached when `profileComplete` is false, and left automatically when it flips.
 */
export type OnboardingStackParamList = {
	ProfileSetupScreen: undefined;
};

export type ProfileSetupScreenNavigationProps = NativeStackScreenProps<
	OnboardingStackParamList,
	"ProfileSetupScreen"
>;

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingStackNavigation = () => {
	return (
		<OnboardingStack.Navigator
			id={null}
			screenOptions={{ headerShown: false }}
			initialRouteName="ProfileSetupScreen"
		>
			<OnboardingStack.Screen
				name="ProfileSetupScreen"
				component={ProfileSetupScreen}
				// gestureEnabled: false — there is nothing behind this screen to go back to,
				// and a swipe-back would strand the user on a blank stack.
				options={{ animation: "slide_from_right", gestureEnabled: false }}
			/>
		</OnboardingStack.Navigator>
	);
};
