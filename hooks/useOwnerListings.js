'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient, toApiErrorMessage } from "@/lib/apiClient";
import { getUserRoleFlags } from "@/lib/auth/roles";
import { useAuth } from "@/hooks/useAuth";

import { matchesOwner } from "@/lib/properties/owner";
import { PROPERTY_STATUS_OPTIONS } from "@/lib/properties/constants";

function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.items)) return data.items;
    return [];
    }

    export function useOwnerListings() {
    const { user, isAuthenticated, isLoading, status, getValidAccessToken } = useAuth();
    const { isOwner } = getUserRoleFlags(user?.role);

    const ownerId = useMemo(() => {
        return (
        user?.client_no ||
        user?.clientNo ||
        user?.id ||
        user?.clientId ||
        user?.client_id ||
        null
        );
    }, [user]);

    const [properties, setProperties] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [deletingId, setDeletingId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({
        title: "",
        monthly_rent: "",
        status: "Available",
    });

    const refreshListings = useCallback(async () => {
        if (status !== "authenticated") return;
        if (!isOwner) return;

        setIsFetching(true);
        setErrorMsg("");

        try {
        const token = await getValidAccessToken();
        if (!token) throw new Error("Missing access token.");

        const data = await apiClient.get("properties/", { token });
        const list = normalizeList(data);

        const filtered = ownerId ? list.filter((p) => matchesOwner(p?.owner, ownerId)) : list;
        setProperties(filtered);
        } catch (err) {
        setErrorMsg(toApiErrorMessage(err, "Could not load your listings."));
        setProperties([]);
        } finally {
        setIsFetching(false);
        }
    }, [getValidAccessToken, isOwner, ownerId, status]);

    useEffect(() => {
        refreshListings();
    }, [refreshListings]);

    const startEdit = useCallback((prop) => {
        const id = prop?.property_no || prop?.id;
        if (!id) return;

        setEditingId(id);
        setErrorMsg("");

        setEditValues({
        title: prop?.title ?? "",
        monthly_rent:
            prop?.monthly_rent !== undefined && prop?.monthly_rent !== null
            ? String(prop.monthly_rent)
            : "",
        status: prop?.status || "Available",
        });
    }, []);

    const cancelEdit = useCallback(() => {
        setEditingId(null);
        setEditValues({ title: "", monthly_rent: "", status: "Available" });
    }, []);

    const saveEdit = useCallback(
        async (prop) => {
        const id = prop?.property_no || prop?.id;
        if (!id) return;

        if (!editValues.title.trim()) {
            setErrorMsg("Title is required.");
            return;
        }

        if (editValues.monthly_rent === "" || Number.isNaN(Number(editValues.monthly_rent))) {
            setErrorMsg("Monthly rent must be a number.");
            return;
        }

        if (!PROPERTY_STATUS_OPTIONS.includes(editValues.status)) {
            setErrorMsg("Invalid status selected.");
            return;
        }

        setUpdatingId(id);
        setErrorMsg("");

        try {
            const token = await getValidAccessToken();
            if (!token) throw new Error("Missing access token.");

            const payload = {
            title: editValues.title,
            monthly_rent: editValues.monthly_rent,
            status: editValues.status,
            };

            const updated = await apiClient.patch(`properties/${id}/`, {
            token,
            data: payload,
            });

            setProperties((prev) =>
            prev.map((p) => {
                const pid = p.property_no || p.id;
                if (pid !== id) return p;
                return { ...p, ...(updated && typeof updated === "object" ? updated : payload) };
            })
            );

            cancelEdit();
        } catch (err) {
            setErrorMsg(toApiErrorMessage(err, "Could not save changes."));
        } finally {
            setUpdatingId(null);
        }
        },
        [cancelEdit, editValues, getValidAccessToken]
    );

    const updateStatus = useCallback(
        async (prop, nextStatus) => {
        const id = prop?.property_no || prop?.id;
        if (!id) return;

        if (!PROPERTY_STATUS_OPTIONS.includes(nextStatus)) {
            setErrorMsg("Invalid status selected.");
            return;
        }

        setUpdatingId(id);
        setErrorMsg("");

        try {
            const token = await getValidAccessToken();
            if (!token) throw new Error("Missing access token.");

            const updated = await apiClient.patch(`properties/${id}/`, {
            token,
            data: { status: nextStatus },
            });

            setProperties((prev) =>
            prev.map((p) => {
                const pid = p.property_no || p.id;
                if (pid !== id) return p;
                return {
                ...p,
                ...(updated && typeof updated === "object" ? updated : { status: nextStatus }),
                };
            })
            );

            // Keep edit form in sync if editing this same item
            if (editingId === id) {
            setEditValues((v) => ({ ...v, status: nextStatus }));
            }
        } catch (err) {
            setErrorMsg(toApiErrorMessage(err, "Could not update status."));
        } finally {
            setUpdatingId(null);
        }
        },
        [editingId, getValidAccessToken]
    );

    const deleteListing = useCallback(
        async (prop) => {
        const id = prop?.property_no || prop?.id;
        if (!id) return;

        const ok = window.confirm(`Delete property ${id}? This cannot be undone.`);
        if (!ok) return;

        setDeletingId(id);
        setErrorMsg("");

        try {
            const token = await getValidAccessToken();
            if (!token) throw new Error("Missing access token.");

            await apiClient.delete(`properties/${id}/`, { token });

            setProperties((prev) => prev.filter((p) => (p.property_no || p.id) !== id));

            // If deleting the thing you were editing, exit edit mode
            if (editingId === id) {
            cancelEdit();
            }
        } catch (err) {
            setErrorMsg(toApiErrorMessage(err, "Could not delete this property."));
        } finally {
            setDeletingId(null);
        }
        },
        [cancelEdit, editingId, getValidAccessToken]
    );

    return {
        // auth / route
        user,
        isAuthenticated,
        isLoading,
        status,
        isOwner,
        ownerId,

        // data
        properties,
        isFetching,
        errorMsg,

        // ui state
        deletingId,
        updatingId,
        editingId,
        editValues,
        setEditValues,

        // actions
        refreshListings,
        startEdit,
        cancelEdit,
        saveEdit,
        updateStatus,
        deleteListing,

        // constants
        STATUS_OPTIONS: PROPERTY_STATUS_OPTIONS,
    };
}