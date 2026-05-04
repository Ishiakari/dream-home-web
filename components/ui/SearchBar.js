"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

// small debounce hook for live search
function useDebouncedValue(value, delayMs) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs]);

    return debounced;
    }

    export default function SearchBar({ value, onChange, onSearch, debounceMs = 250 }) {
    // ✅ Always keep local input values as STRINGS (never null)
    const [local, setLocal] = useState(() => ({
        where: value?.where ?? "",
        minPrice: value?.minPrice ?? "",
        maxPrice: value?.maxPrice ?? "",
        minRooms: value?.minRooms ?? "",
    }));

    // ✅ Keep local in sync if parent changes (force to strings)
    useEffect(() => {
        if (!value) return;
        setLocal({
        where: value.where ?? "",
        minPrice: value.minPrice ?? "",
        maxPrice: value.maxPrice ?? "",
        minRooms: value.minRooms ?? "",
        });
    }, [value]);

    const debounced = useDebouncedValue(local, debounceMs);

    // ✅ Live update to parent (area-search uses this; landing page can omit onChange)
    useEffect(() => {
        onChange?.(debounced);
    }, [debounced, onChange]);

    // ✅ Parsed numbers for submit (null if empty/invalid)
    const parsed = useMemo(() => {
        const minPrice = local.minPrice === "" ? null : Number(String(local.minPrice));
        const maxPrice = local.maxPrice === "" ? null : Number(String(local.maxPrice));
        const minRooms = local.minRooms === "" ? null : Number(String(local.minRooms));

        return {
        where: local.where ?? "",
        minPrice: Number.isFinite(minPrice) ? minPrice : null,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : null,
        minRooms: Number.isFinite(minRooms) ? minRooms : null,
        };
    }, [local]);

    const handleSubmit = () => {
        onSearch?.(parsed);
        // ensure parent has latest even if debounce hasn’t fired
        onChange?.(parsed);
    };

    return (
        <div className="flex items-center justify-center w-full mt-8">
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-4xl mx-auto h-16">
            {/* Where */}
            <div className="flex flex-col justify-center flex-1 h-full px-6 sm:px-8 rounded-l-full hover:bg-gray-100 transition-colors text-left">
            <label className="text-xs font-bold text-gray-800 tracking-wide">
                Where
            </label>
            <input
                value={local.where ?? ""}
                onChange={(e) => setLocal((s) => ({ ...s, where: e.target.value }))}
                className="text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-500"
                placeholder="City, area, street, postcode"
            />
            </div>

            {/* Divider */}
            <div className="w-[1px] h-8 bg-gray-200 hidden sm:block" />

            {/* Price */}
            <div className="hidden sm:flex flex-col justify-center flex-1 h-full px-6 sm:px-8 hover:bg-gray-100 transition-colors text-left">
            <span className="text-xs font-bold text-gray-800 tracking-wide">
                Price
            </span>
            <div className="flex items-center gap-2">
                <input
                inputMode="numeric"
                value={local.minPrice ?? ""}
                onChange={(e) =>
                    setLocal((s) => ({ ...s, minPrice: e.target.value }))
                }
                className="w-24 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-500"
                placeholder="Min"
                />
                <span className="text-gray-400 text-sm">-</span>
                <input
                inputMode="numeric"
                value={local.maxPrice ?? ""}
                onChange={(e) =>
                    setLocal((s) => ({ ...s, maxPrice: e.target.value }))
                }
                className="w-24 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-500"
                placeholder="Max"
                />
            </div>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-8 bg-gray-200 hidden md:block" />

            {/* Rooms + Search button */}
            <div className="hidden md:flex items-center justify-between flex-1 h-full pl-6 sm:pl-8 pr-2 rounded-r-full hover:bg-gray-100 transition-colors">
            <div className="flex flex-col justify-center text-left">
                <span className="text-xs font-bold text-gray-800 tracking-wide">
                Rooms
                </span>
                <input
                inputMode="numeric"
                value={local.minRooms ?? ""}
                onChange={(e) =>
                    setLocal((s) => ({ ...s, minRooms: e.target.value }))
                }
                className="text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-500 w-32"
                placeholder="Min rooms"
                />
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center justify-center p-3 sm:p-4 bg-[#E11553] hover:bg-[#C11246] text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E11553]"
                aria-label="Search properties"
            >
                <Search className="w-5 h-5" strokeWidth={2.5} />
            </button>
            </div>

            {/* Mobile search button fallback */}
            <div className="md:hidden flex-1 flex justify-end pr-2">
            <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center justify-center p-3 bg-[#E11553] text-white rounded-full"
            >
                <Search className="w-4 h-4" />
            </button>
            </div>
        </div>
        </div>
    );
}