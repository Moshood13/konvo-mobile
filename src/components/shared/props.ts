import { ReactNode } from "react";
import { KeyboardTypeOptions, StyleProp, TextStyle } from "react-native";

export interface SimpleTextProps {
	style?: StyleProp<TextStyle>;
	text: string;
	numberOfLines?: number;
}

export interface TextProps {
	text: string;
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
}

export interface InputProps {
	name: string;
	control: any;
	error?: any;
	label: string;
	placeholder?: string;
	keyboardType?: KeyboardTypeOptions;
	isSecureEntry?: boolean;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	disabled?: boolean;
	rightView?: ReactNode;
	onFocus?: () => void;
	onBlur?: () => void;
	normalPlaceholderTextColor?: string;
	focusPlaceholderTextColor?: string;
	focusBorderColor?: string;
	normalBorderColor?: string;
	labelBackgroundColor?: string;
	labelTextColor?: string;
	textColor?: string;
}

export interface IconInputProps extends InputProps {
	text?: string;
	icon?: ReactNode;
	backgroundColor?: string;
	isIconToggled?: boolean;
	onIconPress?: () => void;
	iconColor?: string;
}
