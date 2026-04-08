"use client";

import { CheckCircle2 } from "lucide-react";

/**
 * PropertyFeatures
 * Shows the "Features" grid of amenities with a blue checkmark per item.
 *
 * Props:
 *   features  {string[]}  Array of feature strings,
 *                         e.g. ["Air Conditioning", "Shared gym", "TV Cable"]
 */
export default function PropertyFeatures({ features = [] }) {
  if (!features.length) return null;

  return (
    <section className="border border-gray-200 rounded-xl p-4">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Features</h4>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
