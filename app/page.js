import PrimarySearchBar from '@/components/ui/SearchBar';
// 1. Import your new PropertyCard! (Adjust the path if it's inside the 'ui' folder)
import PropertyCard from '../components/cards/PropertyCard';

export default function HomePage() {
  
  // 2. Create dummy data representing what Django will eventually send
  const dummyProperties = [
    { id: 'PG4', type: 'Flat', city: 'Glasgow', street: '6 Lawrence St', postcode: 'G11 9QX', noOfRooms: 3, status: 'Available', monthlyRent: 450 },
    { id: 'PA14', type: 'House', city: 'Aberdeen', street: '16 Holburn', postcode: 'AB1 5XX', noOfRooms: 6, status: 'Available', monthlyRent: 650 },
    { id: 'PL94', type: 'Flat', city: 'London', street: '2 Argyll St', postcode: 'NW2', noOfRooms: 4, status: 'Available', monthlyRent: 1200 },
    { id: 'PG21', type: 'House', city: 'Glasgow', street: '18 Dale Rd', postcode: 'G12', noOfRooms: 5, status: 'Rented', monthlyRent: 600 },
  ];

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8">
      
      {/* Hero Section (Unchanged) */}
      <section className="text-center max-w-4xl mx-auto mt-20 md:mt-10 mb-12 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Find your perfect <span className="text-[#E11553]">DreamHome</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover top-tier UK properties tailored to your lifestyle. Search by location, dates, and group size.
        </p>
      </section>

      {/* Search Bar Container (Unchanged) */}
      <div className="w-full max-w-4xl relative z-10">
        <PrimarySearchBar />
      </div>

      {/* 3. The Updated Properties Section */}
      <section className="w-full max-w-7xl mx-auto mt-32">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Destinations</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* We loop through the dummy data to generate the cards dynamically! */}
          {dummyProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
          ))}

        </div>
      </section>

    </div>
  );
}