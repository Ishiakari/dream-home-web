'use client'; // Required for Framer Motion

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import PrimarySearchBar from '@/components/ui/SearchBar';
import PropertyCard from '../components/cards/PropertyCard';
import BlogTestimonialsSection from '@/components/sections/BlogTestimonialsSection';
import AccordionItem from '@/components/ui/AccordionItem';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import { blogTestimonials } from '@/lib/data/blogTestimonials';

import PropertyDialog from '@/components/cards/property/PropertyDialog';
import { usePublicProperties } from '@/hooks/usePublicProperties';
import { toDialogProperty } from '@/lib/properties/toDialogProperty';

export default function HomePage() {
  // ✅ Load real properties
  const { properties, isLoading, errorMsg } = usePublicProperties();

  // Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleOpenDialog = (propertyFromApi) => {
    setSelectedProperty(toDialogProperty(propertyFromApi));
    setIsDialogOpen(true);
  };

  // Show a small curated set on landing page (e.g. first 8)
  const landingProperties = useMemo(() => {
    // Optional: show only Available on landing page
    const available = (properties || []).filter(
      (p) => String(p?.status || '').toLowerCase() === 'available'
    );

    return available.slice(0, 8);
  }, [properties]);


  // FAQ Data (unchanged)
  const faqData = [
    {
      id: 1,
      title: 'How do I book a viewing for a property?',
      content:
        "You can book a viewing directly through the property detail page by clicking 'Request a Viewing'. Our system will coordinate with the landlord to find a time that works for you.",
    },
    {
      id: 2,
      title: 'Are there any hidden fees when renting through DreamHome?',
      content:
        'No. DreamHome follows a strict transparent pricing policy. Your only costs are the monthly rent and a security deposit, which is held in a government-backed protection scheme.',
    },
    {
      id: 3,
      title: 'How can I list my own property on this platform?',
      content:
        "You can click the 'List your property' button in the navbar. We offer a simple step-by-step process for landlords to upload photos, descriptions, and legal documents.",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 bg-white overflow-hidden">
      {/* --- HERO SECTION (Animates on Load) --- */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-4xl mx-auto mt-20 md:mt-10 mb-12 space-y-6 relative z-30"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Find your perfect <span className="text-[#E11553]">DreamHome</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover top-tier UK properties tailored to your lifestyle. Search by location, dates, and group size.
        </p>
      </motion.section>

      {/* Search Bar Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="w-full max-w-4xl relative z-30"
      >
        <PrimarySearchBar />
      </motion.div>

      {/* Intro Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        className="w-full max-w-5xl relative z-10 -mt-16 md:-mt-24 h-[400px] md:h-[600px]"
      >
        <Image
          src="/PropertyExampleIntro.jpg"
          alt="DreamHome Intro"
          fill
          className="object-cover rounded-[3rem] opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent rounded-[3rem]" />
      </motion.div>

      {/* --- SCROLL SECTIONS --- */}

      {/* Properties Section (REAL DATA) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl mx-auto mt-20"
      >
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Explore Destinations</h2>
            <p className="text-gray-500 mt-1 text-sm">
              {isLoading ? 'Loading properties...' : `${landingProperties.length} available listings`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading properties...</p>
        ) : errorMsg ? (
          <p className="text-sm text-red-600">{errorMsg}</p>
        ) : landingProperties.length === 0 ? (
          <p className="text-sm text-slate-600">No available properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {landingProperties.map((p, idx) => {
              const key = p.property_no ?? p.id ?? `home-${idx}`;

              // Map backend -> PropertyCard expected shape (same mapping we used on house listings)
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
                <PropertyCard
                  key={key}
                  property={cardProperty}
                  onViewDetails={() => handleOpenDialog(p)}
                />
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        <WhyChooseUs />
      </motion.div>

      {/* Blog Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="w-full mt-32"
      >
        <BlogTestimonialsSection items={blogTestimonials} />
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mx-auto mt-44 mb-32"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2">Everything you need to know about the DreamHome process.</p>
        </div>

        <div className="space-y-2 border-t border-gray-200">
          {faqData.map((faq) => (
            <AccordionItem key={faq.id} title={faq.title} content={faq.content} />
          ))}
        </div>
      </motion.section>

      {/* Modal */}
      <PropertyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
}