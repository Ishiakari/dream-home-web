'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { apiClient, toApiErrorMessage } from "@/lib/apiClient";
import { getUserRoleFlags } from "@/lib/auth/roles";

    function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.items)) return data.items;
    return [];
    }

    export default function OwnerListingsPage() {
    const router = useRouter();
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

    // Protect route: must be logged in
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
        router.replace("/login?next=/profile/listings");
        }
    }, [isAuthenticated, isLoading, router]);

    // Optional: if user is logged in but NOT owner
    useEffect(() => {
        if (!isLoading && isAuthenticated && !isOwner) {
        router.replace("/profile");
        }
    }, [isAuthenticated, isLoading, isOwner, router]);

    useEffect(() => {
        async function loadListings() {
        if (status !== "authenticated") return;
        if (!isOwner) return;

        setIsFetching(true);
        setErrorMsg("");

        try {
            const token = await getValidAccessToken();
            const data = await apiClient.get("properties/", { token });

            const list = normalizeList(data);

            const filtered = ownerId
            ? list.filter((prop) => {
                const ownerField = prop?.owner;

                // owner might be "CO001" OR {client_no:"CO001"} OR {id:"CO001"}
                if (typeof ownerField === "string") return ownerField === ownerId;

                if (ownerField && typeof ownerField === "object") {
                    return (
                    ownerField.client_no === ownerId ||
                    ownerField.clientNo === ownerId ||
                    ownerField.id === ownerId
                    );
                }

                return false;
                })
            : list;

            setProperties(filtered);
        } catch (err) {
            setErrorMsg(toApiErrorMessage(err, "Could not load your listings."));
            setProperties([]);
        } finally {
            setIsFetching(false);
        }
        }

        loadListings();
    }, [getValidAccessToken, isOwner, ownerId, status]);

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

    // If still not authenticated, ProfilePage handles redirect message;
    // this page will redirect too. Keep a minimal UI.
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

                <div className="flex items-center gap-2">
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

            {!ownerId ? (
                <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Note: your user object doesn’t include a client ID, so listings may not filter correctly yet.
                </p>
            ) : null}
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {isFetching ? (
                <p className="text-sm text-gray-600">Loading your listings...</p>
            ) : errorMsg ? (
                <p className="text-sm text-red-600">{errorMsg}</p>
            ) : properties.length === 0 ? (
                <div className="space-y-3">
                <p className="text-sm text-gray-700">
                    You don’t have any properties listed yet.
                </p>
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
                    const title = prop.title || "Untitled property";
                    const location = [prop.street, prop.city].filter(Boolean).join(", ");
                    const rent = prop.monthly_rent ?? prop.monthlyRent;
                    const statusText = prop.status || "Unknown";

                    return (
                    <div
                        key={id}
                        className="rounded-xl border border-blue-100 bg-blue-50/30 px-4 py-4"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-[#003580]">
                            {id} — {title}
                            </p>
                            <p className="mt-1 text-xs text-gray-600">
                            {location || "No address provided"}
                            </p>

                            {rent !== undefined && rent !== null ? (
                            <p className="mt-2 text-xs text-gray-700">
                                Monthly Rent: <span className="font-semibold">£{rent}</span>
                            </p>
                            ) : null}
                        </div>

                        <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                            <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#003580] border border-blue-100">
                            {statusText}
                            </span>

                            {/* Future actions placeholder */}
                            <p className="text-[11px] text-gray-500">
                            (Edit / Withdraw coming next)
                            </p>
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