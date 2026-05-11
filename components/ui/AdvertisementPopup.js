"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const STORAGE_KEY = "dh_ad_popup_count";
const MAX_SHOWS = 2;

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const isWithinDateRange = (ad, today) => {
  const start = ad?.start_date;
  const end = ad?.end_date;

  if (start && today < start) return false;
  if (end && today > end) return false;
  return true;
};

export default function AdvertisementPopup() {
  const [ad, setAd] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    let isMounted = true;

    const loadAd = async () => {
      try {
        const data = await apiClient.get("properties/adverts/");
        const list = normalizeList(data);
        const today = new Date().toISOString().split("T")[0];

        const candidates = list
          .filter((item) => {
            const status = String(item?.status || "").toLowerCase();
            const placement = String(item?.placement || "").toLowerCase();

            return (
              status === "active" &&
              placement === "popup" &&
              isWithinDateRange(item, today)
            );
          })
          .sort((a, b) => Number(b?.priority || 0) - Number(a?.priority || 0));

        if (!candidates.length) return;

        const shownCount = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
        if (shownCount >= MAX_SHOWS) return;

        if (!isMounted) return;

        setAd(candidates[0]);
        setIsOpen(true);
        sessionStorage.setItem(STORAGE_KEY, String(shownCount + 1));
      } catch {
        // No-op: fail silently for marketing popup
      }
    };

    loadAd();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen || !ad) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-label="Close advertisement"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f3f6ff] via-white to-[#fef3f2]" />
        <div className="relative flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003580]">
                DreamHome Spotlight
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                {ad?.title || "DreamHome Update"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Dismiss advertisement"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <Image
              src="/PlaceHolderProperties.jpg"
              alt="Advertisement"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            {ad?.message || "New listings and offers are waiting for you."}
          </p>

          {ad?.property_no ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Property: {ad.property_no}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
