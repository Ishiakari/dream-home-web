'use client';

import { useEffect, useMemo, useState } from 'react';
import BlogCard from '@/components/cards/BlogCard';

export default function BlogTestimonialsSection({
    title = 'From Our Blog',
    subtitle = 'Hear from our satisfied renters and property owners across the Philippines.',
    items = [],
    className = '',
    }) {
    const blogs = items || [];

    // Only show dots/pagination when we have more than 3
    const pageSize = 3;
    const isCarousel = blogs.length > pageSize;

    const pages = useMemo(() => {
        const out = [];
        for (let i = 0; i < blogs.length; i += pageSize) {
        out.push(blogs.slice(i, i + pageSize));
        }
        return out.length ? out : [[]];
    }, [blogs]);

    const [activePage, setActivePage] = useState(0);

    // If items change, keep activePage in range
    useEffect(() => {
        setActivePage((p) => Math.min(p, Math.max(0, pages.length - 1)));
    }, [pages.length]);

    const visible = pages[activePage] || [];

    return (
        <section className={['w-full max-w-7xl mx-auto', className].join(' ')}>
        <div className="flex items-start justify-between gap-6 mb-10">
            {/* Left: title/subtitle */}
            <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            <p className="text-gray-500 mt-2 text-lg">{subtitle}</p>
            </div>

            {/* Right: dots (dynamic, only if > 3) */}
            {isCarousel && pages.length > 1 && (
            <div className="flex items-center gap-2 pt-3">
                {pages.map((_, idx) => {
                const isActive = idx === activePage;
                return (
                    <button
                    key={idx}
                    onClick={() => setActivePage(idx)}
                    aria-label={`Go to testimonials page ${idx + 1}`}
                    className={[
                        'h-2 w-2 rounded-full transition',
                        isActive ? 'bg-[#003580]' : 'bg-slate-300 hover:bg-slate-400',
                    ].join(' ')}
                    />
                );
                })}
            </div>
            )}
        </div>

        {/* Cards (grid like Figma) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {(isCarousel ? visible : blogs).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
            ))}
        </div>
        </section>
    );
}