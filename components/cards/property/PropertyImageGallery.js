"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

/**
 * PropertyImageGallery
 * Displays a main hero image with a row of clickable thumbnails below it.
 * Clicking a thumbnail swaps the main image.
 *
 * Props:
 *   images  {string[]}  Array of image URL strings. First image is shown by default.
 *   alt     {string}    Alt text for the images
 */
export default function PropertyImageGallery({ images = [], alt = "Property image" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return null;

  return (
    <div className="mb-5">
      {/* Main image */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={images[activeIndex]}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover transition-all duration-300"
          priority
        />

        {/* Next arrow if multiple images */}
        {images.length > 1 && (
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                idx === activeIndex ? "border-blue-600" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
