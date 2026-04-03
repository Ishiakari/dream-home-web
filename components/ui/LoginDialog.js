"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { loginClient } from "../../lib/authService";
import { useRouter } from "next/navigation";

// Reusable Input Component (Placeholder prop removed)
const FormInput = ({ label, type = "text", name, value, onChange, required = true }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11553] focus:border-[#E11553] outline-none transition-all"
    />
  </div>
);

export default function LoginDialog({ isOpen, onClose, onSwitchToSignup }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Reset error when dialog reopens
  useEffect(() => {
    if (!isOpen) setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginClient(credentials.email, credentials.password);
      // Tokens are stored in localStorage by loginClient
      onClose();
      // Optionally reload to update UI with logged-in state
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-xl">Welcome back</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput 
              label="Email address" 
              type="email" 
              name="email" 
              value={credentials.email} 
              onChange={handleChange} 
            />
            
            <FormInput 
              label="Password" 
              type="password" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
            />
            
            <div className="flex justify-end">
              <a href="#" className="text-sm text-[#E11553] hover:underline">Forgot password?</a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-[#E11553] hover:bg-[#C11246] text-white font-semibold rounded-lg transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitchToSignup} className="text-[#E11553] font-semibold hover:underline">
            Sign up
          </button>
        </div>

      </div>
    </div>
  );
}
