import React from 'react';
import SearchBar from '@/components/ui/SearchBar';
import PropertyCard from '@/components/cards/PropertyCard';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import AccordionItem from '@/components/ui/AccordionItem';

const fallbackProperty = { 
  id: 'dummy', 
  type: 'House', 
  city: 'London', 
  street: '123 Fake St', 
  postcode: 'NW1 6XE', 
  noOfRooms: 4, 
  status: 'Available', 
  monthlyRent: 850 
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
  return (
    <div className="bg-white min-h-screen">

      {/* 1. STICKY SEARCH & FILTER HEADER */}
      <section className="border-b border-slate-200 pb-4 pt-2 px-4 sm:px-8 bg-white sticky top-0 z-20 shadow-sm">
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
      </section>

      {/* 2. PROPERTY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">House Listings</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <PropertyCard key={item} property={fallbackProperty} />
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 4. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-100 mt-4">
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
      </section>

    </div>
  );
}