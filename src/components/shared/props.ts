import { StyleProp, TextStyle } from "react-native";

export interface SimpleTextProps {
	style?: StyleProp<TextStyle>;
	text: string;
	numberOfLines?: number;
}

export interface TextProps {
	text: string;
	style: StyleProp<TextStyle>;
	numberOfLines?: number;
}
