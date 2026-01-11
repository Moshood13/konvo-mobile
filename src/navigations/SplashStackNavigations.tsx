import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppNavigator } from "./AppNavigator";
import { SplashScreen } from "../screens";

type SplashStackParamList = {
	SplashScreen: undefined;
	AppNavigatorStack: undefined;
};

export type SplashScreenNavigationProps = NativeStackScreenProps<
	SplashStackParamList,
	"SplashScreen"
>;
export type AppNavigatorStackNavigationProps = NativeStackScreenProps<
	SplashStackParamList,
	"AppNavigatorStack"
>;

const SplashStack = createNativeStackNavigator<SplashStackParamList>();

export const SplashStackNavigation = () => {
	return (
		<SplashStack.Navigator
			id={null}
			initialRouteName="AppNavigatorStack"
			screenOptions={{ headerShown: false }}
		>
			<SplashStack.Group>
				<SplashStack.Screen name="SplashScreen" component={SplashScreen} />
				<SplashStack.Screen
					name="AppNavigatorStack"
					component={AppNavigator}
					options={{ animation: "slide_from_right", gestureEnabled: false }}
				/>
			</SplashStack.Group>
		</SplashStack.Navigator>
	);
};
