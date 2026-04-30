import React from 'react';
import Image from 'next/image';

export default function HeroPropertyCard({
    title = 'Comfortable Villa Green',
    location = 'London, NW2',
    price = '£1,200',
    rooms = 4,
    bathrooms = 2,
    status = 'For Sale',
    tag = 'Featured',
    imageSrc = '/PlaceHolderPic.png',
    onViewDetails, // ✅ NEW
    }) {
    return (
        <div
        onClick={onViewDetails} // ✅ NEW: click anywhere opens details
        role={onViewDetails ? 'button' : undefined}
        tabIndex={onViewDetails ? 0 : undefined}
        onKeyDown={(e) => {
            if (!onViewDetails) return;
            if (e.key === 'Enter' || e.key === ' ') onViewDetails();
        }}
        className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer w-full"
        >
        <div className="relative h-[380px] md:h-[480px] w-full">
            <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        </div>

        {/* Badges */}
        <div className="absolute top-6 left-6 flex gap-2">
            <span className="bg-[#003580] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
            {status}
            </span>
            <span className="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow">
            ★ {tag}
            </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{title}</h2>
            <p className="text-white/75 text-sm">
                {location} · {rooms} rooms · {bathrooms} bath
            </p>
            </div>
            <div className="shrink-0 text-right">
            <p className="text-white/60 text-xs">Monthly from</p>
            <p className="text-2xl font-extrabold text-white">{price}</p>
            </div>
        </div>
        </div>
    );
}