import React from 'react';
import { Wifi } from 'lucide-react';

export const CreditCard = ({ cardData }) => {
  return (
    <div className="relative w-full aspect-[1.6/1] max-w-[400px] mx-auto rounded-[1.25rem] p-6 text-white shadow-xl overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform duration-300" 
         style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)' }}>
      
      {/* Metallic / Texture overaly */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, transparent 60%)' }}></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}></div>
      
      <div className="relative h-full flex flex-col justify-between z-10 w-full overflow-hidden">
        <div className="flex justify-between items-start w-full">
          <Wifi size={20} className="sm:size-6 md:size-7 rotate-90 opacity-80 shrink-0" strokeWidth={2.5} />
          <div className="text-right overflow-hidden flex-1 pl-3 sm:pl-4">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.14em] font-mono font-medium drop-shadow-sm opacity-90 truncate w-full">{cardData.number || '**** **** **** ****'}</p>
            <p className="text-[0.65rem] sm:text-xs font-mono opacity-70 mt-1 mr-1 float-right tracking-widest text-[#94a3b8]">{cardData.expiry || 'MM/YY'}</p>
          </div>
        </div>
        
        <div className="w-full">
          <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-md bg-gradient-to-br from-[#f8fafc] via-[#cbd5e1] to-[#94a3b8] mb-3 sm:mb-4 flex items-center justify-center opacity-90 shadow-[0_2px_4px_rgba(0,0,0,0.5)] border border-white/30 shrink-0">
            {/* Chip engrave lines */}
            <div className="w-8 h-5 sm:w-9 sm:h-6 border border-black/20 rounded-sm grid grid-cols-2 gap-[1px] p-[1px]">
               <div className="border border-black/10 rounded-[1px]"></div><div className="border border-black/10 rounded-[1px]"></div>
               <div className="border border-black/10 rounded-[1px]"></div><div className="border border-black/10 rounded-[1px]"></div>
            </div>
          </div>
          <div className="flex justify-between items-end w-full overflow-hidden gap-2">
            <div className="overflow-hidden flex-1 pr-2">
              <p className="text-[0.5rem] sm:text-[0.65rem] md:text-xs uppercase tracking-wider opacity-60 mb-0.5 font-medium text-[#cbd5e1]">Card Holder Name</p>
              <p className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-md tracking-wide truncate w-full">{cardData.name || 'CARD HOLDER'}</p>
            </div>
            <div className="font-bold italic text-xl sm:text-2xl md:text-3xl tracking-tighter mix-blend-overlay opacity-90 font-serif drop-shadow-lg shrink-0">VISA</div>
          </div>
        </div>
      </div>
    </div>
  );
};
