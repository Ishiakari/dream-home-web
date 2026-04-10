 "use client";

import { useState } from "react";
import PropertyDialog from "@/components/cards/property/PropertyDialog";

const TEST_PROPERTY = {
  propertyId: "MT1651674",
  title: "Light and Modern House",
  location: "Austin, TX",
  price: "$4,500/mo",
  tags: ["Active", "Featured"],
  images: ["/PlaceHolderPic.png"],
  agent: {
    name: "Martha Stewart",
    title: "Property Consultant",
    avatarUrl: null,
  },
  propertyType: "Shared House",
  yearBuilt: 2015,
  bathrooms: 3,
  bedrooms: 6,
  address: "7409 Knollwood Cove, 78731",
  zip: "78731",
  city: "Austin",
  area: "Knollwood",
  description:
    "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  status: "For Rent",
  features: [
    "Air Conditioning",
    "Shared gym",
    "TV Cable",
    "External Yard",
    "Kitchen Appliances",
    "Washer",
    "Dryer",
    "Gym",
    "Laundry",
    "Outdoor Shower",
    "Two Refrigerators",
    "Club House",
  ],
};

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Property Dialog Test Page</h1>
        <p className="text-gray-500">Click the button below to open the dialog</p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-[#E11553] hover:bg-[#C11246] text-white font-semibold rounded-full transition-colors"
        >
          Open Property Dialog
        </button>
      </div>

      <PropertyDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        property={TEST_PROPERTY}
      />
    </div>
  );
}
