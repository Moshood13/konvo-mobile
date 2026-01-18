import { Controller } from "react-hook-form";
import { View, StyleSheet, Animated, Keyboard } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { InputProps } from "../shared/props";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ColorConstants, ColorTheme } from "../../constants";

export const PaperInput: FC<InputProps> = ({
	name,
	control,
	label,
	placeholder,
	keyboardType,
	isSecureEntry,
	autoCapitalize = "none",
	disabled,
	rightView,
	error,
	onFocus,
	onBlur,
	normalPlaceholderTextColor,
	focusPlaceholderTextColor,
	focusBorderColor,
	normalBorderColor,
	labelBackgroundColor,
	textColor,
	labelTextColor,
}) => {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = useCallback(() => {
		setIsFocused(true);
		onFocus?.();
	}, [onFocus]);

	const handleBlur = useCallback(
		(controllerOnBlur) => {
			setIsFocused(false);
			controllerOnBlur?.();
			onBlur?.();
		},
		[onBlur],
	);

	const getBorderColor = useMemo(() => {
		if (error) {
			return "red";
		}
		return isFocused
			? (focusBorderColor ?? ColorTheme.inputField.focusBorderColor)
			: (normalBorderColor ?? ColorTheme.inputField.normalBorderColor);
	}, [isFocused, error, focusBorderColor, normalBorderColor]);

	useEffect(() => {
		const hideSub = Keyboard.addListener("keyboardDidHide", () => {
			setIsFocused(false);
			onBlur?.();
		});

		return () => {
			hideSub.remove();
		};
	}, [onBlur]);

	return (
		<Controller
			control={control}
			name={name}
			render={({
				field: { onChange: controllerOnChange, onBlur: controllerOnBlur, value: controllerValue },
			}) => {
				const labelTranslateY = useMemo(() => new Animated.Value(controllerValue ? 0 : 20), []);

				Animated.timing(labelTranslateY, {
					toValue: isFocused || controllerValue ? 0 : 20,
					duration: 150,
					useNativeDriver: true,
				}).start();

				return (
					<View>
						<View style={[styles.inputWrapper, { borderColor: getBorderColor }]}>
							{/* Manual floating label */}
							{(isFocused || controllerValue) && (
								<Animated.Text
									style={[
										styles.floatingLabel,
										{
											transform: [{ translateY: labelTranslateY }],
											backgroundColor: labelBackgroundColor,
											color: labelTextColor,
										},
									]}
								>
									{label}
								</Animated.Text>
							)}
							<TextInput
								mode="outlined"
								onFocus={handleFocus}
								placeholder={isFocused ? "" : placeholder}
								value={controllerValue}
								onChangeText={controllerOnChange}
								onBlur={() => handleBlur(controllerOnBlur)}
								keyboardType={keyboardType}
								textColor={textColor ?? ColorConstants.black900}
								secureTextEntry={isSecureEntry}
								autoCapitalize={autoCapitalize}
								disabled={disabled}
								error={error}
								right={rightView}
								style={styles.inputContainer}
								outlineStyle={[
									styles.outline,
									{
										backgroundColor: "transparent",
										borderWidth: 0,
									},
								]}
								theme={{
									colors: {
										onSurfaceVariant: normalPlaceholderTextColor,
										primary: focusPlaceholderTextColor,
										background: "transparent",
									},
								}}
								contentStyle={{
									backgroundColor: "transparent",
								}}
							/>
						</View>

						{error && (
							<HelperText type="error" visible>
								{error}
							</HelperText>
						)}
					</View>
				);
			}}
		/>
	);
};

const styles = StyleSheet.create({
	inputContainer: {
		backgroundColor: "#fff",
		color: ColorTheme.inputField.inputTextColor,
	},
	outline: {},
	inputWrapper: {
		position: "relative",
		borderWidth: 1,
		borderRadius: 32,
		backgroundColor: "transparent",
	},
	floatingLabel: {
		position: "absolute",
		left: 24,
		top: -10,
		fontSize: 12,
		backgroundColor: "transparent", // ensures no white background
		paddingHorizontal: 8,
	},
});
