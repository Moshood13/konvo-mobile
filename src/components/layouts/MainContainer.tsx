import { FC, ReactNode } from "react";
import {
	StatusBar,
	StyleSheet,
	View,
	Platform,
    StyleProp,
    ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ColorConstants } from "../../constants/colors";
import { ColorTheme } from "../../constants";

interface MainContainerProps {
	children?: ReactNode;
	rootContainerStyle?: StyleProp<ViewStyle>;
}

export const MainContainer: FC<MainContainerProps> = ({
	children,
	rootContainerStyle,
}) => {
    const insets = useSafeAreaInsets()
	return (
		<>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={ColorTheme.mainContainer.backgroundColor}
			/>

			<View style={[styles.container, { flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }, rootContainerStyle]}>
				{children}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: ColorConstants.white
	},
});
