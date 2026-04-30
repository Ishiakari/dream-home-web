import React from 'react';
import Image from 'next/image';

export default function HorizontalPropertyCard({ 
    propertyNo = "P001",
    imageSrc = "/PlaceHolderPic.png", 
    price = "850",
    title = "Modern Flat in City Centre",
    address = "123 High Street, Glasgow",
    rooms = 4,
    propertyType = "Flat",
    status = "Available",
    onViewDetails // <--- 1. ADD THIS PROP HERE
}) {
    return (
        <div className="group bg-[#0F58BF]/[0.08] border border-[#0F58BF]/20 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row h-auto sm:h-56 cursor-pointer">
        
        {/* LEFT SIDE: Image Container */}
        <div className="relative w-full sm:w-2/5 h-48 sm:h-full overflow-hidden shrink-0 bg-slate-200">
            <Image 
                src={imageSrc} 
                alt={title} 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-[#0F58BF] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {status}
            </div>
        </div>

        {/* RIGHT SIDE: Property Details */}
        <div className="p-5 flex flex-col justify-between w-full">
            
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-2xl font-bold text-slate-900">
                        ₱{price} <span className="text-sm font-medium text-slate-500">/ month</span>
                    </h3>
                    <button className="text-slate-400 hover:text-red-500 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
                <h4 className="text-lg font-semibold text-slate-800 line-clamp-1">{title}</h4>
                <p className="text-sm text-slate-600 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-[#0F58BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {address}
                </p>
            </div>

            <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-4 mt-auto">
                <div className="flex items-center gap-4 text-slate-700 text-sm font-medium">
                    <div className="flex items-center gap-1 bg-white border border-[#0F58BF]/10 text-[#0F58BF] px-3 py-1 rounded-md shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {propertyType}
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#0F58BF]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8" />
                        </svg>
                        <span className="font-bold">{rooms}</span> Rooms
                    </div>
                </div>
                
                {/* 2. ADD THE ONCLICK HANDLER TO THE BUTTON HERE */}
                <button 
                    onClick={onViewDetails}
                    className="bg-[#0F58BF] hover:bg-[#0d4ea8] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 w-full xl:w-auto shadow-sm"
                >
                    View Details
                </button>
            </div>
        </div>
    </div>
    );
}