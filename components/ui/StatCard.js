export default function StatCard({ number, label }) {
    return (
        <div className="text-center px-4">
        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            {number}
        </h3>
        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs md:text-sm">
            {label}
        </p>
        </div>
    );
}