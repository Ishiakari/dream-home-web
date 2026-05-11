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
        type: value?.type ?? "",
        minPrice: value?.minPrice ?? "",
        maxPrice: value?.maxPrice ?? "",
        minRooms: value?.minRooms ?? "",
    }));

    // ✅ Keep local in sync if parent changes (force to strings)
    useEffect(() => {
        if (!value) return;
        setLocal({
        where: value.where ?? "",
        type: value.type ?? "",
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
        type: local.type ?? "",
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
            <div className="hidden sm:flex flex-col justify-center flex-1 h-full px-6 sm:px-8 hover:bg-gray-100 transition-colors text-left relative group cursor-pointer">
            <span className="text-xs font-bold text-gray-800 tracking-wide">
                Price Range
            </span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#E11553]">₱</span>
                <input
                inputMode="numeric"
                value={local.minPrice ?? ""}
                onChange={(e) =>
                    setLocal((s) => ({ ...s, minPrice: e.target.value }))
                }
                className="w-16 text-sm text-gray-900 font-semibold bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal"
                placeholder="Min"
                />
                <span className="text-gray-300 text-sm">-</span>
                <span className="text-sm font-bold text-[#E11553]">₱</span>
                <input
                inputMode="numeric"
                value={local.maxPrice ?? ""}
                onChange={(e) =>
                    setLocal((s) => ({ ...s, maxPrice: e.target.value }))
                }
                className="w-16 text-sm text-gray-900 font-semibold bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal"
                placeholder="Max"
                />
            </div>

            {/* Advanced Slider Dropdown (appears on hover) */}
            <div className="absolute top-full left-0 mt-4 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0">
                <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">Adjust Budget</p>
                
                <div className="space-y-6">
                    {/* Min Slider */}
                    <div>
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-3">
                            <span>Minimum</span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-[#003580]">₱{local.minPrice || 0}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="3000" step="50"
                            value={local.minPrice || 0}
                            onChange={(e) => setLocal(s => ({ ...s, minPrice: e.target.value }))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#003580]"
                        />
                    </div>

                    {/* Max Slider */}
                    <div>
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-3">
                            <span>Maximum</span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-[#E11553]">₱{local.maxPrice || 5000}</span>
                        </div>
                        <input 
                            type="range" 
                            min="500" max="10000" step="100"
                            value={local.maxPrice || 10000}
                            onChange={(e) => setLocal(s => ({ ...s, maxPrice: e.target.value }))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E11553]"
                        />
                    </div>
                </div>
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