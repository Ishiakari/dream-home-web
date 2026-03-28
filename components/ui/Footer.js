import Link from 'next/link';

const Footer = () => {
    explore:[
        { name: 'Featured Flats', href: '/properties/flats' },
        { name: 'House Listings', href: '/properties/houses' },
        { name: 'Branch Locations', href: '/branches' },
        { name: 'How it Works', href: '/about' },
    ], 
    operations: [
        { name: 'List Your Property', href: '/services/owners' },
        { name: 'List Your Property', href: '/services/owners' },
        { name: 'Lease Terms', href: '/legal/lease-info' },
        { name: 'Area Search', href: '/search' },
    ],
    resources: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Privacy Policy', href: '/privacy' },
    ]
};

return (
    <footer className="bg-[#0f172a] text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            
            <div className="space-y-5">
            <div className="text-2xl font-bold text-white tracking-tight">
                Dream<span className="text-emerald-400">Home</span>
                <span className="text-slate-500 text-sm ml-1 font-mono">.dev</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
                Simplifying the rental journey across the United Kingdom. 
                From furnished flats to spacious houses, we connect quality renters 
                with premier property owners.
            </p>
            </div>

            <div>
            <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-xs">Explore</h3>
            <ul className="space-y-3 text-sm">
                {footerLinks.explore.map((link) => (
                <li key={link.name}>
                    <Link href={link.href} className="hover:text-emerald-400 transition-colors duration-200">
                    {link.name}
                    </Link>
                </li>
                ))}
            </ul>
            </div>

            <div>
            <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-xs">Services</h3>
            <ul className="space-y-3 text-sm">
                {footerLinks.services.map((link) => (
                <li key={link.name}>
                    <Link href={link.href} className="hover:text-emerald-400 transition-colors duration-200">
                    {link.name}
                    </Link>
                </li>
                ))}
            </ul>
            </div>


            <div>
            <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-xs">Support</h3>
            <ul className="space-y-3 text-sm">
                {footerLinks.support.map((link) => (
                <li key={link.name}>
                    <Link href={link.href} className="hover:text-emerald-400 transition-colors duration-200">
                    {link.name}
                    </Link>
                </li>
                ))}
            </ul>
            </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            <p>
            © {currentYear} John Lloyd Canoy. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
            <span className="hover:text-emerald-400 cursor-default transition-colors">Next.js</span>
            <span className="hover:text-blue-400 cursor-default transition-colors">Tailwind CSS</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 italic font-serif lowercase">DreamHome Case Study</span>
            </div>
        </div>
        </footer>
    );
};

export default PublicFooter;