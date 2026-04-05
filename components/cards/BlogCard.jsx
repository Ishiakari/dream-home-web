import Image from 'next/image';

export default function BlogCard({ blog }) {
  // Logic to render stars (gold for active, gray for empty)
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-200"}>
            ★
        </span>
        ));
    };

    return (
        <div className="bg-[#0F58BF]/5 rounded-[2rem] p-8 relative flex flex-col h-full border border-blue-50 shadow-sm transition-all hover:shadow-md">
        
        {/* Decorative Quote Icon (Top Right) */}
        <div className="absolute top-6 right-8 text-[#D1E0FF]">
            <svg width="40" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.748-9.393 9-10.171V5.5c-2.337.205-3.991 1.106-4.299 3.411H24v12h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.393 9-10.171V5.5c-2.337.205-3.991 1.106-4.299 3.411H10v12H0z" />
            </svg>
        </div>

        {/* Header Title */}
        <h3 className="text-lg font-extrabold text-gray-900 mb-6">{blog.title}</h3>
        
        {/* The Quote Content */}
        <p className="text-gray-700 font-medium leading-relaxed mb-6 flex-grow">
            “{blog.content}”
        </p>

        {/* Star Rating */}
        <div className="flex gap-1 text-lg mb-8">
            {renderStars(blog.rating)}
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-gray-200 mb-6"></div>

        {/* Author/User Section */}
        <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image 
                src={blog.authorImage || "/PlaceHolderPic.png"} 
                alt={blog.authorName}
                fill
                sizes="48px"
                className="object-cover"
            />
            </div>
            <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-sm leading-tight">{blog.authorName}</span>
            <span className="text-xs text-gray-500 font-medium mt-1">{blog.authorRole}</span>
            </div>
        </div>
        </div>
    );
}