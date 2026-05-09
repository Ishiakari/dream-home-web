'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ---------------------------------------------------------------------------
// Pure helpers (shared between hook consumers)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Filtering & sorting helpers
// ---------------------------------------------------------------------------

function applyFilters(properties, filters) {
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
}

function applySorting(properties, sortBy) {
  const list = [...properties];

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
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * usePropertyFilters
 *
 * Consolidates the duplicated filter/sort/URL-sync logic shared between
 * area-search and house-listings pages.
 *
 * @param {Object} options
 * @param {Array}  options.properties   – The raw property array to filter/sort
 * @param {boolean} options.isLoading   – Whether data is still loading
 * @param {string} options.errorMsg     – Error message from data fetch
 * @param {string} options.basePath     – URL path for router.replace (e.g. '/properties/area-search')
 * @param {Function} [options.preFilter] – Optional function to pre-filter before search filters
 *                                          (e.g. p => p.property_type === 'House')
 *
 * @returns {{ filters, setFilters, sortBy, setSortBy, sortedProperties, resultsCount, isLoading, errorMsg }}
 */
export function usePropertyFilters({
  properties = [],
  isLoading = false,
  errorMsg = '',
  basePath = '',
  preFilter = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qsString = searchParams.toString();

  // Controlled filters
  const [filters, setFilters] = useState({
    where: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
  });

  // Sorting state
  const [sortBy, setSortBy] = useState('price_asc');

  // Refs to prevent URL/state loops
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

    router.replace(nextQs ? `${basePath}?${nextQs}` : basePath, {
      scroll: false,
    });
  }, [filters, router, qsString, basePath]);

  // Pre-filter (e.g. houses only)
  const preFiltered = useMemo(() => {
    if (!preFilter) return properties || [];
    return (properties || []).filter(preFilter);
  }, [properties, preFilter]);

  // Apply search filters
  const filteredProperties = useMemo(
    () => applyFilters(preFiltered, filters),
    [preFiltered, filters]
  );

  // Apply sorting
  const sortedProperties = useMemo(
    () => applySorting(filteredProperties, sortBy),
    [filteredProperties, sortBy]
  );

  const resultsCount = sortedProperties.length;

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortedProperties,
    resultsCount,
    isLoading,
    errorMsg,
  };
}
