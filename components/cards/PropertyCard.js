import Image from 'next/image';
import Link from 'next/link';

export default function PropertyCard({ property }) {
    return (
        <Link href={`/house-listings/${property.id}`} className="block transition-transform hover:scale-105">
        <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 cursor-pointer">
            
            {/* Image Section */}
            <div className="relative h-56 w-full">
                
            {/* --- LABEL HEHE --- */}
                <span className="absolute top-4 right-4 z-10 bg-[#0A4DA1] text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-sm pointer-events-none">
                      {property.monthlyRent > 1000 ? "For sale" : "For rent"} 
                </span>
            {/* ------------------------- */}
            <Image 
                src="/PlaceHolderPic.png" 
                alt={`Property in ${property.city}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
            />
            </div>

            {/* Text Details */}
            <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {property.type} in {property.city}
            </h2>
            <p className="text-gray-500 text-base mb-6">
                {property.street}, {property.postcode}
            </p>

            {/* Bottom Row */}
            <div className="flex justify-between items-center">
                <div className="flex gap-4 text-gray-700">
                
                {/* Bed Icon & Rooms */}
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <path d="M2 4v16"/>
                        <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
                        <path d="M2 17h20"/>
                        <path d="M6 8v9"/>
                    </svg>
                    <span className="font-medium text-lg">{property.noOfRooms}</span>
                </div>
                
                {/* House Icon & Status */}
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="font-medium text-lg text-green-600">{property.status}</span>
                </div>

                </div>

                {/* Price Tag */}
                <div className="bg-blue-700 text-white font-bold text-lg py-2 px-5 rounded-md">
                £{property.monthlyRent}
                </div>
            </div>
            </div>
        </div>
        </Link>
    );
}