'use client'; // Required for Framer Motion

import { motion } from 'framer-motion';
import Image from 'next/image'; // Required for the new hero image
import PrimarySearchBar from '@/components/ui/SearchBar';
import PropertyCard from '../components/cards/PropertyCard';
import BlogCard from '../components/cards/BlogCard';
import AccordionItem from '@/components/ui/AccordionItem';
import WhyChooseUs from '@/components/ui/WhyChooseUs';

export default function HomePage() {
  // 1. Dummy data for properties
  const dummyProperties = [
    { id: 'PG4', type: 'Flat', city: 'Glasgow', street: '6 Lawrence St', postcode: 'G11 9QX', noOfRooms: 3, status: 'Available', monthlyRent: 450 },
    { id: 'PA14', type: 'House', city: 'Aberdeen', street: '16 Holburn', postcode: 'AB1 5XX', noOfRooms: 6, status: 'Available', monthlyRent: 650 },
    { id: 'PL94', type: 'Flat', city: 'London', street: '2 Argyll St', postcode: 'NW2', noOfRooms: 4, status: 'Available', monthlyRent: 1200 },
    { id: 'PG21', type: 'House', city: 'Glasgow', street: '18 Dale Rd', postcode: 'G12', noOfRooms: 5, status: 'Rented', monthlyRent: 600 },
  ];

  // 2. Dummy data for blogs
  const blogData = [
    { id: 1, title: "Great Work", content: "Ganahan kaayo ko sa ila website tas ilang customer service kay super fast", rating: 5, authorName: "John Lloyd Canoy", authorRole: "Renter", authorImage: "/PlaceHolderPic.png" },
    { id: 2, title: "Good Job", content: "I have trusted DreamHome with my rental properties for years.", rating: 4, authorName: "Ella Culaste", authorRole: "Property Owner", authorImage: "/PlaceHolderPic.png" },
    { id: 3, title: "Perfect", content: "Grabi ako aura ani, dali rapod ko makakita og ma rentahan", rating: 5, authorName: "Zach Alfred", authorRole: "Developer", authorImage: "/PlaceHolderPic.png" }
  ];

  // 3. FAQ Data
  const faqData = [
    { id: 1, title: "How do I book a viewing for a property?", content: "You can book a viewing directly through the property detail page by clicking 'Request a Viewing'. Our system will coordinate with the landlord to find a time that works for you." },
    { id: 2, title: "Are there any hidden fees when renting through DreamHome?", content: "No. DreamHome follows a strict transparent pricing policy. Your only costs are the monthly rent and a security deposit, which is held in a government-backed protection scheme." },
    { id: 3, title: "How can I list my own property on this platform?", content: "You can click the 'List your property' button in the navbar. We offer a simple step-by-step process for landlords to upload photos, descriptions, and legal documents." }
  ];

  return (
    // Added overflow-hidden to prevent horizontal scrolling during animations
    <div className="flex flex-col items-center w-full px-4 md:px-8 bg-white overflow-hidden">
      
      {/* --- HERO SECTION (Animates on Load) --- */}
      
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl mx-auto mt-20 md:mt-10 mb-12 space-y-6 relative z-30"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Find your perfect <span className="text-[#E11553]">DreamHome</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover top-tier UK properties tailored to your lifestyle. Search by location, dates, and group size.
        </p>
      </motion.section>

      {/* Search Bar Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-30"
      >
        <PrimarySearchBar />
      </motion.div>

      {/* Intro Image (Faded Bottom, overlapping the search bar slightly) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        // Negative top margin (-mt-16) pulls it UP behind the search bar
        className="w-full max-w-5xl relative z-10 -mt-16 md:-mt-24 h-[400px] md:h-[600px]"
      >
        <Image 
          src="/PropertyExampleIntro.jpg" 
          alt="DreamHome Intro" 
          fill 
          className="object-cover rounded-[3rem] opacity-70"
          priority 
        />
        {/* Gradient overlay to smoothly blend the image into the white page */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent rounded-[3rem]"></div>
      </motion.div>


      {/* --- SCROLL SECTIONS (Animates when scrolled into view) --- */}

      {/* Properties Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl mx-auto mt-20"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Explore Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dummyProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </motion.section>

      {/* Why Choose Us (Wrapped in motion for scroll animation) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        <WhyChooseUs />
      </motion.div>

      {/* Blog Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl mx-auto mt-32"
      >
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Latest from our Blog</h2>
          <p className="text-gray-500 mt-2 text-lg">Hear from our satisfied renters and property owners.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogData.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mx-auto mt-44 mb-32"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2">Everything you need to know about the DreamHome process.</p>
        </div>

        <div className="space-y-2 border-t border-gray-200">
          {faqData.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              title={faq.title} 
              content={faq.content} 
            />
          ))}
        </div>
      </motion.section>

    </div>
  );
}