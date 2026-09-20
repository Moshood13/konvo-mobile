import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { RegularText, TitleText } from "../../src/components";
import { ColorTheme } from "../../src/constants";

const flattenColor = (style: unknown): string | undefined =>
	(StyleSheet.flatten(style as never) as { color?: string } | undefined)?.color;

describe("text components", () => {
	it("renders its text", () => {
		render(<TitleText text="Konvo" />);
		expect(screen.getByText("Konvo")).toBeTruthy();
	});

	it("uses the dark default so it stays readable on light chat screens", () => {
		render(<RegularText text="Hello" />);
		expect(flattenColor(screen.getByText("Hello").props.style)).toBe(ColorTheme.text.primary);
	});

	it("lets a screen override to inverse for photo and teal backgrounds", () => {
		render(<RegularText text="Hello" style={{ color: ColorTheme.text.inverse }} />);
		expect(flattenColor(screen.getByText("Hello").props.style)).toBe(ColorTheme.text.inverse);
	});
});
