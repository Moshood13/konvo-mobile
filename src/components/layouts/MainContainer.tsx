import { FC, ReactNode } from "react";
import { StatusBar, StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { ColorConstants } from "../../constants/colors";
import { ColorTheme } from "../../constants";

interface MainContainerProps {
	children?: ReactNode;
	rootContainerStyle?: StyleProp<ViewStyle>;
}

export const MainContainer: FC<MainContainerProps> = ({ children, rootContainerStyle }) => {
	return (
		<>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={ColorTheme.mainContainer.backgroundColor}
			/>

			<View
				style={[
					styles.container,
					{ flex: 1},
					rootContainerStyle,
				]}
			>
				{children}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: ColorConstants.white,
	},
});
