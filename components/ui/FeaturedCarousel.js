'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import PropertyCard from '../cards/PropertyCard';

export default function FeaturedCarousel({ properties, onPropertyClick }) {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    if (!properties || properties.length === 0) {
        return <p className="text-sm text-slate-600">No featured properties available.</p>;
    }

    return (
        <div className="relative w-full group/carousel py-4">
            {/* Left Button */}
            <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-10 p-3 rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-[#003580] hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:block"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide pb-8 px-4 -mx-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {properties.map((p, idx) => {
                    const key = p.property_no ?? p.id ?? `feat-${idx}`;
                    const cardProperty = {
                        id: p.property_no ?? p.id,
                        type: p.property_type,
                        city: p.city,
                        street: p.street,
                        postcode: p.postcode,
                        noOfRooms: p.no_of_rooms,
                        status: p.status,
                        monthlyRent: p.monthly_rent,
                    };

                    return (
                        <div
                            key={key}
                            className="min-w-[240px] md:min-w-[260px] max-w-[260px] snap-center shrink-0"
                        >
                            <PropertyCard
                                property={cardProperty}
                                onViewDetails={() => onPropertyClick(p)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Right Button */}
            <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-10 p-3 rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-[#003580] hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:block"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>
            
            {/* Hide scrollbar styling via injected css */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
