import * as Crypto from "expo-crypto";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalises a phone number to E.164 ("+2348012345678"), the only format the app
 * stores. Returns null when the number cannot be understood.
 *
 * `defaultCountry` lets a user type a local number without the country code; it is
 * ignored when the input already starts with "+".
 *
 * Deliberately gated on `isPossible()` rather than `isValid()`, and this must stay in
 * step with `isPossiblePhoneNumber` in the profile-setup schema — if the two disagree,
 * a number passes field validation and is then rejected on submit, with nothing the
 * user can do about it.
 *
 * `isValid()` checks the number against known allocated ranges, and that metadata
 * lags real-world allocations, so it produces false negatives for legitimately issued
 * numbers. The failure modes are not symmetric: wrongly rejecting a real number blocks
 * onboarding completely, while wrongly accepting a well-formed but unallocated one
 * just means contact discovery never matches it.
 */
export const toE164 = (input: string, defaultCountry?: string): string | null => {
	const parsed = parsePhoneNumberFromString(
		input.trim(),
		defaultCountry as Parameters<typeof parsePhoneNumberFromString>[1],
	);
	return parsed?.isPossible() ? parsed.number : null;
};

/**
 * SHA-256 of an E.164 number.
 *
 * Contact discovery matches on this hash, never the raw number, so the address book
 * of people who are NOT users never leaves the device in readable form. It also means
 * a scraper has to already know a number to confirm it belongs to a Konvo user.
 */
export const hashPhone = (e164: string): Promise<string> =>
	Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, e164);
