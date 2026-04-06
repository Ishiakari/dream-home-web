"use client";

import { MapPin } from "lucide-react";

/**
 * PropertyDialogHeader
 * Renders the top section of the property dialog:
 *   - Title (e.g. "Light and Modern House")
 *   - Location tag
 *   - Badge tags (e.g. "Active", "Featured")
 *   - Monthly rental price (top-right)
 *
 * Props:
 *   title      {string}   Property title
 *   location   {string}   Location string, e.g. "Austin, TX"
 *   price      {string}   e.g. "$4,500/mo"
 *   tags       {string[]} Optional badge labels, e.g. ["Active", "Featured"]
 */
export default function PropertyDialogHeader({ title, location, price, tags = [] }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      {/* Left: title + location + tags */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>

        {location && (
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{location}</span>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: price */}
      {price && (
        <p className="text-xl font-bold text-gray-900 whitespace-nowrap shrink-0">{price}</p>
      )}
    </div>
  );
}
