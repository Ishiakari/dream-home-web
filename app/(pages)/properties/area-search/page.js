'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import HorizontalPropertyCard from '@/components/cards/HorizontalPropertyCard';
import AccordionItem from '@/components/ui/AccordionItem';
import PropertyDialog from '@/components/cards/property/PropertyDialog';
import AreaSearchMap from '@/components/ui/AreaSearchMap';
import { motion } from 'framer-motion';

import { toDialogProperty } from '@/lib/properties/toDialogProperty';
import { usePublicProperties } from '@/hooks/usePublicProperties';
import { useRouter, useSearchParams } from 'next/navigation';

function parseNumberOrEmpty(value) {
  if (value === null || value === undefined) return '';
  const n = Number(value);
  return Number.isFinite(n) ? n : '';
}

function buildFiltersFromSearchParams(searchParams) {
  return {
    where: searchParams.get('where') || '',
    minPrice: parseNumberOrEmpty(searchParams.get('minPrice')),
    maxPrice: parseNumberOrEmpty(searchParams.get('maxPrice')),
    minRooms: parseNumberOrEmpty(searchParams.get('minRooms')),
  };
}

function toQueryString(filters) {
  const params = new URLSearchParams();

  const where = String(filters?.where || '').trim();
  if (where) params.set('where', where);

  const minPrice = filters?.minPrice;
  const maxPrice = filters?.maxPrice;
  const minRooms = filters?.minRooms;

  if (minPrice !== '' && minPrice !== null && minPrice !== undefined && !Number.isNaN(Number(minPrice))) {
    params.set('minPrice', String(minPrice));
  }
  if (maxPrice !== '' && maxPrice !== null && maxPrice !== undefined && !Number.isNaN(Number(maxPrice))) {
    params.set('maxPrice', String(maxPrice));
  }
  if (minRooms !== '' && minRooms !== null && minRooms !== undefined && !Number.isNaN(Number(minRooms))) {
    params.set('minRooms', String(minRooms));
  }

  return params.toString();
}

function shallowEqualFilters(a, b) {
  return (
    (a?.where ?? '') === (b?.where ?? '') &&
    String(a?.minPrice ?? '') === String(b?.minPrice ?? '') &&
    String(a?.maxPrice ?? '') === String(b?.maxPrice ?? '') &&
    String(a?.minRooms ?? '') === String(b?.minRooms ?? '')
  );
}

export default function AreaSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qsString = searchParams.toString(); // ✅ stable dependency

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showMobileMap, setShowMobileMap] = useState(false);

  // ✅ Public listings (Available-only)
  const { properties, isLoading, errorMsg } = usePublicProperties();

  // ✅ Controlled filters for SearchBar
  const [filters, setFilters] = useState({
    where: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
  });

  // ✅ Sorting state (no "Newest")
  // allowed: price_asc | price_desc | rooms_desc
  const [sortBy, setSortBy] = useState('price_asc');

  // Refs to prevent URL/state loops (especially landing -> area-search navigation)
  const didHydrateRef = useRef(false);
  const lastWrittenQsRef = useRef(null);
  const didInitFromUrlRef = useRef(false);

  // 0) Initialize from URL ONCE on first mount
  useEffect(() => {
    if (didInitFromUrlRef.current) return;

    const next = buildFiltersFromSearchParams(searchParams);
    setFilters(next);

    didHydrateRef.current = true;
    didInitFromUrlRef.current = true;

    // baseline: treat current URL as already applied
    lastWrittenQsRef.current = qsString;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1) URL -> state (ONLY when URL changed NOT caused by our own typing)
  useEffect(() => {
    if (!didInitFromUrlRef.current) return;

    // If this URL change matches what we last wrote, ignore it (it's from our replace)
    if (lastWrittenQsRef.current === qsString) return;

    const next = buildFiltersFromSearchParams(searchParams);
    setFilters((prev) => (shallowEqualFilters(prev, next) ? prev : next));
  }, [qsString, searchParams]);

  // 2) state -> URL (live typing), loop-safe
  useEffect(() => {
    if (!didHydrateRef.current) return;
    if (!didInitFromUrlRef.current) return;

    const nextQs = toQueryString(filters);

    // If already in sync, do nothing
    if (nextQs === qsString) return;

    lastWrittenQsRef.current = nextQs;

    router.replace(nextQs ? `/properties/area-search?${nextQs}` : '/properties/area-search', {
      scroll: false,
    });
  }, [filters, router, qsString]);

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

  const handleOpenDialog = (propertyFromApi) => {
    setSelectedProperty(toDialogProperty(propertyFromApi));
    setIsDialogOpen(true);
  };

  // ✅ Filter list client-side
  const filteredProperties = useMemo(() => {
    const q = String(filters.where || '').trim().toLowerCase();

    const minPrice = filters.minPrice === '' ? null : Number(filters.minPrice);
    const maxPrice = filters.maxPrice === '' ? null : Number(filters.maxPrice);
    const minRooms = filters.minRooms === '' ? null : Number(filters.minRooms);

    const hasMinPrice = Number.isFinite(minPrice);
    const hasMaxPrice = Number.isFinite(maxPrice);
    const hasMinRooms = Number.isFinite(minRooms);

    return (properties || []).filter((p) => {
      // Where text (partial match)
      if (q) {
        const hay = [p.title, p.street, p.area, p.city, p.postcode, p.property_type]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!hay.includes(q)) return false;
      }

      // Price
      const rent = Number(p.monthly_rent);
      if (hasMinPrice && Number.isFinite(rent) && rent < minPrice) return false;
      if (hasMaxPrice && Number.isFinite(rent) && rent > maxPrice) return false;

      // Rooms (min)
      const rooms = Number(p.no_of_rooms);
      if (hasMinRooms && Number.isFinite(rooms) && rooms < minRooms) return false;

      return true;
    });
  }, [properties, filters]);

  // ✅ Sort the filtered list
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];

    const rentValue = (p) => {
      const n = Number(p?.monthly_rent);
      return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
    };

    const roomsValue = (p) => {
      const n = Number(p?.no_of_rooms);
      return Number.isFinite(n) ? n : 0;
    };

    list.sort((a, b) => {
      if (sortBy === 'price_asc') return rentValue(a) - rentValue(b);
      if (sortBy === 'price_desc') return rentValue(b) - rentValue(a);
      if (sortBy === 'rooms_desc') return roomsValue(b) - roomsValue(a);
      return 0;
    });

    return list;
  }, [filteredProperties, sortBy]);

  const resultsCount = sortedProperties.length;

  return (
    <div className="bg-white min-h-screen relative pb-20 lg:pb-0">
      {/* HEADER */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border-b border-slate-200 pb-4 pt-2 px-4 sm:px-8 bg-white sticky top-0 z-20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex flex-col">
          {/* live typing on area-search */}
          <SearchBar value={filters} onChange={setFilters} onSearch={setFilters} debounceMs={250} />

          {/* ✅ SORT ONLY (pill row removed) */}
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

      {/* MAIN */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: list */}
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
            ) : sortedProperties.length === 0 ? (
              <p className="text-sm text-slate-600">No properties found.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {sortedProperties.map((prop, index) => {
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

          {/* RIGHT: map */}
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

      {/* FAQ */}
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

      {/* MOBILE TOGGLE */}
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

      <PropertyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
}