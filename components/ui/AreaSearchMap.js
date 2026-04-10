import React from 'react';

export default function AreaSearchMap() {
    // Dummy data for our fake map markers
    const mapMarkers = [
        { top: '22%', left: '48%', count: 2 },
        { top: '32%', left: '72%', count: 16 },
        { top: '42%', left: '45%', count: 12 },
        { top: '46%', left: '22%', count: 20 },
        { top: '46%', left: '72%', count: 1 },
        { top: '56%', left: '62%', count: 40 },
        { top: '68%', left: '63%', count: 2 },
        { top: '62%', left: '32%', count: 8 },
    ];

    return (
        <div className="sticky top-48 h-[calc(100vh-14rem)] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-[#f0f3f5] relative">
            
            {/* Simulated Map Background Texture */}
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute top-0 bottom-0 left-[40%] w-16 bg-slate-300 opacity-30 skew-x-12"></div> 
            
            {/* Fake Neighborhood Labels */}
            <div className="absolute top-[15%] left-[10%] text-slate-600 font-bold text-lg opacity-80">Camden Town</div>
            <div className="absolute top-[35%] left-[30%] text-slate-500 font-semibold text-sm opacity-60">BLOOMSBURY</div>
            <div className="absolute top-[52%] left-[25%] text-slate-800 font-bold text-2xl opacity-90">London</div>
            <div className="absolute top-[68%] left-[15%] text-slate-800 font-bold text-xl opacity-90">Westminster</div>
            <div className="absolute top-[45%] right-[5%] text-slate-800 font-bold text-xl opacity-90">City of London</div>
            
            {/* Render the Circular Map Markers */}
            {mapMarkers.map((marker, index) => (
            <div 
                key={index}
                className="absolute flex items-center justify-center bg-white border-[3px] border-[#0F58BF] rounded-full font-bold text-slate-900 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                style={{ 
                top: marker.top, 
                left: marker.left,
                width: marker.count > 20 ? '50px' : '40px',
                height: marker.count > 20 ? '50px' : '40px',
                transform: 'translate(-50%, -50%)'
                }}
            >
                {marker.count}
            </div>
            ))}

            {/* Zoom Controls (Top Right) */}
            <div className="absolute top-4 right-4 flex flex-col shadow-lg rounded-lg overflow-hidden">
            <button className="w-10 h-10 bg-[#0F58BF] hover:bg-[#0d4ea8] text-white flex items-center justify-center text-xl transition-colors border-b border-blue-800">
                +
            </button>
            <button className="w-10 h-10 bg-[#0F58BF] hover:bg-[#0d4ea8] text-white flex items-center justify-center text-2xl transition-colors pb-1">
                -
            </button>
            </div>
            
            {/* The "Search as I move" Overlay Button */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full shadow-md text-sm font-bold text-slate-700 flex items-center gap-2 border border-slate-100 z-10 cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="checkbox" className="accent-[#0F58BF] w-4 h-4 cursor-pointer" defaultChecked readOnly />
            Search as I move the map
            </div>

        </div>
    );
}