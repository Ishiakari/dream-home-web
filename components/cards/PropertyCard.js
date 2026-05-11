import { formatMoneyPHP } from '@/lib/formatMoney';
import Image from 'next/image';
import Link from 'next/link';

const STATUS_BADGE = {
    Available: { label: 'Available', className: 'bg-teal-600 text-white' },
    Rented: { label: 'Rented', className: 'bg-slate-500 text-white' },
    Withdrawn: { label: 'Withdrawn', className: 'bg-red-700   text-white' },
};

export default function PropertyCard({ property, onViewDetails }) {
    const Wrapper = onViewDetails ? 'div' : Link;
    const wrapperProps = onViewDetails 
        ? { onClick: onViewDetails, className: "block transition-transform hover:scale-105 cursor-pointer" }
        : { href: `/properties/house-listings/${property.id}`, className: "block transition-transform hover:scale-105 cursor-pointer" };

    return (
        <Wrapper {...wrapperProps}>
            <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                {/* Image Section */}
                <div className="relative h-48 w-full group overflow-hidden rounded-t-2xl">
                    {/* Status badge */}
                    {(() => {
                        const badge = STATUS_BADGE[property.status] ?? { label: property.status ?? 'For Rent', className: 'bg-[#0A4DA1] text-white' };
                        return (
                            <span className={`absolute top-4 right-4 z-10 px-4 py-1.5 rounded-md text-sm font-medium shadow-sm pointer-events-none ${badge.className}`}>
                                {badge.label}
                            </span>
                        );
                    })()}

                    <Image
                        src="/PlaceHolderProperties.jpg"
                        alt={`Property in ${property.city}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Hover Overlay */}
                    {onViewDetails && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onViewDetails();
                                }}
                                className="bg-white text-[#003580] px-6 py-2.5 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-gray-50"
                            >
                                View Details
                            </button>
                        </div>
                    )}
                </div>

                {/* Text Details */}
                <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {property.type} in {property.city}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4 truncate">
                        {property.street}, {property.postcode}
                    </p>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        {/* Left side */}
                        <div className="flex gap-4 text-gray-700 min-w-0 flex-wrap">
                            {/* Bed Icon & Rooms */}
                            <div className="flex items-center gap-1.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400"
                                >
                                    <path d="M2 4v16" />
                                    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                                    <path d="M2 17h20" />
                                    <path d="M6 8v9" />
                                </svg>
                                <span className="font-medium text-sm">{property.noOfRooms} bd</span>
                            </div>

                            {/* House Icon & Status */}
                            <div className="flex items-center gap-1.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-teal-600"
                                >
                                    <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span className="font-medium text-sm text-teal-600 whitespace-nowrap">
                                    {property.status}
                                </span>
                            </div>
                        </div>

                        {/* Price Tag */}
                        <div className="bg-blue-700 text-white font-bold text-sm md:text-base py-1.5 px-3 rounded-md shrink-0 whitespace-nowrap">
                            {formatMoneyPHP(property.monthlyRent)}
                        </div>
                    </div>

                </div>
            </div>
        </Wrapper>
    );
}