import {
	blurPlaceholderUrl,
	derivedUrl,
	isCloudinaryConfigured,
	thumbnailUrl,
} from "../../src/services/media/cloudinary";

const UPLOADED = "https://res.cloudinary.com/demo/image/upload/v1712345678/konvo/chat/abc.jpg";

describe("cloudinary derived URLs", () => {
	/**
	 * These transforms are why no separate thumbnail is uploaded: one upload serves
	 * every size, generated and CDN-cached on first request. If the transform segment
	 * is malformed, Cloudinary serves the full-size original instead of erroring — so
	 * the failure is a silent bandwidth blowout, not a broken image. Hence the tests.
	 */
	it("inserts the transform segment directly after /upload/", () => {
		expect(derivedUrl(UPLOADED, { width: 320 })).toBe(
			"https://res.cloudinary.com/demo/image/upload/w_320,c_limit,f_auto,q_70/v1712345678/konvo/chat/abc.jpg",
		);
	});

	it("keeps the version and public id intact", () => {
		expect(derivedUrl(UPLOADED, { width: 100 })).toContain("/v1712345678/konvo/chat/abc.jpg");
	});

	it("honours an explicit quality", () => {
		expect(derivedUrl(UPLOADED, { width: 320, quality: 50 })).toContain("q_50");
	});

	it("adds a blur only when asked", () => {
		expect(derivedUrl(UPLOADED, { width: 32 })).not.toContain("e_blur");
		expect(derivedUrl(UPLOADED, { width: 32, blur: 400 })).toContain("e_blur:400");
	});

	it("uses c_limit so a small source is never upscaled", () => {
		expect(derivedUrl(UPLOADED, { width: 4000 })).toContain("c_limit");
	});

	it("requests f_auto so modern clients get webp without a second upload", () => {
		expect(derivedUrl(UPLOADED, { width: 320 })).toContain("f_auto");
	});

	it("builds a cheap thumbnail and a very cheap blur placeholder", () => {
		expect(thumbnailUrl(UPLOADED)).toContain("w_320");
		expect(blurPlaceholderUrl(UPLOADED)).toContain("w_32");
		expect(blurPlaceholderUrl(UPLOADED)).toContain("e_blur");
	});
});

describe("cloudinary configuration", () => {
	it("reports unconfigured when the env vars are absent", () => {
		// The jest expo-constants mock supplies no cloudinary block, mirroring a
		// checkout with no .env. Onboarding relies on this to save a profile without
		// a photo rather than trapping the user on the setup screen.
		expect(isCloudinaryConfigured()).toBe(false);
	});
});
