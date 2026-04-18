'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginDialog from '@/components/auth/LogInModal';
import SignupDialog from '@/components/auth/SignUpModal';
import { useAuth } from '@/hooks/useAuth';
import { getUserRoleLabel } from '@/lib/auth/roles';

const getProfileInitials = (name = '') => {
  const words = String(name).trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return 'DH';
  }

  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
};

const NavBar = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // State to control the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const displayName = user?.fullName || user?.firstName || 'My Profile';
  const roleLabel = getUserRoleLabel(user?.role);
  const profileInitials = getProfileInitials(displayName);

  const isActive = (path) => pathname === path;

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleOutsideClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isProfileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const menuData = [
    {
      title: 'Properties',
      href: '/properties',
      items: ['Featured Flats', 'House Listings', 'Area Search']
    },
    {
      title: 'About',
      href: '/about',
      items: ['Our Branches', 'Contact Support']
    }
  ];

  return (
    <>
      <nav className="bg-[#003580] text-white border-b border-blue-900 shadow-md sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

          {/* LEFT SECTION: LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img src="/DreamHomelogo.png" alt="Logo" className="h-10 md:h-14 w-auto object-contain" />
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight hidden sm:block">DreamHome</span>
          </Link>

          {/* MIDDLE SECTION: DESKTOP DROPDOWN MENUS */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            
            <Link
              href="/"
              className={`py-2 text-sm font-semibold transition-colors hover:text-blue-200 ${isActive('/') ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/90'}`}
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

                {/* DESKTOP DROPDOWN BOX */}
                <div className={`absolute top-full left-0 w-64 bg-white text-[#003580] rounded-xl shadow-2xl py-3 border border-gray-100 transition-all duration-200 z-60 ${activeDropdown === menu.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
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

          {/* RIGHT SECTION: ACTIONS & MOBILE MENU BUTTON */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/list-property" className="hidden xl:block text-sm font-medium hover:text-blue-200 transition">
              List your property
            </Link>

            {isLoading ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-white/20" />
            ) : isAuthenticated ? (
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/40 px-3 py-1.5 text-sm font-bold transition hover:bg-white hover:text-[#003580]"
                >
                  <span className="hidden max-w-32.5 truncate md:inline">{displayName}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-extrabold">
                    {profileInitials}
                  </span>
                </button>

                <div
                  className={`absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-100 bg-white text-[#003580] shadow-2xl transition-all duration-200 z-60 ${
                    isProfileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
                    <p className="mt-1 text-xs font-medium text-gray-500">{roleLabel}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-sm font-bold border border-white/40 px-4 md:px-6 py-2 rounded-full hover:bg-white hover:text-[#003580] transition"
              >
                Sign in
              </button>
            )}

            {/* MOBILE HAMBURGER BUTTON */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-blue-200 focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {isMobileMenuOpen ? (
                // Close (X) Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger (☰) Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#003580] border-t border-blue-800 shadow-xl pb-6 px-6 flex flex-col z-60">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-4 border-b border-blue-800/50 font-semibold text-lg"
            >
              Home
            </Link>
            
            {menuData.map((menu) => (
              <div key={menu.title} className="py-4 border-b border-blue-800/50">
                <div className="font-semibold text-blue-200 mb-3">{menu.title}</div>
                <div className="flex flex-col gap-3 pl-4 border-l-2 border-blue-800/50">
                  {menu.items.map(item => (
                    <Link 
                      key={item} 
                      href={`${menu.href}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-white/80 hover:text-white transition"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Show "List your property" on mobile */}
            <Link 
              href="/list-property" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-4 font-semibold text-lg hover:text-blue-200 transition"
            >
              List your property
            </Link>

            {isAuthenticated ? (
              <div className="mt-2 border-t border-blue-800/50 pt-4">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 font-semibold text-lg hover:text-blue-200 transition"
                >
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/20 transition"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginOpen(true);
                }}
                className="mt-4 rounded-lg border border-white/40 px-3 py-2 text-sm font-bold hover:bg-white hover:text-[#003580] transition"
              >
                Sign in
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Mount the dialogs outside the nav structure */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />

      <SignupDialog
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default NavBar;