'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient'; 
import { useAuth } from '@/hooks/useAuth'; 

export default function AddPropertyForm() {
    const { getValidAccessToken, status } = useAuth(); 

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        street: '',
        area: '',
        city: '',
        postcode: '',
        property_type: 'Flat',
        no_of_rooms: '',
        monthly_rent: '',
        branch: '', 
    });

    const [branches, setBranches] = useState([]);
    const [isLoadingBranches, setIsLoadingBranches] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [branchError, setBranchError] = useState("");

    useEffect(() => {
        async function loadBranches() {
            try {
                setIsLoadingBranches(true);
                const activeToken = await getValidAccessToken();
                
                if (!activeToken) {
                    setBranchError("Session expired. Please sign in again.");
                    return;
                }

                const data = await apiClient.get('branches/', { token: activeToken }); 
                setBranches(data);
                
                if (data && data.length > 0) {
                    setFormData(prev => ({ ...prev, branch: data[0].branch_no || data[0].id }));
                }
            } catch (err) {
                console.error("Branch Load Error:", err);
                setBranchError("Could not load branches.");
            } finally {
                setIsLoadingBranches(false);
            }
        }

        if (status === "authenticated") {
            loadBranches();
        }
    }, [getValidAccessToken, status]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const activeToken = await getValidAccessToken();
            
            // 🌟 Ensure numbers are formatted correctly for Django
            const submissionData = {
                ...formData,
                no_of_rooms: parseInt(formData.no_of_rooms, 10),
                monthly_rent: parseFloat(formData.monthly_rent),
            };

            // 🌟 FIXED URL: Changed 'properties/create/' to 'properties/' 
            // to match your path("", views.PropertyForRentListCreateView...)
            await apiClient.post('properties/', { 
                data: submissionData,
                token: activeToken 
            });

            alert("🎉 Property added to database successfully!");
            
            // Reset form on success
            setFormData({
                title: '', description: '', street: '', area: '', city: '', 
                postcode: '', property_type: 'Flat', no_of_rooms: '', 
                monthly_rent: '', branch: branches[0]?.branch_no || branches[0]?.id || ''
            });

        } catch (err) {
            console.error("Submit Error:", err);
            alert(err.message || "Failed to save property. Please check all fields.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 max-w-4xl mx-auto"
        >
            <div className="mb-8 border-b border-slate-100 pb-6">
                <h2 className="text-2xl font-bold text-[#003580]">List a New Property</h2>
                <p className="text-slate-500 mt-1">Fill out the details below to add a property to your portfolio.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="bg-blue-50 text-[#003580] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        Rent & Type
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Stunning 2-Bed Flat" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003580] outline-none transition text-gray-900 bg-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                            <select name="property_type" value={formData.property_type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003580] outline-none transition bg-white text-gray-900">
                                <option value="Flat">Flat</option>
                                <option value="House">House</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (£)</label>
                            <input type="number" step="0.01" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003580] outline-none transition text-gray-900 bg-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms</label>
                            <input type="number" name="no_of_rooms" value={formData.no_of_rooms} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003580] outline-none transition text-gray-900 bg-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Managing Branch</label>
                            <select 
                                name="branch" 
                                value={formData.branch} 
                                onChange={handleChange} 
                                disabled={isLoadingBranches}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#003580] outline-none transition bg-white text-gray-900 disabled:bg-gray-100"
                            >
                                {isLoadingBranches ? (
                                    <option value="">Loading branches...</option>
                                ) : branchError ? (
                                    <option value="">{branchError}</option>
                                ) : (
                                    branches.map((b) => (
                                        <option key={b.branch_no || b.id} value={b.branch_no || b.id}>
                                            {`${b.street || ''}${b.street && b.area ? ', ' : ''}${b.area || ''}` || b.city || `Branch ${b.branch_no || b.id}`}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Location */}
                <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="bg-blue-50 text-[#003580] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" name="street" value={formData.street} onChange={handleChange} required placeholder="Street" className="px-4 py-3 rounded-xl border border-slate-200 text-gray-900 bg-white" />
                        <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Barangay / Area" className="px-4 py-3 rounded-xl border border-slate-200 text-gray-900 bg-white" />
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="City" className="px-4 py-3 rounded-xl border border-slate-200 text-gray-900 bg-white" />
                        <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} required placeholder="Postcode" className="px-4 py-3 rounded-xl border border-slate-200 text-gray-900 bg-white" />
                    </div>
                </div>

                {/* Section 3: Description */}
                <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="bg-blue-50 text-[#003580] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                        Description
                    </h3>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        rows="4" 
                        placeholder="Tell us more about the property..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-[#003580]"
                    ></textarea>
                </div>

                <div className="pt-8 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-[#003580] hover:bg-[#002a6e] text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Saving..." : "Save Property to Database"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}