"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.items)) return data.items;
    return [];
    }

    function isAvailable(property) {
    return String(property?.status || "").toLowerCase() === "available";
    }

    /**
     * ✅ Global cache (survives Turbopack HMR better than module variables)
     * data: Array | null
     * inFlight: Promise<Array> | null
     * ts: number (Date.now)
     */
    const CACHE_KEY = "__dreamhome_public_properties_cache__";
    const CACHE_TTL_MS = 60_000; // 60s (increase if you want)

    function getCache() {
    const g = globalThis;
    if (!g[CACHE_KEY]) {
        g[CACHE_KEY] = { data: null, inFlight: null, ts: 0 };
    }
    return g[CACHE_KEY];
    }

    function isCacheFresh(cache) {
    return Array.isArray(cache.data) && cache.data.length >= 0 && Date.now() - cache.ts < CACHE_TTL_MS;
    }

    async function fetchPublicPropertiesCached({ force = false } = {}) {
    const cache = getCache();

    if (!force && isCacheFresh(cache)) return cache.data;
    if (!force && cache.inFlight) return cache.inFlight;

    cache.inFlight = (async () => {
        const data = await apiClient.get("properties/");
        const list = normalizeList(data);
        const publicList = list.filter(isAvailable);

        cache.data = publicList;
        cache.ts = Date.now();
        return publicList;
    })();

    try {
        return await cache.inFlight;
    } finally {
        cache.inFlight = null;
    }
}

/**
 * usePublicProperties
 * Loads public property listings from GET /api/properties/
 * Public browsing should only show AVAILABLE listings.
 */
export function usePublicProperties() {
    const cache = getCache();

    const [properties, setProperties] = useState(() => (Array.isArray(cache.data) ? cache.data : []));
    const [isLoading, setIsLoading] = useState(() => !isCacheFresh(cache));
    const [errorMsg, setErrorMsg] = useState("");

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setErrorMsg("");

        try {
        const list = await fetchPublicPropertiesCached({ force: true });
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
        let alive = true;

        // If cache is fresh, use it (no GET)
        if (isCacheFresh(getCache())) {
        setProperties(getCache().data);
        setIsLoading(false);
        return () => {
            alive = false;
        };
        }

        // Otherwise fetch (deduped)
        (async () => {
        setIsLoading(true);
        setErrorMsg("");
        try {
            const list = await fetchPublicPropertiesCached({ force: false });
            if (!alive) return;
            setProperties(list);
        } catch (err) {
            console.error("Public properties fetch error:", err);
            if (!alive) return;
            setProperties([]);
            setErrorMsg("Could not load properties. Please try again.");
        } finally {
            if (!alive) return;
            setIsLoading(false);
        }
        })();

        return () => {
        alive = false;
        };
    }, []);

    return { properties, isLoading, errorMsg, refresh };
}