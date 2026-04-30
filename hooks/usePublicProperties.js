"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.items)) return data.items;
    return [];
    }

    /**
     * usePublicProperties
     * Loads public property listings from GET /api/properties/
     * (your backend is now public for GET).
     */
    export function usePublicProperties() {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setErrorMsg("");

        try {
        const data = await apiClient.get("properties/");
        const list = normalizeList(data);
        setProperties(list);
        } catch (err) {
        console.error("Public properties fetch error:", err);
        setProperties([]);
        setErrorMsg("Could not load properties. Please try again.");
        } finally {
        setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { properties, isLoading, errorMsg, refresh };
}