import { FC, ReactNode } from "react";
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from "react-native";

// import { ColorTheme } from "../../constants";

interface Props {
	onPress: () => void;
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
	disabled?: boolean;
}

export const ButtonContainer: FC<Props> = ({ onPress, children, style, disabled }) => {
	return (
		<TouchableOpacity
			accessibilityRole="button"
			style={[styles.buttonContainer, style, { opacity: disabled ? 0.5 : 1 }]}
			onPress={onPress}
			disabled={disabled}
		>
			{children}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		paddingHorizontal: 40,
		paddingVertical: 18,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 10,
	},
});
