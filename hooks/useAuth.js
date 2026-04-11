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

function getFirstError(errors = {}) {
	const firstKey = Object.keys(errors)[0];
	return firstKey ? errors[firstKey] : "Please check your input and try again.";
}

export function useAuth() {
	const [user, setUser] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const clearError = useCallback(() => {
		setError("");
	}, []);

	const storeTokens = useCallback(({ accessToken, refreshToken, fallbackUser = null }) => {
		const resolvedUser = buildUserFromToken(accessToken, fallbackUser);

		const saved = saveAuthSession({
			accessToken,
			refreshToken,
			user: resolvedUser,
		});

		setUser(resolvedUser);
		setError("");

		return saved;
	}, []);

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
		async ({ email, password }) => {
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
					setUser(buildUserFromToken(session.accessToken, session.user));
					setIsLoading(false);
				}
				return;
			}

			await refreshAccessToken({ silent: true });

			if (isMounted) {
				const updatedSession = readAuthSession();
				setUser(
					updatedSession?.accessToken
						? buildUserFromToken(updatedSession.accessToken, updatedSession.user)
						: null
				);
				setIsLoading(false);
			}
		};

		hydrateSession();

		return () => {
			isMounted = false;
		};
	}, [refreshAccessToken]);

	useEffect(() => {
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
				const loggedInUser = await authenticateWithCredentials(validation.data);
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

						// Intentionally hide account existence information.
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

