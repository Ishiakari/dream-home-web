const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim();
const REQUEST_TIMEOUT_MS = 12000;

export class ApiError extends Error {
	constructor(message, { status = 0, details = null, code = null } = {}) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.details = details;
		this.code = code;
	}
}

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function getApiBaseUrl() {
	if (!API_BASE_URL) {
		throw new ApiError(
			"API base URL is missing. Set NEXT_PUBLIC_API_URL in your .env.local file."
		);
	}

	return API_BASE_URL;
}

function buildUrl(path = "") {
	const base = getApiBaseUrl().replace(/\/+$/, "");
	const cleanPath = String(path).trim();

	if (!cleanPath) {
		return base;
	}

	if (/^https?:\/\//i.test(cleanPath)) {
		return cleanPath;
	}

	return `${base}/${cleanPath.replace(/^\/+/, "")}`;
}

async function parseResponseBody(response) {
	const contentType = response.headers.get("content-type") || "";

	if (contentType.includes("application/json")) {
		try {
			return await response.json();
		} catch {
			return null;
		}
	}

	try {
		const text = await response.text();
		return text ? { detail: text } : null;
	} catch {
		return null;
	}
}

function normalizeErrorMessage(status, data) {
	if (isObject(data)) {
		if (typeof data.detail === "string" && data.detail.trim()) {
			return data.detail;
		}

		if (typeof data.message === "string" && data.message.trim()) {
			return data.message;
		}

		if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
			return String(data.non_field_errors[0]);
		}

		const firstKey = Object.keys(data)[0];
		const firstValue = firstKey ? data[firstKey] : null;

		if (Array.isArray(firstValue) && firstValue.length > 0) {
			return String(firstValue[0]);
		}

		if (typeof firstValue === "string" && firstValue.trim()) {
			return firstValue;
		}
	}

	if (status === 401) {
		return "Your session has expired. Please sign in again.";
	}

	if (status === 403) {
		return "You are not allowed to perform this action.";
	}

	if (status === 404) {
		return "The requested resource was not found.";
	}

	if (status >= 500) {
		return "Server error. Please try again in a moment.";
	}

	return "Request failed. Please check your input and try again.";
}

async function fetchWithTimeout(url, options, timeoutMs) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(url, {
			...options,
			signal: controller.signal,
		});
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function apiRequest(path, options = {}) {
	const {
		method = "GET",
		data,
		headers = {},
		token,
		timeoutMs = REQUEST_TIMEOUT_MS,
	} = options;

	const url = buildUrl(path);
	const hasBody = data !== undefined && data !== null;
	const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

	const requestHeaders = {
		Accept: "application/json",
		...headers,
	};

	if (hasBody && !isFormData) {
		requestHeaders["Content-Type"] = "application/json";
	}

	if (token) {
		requestHeaders.Authorization = `Bearer ${token}`;
	}

	let response;
	try {
		response = await fetchWithTimeout(
			url,
			{
				method,
				headers: requestHeaders,
				body: hasBody ? (isFormData ? data : JSON.stringify(data)) : undefined,
			},
			timeoutMs
		);
	} catch (error) {
		if (error.name === "AbortError") {
			throw new ApiError("The request timed out. Please try again.");
		}

		throw new ApiError("Unable to connect to the server. Check your network and API URL.");
	}

	const parsedBody = await parseResponseBody(response);

	if (!response.ok) {
		throw new ApiError(normalizeErrorMessage(response.status, parsedBody), {
			status: response.status,
			details: parsedBody,
			code: isObject(parsedBody) && typeof parsedBody.code === "string" ? parsedBody.code : null,
		});
	}

	return parsedBody;
}

export function toApiErrorMessage(error, fallbackMessage = "Something went wrong. Please try again.") {
	if (error instanceof ApiError && error.message) {
		return error.message;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return fallbackMessage;
}

export const apiClient = {
	request: apiRequest,
	get(path, options = {}) {
		return apiRequest(path, { ...options, method: "GET" });
	},
	post(path, options = {}) {
		return apiRequest(path, { ...options, method: "POST" });
	},
	put(path, options = {}) {
		return apiRequest(path, { ...options, method: "PUT" });
	},
	patch(path, options = {}) {
		return apiRequest(path, { ...options, method: "PATCH" });
	},
	delete(path, options = {}) {
		return apiRequest(path, { ...options, method: "DELETE" });
	},
};

