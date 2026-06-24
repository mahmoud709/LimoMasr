export function HotelMarquee() {
  const brands = [
    "Four Seasons", "The Ritz-Carlton", "Marriott", "Rixos", 
    "Steigenberger", "Hilton", "Mövenpick", "Kempinski", "Sofitel", "Fairmont"
  ];

  return (
    <div className="w-full bg-[#1a2b3c] py-6 overflow-hidden flex items-center relative border-y border-white/5">
      <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-[#1a2b3c] to-transparent z-10"></div>
      <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-[#1a2b3c] to-transparent z-10"></div>
      
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Double the array for seamless infinite scrolling */}
        {[...brands, ...brands].map((brand, idx) => (
          <span 
            key={idx} 
            className="text-white/40 text-xl md:text-2xl font-black uppercase tracking-widest mx-8 hover:text-[#d0a755] transition-colors cursor-default"
          >
            {brand}
          </span>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: scroll 60s linear infinite;
        }
        [dir="rtl"] .animate-marquee {
          animation: scroll-rtl 60s linear infinite;
        }
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
      `}} />
    </div>
  );
}
