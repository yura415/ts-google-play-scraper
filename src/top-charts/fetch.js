import qs from "querystring";
import httpRequest from "util/http-request";

export const BASE_URL = "https://play.google.com/store/apps";

export const FAMILY_REGEXP = /^FAMILY_?/;
export const AGE_REGEXP = /(_UNDER_5|_6_TO_8|_9_AND_UP)$/;
export const AGE_MAP = {
	_UNDER_5: "AGE_RANGE1",
	_6_TO_8: "AGE_RANGE2",
	_9_AND_UP: "AGE_RANGE3",
};

export function topChartsUrl({ category, collection, countryCode, languageCode }) {
	const query = {
		hl: languageCode,
		gl: countryCode,
		num: 20,
		age: categoryAge(category),
	};
	let url = BASE_URL;

	if (category) {
		url += `/category/${category}`;
	}
	url += `/collection/${collection}`;

	return `${url}?${qs.stringify(query)}`;
}

export function categoryAge(category) {
	if (FAMILY_REGEXP.test(category) && AGE_REGEXP.test(category)) {
		const [, age = void 0] = category.match(AGE_REGEXP) || [];
		return AGE_MAP[age];
	}
}

/**
 * @export
 * @param {import("google-play-scraping").TopChartsRequest} options
 * @returns {Promise<string>}
 */
export default async function fetchTopCharts({ category, collection, languageCode, countryCode, options }) {
	const requestUrl = topChartsUrl({ category, collection, languageCode, countryCode });
	const response = await httpRequest({
		url: requestUrl,
		method: "POST",
		responseType: "text",
		...(options || {}),
	});

	return response.data;
}