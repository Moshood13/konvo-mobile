import Constants from "expo-constants";
import * as Sentry from "@sentry/react-native";

let initialized = false;

/**
 * The navigation integration was previously constructed and handed to the
 * NavigationContainer, but `Sentry.init` was never called — so nothing was ever
 * reported. Initialising is a no-op when no DSN is configured, which keeps local
 * development free of a hard dependency on a Sentry project.
 */
export const initSentry = (
	navigationIntegration: ReturnType<typeof Sentry.reactNavigationIntegration>,
): void => {
	if (initialized) return;

	const dsn = Constants.expoConfig?.extra?.sentry?.dsn as string | undefined;
	if (!dsn) return;

	const appEnv = (Constants.expoConfig?.extra?.appEnv as string | undefined) ?? "development";

	Sentry.init({
		dsn,
		environment: appEnv,
		// Full traces in dev, a sample in production — chat apps are chatty and
		// tracing every navigation would blow through the quota in a day.
		tracesSampleRate: appEnv === "production" ? 0.2 : 1.0,
		// Firestore documents can contain message text. Never let it leave the device.
		sendDefaultPii: false,
		enableAutoSessionTracking: true,
		integrations: [navigationIntegration],
	});

	initialized = true;
};

/** Breadcrumb helper for listener attach/detach and send-pipeline transitions. */
export const trackBreadcrumb = (
	category: string,
	message: string,
	data?: Record<string, unknown>,
) => Sentry.addBreadcrumb({ category, message, data, level: "info" });
