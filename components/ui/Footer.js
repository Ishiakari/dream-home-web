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
            { name: 'Contact Us', href: '/contact' },
            { name: 'FAQ', href: '/faq' },
            { name: 'Privacy Policy', href: '/privacy' },
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
        <footer className="bg-[#0f172a] text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Branding Section */}
            <div className="space-y-5">
            <div className="text-2xl font-bold text-white tracking-tight">
                Dream<span className="text-emerald-400">Home</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
                Simplifying the rental journey across the United Kingdom. 
                From furnished flats to spacious houses, we connect quality renters 
                with premier property owners.
            </p>
            </div>

            {/*Loop through sections */}
            {FOOTER_CONFIG.sections.map((section) => (
            <div key={section.title}>
                <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-xs">
                {section.title}
                </h3>
                <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                    <li key={link.name}>
                    <Link 
                        href={link.href} 
                        className="hover:text-emerald-400 transition-colors duration-200"
                    >
                        {link.name}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
            ))}
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            <p>© {currentYear}. All rights reserved.</p>
            
            <div className="flex items-center gap-6">
            {FOOTER_CONFIG.techStack.map((tech) => (
                <span key={tech.name} className={`${tech.color} cursor-default transition-colors`}>
                {tech.name}
                </span>
            ))}
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 italic font-serif lowercase">
                DreamHome Case Study
            </span>
            </div>
        </div>
        </footer>
    );
};

export default PublicFooter;