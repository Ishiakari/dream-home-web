// app/properties/house-listings/[id]/page.js

async function getPropertyData(id) {
    // Replace with your actual Django API endpoint
    // Example: http://127.0.0.1:8000/api/properties/1/
    const res = await fetch(`http://127.0.0.1:8000/api/properties/${id}/`, {
        cache: 'no-store' // Use this to ensure you get fresh data
    });

    if (!res.ok) {
        throw new Error('Failed to fetch property');
    }

    return res.json();
}

export default async function PropertyDetailPage({ params }) {
    const { id } = await params;
    const property = await getPropertyData(id);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">
                {property.type} in {property.city}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Placeholder */}
                <div className="bg-gray-200 h-96 rounded-3xl flex items-center justify-center">
                    <p className="text-gray-500">Big Property Image Here</p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <p className="text-2xl text-blue-700 font-bold">
                        ₱{property.monthlyRent.toLocaleString()}
                    </p>
                    <p className="text-gray-600 italic">
                        {property.street}, {property.postcode}
                    </p>
                    <div className="border-t pt-4">
                        <h3 className="font-semibold">Description</h3>
                        <p>{property.description || "No description provided."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}