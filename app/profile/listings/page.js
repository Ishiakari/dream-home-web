'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Building2 } from "lucide-react";

import { useOwnerListings } from "@/hooks/useOwnerListings";

export default function OwnerListingsPage() {
    const router = useRouter();

    const {
        // auth / route
        isAuthenticated,
        isLoading,
        status,
        isOwner,

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
        STATUS_OPTIONS,
    } = useOwnerListings();

    // Protect route: must be logged in
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
        router.replace("/login?next=/profile/listings");
        }
    }, [isAuthenticated, isLoading, router]);

    // If user is logged in but NOT owner
    useEffect(() => {
        if (!isLoading && isAuthenticated && !isOwner) {
        router.replace("/profile");
        }
    }, [isAuthenticated, isLoading, isOwner, router]);

    if (isLoading) {
        return (
        <section className="min-h-[calc(100vh-140px)] bg-linear-to-b from-[#f4f8ff] to-white px-4 py-8 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-5xl animate-pulse space-y-5">
            <div className="h-16 rounded-2xl bg-blue-100/60" />
            <div className="h-72 rounded-2xl bg-blue-100/60" />
            </div>
        </section>
        );
    }

    // Minimal UI while redirecting
    if (!isAuthenticated) {
        return (
        <section className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-linear-to-b from-[#f4f8ff] to-white px-4 py-8">
            <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#003580]">Redirecting to sign in...</h1>
            <p className="mt-2 text-sm text-gray-600">You need to be logged in to manage your listings.</p>
            <Link
                href="/login?next=/profile/listings"
                className="mt-4 inline-flex items-center rounded-lg bg-[#003580] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
            >
                Sign in now
            </Link>
            </div>
        </section>
        );
    }

    // Minimal UI while redirecting
    if (status === "authenticated" && !isOwner) {
        return (
        <section className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-linear-to-b from-[#f4f8ff] to-white px-4 py-8">
            <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#003580]">Redirecting...</h1>
            <p className="mt-2 text-sm text-gray-600">Owner access is required to manage listings.</p>
            </div>
        </section>
        );
    }

    return (
        <section className="min-h-[calc(100vh-140px)] bg-linear-to-b from-[#f4f8ff] to-white px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-5xl space-y-5">
            {/* Header */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#003580]/10 p-2 text-[#003580]">
                    <Building2 className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-[#003580]">Manage Listings</h1>
                    <p className="mt-1 text-sm text-gray-600">
                    View your properties and manage them from one place.
                    </p>
                </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={refreshListings}
                    className="inline-flex items-center rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-[#003580] transition hover:bg-blue-50"
                >
                    Refresh
                </button>

                <Link
                    href="/profile"
                    className="inline-flex items-center rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-[#003580] transition hover:bg-blue-50"
                >
                    Back to Profile
                </Link>

                <Link
                    href="/profile"
                    className="inline-flex items-center rounded-lg bg-[#003580] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
                >
                    Add New Property
                </Link>
                </div>
            </div>
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {isFetching ? (
                <p className="text-sm text-gray-600">Loading your listings...</p>
            ) : errorMsg ? (
                <p className="text-sm text-red-600">{errorMsg}</p>
            ) : properties.length === 0 ? (
                <div className="space-y-3">
                <p className="text-sm text-gray-700">You don’t have any properties listed yet.</p>
                <p className="text-sm text-gray-600">
                    Go back to your profile and click <strong>Add New Property</strong>.
                </p>
                <Link
                    href="/profile"
                    className="inline-flex items-center rounded-lg bg-[#003580] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
                >
                    Back to Owner Dashboard
                </Link>
                </div>
            ) : (
                <div className="space-y-3">
                {properties.map((prop) => {
                    const id = prop.property_no || prop.id || "N/A";
                    const propId = prop.property_no || prop.id;

                    const title = prop.title || "Untitled property";
                    const location = [prop.street, prop.city].filter(Boolean).join(", ");
                    const rent = prop.monthly_rent ?? prop.monthlyRent;
                    const statusText = prop.status || "Unknown";

                    const isDeleting = deletingId === propId;
                    const isUpdating = updatingId === propId;
                    const isEditing = editingId === propId;

                    return (
                    <div
                        key={id}
                        className="rounded-xl border border-blue-100 bg-blue-50/30 px-4 py-4"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                            {!isEditing ? (
                            <>
                                <p className="text-sm font-semibold text-[#003580]">
                                {id} — {title}
                                </p>
                                <p className="mt-1 text-xs text-gray-600">
                                {location || "No address provided"}
                                </p>

                                {rent !== undefined && rent !== null ? (
                                <p className="mt-2 text-xs text-gray-700">
                                    Monthly Rent: <span className="font-semibold">₱{rent}</span>
                                </p>
                                ) : null}
                            </>
                            ) : (
                            <div className="space-y-3">
                                <div>
                                <label className="block text-xs font-semibold text-gray-700">
                                    Title
                                </label>
                                <input
                                    value={editValues.title}
                                    onChange={(e) =>
                                    setEditValues((v) => ({ ...v, title: e.target.value }))
                                    }
                                    className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-[#003580]"
                                />
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700">
                                    Monthly Rent
                                    </label>
                                    <input
                                    value={editValues.monthly_rent}
                                    onChange={(e) =>
                                        setEditValues((v) => ({ ...v, monthly_rent: e.target.value }))
                                    }
                                    className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-[#003580]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700">
                                    Status
                                    </label>
                                    <select
                                    value={editValues.status}
                                    onChange={(e) =>
                                        setEditValues((v) => ({ ...v, status: e.target.value }))
                                    }
                                    className="mt-1 w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-[#003580]"
                                    >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>
                                        {s}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => saveEdit(prop)}
                                    disabled={isUpdating}
                                    className="rounded-lg bg-[#003580] px-3 py-2 text-sm font-semibold text-white hover:bg-[#002a66] disabled:opacity-50"
                                >
                                    {isUpdating ? "Saving..." : "Save"}
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={isUpdating}
                                    className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-[#003580] hover:bg-blue-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                </div>
                            </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                            <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#003580] border border-blue-100">
                            {statusText}
                            </span>

                            <div className="flex flex-wrap gap-2 sm:justify-end">
                            {/* STATUS QUICK ACTIONS */}
                            <button
                                type="button"
                                onClick={() => updateStatus(prop, "Withdrawn")}
                                disabled={isUpdating || isDeleting || String(statusText) === "Withdrawn"}
                                className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-50"
                            >
                                {isUpdating ? "Updating..." : "Withdraw"}
                            </button>

                            <button
                                type="button"
                                onClick={() => updateStatus(prop, "Available")}
                                disabled={isUpdating || isDeleting || String(statusText) === "Available"}
                                className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50"
                            >
                                {isUpdating ? "Updating..." : "Mark Available"}
                            </button>

                            <button
                                type="button"
                                onClick={() => updateStatus(prop, "Rented")}
                                disabled={isUpdating || isDeleting || String(statusText) === "Rented"}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                {isUpdating ? "Updating..." : "Mark Rented"}
                            </button>

                            {/* EDIT */}
                            <button
                                type="button"
                                onClick={() => startEdit(prop)}
                                disabled={isUpdating || isDeleting || isEditing}
                                className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#003580] hover:bg-blue-50 disabled:opacity-50"
                            >
                                Edit
                            </button>

                            {/* DELETE */}
                            <button
                                type="button"
                                onClick={() => deleteListing(prop)}
                                disabled={isDeleting || isUpdating}
                                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
            </div>
        </div>
        </section>
    );
}