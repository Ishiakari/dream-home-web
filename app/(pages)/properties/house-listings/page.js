'use client'; // Required for framer-motion and useState

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/ui/SearchBar';
import PropertyCard from '@/components/cards/PropertyCard';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import AccordionItem from '@/components/ui/AccordionItem';
import PropertyDialog from '@/components/cards/property/PropertyDialog';

import { usePublicProperties } from '@/hooks/usePublicProperties';
import { toDialogProperty } from '@/lib/properties/toDialogProperty';

const faqs = [
  {
    question: 'How do I book a viewing?',
    answer:
      'Click "View Details" on any property to see the full listing. You can then contact the branch directly to schedule a convenient viewing slot.',
  },
  {
    question: 'Are the listed prices inclusive of bills?',
    answer:
      'Monthly rent covers the property only. Check individual listings for details on council tax, utilities, and any service charges.',
  },
  {
    question: 'Can I filter by property type?',
    answer:
      'Yes — use the Property Type, Price Range, and Rooms filters in the header above to narrow results to your exact requirements.',
  },
];

export default function HouseListingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // ✅ NEW: load real properties from backend
  const { properties, isLoading, errorMsg } = usePublicProperties();

  // ✅ Filter only Houses (backend uses property_type)
  const houseProperties = useMemo(() => {
    return (properties || []).filter(
      (p) => String(p?.property_type || '').toLowerCase() === 'house'
    );
  }, [properties]);

  const handleOpenDialog = (propertyFromApi) => {
    setSelectedProperty(toDialogProperty(propertyFromApi));
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. STICKY SEARCH & FILTER HEADER (Slides down) */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
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
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Price Range */}
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Price Range
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Rooms */}
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Rooms
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Location */}
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Location
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Sort */}
            <div className="text-sm font-semibold flex items-center gap-2">
              Sort by:
              <span className="text-[#e11d48] cursor-pointer flex items-center hover:underline">
                Newest
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-500 mt-4 px-2">
            <span className="text-slate-900 font-bold">{houseProperties.length} results</span> found across the UK
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

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading house listings...</p>
        ) : errorMsg ? (
          <p className="text-sm text-red-600">{errorMsg}</p>
        ) : houseProperties.length === 0 ? (
          <p className="text-sm text-slate-600">No house listings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {houseProperties.map((prop, index) => {
              const key = prop.property_no ?? prop.id ?? `house-${index}`;

              // PropertyCard expects property.id etc. We'll adapt the payload lightly.
              const cardProperty = {
                id: prop.property_no ?? prop.id,
                type: prop.property_type,
                city: prop.city,
                street: prop.street,
                postcode: prop.postcode,
                noOfRooms: prop.no_of_rooms,
                status: prop.status,
                monthlyRent: prop.monthly_rent,
              };

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <PropertyCard
                    property={cardProperty}
                    onViewDetails={() => handleOpenDialog(prop)}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. WHY CHOOSE US */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <WhyChooseUs />
      </motion.div>

      {/* 4. FAQ SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-100 mt-4"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center lg:text-left">
          Listing FAQ
        </h2>
        <div className="space-y-4 max-w-3xl">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} title={faq.question} content={faq.answer} />
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