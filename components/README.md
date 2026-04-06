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