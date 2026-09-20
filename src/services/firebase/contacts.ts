import * as Crypto from "expo-crypto";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalises a phone number to E.164 ("+2348012345678"), the only format the app
 * stores. Returns null when the number cannot be understood.
 *
 * `defaultCountry` lets a user type a local number without the country code; it is
 * ignored when the input already starts with "+".
 */
export const toE164 = (input: string, defaultCountry?: string): string | null => {
	const parsed = parsePhoneNumberFromString(
		input.trim(),
		defaultCountry as Parameters<typeof parsePhoneNumberFromString>[1],
	);
	return parsed?.isValid() ? parsed.number : null;
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
