import React, { FC } from "react";
import { Text, StyleSheet } from "react-native";

import { ColorTheme, FontsConstants } from "../../constants";
import { isValueNullOrUndefined } from "../../helpers/helper";
import { TextProps } from "../shared/props";

export const RegularText: FC<TextProps> = ({ text, style, numberOfLines }) => {
	return (
		<Text
			numberOfLines={isValueNullOrUndefined(numberOfLines) ? undefined : numberOfLines}
			style={[styles.text, style]}
			ellipsizeMode="tail"
		>
			{text}
		</Text>
	);
};

const styles = StyleSheet.create({
	text: {
		color: ColorTheme.text.white,
		fontSize: 12,
		fontFamily: FontsConstants.brFirma.regular,
	},
});
