import { FC, ReactNode } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

// import { ColorTheme, SpacingConstants } from "../../constants";

interface Props {
	children: ReactNode;
	backgroundColor?: string;
	style?: StyleProp<ViewStyle>;
	onIconPress?: () => void;
	disabled?: boolean;
}

export const IconContainer: FC<Props> = ({
	children,
	backgroundColor,
	style,
	onIconPress,
	disabled,
}) => {
	return (
		<TouchableOpacity
			style={[styles.container, backgroundColor && { backgroundColor }, style]}
			onPress={onIconPress}
			disabled={disabled}
		>
			{children}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		// opacity: 0.5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		// backgroundColor: ColorTheme.inputField.iconBackground.mainColor,
		padding: 4,
		// borderRadius: SpacingConstants.inputIconContainerRadius,
		// width: SpacingConstants.inputIconContainerSize,
		// height: SpacingConstants.inputIconContainerSize,
	},
});
