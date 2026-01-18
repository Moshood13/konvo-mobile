import { FC } from "react";
import { Text, StyleSheet } from "react-native";

import { ColorTheme, FontsConstants } from "../../constants";
import { SimpleTextProps } from "../shared/props";

export const BoldText: FC<SimpleTextProps> = ({ text, style, numberOfLines }) => {
	return (
		<Text style={[styles.text, style]} ellipsizeMode="tail" numberOfLines={numberOfLines}>
			{text}
		</Text>
	);
};

const styles = StyleSheet.create({
	text: {
		color: ColorTheme.text.white,
		fontSize: 16,
		fontFamily: FontsConstants.brFirma.bold,
	},
});
