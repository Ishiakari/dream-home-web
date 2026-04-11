'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, X, Save, Loader2 } from 'lucide-react';
import { apiClient, toApiErrorMessage } from '@/lib/apiClient'; 
import { useAuth } from '@/hooks/useAuth';
import { readAuthSession, saveAuthSession } from '@/lib/auth/session';

export default function ProfileSettingsForm({ user, onCancel }) {
    // 🌟 Using the hook to get the smart token fetcher
    const { getValidAccessToken } = useAuth(); 
    const [isLoading, setIsLoading] = useState(false);

    // Initial form state from the 'user' prop
    const [formData, setFormData] = useState({
        first_name: user?.firstName || "",
        last_name: user?.lastName || "",
        email: user?.email || "",
        telephone_no: user?.telephoneNo || "",
        address: user?.address || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 🔍 1. Get a valid (and automatically refreshed) token
            const token = await getValidAccessToken();

            if (!token) {
                alert("❌ Session expired. Please sign out and sign back in.");
                setIsLoading(false);
                return;
            }

            // 🌟 2. Send the update to Django. 
            // We save the response because it now contains the FRESH tokens!
            const response = await apiClient.put('/users/me/', {
                data: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    telephone_no: formData.telephone_no,
                    address: formData.address,
                },
                token: token 
            });

            // 🌟 3. Update the local session with the NEW tokens and data
            // This ensures that even if you refresh, the "baked-in" token data is new.
            const currentSession = readAuthSession();
            if (currentSession && response.tokens) {
                saveAuthSession({
                    ...currentSession, 
                    accessToken: response.tokens.access,    // Fresh access token from Django
                    refreshToken: response.tokens.refresh,  // Fresh refresh token from Django
                    user: {
                        ...currentSession.user, 
                        firstName: formData.first_name,
                        lastName: formData.last_name,
                        fullName: `${formData.first_name} ${formData.last_name}`.trim(),
                        email: formData.email,
                        telephoneNo: formData.telephone_no,
                        address: formData.address,
                    }
                });
            }

            alert("🎉 Profile updated successfully!");
            
            // 4. Close the modal/form
            if (onCancel) onCancel(); 

        } catch (error) {
            const message = toApiErrorMessage(error);
            console.error("Technical Details:", error.details || error);
            
            if (error.status === 401) {
                alert("❌ Session expired. Please log out and log back in.");
            } else {
                alert(`❌ ${message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/30 focus:bg-white focus:ring-2 focus:ring-[#003580] outline-none transition-all text-sm";

    return (
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-[#003580]">Edit Personal Details</h2>
                    <p className="text-sm text-gray-500">Update your contact and account information.</p>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition hover:text-red-500">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input name="first_name" value={formData.first_name} onChange={handleChange} className={inputClass} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input name="last_name" value={formData.last_name} onChange={handleChange} className={inputClass} required />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input name="email" value={formData.email} onChange={handleChange} className={inputClass} type="email" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">Telephone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input name="telephone_no" value={formData.telephone_no} onChange={handleChange} className={inputClass} required />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">Street Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input name="address" value={formData.address} onChange={handleChange} className={inputClass} required />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        disabled={isLoading}
                        className="px-5 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-[#003580] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#002a66] transition disabled:bg-blue-300"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}