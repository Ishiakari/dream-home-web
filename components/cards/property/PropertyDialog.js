"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import PropertyDialogHeader from "./PropertyDialogHeader";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyInquiryForm from "./PropertyInquiryForm";
import PropertyOverview from "./PropertyOverview";
import PropertyAddress from "./PropertyAddress";
import PropertyDescription from "./PropertyDescription";
import PropertyDetails from "./PropertyDetails";
import PropertyFeatures from "./PropertyFeatures";

/**
 * PropertyDialog
 * Master dialog that composes all the property sub-components into a scrollable modal.
 *
 * Props:
 *   isOpen      {boolean}    Controls dialog visibility
 *   onClose     {() => void} Called when the user dismisses
 *   property    {object}     Full property data object (see shape below)
 *
 * property shape:
 * {
 *   title:        string,
 *   location:     string,       // e.g. "Austin, TX"
 *   price:        string,       // e.g. "$4,500/mo"
 *   tags:         string[],     // e.g. ["Active", "Featured"]
 *   images:       string[],     // array of image URLs
 *   agent: {
 *     name:       string,
 *     title:      string,
 *     avatarUrl:  string,
 *   },
 *   propertyType: string,       // e.g. "Shared House"
 *   yearBuilt:    number,
 *   bathrooms:    number,
 *   bedrooms:     number,
 *   address:      string,
 *   zip:          string,
 *   city:         string,
 *   area:         string,
 *   description:  string,
 *   propertyId:   string,       // e.g. "MT1651674"
 *   status:       string,       // e.g. "For Rent"
 *   features:     string[],     // e.g. ["Air Conditioning", "Shared gym"]
 * }
 */
export default function PropertyDialog({ isOpen, onClose, property }) {
  // Lock background scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !property) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      aria-modal="true"
      role="dialog"
      aria-labelledby="property-dialog-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* ── Sticky close bar ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <span id="property-dialog-title" className="text-base font-bold text-gray-900">
            Property Details
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 p-5">
          {/* Top section: two-column layout on larger screens */}
          <div className="flex flex-col lg:flex-row gap-5 mb-5">
            {/* Left: header + gallery */}
            <div className="flex-1 min-w-0">
              <PropertyDialogHeader
                title={property.title}
                location={property.location}
                price={property.price}
                tags={property.tags}
              />
              <PropertyImageGallery images={property.images} alt={property.title} />
            </div>

            {/* Right: inquiry form */}
            <div className="lg:w-72 shrink-0">
              <PropertyInquiryForm agent={property.agent} />
            </div>
          </div>

          {/* Detail sections stacked below */}
          <PropertyOverview
            propertyType={property.propertyType}
            yearBuilt={property.yearBuilt}
            bathrooms={property.bathrooms}
            bedrooms={property.bedrooms}
          />

          <PropertyAddress
            address={property.address}
            zip={property.zip}
            city={property.city}
            area={property.area}
          />

          <PropertyDescription text={property.description} />

          <PropertyDetails
            propertyId={property.propertyId}
            propertyType={property.propertyType}
            bedrooms={property.bedrooms}
            status={property.status}
          />

          <PropertyFeatures features={property.features} />
        </div>
      </div>
    </div>
  );
}
