"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function BetaAlert() {
    const [isVisible, setIsVisible] = useState(false);

useEffect(() => {

    const hasDismissed = localStorage.getItem("dreamhomeBetaDismissed");
    
    if (!hasDismissed) {
        setIsVisible(true);
        document.body.style.overflow = "hidden";
    }


    return () => {
        document.body.style.overflow = "unset";
    };
}, []);

const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("dreamhomeBetaDismissed", "true");
    document.body.style.overflow = "unset";
};

if (!isVisible) return null;

return (
    // Backdrop: Darkens and blurs the rest of the site
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        
        {/* Dialog Box */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-gray-900 text-lg">Beta Version</h3>
            </div>
            <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-700 focus:outline-none p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close dialog"
            >
                <X className="h-5 w-5" />
            </button>
            </div>

            {/* Content */}
            <div className="p-6">
            <p className="text-gray-600 text-sm leading-relaxed">
                Welcome to DreamHome! We're currently in beta. You might encounter a few bugs or unfinished features as we continue to improve the platform for everyone.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
                Thanks for exploring with us!
            </p>
            </div>

            {/* Footer / Actions */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
                onClick={handleDismiss}
                className="px-6 py-2.5 bg-[#E11553] hover:bg-[#C11246] text-white text-sm font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E11553]"
            >
                I Understand
            </button>
            </div>

        </div>
        </div>
    );
}