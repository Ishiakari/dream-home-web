import Image from 'next/image';

function Stars({ rating = 0 }) {
    const full = Math.max(0, Math.min(5, Math.round(rating)));

    return (
        <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg
            key={i}
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 ${i < full ? 'text-amber-400' : 'text-slate-200'}`}
            aria-hidden="true"
            >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
        ))}
        </div>
    );
}

export default function BlogCard({ blog, className = '' }) {
    if (!blog) return null;

    return (
        <article
        className={[
            'w-full rounded-2xl border border-slate-200/70',
            'bg-[#0F58BF]/[0.05] shadow-sm',
            'px-7 py-7',
            'min-h-[260px] flex flex-col', // ✅ equal-ish heights like Figma
            className,
        ].join(' ')}
        >
        {/* Title + quote */}
        <div className="flex items-start justify-between gap-6">
            <h3 className="text-[15px] font-extrabold text-slate-900">{blog.title}</h3>

            {/* Quote mark */}
            <span className="text-slate-200 text-5xl leading-none font-black select-none -mt-1">
            “
            </span>
        </div>

        {/* Content */}
        <p className="mt-4 text-[13.5px] leading-6 text-slate-700">
            “{blog.content}”
        </p>

        {/* Stars */}
        <div className="mt-5">
            <Stars rating={blog.rating} />
        </div>

        {/* Push author to bottom */}
        <div className="mt-auto">
            {/* Divider */}
            <div className="mt-5 h-px w-full bg-slate-200/80" />

            {/* Author */}
            <div className="mt-5 flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-200 shrink-0">
                <Image
                src={blog.authorImage || '/PlaceHolderPic.png'}
                alt={blog.authorName || 'Author'}
                fill
                sizes="44px"
                className="object-cover"
                />
            </div>

            <div className="min-w-0">
                <p className="text-[13px] font-extrabold text-slate-900 truncate">
                {blog.authorName}
                </p>
                <p className="text-[12px] text-slate-500 truncate">{blog.authorRole}</p>
            </div>
            </div>
        </div>
        </article>
    );
}