'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from "next/link";
import { Building2, Home, KeyRound, Search } from "lucide-react";
import { getUserRoleFlags } from "@/lib/auth/roles";
import AddPropertyForm from "./AddPropertyForm";

import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";



function RolePanel({ icon: Icon, title, description, items = [], primaryAction, children }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#003580]">{title}</h2>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <div className="rounded-full bg-[#003580]/10 p-2 text-[#003580]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {items.map((item) => (
            <li key={item} className="rounded-lg bg-blue-50/40 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}

      <div className="mt-4">
        {primaryAction?.onClick ? (
          <button
            onClick={primaryAction.onClick}
            className="inline-flex items-center rounded-lg bg-[#003580] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
          >
            {primaryAction.label}
          </button>
        ) : primaryAction?.href ? (
          <Link
            href={primaryAction.href}
            className="inline-flex items-center rounded-lg bg-[#003580] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
          >
            {primaryAction.label}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export default function ProfileRolePanels({ user }) {
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const { isRenter, isOwner } = getUserRoleFlags(user?.role);

  const { getValidAccessToken, status } = useAuth();

  const [ownerProperties, setOwnerProperties] = useState([]);
  const [isLoadingOwnerProperties, setIsLoadingOwnerProperties] = useState(false);
  const [ownerPropertiesError, setOwnerPropertiesError] = useState("");

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
  useEffect(() => {
  console.log("AUTH USER (ProfileRolePanels):", user);
}, [user]);
  useEffect(() => {
    async function loadOwnerProperties() {
      if (!isOwner) return;
      if (status !== "authenticated") return;

      setIsLoadingOwnerProperties(true);
      setOwnerPropertiesError("");

      try {
        const token = await getValidAccessToken();
        if (!token) {
          setOwnerPropertiesError("Session expired. Please sign in again.");
          setOwnerProperties([]);
          return;
        }

        const data = await apiClient.get("properties/", { token });
        const list = normalizeList(data);

        // ✅ DEBUG (temporary): tells us why old properties are not showing
        console.log("DEBUG ownerId from user =", ownerId);
        console.log("DEBUG total properties from API =", list.length);
        console.log("DEBUG first 5 owner fields =", list.slice(0, 5).map((p) => p.owner));

        const filtered = ownerId
          ? list.filter((prop) => {
              const ownerField = prop?.owner;

              // owner might be "CO001" OR a URL OR {client_no:"CO001"} etc.
              if (typeof ownerField === "string") {
                return ownerField === ownerId || ownerField.includes(ownerId);
              }

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

        setOwnerProperties(filtered);
      } catch (err) {
        console.error("Owner properties load error:", err);
        setOwnerPropertiesError("Could not load your property listings.");
        setOwnerProperties([]);
      } finally {
        setIsLoadingOwnerProperties(false);
      }
    }

    loadOwnerProperties();
  }, [getValidAccessToken, isOwner, ownerId, status]);

  // OWNER ADD PROPERTY VIEW
  if (isOwner && isAddingProperty) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setIsAddingProperty(false)}
          className="mb-6 flex items-center gap-2 text-[#003580] font-semibold hover:underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        <AddPropertyForm />
      </div>
    );
  }

  // STANDARD DASHBOARD VIEW
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {isRenter ? (
        <RolePanel
          icon={Search}
          title="Renter Dashboard"
          description="Track and manage your renting journey in one place."
          items={[
            "Review saved property searches",
            "Track active viewing requests",
            "Monitor application and lease progress",
          ]}
          primaryAction={{ href: "/properties", label: "Browse Properties" }}
        />
      ) : null}

      {isOwner ? (
        <>
          <RolePanel
            icon={Building2}
            title="Owner Dashboard"
            description="Manage listings and tenant activity with confidence."
            items={[
              "Monitor published property listings",
              "Track tenant requests and occupancy",
              "Review lease lifecycle status",
            ]}
            primaryAction={{ onClick: () => setIsAddingProperty(true), label: "Add New Property" }}
          />

          <RolePanel
            icon={Building2}
            title="My Listings"
            description="Your properties currently registered in DreamHome."
            items={[]}
            primaryAction={{ href: "/profile/listings", label: "Manage Listings" }}
          >
            {isLoadingOwnerProperties ? (
              <p className="text-sm text-gray-600">Loading your listings...</p>
            ) : ownerPropertiesError ? (
              <p className="text-sm text-red-600">{ownerPropertiesError}</p>
            ) : ownerProperties.length === 0 ? (
              <p className="text-sm text-gray-600">
                You don’t have any properties listed yet. Click <strong>Add New Property</strong> to create one.
              </p>
            ) : (
              <div className="space-y-3">
                {ownerProperties.slice(0, 5).map((prop) => {
                  const id = prop.property_no || prop.id || "N/A";
                  const title = prop.title || "Untitled property";
                  const location = [prop.street, prop.city].filter(Boolean).join(", ");
                  const rent = prop.monthly_rent ?? prop.monthlyRent;
                  const statusText = prop.status || "Unknown";

                  return (
                    <div
                      key={id}
                      className="rounded-xl border border-blue-100 bg-blue-50/30 px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#003580]">
                            {id} — {title}
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            {location || "No address provided"}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#003580] border border-blue-100">
                          {statusText}
                        </span>
                      </div>

                      {rent !== undefined && rent !== null ? (
                        <p className="mt-2 text-xs text-gray-700">
                          Monthly Rent: <span className="font-semibold">£{rent}</span>
                        </p>
                      ) : null}
                    </div>
                  );
                })}

                {ownerProperties.length > 5 ? (
                  <p className="text-xs text-gray-500">
                    Showing 5 of {ownerProperties.length} listings.
                  </p>
                ) : null}
              </div>
            )}
          </RolePanel>
        </>
      ) : null}

      {!isRenter && !isOwner ? (
        <RolePanel
          icon={KeyRound}
          title="Profile Dashboard"
          description="Your account is active. Role-specific features appear once roles are assigned."
          items={[
            "Keep your profile details up to date",
            "Check account status and notifications",
            "Contact support for role adjustments",
          ]}
          primaryAction={{ href: "/about/contact-support", label: "Contact Support" }}
        />
      ) : null}

      {isRenter && isOwner ? (
        <article className="rounded-2xl border border-amber-100 bg-amber-50 p-5 lg:col-span-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <Home className="h-4 w-4" />
            Dual-role account detected: renter and owner tools are both available.
          </p>
        </article>
      ) : null}
    </section>
  );
}