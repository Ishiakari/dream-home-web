"use client";

import { useState, useEffect } from "react";
import { X, User, Home } from "lucide-react";
import { registerClient } from "../../lib/authService"; 

// Reusable Input Component 
const FormInput = ({ label, type = "text", name, value, onChange, required = true, ...props }) => (
  <div className="w-full">  
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11553] outline-none transition-all"
      {...props}
    />
  </div>
);

export default function SignupDialog({ isOpen, onClose, onSwitchToLogin }) {
  const [activeRole, setActiveRole] = useState("renter");
  
  // Centralized form state for easy API submission
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    birthdate: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Payload ready for Django API:
    const payload = { ...formData, role: activeRole.toUpperCase() };
    console.log("Submitting to API:", payload);
    // TODO: Add your fetch/axios POST request here
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-gray-900 text-xl">Create an account</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Role Selector Tabs */}
          <div className="flex p-1 mb-6 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveRole("renter")}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${activeRole === "renter" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <User className="w-4 h-4 mr-2" /> Renter
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("owner")}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${activeRole === "owner" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Home className="w-4 h-4 mr-2" /> Owner
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            
            <FormInput label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} />
            <FormInput label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11553] outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select...</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                  <option value="P">Prefer not to say</option>
                </select>
              </div>
              <FormInput label="Birthdate" type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            </div>

            <FormInput label="Password" type="password" name="password" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} />

            <button type="submit" className="w-full py-3 bg-[#E11553] hover:bg-[#C11246] text-white font-semibold rounded-lg transition-colors mt-4">
              Create {activeRole} account
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 text-center text-sm text-gray-600 shrink-0 bg-gray-50">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} className="text-[#E11553] font-semibold hover:underline">
            Log in
          </button>
        </div>

      </div>
    </div>
  );
}