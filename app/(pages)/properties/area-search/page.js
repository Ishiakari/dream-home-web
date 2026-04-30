'use client';

import React, { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import HorizontalPropertyCard from '@/components/cards/HorizontalPropertyCard';
import AccordionItem from '@/components/ui/AccordionItem';
import PropertyDialog from '@/components/cards/property/PropertyDialog';
import AreaSearchMap from '@/components/ui/AreaSearchMap';
import { motion } from 'framer-motion';

import { toDialogProperty } from '@/lib/properties/toDialogProperty';
import { usePublicProperties } from '@/hooks/usePublicProperties';

export default function AreaSearchPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showMobileMap, setShowMobileMap] = useState(false);

  // ✅ NEW: load real properties via reusable hook
  const { properties, isLoading, errorMsg } = usePublicProperties();

  const faqs = [
    {
      question: 'How do I schedule a viewing?',
      answer:
        "Click 'View Details' on any property to see the full description and contact the branch directly to book a slot.",
    },
    {
      question: 'Are these prices inclusive of bills?',
      answer:
        'Monthly rent typically covers the property only. Check the details page for specific information regarding council tax and utilities.',
    },
  ];

  const resultsCount = properties.length;

  const handleOpenDialog = (propertyFromApi) => {
    const dialogPayload = toDialogProperty(propertyFromApi);
    setSelectedProperty(dialogPayload);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white min-h-screen relative pb-20 lg:pb-0">
      {/* 1. HEADER (Slides down from top) */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border-b border-slate-200 pb-4 pt-2 px-4 sm:px-8 bg-white sticky top-0 z-20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex flex-col">
          <SearchBar />

          <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-6 gap-4 px-2 text-slate-700">
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Property Type
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Price Range
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 transition bg-white">
                Rooms
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

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
            <span className="text-slate-900 font-bold">{resultsCount} results</span> found in your area
          </div>
        </div>
      </motion.section>

      {/* 2. MAIN CONTENT */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: Property List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`w-full lg:w-[55%] xl:w-[60%] flex-col gap-6 ${showMobileMap ? 'hidden lg:flex' : 'flex'}`}
          >
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Available Properties</h1>

            {isLoading ? (
              <p className="text-sm text-slate-600">Loading properties...</p>
            ) : errorMsg ? (
              <p className="text-sm text-red-600">{errorMsg}</p>
            ) : properties.length === 0 ? (
              <p className="text-sm text-slate-600">No properties found.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {properties.map((prop, index) => {
                  const id = prop.property_no ?? prop.id ?? `row-${index}`;
                  const title = prop.title || `${prop.property_type ?? 'Property'} in ${prop.city ?? ''}`.trim();
                  const address = [prop.street, prop.city].filter(Boolean).join(', ');
                  const rooms = prop.no_of_rooms ?? 0;
                  const rent = prop.monthly_rent ?? '';
                  const type = prop.property_type ?? '';
                  const status = prop.status ?? 'Available';

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                    >
                      <HorizontalPropertyCard
                        propertyNo={id}
                        title={title}
                        address={address}
                        rooms={rooms}
                        price={rent}
                        propertyType={type}
                        status={status}
                        onViewDetails={() => handleOpenDialog(prop)}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: The Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`w-full lg:w-[45%] xl:w-[40%] ${showMobileMap ? 'block' : 'hidden'} lg:block`}
          >
            <AreaSearchMap />
          </motion.div>
        </div>
      </section>

      {/* 3. FAQ SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className={`max-w-4xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-100 mt-12 ${
          showMobileMap ? 'hidden lg:block' : 'block'
        }`}
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center lg:text-left">Rental FAQ</h2>

        <div className="space-y-4 max-w-3xl">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} title={faq.question} content={faq.answer} />
          ))}
        </div>
      </motion.section>

      {/* MOBILE FLOATING TOGGLE BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.8, delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 lg:hidden"
      >
        <button
          onClick={() => setShowMobileMap(!showMobileMap)}
          className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-colors"
        >
          {showMobileMap ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Show List
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Show Map
            </>
          )}
        </button>
      </motion.div>

      <PropertyDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} property={selectedProperty} />
    </div>
  );
}