import { getSignInSchema } from "../../src/screens/auth/signIn/validation";
import { getProfileSetupSchema } from "../../src/screens/onboarding/validation";

const check = async (schema: { validate: (v: unknown) => Promise<unknown> }, value: unknown) => {
	try {
		await schema.validate(value);
		return null;
	} catch (e) {
		return (e as { message: string }).message;
	}
};

describe("sign-in validation", () => {
	const schema = getSignInSchema();

	it("accepts a normal address", async () => {
		expect(await check(schema, { email: "moshood@example.com" })).toBeNull();
	});

	it("rejects an empty or malformed address", async () => {
		expect(await check(schema, { email: "" })).toBeTruthy();
		expect(await check(schema, { email: "not-an-email" })).toBeTruthy();
	});

	it("tolerates surrounding whitespace, which phone keyboards add freely", async () => {
		expect(await check(schema, { email: "  moshood@example.com  " })).toBeNull();
	});
});

describe("profile setup validation", () => {
	const schema = getProfileSetupSchema();
	const valid = { displayName: "Moshood", phone: "+2348012345678" };

	it("accepts a name and an E.164 number", async () => {
		expect(await check(schema, valid)).toBeNull();
	});

	it("requires a name", async () => {
		expect(await check(schema, { ...valid, displayName: "   " })).toBeTruthy();
	});

	it("caps the name at 50 characters, matching firestore.rules", async () => {
		// A laxer client limit would surface server-side as an opaque permission error.
		expect(await check(schema, { ...valid, displayName: "x".repeat(50) })).toBeNull();
		expect(await check(schema, { ...valid, displayName: "x".repeat(51) })).toBeTruthy();
	});

	it("rejects a number with no country code", async () => {
		expect(await check(schema, { ...valid, phone: "08012345678" })).toBeTruthy();
	});

	it("rejects obvious nonsense", async () => {
		expect(await check(schema, { ...valid, phone: "12" })).toBeTruthy();
		expect(await check(schema, { ...valid, phone: "hello" })).toBeTruthy();
	});

	it("accepts spaced international formats people actually type", async () => {
		expect(await check(schema, { ...valid, phone: "+234 801 234 5678" })).toBeNull();
		expect(await check(schema, { ...valid, phone: "+44 7700 900123" })).toBeNull();
	});
});
