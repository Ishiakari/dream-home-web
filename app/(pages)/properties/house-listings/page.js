'use client'; // Required for framer-motion and useState

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/ui/SearchBar';
import PropertyCard from '@/components/cards/PropertyCard';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import AccordionItem from '@/components/ui/AccordionItem';
import PropertyDialog from '@/components/cards/property/PropertyDialog';

import { usePublicProperties } from '@/hooks/usePublicProperties';
import { toDialogProperty } from '@/lib/properties/toDialogProperty';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function HouseListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qsString = searchParams.toString(); // ✅ stable dependency

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // ✅ load real properties from backend (available-only from hook)
  const { properties, isLoading, errorMsg } = usePublicProperties();

  // ✅ Controlled filters for SearchBar (URL synced)
  const [filters, setFilters] = useState({
    where: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
  });

  // ✅ Sorting state (no "Newest")
  // allowed: price_asc | price_desc | rooms_desc
  const [sortBy, setSortBy] = useState('price_asc');

  // Refs to prevent URL/state loops (landing -> page navigation etc.)
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

    lastWrittenQsRef.current = qsString;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1) URL -> state (ONLY when URL changed NOT caused by our own typing)
  useEffect(() => {
    if (!didInitFromUrlRef.current) return;
    if (lastWrittenQsRef.current === qsString) return;

    const next = buildFiltersFromSearchParams(searchParams);
    setFilters((prev) => (shallowEqualFilters(prev, next) ? prev : next));
  }, [qsString, searchParams]);

  // 2) state -> URL (live typing), loop-safe
  useEffect(() => {
    if (!didHydrateRef.current) return;
    if (!didInitFromUrlRef.current) return;

    const nextQs = toQueryString(filters);
    if (nextQs === qsString) return;

    lastWrittenQsRef.current = nextQs;

    router.replace(
      nextQs ? `/properties/house-listings?${nextQs}` : '/properties/house-listings',
      { scroll: false }
    );
  }, [filters, router, qsString]);

  const handleOpenDialog = (propertyFromApi) => {
    setSelectedProperty(toDialogProperty(propertyFromApi));
    setIsDialogOpen(true);
  };

  // ✅ Step 1: filter to houses only
  const houseOnly = useMemo(() => {
    return (properties || []).filter((p) => String(p?.property_type || '').toLowerCase() === 'house');
  }, [properties]);

  // ✅ Step 2: apply search filters (where/price/rooms)
  const filteredHouses = useMemo(() => {
    const q = String(filters.where || '').trim().toLowerCase();

    const minPrice = filters.minPrice === '' ? null : Number(filters.minPrice);
    const maxPrice = filters.maxPrice === '' ? null : Number(filters.maxPrice);
    const minRooms = filters.minRooms === '' ? null : Number(filters.minRooms);

    const hasMinPrice = Number.isFinite(minPrice);
    const hasMaxPrice = Number.isFinite(maxPrice);
    const hasMinRooms = Number.isFinite(minRooms);

    return (houseOnly || []).filter((p) => {
      // where text
      if (q) {
        const hay = [p.title, p.street, p.area, p.city, p.postcode, p.property_type]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!hay.includes(q)) return false;
      }

      // price
      const rent = Number(p.monthly_rent);
      if (hasMinPrice && Number.isFinite(rent) && rent < minPrice) return false;
      if (hasMaxPrice && Number.isFinite(rent) && rent > maxPrice) return false;

      // rooms
      const rooms = Number(p.no_of_rooms);
      if (hasMinRooms && Number.isFinite(rooms) && rooms < minRooms) return false;

      return true;
    });
  }, [houseOnly, filters]);

  // ✅ Step 3: sort
  const sortedHouses = useMemo(() => {
    const list = [...filteredHouses];

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
  }, [filteredHouses, sortBy]);

  // ✅ Results count should reflect filtered + sorted list
  const resultsCount = sortedHouses.length;

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
        ) : sortedHouses.length === 0 ? (
          <p className="text-sm text-slate-600">No house listings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHouses.map((prop, index) => {
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