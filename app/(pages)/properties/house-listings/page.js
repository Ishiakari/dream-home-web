'use client'; // Required for framer-motion and useState

import React, { useState } from 'react';
import { motion } from 'framer-motion'; // NEW: Imported framer-motion
import SearchBar from '@/components/ui/SearchBar';
import PropertyCard from '@/components/cards/PropertyCard';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import AccordionItem from '@/components/ui/AccordionItem';
import PropertyDialog from '@/components/cards/property/PropertyDialog'; // NEW: Imported the modal

// Extended the fallback data to include all fields the PropertyDialog expects
const fallbackProperty = { 
  id: 'dummy', 
  title: 'Spacious 4-Bed House',
  type: 'House', 
  city: 'London', 
  street: '123 Fake St', 
  postcode: 'NW1 6XE', 
  noOfRooms: 4, 
  status: 'Available', 
  monthlyRent: 850,
  // Added fields for the Dialog
  location: "London, UK",
  price: "£850/mo",
  tags: ["Available", "Family Home"],
  images: ["/PlaceHolderPic.png"],
  agent: {
    name: "John Doe",
    title: "Senior Lettings Agent",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  },
  propertyType: "House",
  yearBuilt: 2010,
  bathrooms: 2,
  bedrooms: 4,
  address: "123 Fake St",
  zip: "NW1 6XE",
  area: "Camden",
  description: "A beautiful and spacious family home located in a quiet residential neighborhood. Close to local schools, parks, and transport links.",
  propertyId: "H001",
  features: ["Garden", "Driveway", "Central Heating", "Double Glazing"]
};

const faqs = [
  {
    question: 'How do I book a viewing?',
    answer: 'Click "View Details" on any property to see the full listing. You can then contact the branch directly to schedule a convenient viewing slot.'
  },
  {
    question: 'Are the listed prices inclusive of bills?',
    answer: 'Monthly rent covers the property only. Check individual listings for details on council tax, utilities, and any service charges.'
  },
  {
    question: 'Can I filter by property type?',
    answer: 'Yes — use the Property Type, Price Range, and Rooms filters in the header above to narrow results to your exact requirements.'
  },
];

export default function HouseListingPage() {
  // NEW: State to control the modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleOpenDialog = () => {
    setSelectedProperty(fallbackProperty);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* 1. STICKY SEARCH & FILTER HEADER (Slides down) */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="border-b border-slate-200 pb-4 pt-2 px-4 sm:px-8 bg-white sticky top-0 z-20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex flex-col">

          <SearchBar />

          {/* Secondary Filter Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-6 gap-4 px-2 text-slate-700">
            <div className="flex flex-wrap items-center gap-3">

              {/* Property Type */}
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Property Type
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {/* Price Range */}
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Price Range
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {/* Rooms */}
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Rooms
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {/* Location */}
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Location
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            {/* Sort */}
            <div className="text-sm font-semibold flex items-center gap-2">
              Sort by:
              <span className="text-[#e11d48] cursor-pointer flex items-center hover:underline">
                Newest
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-500 mt-4 px-2">
            <span className="text-slate-900 font-bold">6 results</span> found across the UK
          </div>
        </div>
      </motion.section>

      {/* 2. PROPERTY GRID (Staggered pop-in) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-slate-900 mb-8"
        >
          House Listings
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }} // Staggers the loading
            >
              {/* Passed the click handler to the property card! */}
              <PropertyCard property={fallbackProperty} onViewDetails={handleOpenDialog} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US (Fades in on scroll) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <WhyChooseUs />
      </motion.div>

      {/* 4. FAQ SECTION (Slides up on scroll) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-100 mt-4"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center lg:text-left">
          Listing FAQ
        </h2>
        <div className="space-y-4 max-w-3xl">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              title={faq.question}
              content={faq.answer}
            />
          ))}
        </div>
      </motion.section>

      {/* 5. MODAL COMPONENT */}
      <PropertyDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        property={selectedProperty} 
      />

    </div>
  );
}