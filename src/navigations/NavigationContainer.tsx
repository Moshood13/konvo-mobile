import { NavigationContainer as Container } from "@react-navigation/native";
import { Integration } from "@sentry/core";
import { FC, useRef } from "react";
import { View } from "react-native";

interface Props {
	reactNavigationIntegration: Integration & {
		/**
		 * Pass the ref to the navigation container to register it to the instrumentation
		 * @param navigationContainerRef Ref to a `NavigationContainer`
		 */
		registerNavigationContainer: (navigationContainerRef: unknown) => void;
	};
}

export const NavigationContainer: FC<Props> = ({ reactNavigationIntegration }) => {
	const navigation = useRef(null);

	return (
		<Container
			ref={navigation}
			onReady={() => {
				reactNavigationIntegration.registerNavigationContainer(navigation);
			}}
		>
			<View />
		</Container>
	);
};
