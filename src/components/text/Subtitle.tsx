import React, { FC } from "react";
import { Text, StyleSheet } from "react-native";

import { ColorTheme, FontsConstants } from "../../constants";
import { SimpleTextProps } from "../shared/props";

export const Subtitle: FC<SimpleTextProps> = ({ text, style }) => {
	return (
		<Text style={[styles.subtitle, style]} testID="subtitle-text">
			{text}
		</Text>
	);
};

const styles = StyleSheet.create({
	subtitle: {
		color: ColorTheme.text.white,
		fontSize: 14,
		fontFamily: FontsConstants.brFirma.regular,
		lineHeight: 22,
	},
});
