import React from 'react';
import Image from 'next/image';
import HorizontalPropertyCard from '@/components/cards/HorizontalPropertyCard';
import SectionHeader from '@/components/ui/SectionHeader';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import AccordionItem from '@/components/ui/AccordionItem';
import HeroPropertyCard from '@/components/cards/HeroPropertyCard';

const agents = [
  { id: 1, name: 'Ryan Foster', role: 'Senior Agent', image: '/PlaceHolderPic.png' },
  { id: 2, name: 'Sophie Nguyen', role: 'Sales Executive', image: '/PlaceHolderPic.png' },
  { id: 3, name: 'Liam Harrison', role: 'Leasing Manager', image: '/PlaceHolderPic.png' },
];



const faqs = [
  {
    question: 'What makes a flat "Featured"?',
    answer: 'Featured flats are handpicked by our agents based on value, location, condition, and landlord responsiveness. They represent the best available listings at any given time.'
  },
  {
    question: 'How do I apply for a flat?',
    answer: 'Click "View Details" on any listing to see full information. From there you can contact the agent or branch to begin the application process.'
  },
  {
    question: 'Are furnished flats available?',
    answer: 'Yes — many of our featured flats come fully or partially furnished. Furnishing status is noted on each individual listing page.'
  },
];

export default function FeaturedFlatsPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* 1. PAGE HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-6">
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

        {/* Hero Feature Card */}
        <HeroPropertyCard />
      </section>

      {/* 2. EXCLUSIVE AGENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-[#003580]/5 border border-[#003580]/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">

          {/* Left copy */}
          <div className="md:max-w-xs shrink-0">
            <SectionHeader
              title="Our Exclusive Agents"
              subtitle="Connect directly with our expert team to find your ideal flat."
            />
            <button className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#003580] border border-[#003580]/30 px-5 py-2.5 rounded-xl hover:bg-[#003580] hover:text-white transition">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Agents row */}
          <div className="flex flex-wrap gap-8 flex-1">
            {agents.map((agent) => (
              <div key={agent.id} className="flex flex-col items-center gap-2 text-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                </div>
                <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                <p className="text-xs text-gray-500">{agent.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OTHER FEATURED FLATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title="Other Featured Flats"
            subtitle="Browse our curated selection of premium city apartments."
          />
          <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#003580] border border-[#003580]/30 px-5 py-2.5 rounded-xl hover:bg-[#003580] hover:text-white transition">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <HorizontalPropertyCard key={item} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <button className="inline-flex items-center gap-2 bg-[#003580] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#002a6e] transition">
            View All Flats
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 5. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-100 mt-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center lg:text-left">
          Featured Flats FAQ
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
      </section>

    </div>
  );
}