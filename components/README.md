🏗️ DreamHome Component Library
===============================

This directory contains the global, reusable UI components for the DreamHome frontend. To maintain scalability and clean code, we are following a **Component-Driven Development** approach.

📁 Architecture & Organization
------------------------------

I have restructured the components/ directory to group elements by their function:

*   **components/cards/**: Complex, data-driven UI units (e.g., Properties, Blog posts).
    
*   **components/ui/**: Atomic, low-level design elements (e.g., Search bars, Buttons).
    

🏠 1. PropertyCard
------------------

**File:** components/cards/PropertyCard.jsx

The primary component for listing real estate data. It has been upgraded from the initial draft to meet professional production standards.

### 🔄 What's Changed/Added:

*   **SVG Integration:** Replaced standard emojis with high-resolution SVGs from Heroicons/Lucide.
    
*   **Performance Optimization:** Added the sizes prop to the Next.js  component to resolve "fill" warnings and improve Core Web Vitals (LCP).
    
*   **Tailwind Refinement:** Implemented object-cover for images and transition-transform for a smooth hover-scale effect.
    

{
  id: string,
  type: "House" | "Flat",
  city: string,
  street: string,
  postcode: string,
  noOfRooms: number,
  status: "Available" | "Rented", // Color-coded text
  monthlyRent: number
}

📝 2. BlogCard
--------------

**File:** components/cards/BlogCard.jsx

A specialized card designed to match the "From Our Blog" section in the Figma design. It doubles as a testimonial/social proof component.

### 🔄 What's Changed/Added:

*   **Dynamic Rating System:** Built a renderStars helper function that dynamically generates gold/gray stars based on a 1–5 rating scale.
    
*   **Thematic Styling:** Used a custom light-blue background (bg-\[#F8FAFF\]) and absolute-positioned quote SVGs to match the high-fidelity Figma mockup.
    
*   **Flexible Metadata:** Supports author roles (e.g., "Renter", "Owner") and circular profile avatars.
    

🚀 Technical Standards (For the Team)
-------------------------------------

When adding to this library, please follow these conventions:

1.  **Image Optimization:** Always use the Next.js Image component. If using fill, you **must** include the sizes attribute:sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    
2.  **SVG Formatting:** Ensure all SVG attributes are in camelCase (e.g., strokeWidth, strokeLinecap) to avoid React console errors.
    
3.  **Arbitrary Values:** Use Tailwind square-bracket notation (e.g., rounded-\[2rem\]) only when matching exact Figma specifications that fall outside standard Tailwind increments.
    

### How to use these in a Page:

import PropertyCard from '@/components/cards/PropertyCard';
import BlogCard from '@/components/cards/BlogCard';

// Map through your data array:
{data.map((item) => (
  <PropertyCard key={item.id} property={item} />
))}

DreamHome Component Documentation (Part 2)
==========================================

1\. Navigation Bar (components/ui/NavBar.js)
--------------------------------------------

A fully responsive, sticky navigation bar with desktop dropdowns and a mobile slide-down menu.

*   **State Management:**
    
    *   activeDropdown (String | null): Tracks which desktop menu item is currently hovered to reveal the submenu.
        
    *   isMobileMenuOpen (Boolean): Toggles the hamburger menu drawer on screens smaller than lg.
        
    *   isLoginOpen / isSignupOpen (Boolean): Controls the visibility of the authentication dialogs.
        
*   **Responsive Behavior:** \* **Desktop (lg and up):** Displays a horizontal list of links. Submenus appear on hover using CSS transitions (opacity, translate-y).
    
    *   **Mobile (Below lg):** Main links are hidden and replaced by a hamburger icon (☰). Clicking the icon opens a full-width dropdown containing all navigation links and submenus.
        
*   **Styling Notes:** Uses sticky top-0 z-50 to remain visible while scrolling. The active route is highlighted using Next.js usePathname and Tailwind's underline-offset-8.
    

2\. Why Choose Us Section (components/ui/WhyChooseUs.js)
--------------------------------------------------------

A composite layout section designed to build brand trust, featuring a main image, value propositions, and company statistics.

*   **Structure:**
    
    *   **Main Container:** Uses a subtle tinted background (bg-\[#0F58BF\]/5) to visually separate it from the white page content.
        
    *   **Top Grid (2-columns):** \* Left: A large placeholder image wrapped in a rounded container with a heavy white border to create a "floating" or "polaroid" effect.
        
        *   Right: A SectionHeader followed by a vertical stack of FeatureRow components (utilizing lucide-react icons).
            
    *   **Bottom Grid (Stats):** Houses the StatCard components, separated from the top content by a faint top-border.
        

3\. Statistic Card (components/ui/StatCard.js)
----------------------------------------------

A micro-component used to display impressive company numbers (e.g., "4M", "23M").

*   **Props:**
    
    *   number (String): The main statistic (e.g., "4M").
        
    *   label (String): The descriptive text beneath the number (e.g., "Award Winning").
        
*   **Styling Notes:** Emphasizes the number using text-4xl md:text-5xl font-black. The label uses uppercase styling and tracking-widest for a premium, architectural look.
    

4\. Home Page Layout & Animations (app/page.js)
-----------------------------------------------

The main landing page acting as the orchestrator for all components. It utilizes **Framer Motion** for high-performance, scroll-triggered animations.

*   **Key Dependencies:** framer-motion (Requires the 'use client' directive at the top of the file).
    
*   **Animation Strategies:**
    
    *   **On-Load Stagger (Hero Section):** Uses initial and animate props. The text loads immediately, the PrimarySearchBar loads with a delay: 0.2, and the Hero Image loads with a delay: 0.4. This creates a cascading "waterfall" entrance effect.
        
    *   **Scroll-Triggered (Content Sections):** Uses the whileInView prop instead of animate. Sections remain hidden (opacity: 0, y: 40) until the user scrolls down.
        
    *   **Viewport Optimization:** Utilizes viewport={{ once: true, margin: "-100px" }} to ensure the animation only plays the first time the user sees it, and waits until the element is 100px inside the screen before triggering.
        
*   **Z-Index & Overlap Strategy:** The Hero image uses a negative top margin (-mt-16 md:-mt-24) to slide up _underneath_ the Search Bar. The Search Bar is kept interactive by assigning it a higher z-index (z-30).

Frontend Architecture Update: Area Search UI & Modal Integration (10/04/2026)
================================================================

1\. Overview
------------

This update enhances the AreaSearchPage by integrating a detailed Property Modal (PropertyDialog), a dedicated Map component (AreaSearchMap), and responsive mobile layouts. The page now utilizes framer-motion for smooth, application-like transitions and is structurally prepared for backend API integration.

2\. Component Updates & Creation
--------------------------------

### HorizontalPropertyCard.js

*   **Purpose:** Displays individual property summaries in the list view.
    
*   **Changes Made:** \* Added a blue-tinted background (bg-\[#0F58BF\]/\[0.08\]) to the entire card for brand consistency.
    
    *   **Crucial Update:** Added the onViewDetails prop.
        
    *   Attached onClick={onViewDetails} to the "View Details" button to trigger actions in the parent component.
        

### AreaSearchMap.js (NEW)

*   **Purpose:** Isolates the map UI into its own reusable component for better maintainability.
    
*   **Features:** Contains the CSS-styled fake map background, neighborhood text overlays, absolute-positioned cluster markers, and zoom controls.
    

### page.js (AreaSearchPage)

*   **Purpose:** The main container that manages state and layout for the search results.
    
*   **Changes Made:**
    
    *   Converted to a Client Component ('use client';) to handle React state.
        
    *   Imported and implemented PropertyDialog and AreaSearchMap.
        
    *   Added Framer Motion () for staggered list rendering, smooth header drop-downs, and a spring-animated mobile toggle button.
        
    *   Implemented responsive display logic: side-by-side on Desktop (lg), and a togglable List/Map view on Mobile.
        

### next.config.js

*   **Purpose:** Global Next.js configuration.
    
*   **Changes Made:** Added i.pravatar.cc to images.remotePatterns to safely allow external placeholder images. _(Note: This will need to be updated with your actual production image host, e.g., AWS S3, Cloudinary)._
    

3\. State Management
--------------------

The AreaSearchPage relies on three key pieces of React state (useState):

1.  isDialogOpen (Boolean): Controls whether the PropertyDialog modal is visible.
    
2.  selectedProperty (Object | null): Holds the specific data of the property card that was clicked, passing it into the modal.
    
3.  showMobileMap (Boolean): Controls the mobile UI toggle, switching the view between the Property List and the Map.
    

4\. Backend Integration Checklist (For Django API)
--------------------------------------------------

When the backend endpoints are ready, the following changes must be made in page.js:

### A. Replace Dummy Data with API Fetch

*   **Current State:** Uses a hardcoded dummyPropertyData object and maps over \[1, 2, 3, 4, 5\].
    
*   **Required Action:** 1. Create a state variable: const \[properties, setProperties\] = useState(\[\]).2. Write a useEffect hook to fetch() the array of properties from the Django backend.3. Map over properties instead of the hardcoded array.
    

### B. Map Database Columns to Frontend Props

Ensure the keys returned by the Django JSON payload match the props expected by the components.

*   _Example:_ If Django returns monthly\_rent, you must pass it as price={property.monthly\_rent} to the card/modal.
    
*   Pay special attention to PropertyDialog, which expects specific keys like bedrooms, bathrooms, and yearBuilt.
    

### C. Update the Click Handler Logic

*   **Current State:** handleOpenDialog sets the state to the static dummy data.
    
*   **Required Action:** Update the function to accept the mapped property object dynamically.