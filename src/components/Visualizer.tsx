import { useEffect, useRef, useState } from 'react';

interface VisualizerProps {
  getFrequencyData: () => Uint8Array;
  invert: boolean;
  setInvert: (val: boolean) => void;
}

interface Particle {
  angle: number; ringIndex: number; x: number; y: number; originRadius: number; size: number;
}

const BANDS = [
  { name: "SUB", range: [0, 2] }, { name: "BASS", range: [2, 8] },
  { name: "L-MID", range: [8, 20] }, { name: "MID", range: [20, 50] },
  { name: "H-MID", range: [50, 100] }, { name: "PRES", range: [100, 180] },
  { name: "TREB", range: [180, 300] }, { name: "AIR", range: [300, 512] }
];

export const Visualizer = ({ getFrequencyData, invert, setInvert }: VisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  
  const displayBarsRef = useRef<number[]>(new Array(60).fill(0));
  
  const [activeBands, setActiveBands] = useState<boolean[]>(new Array(8).fill(true));
  const [isInitialized, setIsInitialized] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [gain, setGain] = useState(1.0); 
  const [isMuted, setIsMuted] = useState(false);

  const logoPath = "/Logo lila.png";

  const initParticles = (width: number, height: number) => {
    const p: Particle[] = [];
    const baseRadius = Math.min(width, height) * 0.08;
    for (let r = 0; r < BANDS.length; r++) {
      const numParticles = 100 + (r * 60);
      for (let i = 0; i < numParticles; i++) {
        p.push({
          angle: (i / numParticles) * Math.PI * 2,
          ringIndex: r, x: 0, y: 0, 
          originRadius: baseRadius + (r * 28), 
          size: Math.random() * 1.5 + 0.3
        });
      }
    }
    particles.current = p;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
      setIsInitialized(true);
    };
    window.addEventListener('resize', resize);
    resize();

    let animId: number;
    let time = 0;

    const render = () => {
      const data = isMuted ? new Uint8Array(512).fill(0) : getFrequencyData();
      
      if (data.length > 0 && isInitialized) {
        time += 0.01 * rotationSpeed;

        for (let i = 0; i < 60; i++) {
          const logIndex = Math.floor(Math.pow(i / 60, 2) * (data.length * 0.8));
          let val = data[logIndex] || 0;
          if (i === 0) val *= 0.6; 
          const target = (val / 255) * 100 * gain;
          
          if (target > displayBarsRef.current[i]) {
            displayBarsRef.current[i] = target;
          } else {
            displayBarsRef.current[i] -= 2.5;
          }
        }

        ctx.fillStyle = invert ? '#121212' : '#e8e4d9'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2 + (glitch ? (Math.random() - 0.5) * 20 : 0);
        const centerY = canvas.height / 2;

        const ringEnergies = BANDS.map(b => {
          const s = data.slice(b.range[0], b.range[1]);
          const avg = (s.reduce((a, b) => a + b, 0) / (s.length || 1)) / 255;
          return avg * gain;
        });

        if (ringEnergies[0] > 0.5) setRotationSpeed(2.2);
        else setRotationSpeed(Math.max(1, rotationSpeed - 0.05));

        // Dibujar partículas
        particles.current.forEach((p) => {
          if (!activeBands[p.ringIndex]) return;
          const energy = ringEnergies[p.ringIndex];
          const currentAngle = p.angle + time * (0.2 + (p.ringIndex * 0.05));
          const dist = p.originRadius + (energy * 85) + (glitch ? 60 : 0);
          p.x = centerX + Math.cos(currentAngle) * dist;
          p.y = centerY + Math.sin(currentAngle) * dist;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = invert ? `rgba(232, 228, 217, ${0.15 + energy})` : `rgba(15, 15, 15, ${0.1 + energy * 0.9})`;
          ctx.fill();
        });

        const barAreaY = canvas.height - 40;
        const barWidth = (canvas.width - 96) / 60;
        
        ctx.beginPath();
        ctx.strokeStyle = invert ? 'rgba(232, 228, 217, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        ctx.moveTo(48, barAreaY);
        ctx.lineTo(canvas.width - 48, barAreaY);
        ctx.stroke();

        displayBarsRef.current.forEach((h, i) => {
          const x = 48 + (i * barWidth);
          const height = (h / 100) * 80;
          ctx.fillStyle = invert ? '#e8e4d9' : '#000000';
          ctx.globalAlpha = 0.05 + (h / 100) * 0.95;
          ctx.fillRect(x, barAreaY, barWidth - 3, -Math.max(1, height));
        });
        ctx.globalAlpha = 1;
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [getFrequencyData, isInitialized, activeBands, glitch, invert, rotationSpeed, gain, isMuted]);

  return (
    <div className={`relative w-full h-screen overflow-hidden p-8 font-serif transition-colors duration-700 ${invert ? 'text-[#e8e4d9]' : 'text-black'}`}>
      
      <canvas ref={canvasRef} className="w-full h-full rounded-[30px]" />

      {/* HEADER */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-start z-[60]">
        <div className="flex flex-col select-none cursor-crosshair group" onMouseDown={() => setGlitch(true)} onMouseUp={() => setGlitch(false)}>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase transition-all">
            {glitch ? "SYS_ERROR_0x1" : "Matter_&_Sound"}
          </h1>
          
          <a href="https://rdisquete.es" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 mt-4 transition-all duration-500 opacity-40 group-hover:opacity-100 hover:translate-x-1">
            <img src={logoPath} alt="" className={`h-4 w-auto object-contain transition-all duration-700 ${invert ? 'brightness-200 grayscale invert' : 'grayscale'}`} />
            <span className="w-[1px] h-3 bg-current opacity-20"></span>
            <p className="font-mono text-[9px] tracking-[0.4em] uppercase whitespace-nowrap">Ref_Audio_Mod_02</p>
          </a>
        </div>

        <div className="flex items-center gap-12 mt-2">
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-[7px] tracking-widest opacity-40 uppercase">Signal</span>
            <div className="relative flex flex-col items-center gap-4">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isMuted ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse'}`} />
              <button onClick={() => setIsMuted(!isMuted)} className={`relative w-6 h-12 border transition-colors duration-500 flex items-center justify-center rounded-[2px] ${invert ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}`}>
                <div className="absolute w-[1px] h-8 bg-current opacity-20" />
                <div className={`w-3.5 h-5 border border-current transition-all duration-300 z-10 shadow-lg ${isMuted ? 'translate-y-3 bg-current' : '-translate-y-3 bg-transparent'}`} />
              </button>
            </div>
            <span className="font-mono text-[5px] opacity-40 uppercase">{isMuted ? "Stby" : "Live"}</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-[7px] tracking-widest opacity-40 uppercase">Mode</span>
            <button onClick={() => setInvert(!invert)} className={`relative w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-500 ${invert ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}`}>
              <div className="absolute inset-0 rotate-[-45deg] flex justify-between p-1 items-start opacity-20">
                <div className="w-[1px] h-1.5 bg-current" />
                <div className="w-[1px] h-1.5 bg-current rotate-[90deg]" />
              </div>
              <div className={`w-8 h-8 rounded-full border border-current transition-transform duration-500 flex items-start justify-center p-1 ${invert ? 'rotate-[135deg]' : 'rotate-[-45deg]'}`}>
                <div className="w-1 h-3 bg-current rounded-full" />
              </div>
            </button>
            <span className="font-mono text-[5px] opacity-40 uppercase">{invert ? "Dark" : "Light"}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-40 left-12 right-12 z-[60] flex justify-between items-end border-t border-current/5 pt-8">
        <div className="flex flex-col gap-4">
          <span className="text-[8px] font-mono opacity-40 uppercase tracking-[0.4em]">Frequency_Modulators</span>
          <div className="flex gap-6">
            {BANDS.map((band, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <span className="font-mono text-[7px] opacity-60 uppercase">{band.name}</span>
                <button 
                  onClick={() => { const n = [...activeBands]; n[i] = !n[i]; setActiveBands(n); }}
                  className={`relative w-5 h-9 border rounded-[1px] transition-colors duration-500 flex items-center justify-center ${invert ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}
                >
                  <div className="absolute w-[1px] h-5 bg-current opacity-10" />
                  <div className={`w-3 h-4 border border-current transition-all duration-300 z-10 ${activeBands[i] ? '-translate-y-2 bg-transparent' : 'translate-y-2 bg-current opacity-40'}`} />
                </button>
                <div className={`w-1 h-1 rounded-full transition-colors duration-500 ${activeBands[i] ? 'bg-current shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'bg-current opacity-5'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-[7px] tracking-widest opacity-40 uppercase italic">Input_Gain</span>
            <button 
                onClick={() => setGain(prev => prev >= 2.0 ? 0.5 : prev + 0.5)}
                className={`relative w-14 h-14 rounded-full border flex items-center justify-center transition-colors duration-500 ${invert ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}`}
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="absolute h-full w-[1px] bg-current" style={{ transform: `rotate(${idx * 30 - 75}deg)` }} />
                    ))}
                    <div className={`absolute inset-1 rounded-full ${invert ? 'bg-[#121212]' : 'bg-[#e8e4d9]'}`} />
                </div>
                <div className={`w-10 h-10 rounded-full border border-current transition-transform duration-500 flex items-start justify-center p-1`}
                     style={{ transform: `rotate(${(gain - 0.5) * 120 - 90}deg)` }}>
                    <div className="w-1.5 h-3 bg-current rounded-sm" />
                </div>
            </button>
            <span className="font-mono text-[7px] font-bold italic">{gain.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
};