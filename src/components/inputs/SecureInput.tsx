import { Ionicons } from "@expo/vector-icons";
import { FC, useMemo } from "react";
import { useBoolean } from "usehooks-ts";

import { RightIconInput } from "./RightIconInput";
import { IconInputProps } from "../shared/props";

export const SecureInput: FC<IconInputProps> = ({
	placeholder,
	name,
	control,
	label,
	iconColor,
	...props
}) => {
	const { value: isPasswordVisible, toggle: togglePasswordVisibility } = useBoolean(false);

	const renderRightIcon = useMemo(
		() => (
			<Ionicons
				name={isPasswordVisible ? "eye-off" : "eye"}
				size={16}
				color={iconColor ?? "ColorConstants.cyan900"}
			/>
		),
		[isPasswordVisible],
	);

	return (
		<RightIconInput
			key={name}
			name={name}
			control={control}
			placeholder={placeholder}
			isSecureEntry={!isPasswordVisible}
			icon={renderRightIcon}
			onIconPress={togglePasswordVisibility}
			label={label}
			{...props}
		/>
	);
};
