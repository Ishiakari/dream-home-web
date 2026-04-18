'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, apiClient, toApiErrorMessage } from "@/lib/apiClient";
import {
	buildUserFromToken,
	clearAuthSession,
	getAccessToken,
	isTokenExpired,
	readAuthSession,
	saveAuthSession,
	subscribeToSessionChanges,
	} from "@/lib/auth/session";
	import {
	validateForgotPasswordInput,
	validateLoginInput,
	validateSignupInput,
	} from "@/lib/auth/validation";

	const LOGIN_ENDPOINT = "/token/";
	const REFRESH_ENDPOINT = "/token/refresh/";
	const SIGNUP_ENDPOINT = "/users/clients/";
	const PASSWORD_RESET_ENDPOINTS = [
	"/users/password-reset/",
	"/users/password-reset-request/",
	];

	const PASSWORD_RESET_SUCCESS_MESSAGE =
	"If an account exists for this email, password reset instructions have been sent.";

	// ✅ confirmed working endpoint
	const CLIENTS_LIST_ENDPOINT = "/users/clients/";

	function getFirstError(errors = {}) {
	const firstKey = Object.keys(errors)[0];
	return firstKey ? errors[firstKey] : "Please check your input and try again.";
	}

	async function fetchClientNo({ token }) {
	const data = await apiClient.get(CLIENTS_LIST_ENDPOINT, { token });

	const list = Array.isArray(data)
		? data
		: Array.isArray(data?.results)
		? data.results
		: [];

	if (!list.length) return null;

	const match =
		list.find(
		(c) =>
			typeof c?.client_no === "string" &&
			c.client_no.trim() &&
			String(c?.role || "").toLowerCase() === "owner"
		) || list.find((c) => typeof c?.client_no === "string" && c.client_no.trim());

	const clientNo = match?.client_no;
	return typeof clientNo === "string" && clientNo.trim() ? clientNo : null;
	}

	export function useAuth() {
	const [user, setUser] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const clearError = useCallback(() => {
		setError("");
	}, []);

	const updateSessionUser = useCallback((nextUser) => {
		const current = readAuthSession();
		if (!current?.accessToken || !current?.refreshToken) return;

		// ✅ Don't emit unnecessary session changes if nothing changed
		const sameClientNo =
		String(current?.user?.client_no || "") === String(nextUser?.client_no || "");
		const sameId = String(current?.user?.id || "") === String(nextUser?.id || "");
		if (sameClientNo && sameId) return;

		saveAuthSession({
		accessToken: current.accessToken,
		refreshToken: current.refreshToken,
		user: nextUser,
		});
	}, []);

	const enrichUserWithClientNo = useCallback(
		async (baseUser) => {
		try {
			if (!baseUser) return baseUser;

			// already enriched
			if (baseUser.client_no) return baseUser;

			const token = getAccessToken();
			if (!token || isTokenExpired(token)) return baseUser;

			const clientNo = await fetchClientNo({ token });
			if (!clientNo) return baseUser;

			const nextUser = { ...baseUser, client_no: clientNo };

			// ✅ Only update state if it actually changes to avoid loops
			setUser((prev) => {
			if (prev?.client_no === clientNo) return prev;
			return nextUser;
			});

			updateSessionUser(nextUser);
			return nextUser;
		} catch {
			return baseUser;
		}
		},
		[updateSessionUser]
	);

	const storeTokens = useCallback(
		({ accessToken, refreshToken, fallbackUser = null }) => {
		const resolvedUser = buildUserFromToken(accessToken, fallbackUser);

		const saved = saveAuthSession({
			accessToken,
			refreshToken,
			user: resolvedUser,
		});

		setUser(resolvedUser);
		setError("");

		// ✅ Enrich once after login/refresh
		enrichUserWithClientNo(resolvedUser);

		return saved;
		},
		[enrichUserWithClientNo]
	);

	const refreshAccessToken = useCallback(
		async ({ silent = false } = {}) => {
		const currentSession = readAuthSession();

		if (!currentSession?.refreshToken) {
			clearAuthSession();
			setUser(null);

			if (!silent) {
			setError("Your session has expired. Please sign in again.");
			}

			return null;
		}

		try {
			const response = await apiClient.post(REFRESH_ENDPOINT, {
			data: { refresh: currentSession.refreshToken },
			});

			if (!response?.access) {
			throw new ApiError("Invalid token refresh response.");
			}

			const nextRefreshToken =
			typeof response.refresh === "string" ? response.refresh : currentSession.refreshToken;

			const savedSession = storeTokens({
			accessToken: response.access,
			refreshToken: nextRefreshToken,
			fallbackUser: currentSession.user,
			});

			return savedSession?.accessToken || null;
		} catch {
			clearAuthSession();
			setUser(null);

			if (!silent) {
			setError("Your session has expired. Please sign in again.");
			}

			return null;
		}
		},
		[storeTokens]
	);

	const authenticateWithCredentials = useCallback(
		async ({ email, password, fallbackUser = null }) => {
		const response = await apiClient.post(LOGIN_ENDPOINT, {
			data: {
			username: email,
			password,
			},
		});

		if (!response?.access || !response?.refresh) {
			throw new ApiError("Invalid login response from the API.");
		}

		const savedSession = storeTokens({
			accessToken: response.access,
			refreshToken: response.refresh,
			fallbackUser: {
			...(fallbackUser || {}),
			email,
			},
		});

		return savedSession?.user || null;
		},
		[storeTokens]
	);

	useEffect(() => {
		let isMounted = true;

		const hydrateSession = async () => {
		setIsLoading(true);

		const session = readAuthSession();
		if (!session?.accessToken || !session?.refreshToken) {
			if (isMounted) {
			setUser(null);
			setIsLoading(false);
			}
			return;
		}

		if (!isTokenExpired(session.accessToken)) {
			if (isMounted) {
			const nextUser = buildUserFromToken(session.accessToken, session.user);
			setUser(nextUser);
			setIsLoading(false);

			// ✅ Enrich once on hydration
			enrichUserWithClientNo(nextUser);
			}
			return;
		}

		await refreshAccessToken({ silent: true });

		if (isMounted) {
			const updatedSession = readAuthSession();
			const nextUser =
			updatedSession?.accessToken
				? buildUserFromToken(updatedSession.accessToken, updatedSession.user)
				: null;

			setUser(nextUser);
			setIsLoading(false);

			// ✅ Enrich once after refresh/hydration
			enrichUserWithClientNo(nextUser);
		}
		};

		hydrateSession();

		return () => {
		isMounted = false;
		};
	}, [enrichUserWithClientNo, refreshAccessToken]);

	useEffect(() => {
		// ✅ IMPORTANT: do NOT call enrichUserWithClientNo here (it causes loops).
		const unsubscribe = subscribeToSessionChanges((session) => {
		if (!session?.accessToken) {
			setUser(null);
			return;
		}

		setUser(buildUserFromToken(session.accessToken, session.user));
		});

		return unsubscribe;
	}, []);

	const login = useCallback(
		async (values = {}) => {
		clearError();
		setIsLoading(true);

		const validation = validateLoginInput(values);
		if (!validation.isValid) {
			const message = getFirstError(validation.errors);
			setError(message);
			setIsLoading(false);
			return { success: false, error: message, errors: validation.errors };
		}

		try {
			const loggedInUser = await authenticateWithCredentials({
			...validation.data,
			fallbackUser: {
				email: validation.data.email,
			},
			});
			setIsLoading(false);
			return { success: true, user: loggedInUser };
		} catch (requestError) {
			const message = toApiErrorMessage(
			requestError,
			"Unable to sign in right now. Please try again."
			);
			setError(message);
			setIsLoading(false);
			return { success: false, error: message };
		}
		},
		[authenticateWithCredentials, clearError]
	);

	const signup = useCallback(
		async (values = {}) => {
		clearError();
		setIsLoading(true);

		const validation = validateSignupInput(values);
		if (!validation.isValid) {
			const message = getFirstError(validation.errors);
			setError(message);
			setIsLoading(false);
			return { success: false, error: message, errors: validation.errors };
		}

		try {
			await apiClient.post(SIGNUP_ENDPOINT, {
			data: validation.data,
			});

			const loggedInUser = await authenticateWithCredentials({
			email: validation.data.email,
			password: validation.data.password,
			fallbackUser: {
				firstName: validation.data.first_name,
				lastName: validation.data.last_name,
				fullName: `${validation.data.first_name} ${validation.data.last_name}`.trim(),
				role: validation.data.role,
				email: validation.data.email,
				telephoneNo: validation.data.telephone_no,
				address: validation.data.address,
			},
			});

			setIsLoading(false);
			return { success: true, user: loggedInUser };
		} catch (requestError) {
			const message = toApiErrorMessage(
			requestError,
			"Unable to create your account right now. Please try again."
			);
			setError(message);
			setIsLoading(false);
			return { success: false, error: message };
		}
		},
		[authenticateWithCredentials, clearError]
	);

	const requestPasswordReset = useCallback(
		async (values = {}) => {
		clearError();
		setIsLoading(true);

		const validation = validateForgotPasswordInput(values);
		if (!validation.isValid) {
			const message = getFirstError(validation.errors);
			setError(message);
			setIsLoading(false);
			return { success: false, error: message, errors: validation.errors };
		}

		try {
			for (const endpoint of PASSWORD_RESET_ENDPOINTS) {
			try {
				await apiClient.post(endpoint, {
				data: validation.data,
				});

				setIsLoading(false);
				return {
				success: true,
				message: PASSWORD_RESET_SUCCESS_MESSAGE,
				};
			} catch (endpointError) {
				if (endpointError instanceof ApiError && endpointError.status === 404) {
				continue;
				}

				if (endpointError instanceof ApiError && endpointError.status === 400) {
				setIsLoading(false);
				return {
					success: true,
					message: PASSWORD_RESET_SUCCESS_MESSAGE,
				};
				}

				throw endpointError;
			}
			}

			const unavailableMessage =
			"Password reset is not configured yet. Please contact support.";
			setError(unavailableMessage);
			setIsLoading(false);
			return {
			success: false,
			error: unavailableMessage,
			};
		} catch (requestError) {
			const message = toApiErrorMessage(
			requestError,
			"Unable to process your request right now. Please try again."
			);
			setError(message);
			setIsLoading(false);
			return { success: false, error: message };
		}
		},
		[clearError]
	);

	const logout = useCallback(() => {
		clearAuthSession();
		setUser(null);
		setError("");
	}, []);

	const getValidAccessToken = useCallback(async () => {
		const accessToken = getAccessToken();

		if (accessToken && !isTokenExpired(accessToken)) {
		return accessToken;
		}

		return refreshAccessToken({ silent: true });
	}, [refreshAccessToken]);

	const status = useMemo(() => {
		if (isLoading) {
		return "loading";
		}

		return user ? "authenticated" : "unauthenticated";
	}, [isLoading, user]);

	return {
		user,
		error,
		status,
		isLoading,
		isAuthenticated: Boolean(user),
		login,
		signup,
		register: signup,
		logout,
		requestPasswordReset,
		refreshAccessToken,
		getValidAccessToken,
		clearError,
	};
}