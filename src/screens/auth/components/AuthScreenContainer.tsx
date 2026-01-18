import { FC, ReactNode } from "react";
import { MainContainer } from "../../../components";
import { ImageBackground, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface Prop {
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
	authBackgroundImage?: ImageSourcePropType,
	overlayStyle?: StyleProp<ViewStyle>;
}
export const AuthScreenContainer: FC<Prop> = ({ children, style, authBackgroundImage, overlayStyle }) => {
	return (
		<MainContainer rootContainerStyle={style}>
			<ImageBackground source={authBackgroundImage} style={styles.imageContainer} resizeMode="cover">
				<View style={[styles.overlay, overlayStyle]} />
				<View style={[{flex: 1}, style]}>{children}</View>
			</ImageBackground>
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		flex: 1,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(43, 134, 140, 0.85)",
	},
});
