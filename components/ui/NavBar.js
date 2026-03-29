'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const isActive = (path) => pathname === path;

  const menuData = [
    {
      title: 'Properties',
      href: '/properties',
      items: ['Featured Flats', 'House Listings', 'Area Search']
    },
    {
      title: 'Renters',
      href: '/renters',
      items: ['How to Apply', 'Schedule a Viewing', 'Lease FAQ']
    },
    {
      title: 'About',
      href: '/about',
      items: ['Our Branches', 'Contact Support']
    }
  ];

  return (
    <nav className="bg-[#003580] text-white border-b border-blue-900 shadow-md sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LEFT SECTION: LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img src="/DreamHomelogo.png" alt="Logo" className="h-14 w-auto object-contain" />
          <span className="text-3xl font-extrabold tracking-tight hidden sm:block">DreamHome</span>
        </Link>

        {/* MIDDLE SECTION: DROPDOWN MENUS */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          <Link 
            href="/" 
            className={`text-sm font-semibold transition-colors hover:text-blue-200 ${isActive('/') ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/90'}`}
          >
            Home
          </Link>

          {menuData.map((menu) => (
            <div 
              key={menu.title} 
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown(menu.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 cursor-pointer text-sm font-semibold transition-colors hover:text-blue-200">
                {menu.title}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${activeDropdown === menu.title ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* DROPDOWN BOX */}
              <div className={`absolute top-full left-0 w-64 bg-white text-[#003580] rounded-xl shadow-2xl py-3 border border-gray-100 transition-all duration-200 z-[60] ${activeDropdown === menu.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                {menu.items.map((item) => (
                  <Link 
                    key={item} 
                    href={`${menu.href}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-4 py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-[#003580]"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SECTION: ACTIONS */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Put back the List Property link here */}
          <Link href="/list-property" className="hidden xl:block text-sm font-medium hover:text-blue-200 transition">
            List your property
          </Link>

          <Link href="/signin">
            <button className="text-sm font-bold border border-white/40 px-6 py-2 rounded-full hover:bg-white hover:text-[#003580] transition">
              Sign in
            </button>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;