"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const STORAGE_KEY = "dreamhome_beta_alert_dismissed_v1";

export default function BetaAlert() {
  // Start hidden until we check localStorage (prevents flash)
  const [isVisible, setIsVisible] = useState(false);

  // On mount: decide visibility once
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY) === "1";
      setIsVisible(!dismissed);
    } catch {
      // If storage blocked, just show it
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setIsVisible(false);
  };

  // Lock scroll while open
  useEffect(() => {
    if (!isVisible) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow || "unset";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Beta Version Notice"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-gray-900 text-lg">Beta Version</h3>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            onTouchStart={handleDismiss}
            className="text-gray-400 hover:text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            Welcome to DreamHome! We're currently in beta. You might encounter a
            few bugs or unfinished features as we continue to improve the
            platform for everyone.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mt-3">
            Thanks for exploring with us!
          </p>
        </div>

        <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={handleDismiss}
            onTouchStart={handleDismiss}
            className="px-6 py-2.5 bg-[#E11553] hover:bg-[#C11246] text-white text-sm font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E11553]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}