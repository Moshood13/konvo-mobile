export const SpacingConstants = {
	loginTextTop: 100,
	loginTextLeft: 50,
	loginFormPaddingHorizontal: 32,
	loginFormContainerGap: 26,
	loginFormGap: 16,
	altContainerGap: 8,
	rememberMeContainerGap: 8,
	loginButtonBorderRadius: 24,
	socialAuthContainerGap: 16,
	socialAuthTextGap: 16,
	socialAuthTextLineWidth: 80,
};

/**
 * General-purpose scale. `SpacingConstants` above is a set of one-off login
 * measurements rather than a scale, and existing auth screens still read from it,
 * so this lives alongside it instead of replacing it. Prefer `Space` in new code.
 */
export const Space = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	xxl: 32,
} as const;

export const Radius = {
	sm: 8,
	md: 12,
	lg: 16,
	bubble: 18,
	pill: 999,
} as const;

export const ChatMetrics = {
	avatar: 48,
	avatarSm: 36,
	avatarLg: 96,
	bubbleMaxWidth: "78%",
	composerMinHeight: 44,
	composerMaxHeight: 120,
	listRowHeight: 72,
} as const;
