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
    

### 📊 Required Data Props:

JavaScript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    id: string,    type: "House" | "Flat",    city: string,    street: string,    postcode: string,    noOfRooms: number,    status: "Available" | "Rented", // Color-coded text    monthlyRent: number  }   `

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

JavaScript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   import PropertyCard from '@/components/cards/PropertyCard';  import BlogCard from '@/components/cards/BlogCard';  // Map through your data array:  {data.map((item) => (  ))}   `