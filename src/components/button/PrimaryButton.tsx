import { FC } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { ButtonContainer } from "./ButtonContainer";
import { ButtonText } from "../text/ButtonText";

interface Props {
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
	disabled?: boolean;
	text: string;
	color?: StyleProp<TextStyle>;
	textStyle?: StyleProp<TextStyle>;
}
export const PrimaryButton: FC<Props> = ({
	onPress,
	style,
	disabled,
	text,
	textStyle,
}) => {

	return (
		<ButtonContainer onPress={onPress} disabled={disabled} style={style}>
			<ButtonText text={text} style={textStyle} />
		</ButtonContainer>
	);
};
