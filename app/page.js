import PrimarySearchBar from '@/components/ui/SearchBar';
import PropertyCard from '../components/cards/PropertyCard';
import BlogCard from '../components/cards/BlogCard';

export default function HomePage() {
  
  // 1. Property Dummy Data
  const dummyProperties = [
    { id: 'PG4', type: 'Flat', city: 'Glasgow', street: '6 Lawrence St', postcode: 'G11 9QX', noOfRooms: 3, status: 'Available', monthlyRent: 450 },
    { id: 'PA14', type: 'House', city: 'Aberdeen', street: '16 Holburn', postcode: 'AB1 5XX', noOfRooms: 6, status: 'Available', monthlyRent: 650 },
    { id: 'PL94', type: 'Flat', city: 'London', street: '2 Argyll St', postcode: 'NW2', noOfRooms: 4, status: 'Available', monthlyRent: 1200 },
    { id: 'PG21', type: 'House', city: 'Glasgow', street: '18 Dale Rd', postcode: 'G12', noOfRooms: 5, status: 'Rented', monthlyRent: 600 },
  ];

  // 2. Blog/Testimonial Dummy Data
  const blogData = [
    {
      id: 1,
      title: "Great Work",
      content: "Ganahan kaayo ko sa ila website tas ilang customer service kay super fast",
      rating: 5,
      authorName: "John Lloyd Canoy",
      authorRole: "Renter",
      authorImage: "/PlaceHolderPic.png" 
    },
    {
      id: 2,
      title: "Good Job",
      content: "I have trusted DreamHome with my rental properties for years. DreamHome has always managed my properties professionally and efficiently.",
      rating: 4,
      authorName: "Ella Culaste",
      authorRole: "Property Owner",
      authorImage: "/PlaceHolderPic.png"
    },
    {
      id: 3,
      title: "Perfect",
      content: "Grabi ako aura ani, dali rapod ko makakita og ma rentahan",
      rating: 5,
      authorName: "Zach Alfred",
      authorRole: "Developer",
      authorImage: "/PlaceHolderPic.png"
    }
  ];

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 bg-white">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mt-20 md:mt-10 mb-12 space-y-6">
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

      {/* 3. Properties Section */}
      <section className="w-full max-w-7xl mx-auto mt-32">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Explore Destinations</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dummyProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 4. Blog Section with increased spacing */}
      <section className="w-full max-w-7xl mx-auto mt-44 mb-32">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Latest from our Blog</h2>
          <p className="text-gray-500 mt-2 text-lg">Hear from our satisfied renters and property owners across the UK.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogData.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

    </div>
  );
}