"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, toApiErrorMessage } from "@/lib/apiClient";

/**
 * PropertyInquiryForm
 * "Request a Viewing" panel rendered inside PropertyDialog and the property detail page.
 *
 * Props:
 *   agent       { name, title, avatarUrl }  Agent/team info shown at the top
 *   propertyId  string                      The property_no to book the viewing for
 */
export default function PropertyInquiryForm({ agent, propertyId }) {
  const { user, isAuthenticated, isLoading, getValidAccessToken } = useAuth();

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [viewDate, setViewDate] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!viewDate) {
      setErrorMsg("Please select a date for your viewing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getValidAccessToken();
      if (!token) {
        setErrorMsg("Session expired. Please sign in again.");
        return;
      }

      // POST /api/properties/viewings/
      // Backend expects: property_no, view_date, comments
      await apiClient.post("properties/viewings/", {
        token,
        data: {
          property_no: propertyId,
          view_date: viewDate,
          comments: comments.trim() || null,
        },
      });

      setSuccessMsg("Your viewing request has been submitted! We'll be in touch shortly.");
      setViewDate("");
      setComments("");
    } catch (err) {
      setErrorMsg(toApiErrorMessage(err, "Failed to submit request. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOADING (auth check) ---
  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 animate-pulse space-y-3">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-10 rounded bg-gray-200" />
        <div className="h-10 rounded bg-gray-200" />
        <div className="h-10 rounded bg-gray-200" />
      </div>
    );
  }

  // --- NOT LOGGED IN ---
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center gap-3">
        <div className="rounded-full bg-blue-100 p-3">
          <LogIn className="h-6 w-6 text-[#003580]" />
        </div>
        <p className="text-sm font-semibold text-gray-800">Want to schedule a viewing?</p>
        <p className="text-xs text-gray-500">
          Sign in to your renter account to request a viewing for this property.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
          className="w-full py-2 bg-[#003580] hover:bg-[#002a66] text-white text-sm font-semibold rounded-lg transition text-center"
        >
          Sign in to Request a Viewing
        </Link>
      </div>
    );
  }

  // --- SUCCESS STATE ---
  if (successMsg) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <p className="text-sm font-semibold text-green-800">Viewing Request Sent!</p>
        <p className="text-xs text-green-700">{successMsg}</p>
        <button
          onClick={() => setSuccessMsg("")}
          className="text-xs text-green-700 underline hover:no-underline"
        >
          Request another date
        </button>
      </div>
    );
  }

  // --- LOGGED IN FORM ---
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      {/* Agent / team info */}
      {agent && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003580] text-white text-sm font-bold shrink-0">
            {agent.name?.[0] ?? "D"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{agent.name}</p>
            <p className="text-xs text-gray-500">{agent.title}</p>
          </div>
        </div>
      )}

      <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4 text-[#003580]" />
        Request a Viewing
      </h4>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Viewing date */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={today}
            value={viewDate}
            onChange={(e) => setViewDate(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Notes / Comments <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            placeholder="e.g. preferred time of day, accessibility needs..."
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none transition"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-xs text-red-600 rounded-lg bg-red-50 px-3 py-2">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-[#003580] hover:bg-[#002a66] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
        >
          {isSubmitting ? "Submitting..." : "Submit Viewing Request"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Submitting as <span className="font-medium text-gray-600">{user?.firstName || user?.fullName || "you"}</span>
        </p>
      </form>
    </div>
  );
}
