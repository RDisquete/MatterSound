import { useState } from 'react';
import { Footer } from './components/Footer';
import { Visualizer } from './components/Visualizer';
import { useAudio } from './hooks/useAudio';

function App() {
  const { startAudio, getFrequencyData, isReady } = useAudio();
  const [invert, setInvert] = useState(false);

  const paperTexture = "/ancient-paper-texture-background-old-vintage-2025-01-08-10-33-18-utc.jpg";
  const logoPath = "/Logo lila.png";

  return (
    <main className={`relative w-full h-screen flex items-center justify-center font-serif overflow-hidden transition-colors duration-700 ${invert ? 'bg-[#242422]' : 'bg-[#e8e4d9]'}`}>
      
      
      <div 
        className={`absolute inset-0 pointer-events-none mix-blend-multiply z-[100] transition-opacity duration-700 ${invert ? 'invert opacity-10' : 'opacity-[0.25]'}`}
        style={{ backgroundImage: `url(${paperTexture})` }}
      />

      {!isReady && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[110] flex items-center gap-4 rotate-90 origin-right opacity-20 select-none">
          <p className={`font-mono text-[7px] tracking-[0.4em] uppercase whitespace-nowrap ${invert ? 'text-white' : 'text-black'}`}>
            Studio_Ref_2026
          </p>
          <img 
            src={logoPath} 
            alt="" 
            className={`h-5 w-auto object-contain -rotate-90 transition-all duration-700 ${invert ? 'brightness-200 grayscale invert' : 'grayscale'}`} 
          />
        </div>
      )}

      {!isReady ? (
        <div className="relative z-10 w-full max-w-md p-12 text-center">
          <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${invert ? 'border-white/20' : 'border-black/20'}`} />
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${invert ? 'border-white/20' : 'border-black/20'}`} />

          <header className="mb-16">
            <h2 className={`text-[10px] uppercase tracking-[0.5em] mb-4 font-mono ${invert ? 'text-white/40' : 'text-black/40'}`}>
            DESIGNED BY RDISQUETE
            </h2>
            <h1 className={`text-6xl italic font-black leading-none tracking-tighter uppercase select-none ${invert ? 'text-white' : 'text-black'}`}>
              Matter <br/> & Sound
            </h1>
            <div className={`h-[1px] w-12 mx-auto mt-8 ${invert ? 'bg-white/40' : 'bg-black/40'}`} />
          </header>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={startAudio}
              className="relative outline-none group"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full transition-all duration-1000 animate-pulse 
                  ${invert ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]'}`} 
                />
                <span className="font-mono text-[6px] tracking-[0.3em] opacity-40 uppercase">Standby</span>
              </div>

              <div className={`relative px-12 py-5 border-2 transition-all duration-300 z-10 overflow-hidden
                ${invert ? 'border-white text-white group-hover:bg-white group-hover:text-black' 
                         : 'border-black text-black group-hover:bg-black group-hover:text-[#e8e4d9]'}`}>
                <span className="tracking-[0.4em] uppercase text-sm font-black italic">Power_On</span>
                
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-current/10 to-transparent" />
              </div>

              <div className={`absolute inset-0 transition-transform duration-200 translate-x-2 translate-y-2 border-2 opacity-20
                ${invert ? 'border-white' : 'border-black'}`} />
            </button>
            
            <p className={`font-mono text-[8px] tracking-widest uppercase opacity-30 mt-4`}>
              Master_Control_Unit_01
            </p>
          </div>

          <footer className="mt-20 space-y-3">
            <p className={`text-[9px] uppercase tracking-widest italic font-mono ${invert ? 'text-white/30' : 'text-black/30'}`}>
              Acceso al micro requerido para modulación física
            </p>
            <div className={`flex justify-center gap-6 text-[8px] font-mono opacity-30 ${invert ? 'text-white' : 'text-black'}`}>
              <span>FREQ: 44.1KHZ</span>
              <span>•</span>
              <span>TYPE: ANALOG</span>
            </div>
          </footer>
        </div>
      ) : (
        <>
          <Visualizer 
            getFrequencyData={getFrequencyData} 
            invert={invert} 
            setInvert={setInvert} 
          />
          <Footer invert={invert} />
        </>
      )}
    </main>
  );
}

export default App;