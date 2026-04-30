"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProperties } from "@/lib/properties/api";
import { useAuth } from "@/hooks/useAuth";

export function useProperties({ requiresAuth = true } = {}) {
    const { status, getValidAccessToken } = useAuth();

    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setErrorMsg("");

        try {
        let token = undefined;

        if (requiresAuth) {
            if (status !== "authenticated") {
            setProperties([]);
            setIsLoading(false);
            return;
            }

            token = await getValidAccessToken();
            if (!token) throw new Error("Session expired. Please sign in again.");
        }

        const list = await fetchProperties({ token });
        setProperties(list);
        } catch (err) {
        console.error("Properties load error:", err);
        setErrorMsg(err?.message || "Could not load properties.");
        setProperties([]);
        } finally {
        setIsLoading(false);
        }
    }, [getValidAccessToken, requiresAuth, status]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { properties, isLoading, errorMsg, refresh };
}