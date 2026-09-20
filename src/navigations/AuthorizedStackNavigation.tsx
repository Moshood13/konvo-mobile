import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatListScreen } from "../screens";

export type AuthorizedStackParamList = {
	ChatListScreen: undefined;
};

export type ChatListScreenNavigationProps = NativeStackScreenProps<
	AuthorizedStackParamList,
	"ChatListScreen"
>;

const AuthorizedStack = createNativeStackNavigator<AuthorizedStackParamList>();

export const AuthorizedStackNavigation = () => {
	return (
		<AuthorizedStack.Navigator
			id={null}
			screenOptions={{ headerShown: false }}
			initialRouteName="ChatListScreen"
		>
			<AuthorizedStack.Screen name="ChatListScreen" component={ChatListScreen} />
		</AuthorizedStack.Navigator>
	);
};
