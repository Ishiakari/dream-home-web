export default function SectionHeader({ title, subtitle, center = false }) {
    return (
        <div className={`mb-12 ${center ? 'text-center mx-auto' : 'text-left'}`}>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
        </h2>
        {subtitle && (
            <p className={`mt-3 text-gray-500 text-lg max-w-2xl ${center ? 'mx-auto' : ''}`}>
            {subtitle}
            </p>
        )}
        </div>
    );
}

// Notice the center prop? For your FAQ Section, 
// you can just type <SectionHeader title="..." center /> and it will automatically align everything to the middle!