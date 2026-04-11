import React from 'react';

export const FormInput = ({ label, type = "text", name, value, onChange, required = true, ...props }) => (
  <div className="w-full">  
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      // 👇 ADDED text-gray-900 and bg-white right here!
      className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-[#E11553] outline-none transition-all"
      {...props}
    />
  </div>
);