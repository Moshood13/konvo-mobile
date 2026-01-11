import { FC, ReactNode } from "react";
import { MainContainer } from "../../../components";
import { ImageBackground, StyleSheet, View } from "react-native";

interface Prop {
	children: ReactNode;
}
export const AuthScreenContainer: FC<Prop> = ({ children }) => {
	return (
		<MainContainer>
			<ImageBackground
				source={require("../../../assets/images/auth-image.jpg")}
				style={styles.imageContainer}
				resizeMode="cover"
			/>
			<View style={styles.overlay} />
			{children}
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		flex: 1,
		justifyContent: "center",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(43, 134, 140, 0.85)",
	},
});
