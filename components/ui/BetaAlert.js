"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function BetaAlert() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasDismissed = localStorage.getItem("betaAlertDismissed");
        if (!hasDismissed) {
        setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("betaAlertDismissed", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md shadow-lg max-w-sm flex items-start space-x-3">
            
            {/* Warning Icon */}
            <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            </div>
            
            {/* Alert Content */}
            <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-800">
                DreamHome Beta
            </h3>
            <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                Welcome! We are still in active development. You might encounter a few bugs or unfinished features as we polish the experience.
            </p>
            </div>
            
            {/* Close Button */}
            <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-auto text-amber-500 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 rounded-md p-1 transition-colors"
            aria-label="Dismiss"
            >
            <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
            
        </div>
        </div>
    );
}