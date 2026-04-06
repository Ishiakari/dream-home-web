"use client";

import { BedDouble, Bath, CalendarDays, Home } from "lucide-react";

/**
 * PropertyOverview
 * Displays a compact summary row: Property Type, Year Built, Bathrooms, Bedrooms.
 * Matches the "Overview" section in the design.
 *
 * Props:
 *   propertyType  {string}  e.g. "Shared House"
 *   yearBuilt     {number}  e.g. 2015
 *   bathrooms     {number}  e.g. 3
 *   bedrooms      {number}  e.g. 6
 */
export default function PropertyOverview({ propertyType, yearBuilt, bathrooms, bedrooms }) {
  const items = [
    { icon: <Home className="h-4 w-4 text-gray-400" />, label: "Property Type", value: propertyType },
    { icon: <CalendarDays className="h-4 w-4 text-gray-400" />, label: "Year Built", value: yearBuilt },
    { icon: <Bath className="h-4 w-4 text-gray-400" />, label: "Bathrooms", value: bathrooms },
    { icon: <BedDouble className="h-4 w-4 text-gray-400" />, label: "Bedrooms", value: bedrooms },
  ];

  return (
    <section className="border border-gray-200 rounded-xl p-4 mb-4">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Overview</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ icon, label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              {icon} {label}
            </span>
            <span className="text-sm font-semibold text-gray-800">{value ?? "—"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
