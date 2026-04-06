import Image from 'next/image';
import { ShieldCheck, TrendingUp, Headphones } from 'lucide-react';
import SectionHeader from './SectionHeader';
import StatCard from './StatCard'; // Import your StatCard here

export default function WhyChooseUs() {
    return (
        <section className="w-full bg-[#0F58BF]/5 py-24 my-20">
        <div className="max-w-7xl mx-auto px-6">
            
            {/* Top Part: Image and Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Side: Image */}
            <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden shadow-xl border-8 border-white">
                <Image 
                src="/PropertyExample.png" 
                alt="Modern Luxury Home"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                />
            </div>

            {/* Right Side: Content */}
            <div>
                <SectionHeader 
                title="Why Choose Us" 
                subtitle="Whatever you're looking for, our expert agents will find the perfect match for your lifestyle and budget." 
                />
                <div className="space-y-8 mt-10">
                <FeatureRow icon={<ShieldCheck size={28} />} title="Property Management" desc="We handle everything from maintenance to tenant relations." />
                <FeatureRow icon={<TrendingUp size={28} />} title="Best Net Earnings" desc="Our strategies help you maximize your ROI." />
                <FeatureRow icon={<Headphones size={28} />} title="24/7 Service & Support" desc="Round-the-clock assistance for owners and renters." />
                </div>
            </div>
            </div>

            {/* Bottom Part: The Stats (Now inside the blue tint!) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-[#0F58BF]/10">
            <StatCard number="4M" label="Award Winning" />
            <StatCard number="18K" label="Property Ready" />
            <StatCard number="23M" label="Happy Customers" />
            </div>

        </div>
        </section>
    );
    }

    // Helper component for the rows to keep code clean
    function FeatureRow({ icon, title, desc }) {
    return (
        <div className="flex gap-6 p-4 rounded-2xl transition-all hover:bg-white/50">
        <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#0F58BF] shadow-sm">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{desc}</p>
        </div>
        </div>
    );
}