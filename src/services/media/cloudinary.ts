import Constants from "expo-constants";
import * as ImageManipulator from "expo-image-manipulator";

interface CloudinaryConfig {
	cloudName?: string;
	uploadPreset?: string;
}

const config = (Constants.expoConfig?.extra?.cloudinary ?? {}) as CloudinaryConfig;

export const isCloudinaryConfigured = (): boolean =>
	Boolean(config.cloudName && config.uploadPreset);

const requireConfig = () => {
	if (!config.cloudName || !config.uploadPreset) {
		throw new Error(
			"Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in .env, then restart the dev server. See docs/SETUP.md step 4.",
		);
	}
	return { cloudName: config.cloudName, uploadPreset: config.uploadPreset };
};

export interface UploadedImage {
	publicId: string;
	url: string;
	width: number;
	height: number;
	bytes: number;
}

export interface UploadOptions {
	/** Longest edge after resize. Full-size chat images use 1600, avatars 512. */
	maxWidth: number;
	/** JPEG quality, 0..1. */
	quality: number;
	/** Cloudinary public_id, WITHOUT the folder. Reusing one overwrites in place. */
	publicId: string;
	folder: string;
	onProgress?: (fraction: number) => void;
}

/**
 * Compresses on device before upload. A 12 MP phone photo is ~4 MB; at 1600px and
 * quality 0.8 it lands around 250 KB, which matters on a metered connection and keeps
 * us inside Cloudinary's free 25 GB.
 */
const compress = async (uri: string, maxWidth: number, quality: number) => {
	const context = ImageManipulator.ImageManipulator.manipulate(uri);
	context.resize({ width: maxWidth });
	const image = await context.renderAsync();
	return image.saveAsync({ compress: quality, format: ImageManipulator.SaveFormat.JPEG });
};

/**
 * Uploads to Cloudinary with an unsigned preset.
 *
 * XMLHttpRequest rather than fetch: only XHR exposes `upload.onprogress`, and the
 * progress ring on a sending image bubble needs it. React Native's FormData accepts
 * a `{ uri, type, name }` object directly, so there is no blob conversion and none of
 * the out-of-memory hazard that `fetch(uri).blob()` has with large images.
 */
export const uploadImage = async (
	localUri: string,
	options: UploadOptions,
): Promise<UploadedImage> => {
	const { cloudName, uploadPreset } = requireConfig();
	const compressed = await compress(localUri, options.maxWidth, options.quality);

	const form = new FormData();
	form.append("file", {
		uri: compressed.uri,
		type: "image/jpeg",
		name: `${options.publicId}.jpg`,
	} as unknown as Blob);
	form.append("upload_preset", uploadPreset);
	form.append("public_id", options.publicId);
	form.append("folder", options.folder);

	return new Promise<UploadedImage>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable && options.onProgress) {
				options.onProgress(event.loaded / event.total);
			}
		};

		xhr.onload = () => {
			if (xhr.status < 200 || xhr.status >= 300) {
				reject(new Error(`Cloudinary upload failed (${xhr.status}). ${xhr.responseText}`));
				return;
			}
			try {
				const body = JSON.parse(xhr.responseText) as {
					public_id: string;
					secure_url: string;
					width: number;
					height: number;
					bytes: number;
				};
				resolve({
					publicId: body.public_id,
					url: body.secure_url,
					width: body.width,
					height: body.height,
					bytes: body.bytes,
				});
			} catch {
				reject(new Error("Cloudinary returned a response we could not read."));
			}
		};

		xhr.onerror = () => reject(new Error("Network error while uploading the image."));
		xhr.onabort = () => reject(new Error("Image upload was cancelled."));
		xhr.send(form);
	});
};

/**
 * Builds a resized variant from an already-uploaded image.
 *
 * This is why no separate thumbnail is uploaded: Cloudinary generates and CDN-caches
 * derived sizes on first request, so one upload serves every size the UI needs.
 */
export const derivedUrl = (
	url: string,
	transform: { width: number; quality?: number; blur?: number },
): string => {
	const parts = [`w_${transform.width}`, "c_limit", "f_auto"];
	parts.push(`q_${transform.quality ?? 70}`);
	if (transform.blur) parts.push(`e_blur:${transform.blur}`);

	// Cloudinary URLs are .../image/upload/<transforms>/<version>/<public_id>.jpg
	return url.replace("/image/upload/", `/image/upload/${parts.join(",")}/`);
};

export const thumbnailUrl = (url: string) => derivedUrl(url, { width: 320, quality: 50 });
export const blurPlaceholderUrl = (url: string) =>
	derivedUrl(url, { width: 32, quality: 30, blur: 400 });

/** 512px square-ish avatar. A fixed public_id means a new photo replaces the old one. */
export const uploadAvatar = (localUri: string, uid: string, onProgress?: (n: number) => void) =>
	uploadImage(localUri, {
		maxWidth: 512,
		quality: 0.8,
		publicId: uid,
		folder: "konvo/avatars",
		onProgress,
	});
