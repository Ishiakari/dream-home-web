import { jwtDecode } from "jwt-decode";

const SESSION_STORAGE_KEY = "dreamhome.auth.session.v1";
const SESSION_EVENT_NAME = "dreamhome:session-changed";

function isBrowser() {
	return typeof window !== "undefined";
}

function emitSessionChange() {
	if (!isBrowser()) {
		return;
	}

	window.dispatchEvent(new Event(SESSION_EVENT_NAME));
}

function safeJsonParse(value) {
	if (!value || typeof value !== "string") {
		return null;
	}

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

function normalizeSessionPayload(payload) {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const accessToken = typeof payload.accessToken === "string" ? payload.accessToken : null;
	const refreshToken = typeof payload.refreshToken === "string" ? payload.refreshToken : null;
	const user = payload.user && typeof payload.user === "object" ? payload.user : null;

	if (!accessToken || !refreshToken) {
		return null;
	}

	return {
		accessToken,
		refreshToken,
		user,
		updatedAt: typeof payload.updatedAt === "number" ? payload.updatedAt : Date.now(),
	};
}

export function readAuthSession() {
	if (!isBrowser()) {
		return null;
	}

	const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
	return normalizeSessionPayload(safeJsonParse(raw));
}

export function saveAuthSession(session) {
	if (!isBrowser()) {
		return null;
	}

	const normalized = normalizeSessionPayload({
		...session,
		updatedAt: Date.now(),
	});

	if (!normalized) {
		return null;
	}

	window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(normalized));
	emitSessionChange();
	return normalized;
}

export function clearAuthSession() {
	if (!isBrowser()) {
		return;
	}

	window.localStorage.removeItem(SESSION_STORAGE_KEY);
	emitSessionChange();
}

export function getAccessToken() {
	return readAuthSession()?.accessToken || null;
}

export function getRefreshToken() {
	return readAuthSession()?.refreshToken || null;
}

export function getStoredUser() {
	return readAuthSession()?.user || null;
}

export function decodeJwtToken(token) {
	if (!token || typeof token !== "string") {
		return null;
	}

	try {
		return jwtDecode(token);
	} catch {
		return null;
	}
}

export function isTokenExpired(token, clockSkewSeconds = 30) {
	const payload = decodeJwtToken(token);

	if (!payload || typeof payload.exp !== "number") {
		return true;
	}

	return Date.now() >= (payload.exp - clockSkewSeconds) * 1000;
}

export function buildUserFromToken(accessToken, fallbackUser = null) {
	const payload = decodeJwtToken(accessToken);

	if (!payload) {
		return fallbackUser;
	}

	const firstName = typeof payload.first_name === "string" ? payload.first_name : fallbackUser?.firstName || "";
	const lastName = typeof payload.last_name === "string" ? payload.last_name : fallbackUser?.lastName || "";
	const role = typeof payload.role === "string" ? payload.role : fallbackUser?.role || "Renter";

	const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || fallbackUser?.fullName || "";

	return {
		id: payload.user_id || payload.sub || fallbackUser?.id || null,
		role,
		firstName,
		lastName,
		fullName,
	};
}

export function subscribeToSessionChanges(callback) {
	if (!isBrowser() || typeof callback !== "function") {
		return () => {};
	}

	const onStorage = (event) => {
		if (event.key === SESSION_STORAGE_KEY) {
			callback(readAuthSession());
		}
	};

	const onCustomEvent = () => {
		callback(readAuthSession());
	};

	window.addEventListener("storage", onStorage);
	window.addEventListener(SESSION_EVENT_NAME, onCustomEvent);

	return () => {
		window.removeEventListener("storage", onStorage);
		window.removeEventListener(SESSION_EVENT_NAME, onCustomEvent);
	};
}

