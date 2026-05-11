// app/properties/house-listings/[id]/page.js
import { formatMoneyPHP } from '@/lib/formatMoney';

async function getPropertyData(id) {
    // Replace with your actual Django API endpoint
    // Example: http://127.0.0.1:8000/api/properties/1/
    const res = await fetch(`http://127.0.0.1:8000/api/properties/${id}/`, {
        cache: 'no-store' // Use this to ensure you get fresh data
    });

    if (!res.ok) {
        throw new Error('Failed to fetch property');
    }

    return res.json();
}

import PropertyDialogHeader from "@/components/cards/property/PropertyDialogHeader";
import PropertyImageGallery from "@/components/cards/property/PropertyImageGallery";
import PropertyInquiryForm from "@/components/cards/property/PropertyInquiryForm";
import PropertyOverview from "@/components/cards/property/PropertyOverview";
import PropertyAddress from "@/components/cards/property/PropertyAddress";
import PropertyDescription from "@/components/cards/property/PropertyDescription";
import PropertyDetails from "@/components/cards/property/PropertyDetails";
import PropertyFeatures from "@/components/cards/property/PropertyFeatures";

export default async function PropertyDetailPage({ params }) {
    const { id } = await params;
    const property = await getPropertyData(id);

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Top section: two-column layout on larger screens */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Left: header + gallery */}
                <div className="flex-1 min-w-0">
                    <PropertyDialogHeader
                        title={property.title || `${property.property_type || property.type} in ${property.city}`}
                        location={`${property.city}, ${property.postcode}`}
                        price={`${formatMoneyPHP(property.monthly_rent || property.monthlyRent)}/mo`}
                        tags={[property.status, property.property_type || property.type].filter(Boolean)}
                    />
                    <PropertyImageGallery images={["/PlaceHolderProperties.jpg"]} alt={property.title || "Property"} />
                </div>

                {/* Right: inquiry form */}
                <div className="lg:w-80 shrink-0">
                    <PropertyInquiryForm 
                        agent={{ name: "DreamHome Team", title: "Property Management" }}
                        propertyId={property.property_no || property.id}
                    />
                </div>
            </div>

            {/* Detail sections stacked below */}
            <div className="space-y-6">
                <PropertyOverview
                    propertyType={property.property_type || property.type}
                    yearBuilt={0}
                    bathrooms={0}
                    bedrooms={property.no_of_rooms || property.noOfRooms}
                />

                <PropertyAddress
                    address={property.street}
                    zip={property.postcode}
                    city={property.city}
                    area={property.area}
                />

                <PropertyDescription text={property.description || "No description provided."} />

                <PropertyDetails
                    propertyId={property.property_no || property.id}
                    propertyType={property.property_type || property.type}
                    bedrooms={property.no_of_rooms || property.noOfRooms}
                    status={property.status}
                />

                <PropertyFeatures features={[]} />
            </div>
        </div>
    );
}