import { ColorTheme, Space, Radius, ChatMetrics } from "../../src/constants";

describe("design tokens", () => {
	it("defaults body text to dark, not white", () => {
		// Regression guard. These components used to default to white because every
		// screen sat on the teal auth background; chat screens are light, so a white
		// default renders invisible text. Screens on a photo/teal background must opt
		// into `inverse` explicitly instead.
		expect(ColorTheme.text.primary).not.toBe(ColorTheme.text.inverse);
		expect(ColorTheme.text.primary).toBe("#000");
	});

	it("keeps the deprecated `white` key so existing call sites still compile", () => {
		expect(ColorTheme.text.white).toBe("#fff");
	});

	it("exposes a chat palette distinct from the incoming bubble", () => {
		expect(ColorTheme.chat.bubbleOut).not.toBe(ColorTheme.chat.bubbleIn);
		expect(ColorTheme.chat.tickRead).not.toBe(ColorTheme.chat.tickUnread);
	});

	it("exposes an ascending spacing scale", () => {
		const scale = [Space.xs, Space.sm, Space.md, Space.lg, Space.xl, Space.xxl];
		const ascending = [...scale].sort((a, b) => a - b);
		expect(scale).toEqual(ascending);
	});

	it("exposes chat metrics used by the list and composer", () => {
		expect(Radius.bubble).toBeGreaterThan(0);
		expect(ChatMetrics.composerMinHeight).toBeLessThan(ChatMetrics.composerMaxHeight);
	});
});
