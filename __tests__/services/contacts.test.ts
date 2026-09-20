import { toE164 } from "../../src/services/firebase/contacts";

describe("toE164", () => {
	/**
	 * Every phone number in the system is stored in this one format, and contact
	 * discovery matches on a hash of it. Two spellings of the same number that
	 * normalise differently simply never find each other, silently — which is why
	 * the equivalence cases below matter more than the rejection cases.
	 */
	it("normalises the spellings people actually type to one value", () => {
		const expected = "+2348012345678";
		expect(toE164("+2348012345678")).toBe(expected);
		expect(toE164("+234 801 234 5678")).toBe(expected);
		expect(toE164("+234-801-234-5678")).toBe(expected);
		expect(toE164("  +234 (801) 234 5678  ")).toBe(expected);
	});

	it("applies a default country only when there is no leading +", () => {
		expect(toE164("08012345678", "NG")).toBe("+2348012345678");
		// An explicit country code always wins over the default.
		expect(toE164("+447700900123", "NG")).toBe("+447700900123");
	});

	it("returns null rather than guessing at a local number with no country", () => {
		// Guessing would let two users in different countries collide on one hash.
		expect(toE164("08012345678")).toBeNull();
	});

	it("rejects input that is not a phone number", () => {
		expect(toE164("")).toBeNull();
		expect(toE164("hello")).toBeNull();
		expect(toE164("12")).toBeNull();
	});

	it("handles other countries, since discovery is not Nigeria-only", () => {
		expect(toE164("+44 7911 123456")).toBe("+447911123456");
		expect(toE164("+1 415 555 2671")).toBe("+14155552671");
	});

	it("accepts well-formed numbers that libphonenumber does not consider allocated", () => {
		// +44 7700 900xxx is Ofcom's reserved range: isPossible() true, isValid() false.
		// It stands in here for any legitimately issued number whose range the bundled
		// metadata does not know about yet. Gating on isValid() would reject those and
		// block onboarding outright, and would also disagree with the form schema,
		// which validates on isPossiblePhoneNumber.
		expect(toE164("+44 7700 900123")).toBe("+447700900123");
	});
});
