import React, { useState, useCallback } from 'react';
import { AwwwardsGalaxy3D } from './components/AwwwardsGalaxy3D';
import { IntroOverlay } from './components/IntroOverlay';
import { LoveLetterModal } from './components/LoveLetterModal';
import { AudioPlayer } from './components/AudioPlayer';
import { StandaloneExporterModal } from './components/StandaloneExporterModal';
import { romanticSynth } from './utils/audioSynthesizer';
import { Heart, Sparkles, Code2, Compass } from 'lucide-react';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isUIRevealed, setIsUIRevealed] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isExporterOpen, setIsExporterOpen] = useState<boolean>(false);

  // Triggered when user clicks "Enciende el sonido y haz clic"
  const handleEnterExperience = useCallback(() => {
    setHasEntered(true);
    // Start warm acoustic synthesizer melody immediately on user interaction
    try {
      romanticSynth.start();
    } catch {
      // AudioContext fallback
    }
  }, []);

  // Triggered when GSAP camera flight arrives at destination
  const handleEnterFinished = useCallback(() => {
    setIsUIRevealed(true);
  }, []);

  const handleOpenLetter = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseLetter = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white select-none">
      {/* 1. Epic Three.js WebGL Scene with Bloom Postprocessing & 7,800 Particles */}
      <AwwwardsGalaxy3D
        hasEntered={hasEntered}
        onEnterFinished={handleEnterFinished}
        onHeartClick={handleOpenLetter}
        isModalOpen={isModalOpen}
      />

      {/* 2. Intro Black Overlay (Awwwards Style) */}
      <IntroOverlay
        onEnter={handleEnterExperience}
        isVisible={!hasEntered}
      />

      {/* 3. Top Floating Controls (Visible after entrance) */}
      {hasEntered && (
        <header
          className={`fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 pointer-events-none flex items-start justify-between transition-opacity duration-1000 ${
            isUIRevealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Left: Standalone index.html Export Modal Button */}
          <div className="pointer-events-auto">
            <button
              onClick={() => setIsExporterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-[11px] text-rose-200 hover:text-white hover:border-rose-400/40 transition-all shadow-md group"
              title="Descargar o copiar el código index.html autónomo"
            >
              <Code2 className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="font-sans-clean font-medium">index.html Autónomo</span>
            </button>
          </div>

          {/* Right: Floating Minimalist Music Player */}
          <div className="pointer-events-auto">
            <AudioPlayer />
          </div>
        </header>
      )}

      {/* 4. Main HTML Overlay UI (Revealed progressively after GSAP camera flight) */}
      {hasEntered && (
        <div
          className={`fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-10 select-none transition-all duration-1000 ${
            isUIRevealed && !isModalOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 pointer-events-none translate-y-6'
          }`}
        >
          {/* Main Title Hero Section */}
          <div className="text-center pt-10 sm:pt-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/40 border border-rose-400/20 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-[11px] font-sans-clean tracking-widest uppercase text-rose-200/90 font-medium">
                365 Días Juntos
              </span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-6xl md:text-7xl font-bold tracking-wider text-rose-gradient drop-shadow-2xl">
              1 Año Juntos
            </h1>

            <p className="font-cinzel text-xl sm:text-3xl text-rose-200 font-semibold tracking-wide mt-1">
              Feliz primer aniversario, mi amor ❤️
            </p>

            <p className="font-cormorant italic text-base sm:text-xl text-rose-200/90 max-w-md mx-auto">
              "Construyendo un universo donde solo existimos tú y yo."
            </p>
          </div>

          {/* Bottom Interactive Affordance */}
          <div className="text-center pb-6 sm:pb-8">
            <button
              onClick={handleOpenLetter}
              className="pointer-events-auto inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-panel border border-rose-300/30 text-rose-100 hover:text-white hover:border-rose-300/60 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 cursor-pointer group"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 group-hover:scale-125 transition-transform" />
              <span className="text-xs sm:text-sm font-sans-clean font-medium tracking-wide">
                Abrir Nuestra Carta de Aniversario
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>

            <p className="text-[10px] text-neutral-400 mt-2 font-sans-clean tracking-wider">
              Toca el corazón 3D o inclina tu pantalla para explorar la galaxia
            </p>
          </div>
        </div>
      )}

      {/* 5. Glassmorphism Love Letter & Photographs Modal */}
      <LoveLetterModal
        isOpen={isModalOpen}
        onClose={handleCloseLetter}
      />

      {/* 6. Single-File index.html Exporter Modal */}
      <StandaloneExporterModal
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
      />
    </main>
  );
}
