import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/home/HomeScreen";

export type AuthorizedStackParamList = {
	HomeScreen: undefined;
};

export type HomeScreenNavigationProps = NativeStackScreenProps<
	AuthorizedStackParamList,
	"HomeScreen"
>;

const AuthorizedStack = createNativeStackNavigator<AuthorizedStackParamList>();

export const AuthorizedStackNavigation = () => {
	return (
		<AuthorizedStack.Navigator
			id={null}
			screenOptions={{ headerShown: false }}
			initialRouteName="HomeScreen"
		>
			<AuthorizedStack.Screen name="HomeScreen" component={HomeScreen} />
		</AuthorizedStack.Navigator>
	);
};
