"use client";

/**
 * PropertyDetails
 * Shows the "Details" block: Property ID, Property Type, Bedrooms, Property Status.
 *
 * Props:
 *   propertyId    {string}  e.g. "MT1651674"
 *   propertyType  {string}  e.g. "Shared House"
 *   bedrooms      {number}  e.g. 6
 *   status        {string}  e.g. "For Rent"
 */
export default function PropertyDetails({ propertyId, propertyType, bedrooms, status }) {
  const items = [
    { label: "Property ID", value: propertyId },
    { label: "Property Type:", value: propertyType },
    { label: "Bedrooms", value: bedrooms },
  ];

  return (
    <section className="border border-gray-200 rounded-xl p-4 mb-4">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Details</h4>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {/* Left column items */}
        <div className="space-y-3">
          {items.map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-semibold text-gray-800">{value ?? "—"}</p>
            </div>
          ))}
        </div>

        {/* Right column: Property Status */}
        <div>
          <p className="text-xs text-gray-500">Property Status</p>
          <span
            className={`inline-block mt-0.5 text-sm font-semibold ${
              status?.toLowerCase() === "for rent"
                ? "text-blue-700"
                : status?.toLowerCase() === "for sale"
                ? "text-green-700"
                : "text-gray-800"
            }`}
          >
            {status ?? "—"}
          </span>
        </div>
      </div>
    </section>
  );
}
