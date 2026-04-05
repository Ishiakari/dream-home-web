'use client';
import { useState } from 'react';

export default function AccordionItem({ title, content }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between py-6 text-left transition-all"
        >
            {/* Title changes color when open to match your Blue theme */}
            <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-[#0F58BF]' : 'text-gray-900'}`}>
            {title}
            </span>
            
            {/* Animated Icon (Plus to Cross) */}
            <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            </div>
        </button>

        {/* Modern CSS height animation */}
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden text-gray-600 leading-relaxed">
            {content}
            </div>
        </div>
        </div>
    );
}