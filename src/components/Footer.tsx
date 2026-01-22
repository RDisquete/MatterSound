interface FooterProps {
    invert?: boolean;
  }
  
  export const Footer = ({ invert }: FooterProps) => {
    const logoPath = "/Logo lila.png"; 
  
    return (
      <footer 
        className={`absolute bottom-6 left-12 right-12 flex justify-between items-center text-[7px] font-mono tracking-[0.4em] uppercase z-[70] transition-all duration-700 
        ${invert ? 'text-[#e8e4d9]/80' : 'text-black/40'}`}
      >
        <div className="flex gap-8">
          <span className="hidden md:inline">Channel: Analog_01 // Scale: Log_Scale</span>
          <span>{new Date().getFullYear()} © RDisquete</span>
        </div>
  
        <div className={`h-[1px] flex-grow mx-8 transition-colors duration-700 hidden sm:block 
          ${invert ? 'bg-[#e8e4d9]/10' : 'bg-black/10'}`} 
        />
  
        <a 
          href="https://rdisquete.es" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative flex items-center justify-end group min-w-[150px] h-14"
        >
          <div className="absolute inset-0 flex items-center justify-end transition-all duration-500 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
            <div className={`flex items-center gap-3 px-4 py-2 border rounded-xl backdrop-blur-sm transition-colors duration-700
              ${invert ? 'border-[#e8e4d9]/20 bg-white/5' : 'border-black/10 bg-black/5'}`}>
              
              <span className="text-[6px] tracking-widest opacity-50 font-mono">LINK_ID: 01</span>
              
              <img 
                src={logoPath} 
                alt="R-Disquete Logo" 
                className={`h-7 w-auto object-contain transition-all duration-700 
                  ${invert ? 'brightness-200 grayscale invert' : ''}`}
              />
            </div>
          </div>
  
          <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-2">
              <span 
                className={`text-2xl lowercase tracking-tighter leading-none transition-colors duration-700 ${invert ? 'text-[#e8e4d9]' : 'text-black'}`}
                style={{ 
                  fontFamily: 'serif', 
                  fontStyle: 'italic',
                  fontWeight: 400
                }}
              >
                rdisquete
              </span>
              <span className="text-[5px] opacity-40 mt-1 tracking-[0.2em]">Portfolio_Access</span>
          </div>
        </a>
      </footer>
    );
  };