'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/ui/SearchBar';
import PropertyCard from '@/components/cards/PropertyCard';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import AccordionItem from '@/components/ui/AccordionItem';
import PropertyDialog from '@/components/cards/property/PropertyDialog';

import { usePublicProperties } from '@/hooks/usePublicProperties';
import { toDialogProperty } from '@/lib/properties/toDialogProperty';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';

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
      'Yes — use the search bar filters in the header above to narrow results to your exact requirements.',
  },
];

// Pre-filter: only houses
const houseOnlyFilter = (p) => String(p?.property_type || '').toLowerCase() === 'house';

export default function HouseListingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // ✅ Data fetching
  const { properties, isLoading, errorMsg } = usePublicProperties();

  // ✅ Shared filter/sort/URL-sync hook with house-only pre-filter
  const {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortedProperties,
    resultsCount,
  } = usePropertyFilters({
    properties,
    isLoading,
    errorMsg,
    basePath: '/properties/house-listings',
    preFilter: houseOnlyFilter,
  });

  const handleOpenDialog = (propertyFromApi) => {
    setSelectedProperty(toDialogProperty(propertyFromApi));
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. STICKY SEARCH HEADER */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border-b border-slate-200 pb-4 pt-2 px-4 sm:px-8 bg-white sticky top-0 z-20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex flex-col">
          {/* ✅ live typing like area-search */}
          <SearchBar value={filters} onChange={setFilters} onSearch={setFilters} debounceMs={250} />

          {/* ✅ sort only (pill row removed) */}
          <div className="flex items-center justify-end w-full mt-6 px-2 text-slate-700">
            <div className="text-sm font-semibold flex items-center gap-2">
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[#e11d48] bg-transparent font-semibold cursor-pointer outline-none"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rooms_desc">Rooms: Most first</option>
              </select>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-500 mt-4 px-2">
            <span className="text-slate-900 font-bold">{resultsCount} results</span> found in your area
          </div>
        </div>
      </motion.section>

      {/* 2. PROPERTY GRID */}
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
        ) : sortedProperties.length === 0 ? (
          <p className="text-sm text-slate-600">No house listings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((prop, index) => {
              const key = prop.property_no ?? prop.id ?? `house-${index}`;

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
                  <PropertyCard property={cardProperty} onViewDetails={() => handleOpenDialog(prop)} />
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
      <PropertyDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} property={selectedProperty} />
    </div>
  );
}