"use client";

/**
 * PropertyDescription
 * A simple text block for the property's long-form description.
 *
 * Props:
 *   text  {string}  The full description copy
 */
export default function PropertyDescription({ text }) {
  if (!text) return null;

  return (
    <section className="border border-gray-200 rounded-xl p-4 mb-4">
      <h4 className="text-sm font-bold text-gray-800 mb-2">Description</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </section>
  );
}
