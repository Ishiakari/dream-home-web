import Link from 'next/link';

const FOOTER_CONFIG = {
    sections: [
        {
        title: 'Explore',
        links: [
            { name: 'Featured Flats', href: '#' },
            { name: 'House Listings', href: '#' },
            { name: 'Branch Locations', href: '#' },
            { name: 'How it Works', href: '#' },
        ],
        },
        {
        title: 'Services',
        links: [
            { name: 'List Your Property', href: '#' },
            { name: 'Renter Guide', href: '#' },
            { name: 'Lease Terms', href: '#' },
            { name: 'Area Search', href: '#' },
        ],
        },
        {
        title: 'Support',
        links: [
            { name: 'Contact Us', href: '#' },
            { name: 'FAQ', href: '#' },
            { name: 'Privacy Policy', href: '#' },
        ],
        },
    ],
    techStack: [
        { name: 'Next.js', color: 'hover:text-emerald-400' },
        { name: 'Django', color: 'hover:text-blue-400' },
    ],
};

const PublicFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0f172a] text-slate-400 pt-12 pb-8 md:pt-16 md:pb-12 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
            {/* Main Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            
            {/* Branding Section */}
            <div className="space-y-5 sm:col-span-2 lg:col-span-1">
                <div className="text-2xl font-bold text-white tracking-tight">
                Dream<span className="text-emerald-400">Home</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                Simplifying the rental journey across the United Kingdom. 
                From furnished flats to spacious houses, we connect quality renters 
                with premier property owners.
                </p>
            </div>

            {/* Map through Link Sections */}
            {FOOTER_CONFIG.sections.map((section) => (
                <div key={section.title} className="flex flex-col">
                <h3 className="text-white font-bold mb-5 md:mb-6 tracking-widest uppercase text-xs">
                    {section.title}
                </h3>
                <ul className="space-y-3 text-sm">
                    {section.links.map((link) => (
                    <li key={link.name}>
                        <Link 
                        href={link.href} 
                        className="hover:text-emerald-400 transition-colors duration-200 block py-1 md:py-0"
                        >
                        {link.name}
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>
            ))}
            </div>

            {/* Bottom Bar: Stacked on mobile, row on tablet+ */}
            <div className="mt-12 md:mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-widest text-center md:text-left">
            <p>© {currentYear}. All rights reserved.</p>
            
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                {FOOTER_CONFIG.techStack.map((tech) => (
                <span key={tech.name} className={`${tech.color} cursor-default transition-colors`}>
                    {tech.name}
                </span>
                ))}
                <span className="hidden sm:inline text-slate-700">|</span>
                <span className="text-slate-400 italic font-serif lowercase tracking-normal normal-case">
                DreamHome Case Study [cite: 2]
                </span>
            </div>
            </div>
        </div>
        </footer>
    );
};

export default PublicFooter;