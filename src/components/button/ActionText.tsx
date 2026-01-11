import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, FC, ReactNode } from "react";
import {
	View,
	TouchableOpacity,
	GestureResponderEvent,
	StyleSheet,
	TextStyle,
	StyleProp,
} from "react-native";
import { ButtonText } from "../text/ButtonText";

interface Props {
	text: string;
	style?: StyleProp<TextStyle>;
	// eslint-disable-next-line no-unused-vars
	onPress: (event: GestureResponderEvent) => void;
	iconName?: ComponentProps<typeof Ionicons>["name"];
	iconColor?: string;
	icon?: ReactNode;
}

export const ActionText: FC<Props> = ({ onPress, text, style, icon }) => {
	return (
		<TouchableOpacity onPress={onPress} accessibilityRole="button">
			<View style={styles.container}>
				<ButtonText text={text} style={style} />
				{icon && icon}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});
