import PrimarySearchBar from '@/components/ui/SearchBar';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mt-20 md:mt-32 mb-12 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Find your perfect <span className="text-[#E11553]">DreamHome</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover top-tier UK properties tailored to your lifestyle. Search by location, dates, and group size.
        </p>
      </section>

      {/* Search Bar Container */}
      <div className="w-full max-w-4xl relative z-10">
        <PrimarySearchBar />
      </div>

      {/* Placeholder for future content (like featured properties) */}
      <section className="w-full max-w-7xl mx-auto mt-32">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* We can build out property cards to go here later */}
          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200 animate-pulse"></div>
          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200 animate-pulse"></div>
          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200 animate-pulse hidden sm:block"></div>
          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200 animate-pulse hidden lg:block"></div>
        </div>
      </section>

    </div>
  );
}