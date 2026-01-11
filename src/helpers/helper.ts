export const isStringNullOrEmpty = (item?: string): boolean => {
	if (typeof item === "undefined" || item == null || item.length === 0) {
		return true;
	} else {
		return false;
	}
};

export const isValueNullOrUndefined = (item?: number | boolean): boolean => {
	if (typeof item === "undefined" || item == null) {
		return true;
	} else {
		return false;
	}
};

export const isObjectNullOrEmpty = <T>(obj: T): boolean => {
	if (obj === undefined || obj === null || Object.keys(obj).length === 0) {
		return true;
	}

	return false;
};

export const isArrayNullOrEmpty = <T>(obj?: T[] | null): boolean => {
	return !obj || obj.length === 0;
};

export const extractYoutubeVideoId = (url: string): string | null => {
	if (!url?.includes("v=")) return null;
	return url?.split("v=")[1]?.split("&")[0] || null;
};

export const getAspectRatioHeight = (width: number, ratio: string = "16:9") => {
	const [widthRatio, heightRatio] = ratio.split(":").map(Number);
	return (width * heightRatio) / widthRatio;
};
