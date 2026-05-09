'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MessageSquare, Home, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';

/**
 * RenterViewingsPanel
 * Displays the authenticated renter's list of scheduled/past property viewings.
 * Fetches from GET /api/properties/viewings/my/
 */
export default function RenterViewingsPanel() {
  const { getValidAccessToken, status } = useAuth();
  const [viewings, setViewings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchMyViewings() {
      if (status !== 'authenticated') return;

      setIsLoading(true);
      setErrorMsg('');

      try {
        const token = await getValidAccessToken();
        if (!token) {
          setErrorMsg('Session expired. Please sign in again.');
          return;
        }

        const data = await apiClient.get('properties/viewings/my/', { token });

        // Normalize: API may return array or { results: [] }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setViewings(list);
      } catch (err) {
        console.error('Failed to fetch viewings:', err);
        setErrorMsg('Could not load your viewings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyViewings();
  }, [getValidAccessToken, status]);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-blue-100/60" />
        ))}
      </div>
    );
  }

  // --- ERROR STATE ---
  if (errorMsg) {
    return (
      <p className="text-sm text-red-600 rounded-lg bg-red-50 px-3 py-2">{errorMsg}</p>
    );
  }

  // --- EMPTY STATE ---
  if (viewings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/30 px-4 py-8 text-center">
        <Search className="mx-auto mb-3 h-8 w-8 text-blue-300" />
        <p className="text-sm font-semibold text-gray-700">No viewings scheduled yet.</p>
        <p className="mt-1 text-xs text-gray-500">
          Browse properties and request a viewing to get started.
        </p>
        <Link
          href="/properties/house-listings"
          className="mt-4 inline-flex items-center rounded-lg bg-[#003580] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  // --- VIEWING CARDS ---
  return (
    <div className="space-y-3">
      {viewings.map((viewing, idx) => {
        const propertyId =
          viewing.property_no?.property_no ||
          viewing.property_no ||
          'N/A';

        const propertyTitle =
          viewing.property_no?.title ||
          viewing.property_no?.street ||
          propertyId;

        const viewDate = viewing.view_date
          ? new Date(viewing.view_date).toLocaleDateString('en-PH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Date not set';

        const comments = viewing.comments || null;

        return (
          <div
            key={viewing.id ?? idx}
            className="rounded-xl border border-blue-100 bg-blue-50/30 px-4 py-3"
          >
            {/* Property info row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Home className="h-4 w-4 shrink-0 text-[#003580]" />
                <p className="text-sm font-semibold text-[#003580] truncate">
                  {propertyTitle}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-white border border-blue-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                {propertyId}
              </span>
            </div>

            {/* Date row */}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span>{viewDate}</span>
            </div>

            {/* Comments row */}
            {comments && (
              <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-400" />
                <span className="italic">"{comments}"</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
