import { FC } from "react";
import { ActivityIndicator, StyleProp, TextStyle, ViewStyle } from "react-native";

import { ButtonContainer } from "./ButtonContainer";
import { ButtonText } from "../text/ButtonText";
import { ColorConstants } from "../../constants";

interface Props {
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
	disabled?: boolean;
	loading?: boolean;
	text: string;
	textStyle?: StyleProp<TextStyle>;
}
export const PrimaryButton: FC<Props> = ({
	onPress,
	style,
	disabled,
	loading,
	text,
	textStyle,
}) => {
	return (
		<ButtonContainer onPress={onPress} disabled={disabled || loading} style={style}>
			{loading ? (
				<ActivityIndicator color={ColorConstants.white} />
			) : (
				<ButtonText text={text} style={textStyle} />
			)}
		</ButtonContainer>
	);
};
