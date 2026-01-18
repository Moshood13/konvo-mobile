import { TextInput } from "react-native-paper";
import { IconContainer } from "../layouts/IconContainer";
import { FC } from "react";
import { IconInputProps } from "../shared/props";
import { MediumText } from "../text/MediumText";
import { PaperInput } from "./PaperInputs";

export const RightIconInput: FC<IconInputProps> = ({
	backgroundColor,
	onIconPress,
	disabled,
	text,
	icon,
    name,
    control,
    placeholder,
    keyboardType,
    isSecureEntry,
    ...props
}) => {
	const rightIcon = (
		<TextInput.Icon
			icon={() => (
				<IconContainer
					backgroundColor={backgroundColor}
					onIconPress={onIconPress}
					disabled={disabled}
				>
					{text && <MediumText text={text} />}
					{icon}
				</IconContainer>
			)}
		/>
	);
	return (
		<PaperInput
			name={name}
			control={control}
			placeholder={placeholder}
			keyboardType={keyboardType ?? "default"}
			rightView={rightIcon}
			isSecureEntry={isSecureEntry}
			{...props}
		/>
	);
};
