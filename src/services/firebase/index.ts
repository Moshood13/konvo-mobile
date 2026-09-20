// The single entry point to Firebase for the rest of the app. ESLint forbids
// importing from `firebase/*` anywhere outside this directory — see eslint.config.js.
export { auth, db, getRtdb, isRealtimeDatabaseConfigured } from "./config";
export * from "./types";
export * from "./paths";
export * from "./auth";
export * from "./users";
export * from "./contacts";
export { useAuthListener } from "./useAuthListener";
export { useProfileListener } from "./useProfileListener";
export { useGoogleSignIn } from "./useGoogleSignIn";
export { useEmailLinkHandler } from "./useEmailLinkHandler";
