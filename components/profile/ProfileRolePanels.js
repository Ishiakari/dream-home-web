'use client'; // 🌟 NEW: Added because we are now using useState

import React, { useState } from 'react'; // 🌟 NEW: Imported useState
import Link from "next/link";
import { Building2, Home, KeyRound, Search } from "lucide-react";
import { getUserRoleFlags } from "@/lib/auth/roles";
import AddPropertyForm from "./AddPropertyForm"; // 🌟 NEW: Imported our form!

function RolePanel({ icon: Icon, title, description, items, primaryAction }) {
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

      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-blue-50/40 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        {/* 🌟 UPDATED: Checks if we should render a Button (for our form) or a Link (for normal pages) */}
        {primaryAction.onClick ? (
          <button
            onClick={primaryAction.onClick}
            className="inline-flex items-center rounded-lg bg-[#003580] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
          >
            {primaryAction.label}
          </button>
        ) : (
          <Link
            href={primaryAction.href}
            className="inline-flex items-center rounded-lg bg-[#003580] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
          >
            {primaryAction.label}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function ProfileRolePanels({ user }) {
  // 🌟 NEW: State to track if the Owner is actively adding a property
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const { isRenter, isOwner } = getUserRoleFlags(user?.role);

  // 🌟 NEW: If they are an Owner AND clicked the button, show the form!
  if (isOwner && isAddingProperty) {
    return (
      <div className="mt-4">
        <button 
          onClick={() => setIsAddingProperty(false)}
          className="mb-6 flex items-center gap-2 text-[#003580] font-semibold hover:underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
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
        <RolePanel
          icon={Building2}
          title="Owner Dashboard"
          description="Manage listings and tenant activity with confidence."
          items={[
            "Monitor published property listings",
            "Track tenant requests and occupancy",
            "Review lease lifecycle status",
          ]}
          // 🌟 UPDATED: Changed from `href` to `onClick` to trigger our state!
          primaryAction={{ onClick: () => setIsAddingProperty(true), label: "Add New Property" }}
        />
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