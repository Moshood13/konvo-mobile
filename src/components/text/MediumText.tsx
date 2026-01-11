import React from "react";
import { Text, StyleSheet } from "react-native";

import { ColorTheme, FontsConstants } from "../../constants";
import { SimpleTextProps } from "../shared/props";

export const MediumText: React.FC<SimpleTextProps> = ({ text, style, numberOfLines }) => {
	return (
		<Text numberOfLines={numberOfLines} style={[styles.text, style]} ellipsizeMode="tail">
			{text}
		</Text>
	);
};

const styles = StyleSheet.create({
	text: {
		color: ColorTheme.text.white,
		fontSize: 14,
		fontFamily: FontsConstants.brFirma.medium,
	},
});
