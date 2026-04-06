"use client";

/**
 * PropertyAddress
 * Renders the "Address" section: street, zip/postal code, city, and area.
 *
 * Props:
 *   address    {string}  Street address, e.g. "7409 Knollwood Cove, 78731"
 *   zip        {string}  Zip / Postal code, e.g. "78731"
 *   city       {string}  City, e.g. "Austin"
 *   area       {string}  Area / neighbourhood, e.g. "Knollwood"
 */
export default function PropertyAddress({ address, zip, city, area }) {
  const rows = [
    { left: { label: "Address", value: address }, right: { label: "Zip/Postal Code", value: zip } },
    { left: { label: "City", value: city }, right: { label: "Area", value: area } },
  ];

  return (
    <section className="border border-gray-200 rounded-xl p-4 mb-4">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Address</h4>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <LabelValue {...row.left} />
            <LabelValue {...row.right} />
          </div>
        ))}
      </div>
    </section>
  );
}

function LabelValue({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value ?? "—"}</p>
    </div>
  );
}
