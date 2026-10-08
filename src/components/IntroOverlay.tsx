import React, { useState } from 'react';
import { Volume2, Sparkles, Heart } from 'lucide-react';

interface IntroOverlayProps {
  onEnter: () => void;
  isVisible: boolean;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onEnter, isVisible }) => {
  const [isFading, setIsFading] = useState<boolean>(false);

  if (!isVisible) return null;

  const handleClick = () => {
    setIsFading(true);
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 select-none p-6 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle background cosmic radial vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-rose-950/20 via-black to-black pointer-events-none" />

      <div className="relative text-center max-w-lg space-y-6 z-10">
        {/* Editorial Sub-badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-rose-300/20 bg-rose-950/30 text-[11px] font-sans-clean tracking-[0.25em] uppercase text-rose-200/90 shadow-sm animate-pulse">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Primer Aniversario</span>
          <span aria-hidden="true">·</span>
          <span>365 Días</span>
        </div>

        {/* Cinematic Title */}
        <div className="space-y-2">
          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-300">
            Nuestra Galaxia
          </h1>
          <p className="font-cormorant italic text-lg sm:text-xl text-rose-200/80 tracking-wide">
            "Donde cada latido tuyo es una estrella en mi universo"
          </p>
        </div>

        {/* Awwwards Style Interactive Enter Button */}
        <div className="pt-6">
          <button
            onClick={handleClick}
            className="group relative inline-flex items-center gap-3.5 px-8 py-4 rounded-full border border-rose-300/30 bg-black/40 hover:bg-rose-950/30 text-rose-100 hover:text-white transition-all duration-500 shadow-2xl hover:shadow-rose-900/50 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            {/* Pulsing ambient border glow */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 opacity-20 blur-sm group-hover:opacity-60 transition duration-500" />

            <Volume2 className="relative w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="relative font-sans-clean text-xs sm:text-sm font-medium tracking-[0.18em] uppercase">
              Entrar al universo
            </span>
            <Heart className="relative w-3.5 h-3.5 fill-rose-500 text-rose-500 group-hover:scale-125 transition-transform" />
          </button>
        </div>

        {/* Subtle helper caption */}
        <p className="text-[11px] text-neutral-400 font-sans-clean tracking-wider">
          Usa audífonos para una inmersión completa
        </p>
      </div>
    </div>
  );
};
