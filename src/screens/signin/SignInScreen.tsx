import {Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { MainContainer } from "../../components";
import Svg, { Path } from "react-native-svg";

export const SignInScreen = () => {
	return (
		<MainContainer>
			<View style={styles.wrapper}>
				<View style={styles.content}>
					<Text style={styles.title}>Login</Text>

					<TouchableOpacity style={styles.registerBtn}>
						<Text style={styles.registerText}>Register</Text>
					</TouchableOpacity>

					<Text style={styles.subtitle}>Enter your{"\n"}mobile phone</Text>
				</View>

				{/* Curved bottom */}
				<Svg width="100%" height={120} viewBox="0 0 1440 320" style={styles.svg}>
					<Path
						fill="#0EA5E9"
						d="M0,160L80,176C160,192,320,224,480,224C640,224,800,192,960,170.7C1120,149,1280,139,1360,133.3L1440,128L1440,0L0,0Z"
					/>
				</Svg>
			</View>
		</MainContainer>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: "#0EA5E9",
		paddingTop: 60,
	},

	content: {
		paddingHorizontal: 24,
		paddingBottom: 40,
	},

	title: {
		color: "#fff",
		fontSize: 28,
		fontWeight: "700",
	},

	subtitle: {
		marginTop: 20,
		color: "#fff",
		fontSize: 22,
		fontWeight: "600",
		lineHeight: 30,
	},

	registerBtn: {
		position: "absolute",
		right: 24,
		top: 60,
		backgroundColor: "#E6F6FF",
		paddingHorizontal: 18,
		paddingVertical: 8,
		borderRadius: 20,
	},

	registerText: {
		color: "#0EA5E9",
		fontWeight: "600",
	},

	svg: {
		position: "absolute",
		bottom: -1,
	},
});
