"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * PropertyInquiryForm
 * The "Submit an Inquiry" panel showing the agent avatar, name, title,
 * and a contact form (Name, Email, Phone, Message).
 *
 * Props:
 *   agent  { name, title, avatarUrl }  Agent details to display at the top
 *   onSubmit  {(formData) => void}     Optional submit handler
 */
export default function PropertyInquiryForm({ agent, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Submit an Inquiry</h4>

      {/* Agent info */}
      {agent && (
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-200 shrink-0">
            {agent.avatarUrl ? (
              <Image src={agent.avatarUrl} alt={agent.name} fill className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-gray-500 font-bold text-sm">
                {agent.name?.[0] ?? "A"}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{agent.name}</p>
            <p className="text-xs text-gray-500">{agent.title}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {[
          { label: "Name", name: "name", type: "text", placeholder: "John Doe" },
          { label: "Email", name: "email", type: "email", placeholder: "you@email.com" },
          { label: "Phone (Optional)", name: "phone", type: "tel", placeholder: "+1 (234) 567-8900" },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            placeholder="Type your message..."
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
