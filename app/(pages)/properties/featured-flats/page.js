'use client'; // Required for framer-motion and useState

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import HorizontalPropertyCard from '@/components/cards/HorizontalPropertyCard';
import SectionHeader from '@/components/ui/SectionHeader';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import AccordionItem from '@/components/ui/AccordionItem';
import HeroPropertyCard from '@/components/cards/HeroPropertyCard';
import PropertyDialog from '@/components/cards/property/PropertyDialog';

import { usePublicProperties } from '@/hooks/usePublicProperties';
import { toDialogProperty } from '@/lib/properties/toDialogProperty';

const agents = [
  { id: 1, name: 'Ryan Foster', role: 'Senior Agent', image: '/PlaceHolderPic.png' },
  { id: 2, name: 'Sophie Nguyen', role: 'Sales Executive', image: '/PlaceHolderPic.png' },
  { id: 3, name: 'Liam Harrison', role: 'Leasing Manager', image: '/PlaceHolderPic.png' },
];

const faqs = [
  {
    question: 'What makes a flat "Featured"?',
    answer:
      'Featured flats are handpicked by our agents based on value, location, condition, and landlord responsiveness. They represent the best available listings at any given time.',
  },
  {
    question: 'How do I apply for a flat?',
    answer:
      'Click "View Details" on any listing to see full information. From there you can contact the agent or branch to begin the application process.',
  },
  {
    question: 'Are furnished flats available?',
    answer:
      'Yes — many of our featured flats come fully or partially furnished. Furnishing status is noted on each individual listing page.',
  },
];

export default function FeaturedFlatsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // ✅ Load real properties
  const { properties, isLoading, errorMsg } = usePublicProperties();

  // ✅ Filter only flats
  const flatProperties = useMemo(() => {
    return (properties || []).filter(
      (p) => String(p?.property_type || '').toLowerCase() === 'flat'
    );
  }, [properties]);

  // ✅ pick a hero property (first flat)
  const heroFlat = flatProperties[0] ?? null;

  const handleOpenDialog = (propertyFromApi) => {
    setSelectedProperty(toDialogProperty(propertyFromApi));
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. PAGE HEADER */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-6"
      >
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-50 text-[#003580] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            ✦ Handpicked for You
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Featured Flats
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            Explore our most sought-after city flats and premium-listed apartments chosen by our expert agents.
          </p>
        </div>

        {/* ✅ HERO: now shows real data + opens modal on click (requires updated HeroPropertyCard with onViewDetails) */}
        <HeroPropertyCard
          title={heroFlat?.title || 'Featured Flat'}
          location={[heroFlat?.city, heroFlat?.postcode].filter(Boolean).join(', ') || '—'}
          price={heroFlat?.monthly_rent ? `₱${heroFlat.monthly_rent}/mo` : '—'}
          rooms={heroFlat?.no_of_rooms ?? 0}
          bathrooms={0}
          status={heroFlat?.status ?? 'Available'}
          tag="Featured"
          onViewDetails={() => heroFlat && handleOpenDialog(heroFlat)}
        />
      </motion.section>

      {/* 2. EXCLUSIVE AGENTS */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 py-8"
      >
        <div className="bg-[#003580]/5 border border-[#003580]/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
          {/* Left copy */}
          <div className="md:max-w-xs shrink-0">
            <SectionHeader
              title="Our Exclusive Agents"
              subtitle="Connect directly with our expert team to find your ideal flat."
            />
            <button className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#003580] border border-[#003580]/30 px-5 py-2.5 rounded-xl hover:bg-[#003580] hover:text-white transition">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Agents row */}
          <div className="flex flex-wrap gap-8 flex-1">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="flex flex-col items-center gap-2 text-center group cursor-pointer"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                </div>
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#003580] transition-colors">
                  {agent.name}
                </p>
                <p className="text-xs text-gray-500">{agent.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. OTHER FEATURED FLATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title="Other Featured Flats"
            subtitle="Browse our curated selection of premium city apartments."
          />
          <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#003580] border border-[#003580]/30 px-5 py-2.5 rounded-xl hover:bg-[#003580] hover:text-white transition">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading featured flats...</p>
        ) : errorMsg ? (
          <p className="text-sm text-red-600">{errorMsg}</p>
        ) : flatProperties.length === 0 ? (
          <p className="text-sm text-slate-600">No flats found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {flatProperties.slice(0, 6).map((prop, index) => {
              const id = prop.property_no ?? prop.id ?? `flat-${index}`;
              const title =
                prop.title || `${prop.property_type ?? 'Flat'} in ${prop.city ?? ''}`.trim();

              const address = [prop.street, prop.city].filter(Boolean).join(', ');
              const rooms = prop.no_of_rooms ?? 0;
              const rent = prop.monthly_rent ?? '';
              const type = prop.property_type ?? 'Flat';
              const status = prop.status ?? 'Available';

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
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

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <button className="inline-flex items-center gap-2 bg-[#003580] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#002a6e] transition">
            View All Flats
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <WhyChooseUs />
      </motion.div>

      {/* 5. FAQ SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-100 mt-4"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center lg:text-left">
          Featured Flats FAQ
        </h2>
        <div className="space-y-4 max-w-3xl">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} title={faq.question} content={faq.answer} />
          ))}
        </div>
      </motion.section>

      {/* 6. MODAL */}
      <PropertyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
}