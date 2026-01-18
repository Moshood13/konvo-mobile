import React from "react";
import { Text, StyleSheet } from "react-native";

import { ColorConstants, FontsConstants } from "../../constants";
import { SimpleTextProps } from "../shared/props";

export const ButtonText: React.FC<SimpleTextProps> = ({ text, style }) => {
	return <Text style={[styles.buttonText, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
	buttonText: {
		color: ColorConstants.white,
		fontSize: 14,
		fontFamily: FontsConstants.brFirma.medium,
	},
});
