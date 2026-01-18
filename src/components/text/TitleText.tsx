import React, { FC } from "react";
import { Text, StyleSheet } from "react-native";

import { ColorTheme, FontsConstants } from "../../constants";
import { SimpleTextProps } from "../shared/props";

export const TitleText: FC<SimpleTextProps> = ({ text, style }) => {
	return <Text style={[styles.title, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
	title: {
		fontFamily: FontsConstants.brFirma.semiBold,
		color: ColorTheme.text.white,
		fontSize: 24,
	},
});
