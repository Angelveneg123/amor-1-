import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Settings, Play, Pause, Disc3, Upload, Link } from 'lucide-react';
import { romanticSynth } from '../utils/audioSynthesizer';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [musicMode, setMusicMode] = useState<'synth' | 'audioTag'>('synth');
  const [customAudioUrl, setCustomAudioUrl] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [songTitle, setSongTitle] = useState<string>('Melodía Romántica en Guitarra');

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (musicMode === 'audioTag' && audioRef.current && customAudioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Audio tag play blocked or failed:', err);
            // Fallback to romantic synth
            romanticSynth.start();
            setIsPlaying(true);
            setMusicMode('synth');
            setSongTitle('Melodía Romántica en Guitarra');
          });
      }
    } else {
      // Use synthesized romantic fingerstyle acoustic melody
      if (isPlaying) {
        romanticSynth.stop();
        setIsPlaying(false);
      } else {
        romanticSynth.start();
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
      setMusicMode('audioTag');
      romanticSynth.stop();

      // Autoplay selected song
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play().then(() => setIsPlaying(true));
        }
      }, 100);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAudioUrl && audioRef.current) {
      setMusicMode('audioTag');
      romanticSynth.stop();
      audioRef.current.src = customAudioUrl;
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  return (
    <>
      {/* 
        Structured HTML5 <audio> element as requested:
        Ready for custom MP3/corrido romántico audio file or URL
      */}
      <audio
        ref={audioRef}
        id="romantic-audio-player"
        src={customAudioUrl || undefined}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Floating Audio Control in Top Right Corner */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {/* Animated Visualizer Waves Pill */}
        {isPlaying && (
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-rose-400/20 shadow-md">
            <span className="w-1 h-3 bg-rose-400 rounded-full animate-pulse" />
            <span className="w-1 h-4 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-1 h-2 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span className="w-1 h-5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="text-[11px] font-sans-clean text-rose-200/90 ml-1.5 max-w-[130px] truncate">
              {songTitle}
            </span>
          </div>
        )}

        {/* Floating Play / Pause Romantic Button */}
        <button
          onClick={togglePlay}
          className={`group relative p-3 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center border ${
            isPlaying
              ? 'bg-gradient-to-tr from-rose-600 to-rose-400 text-white border-rose-300/40 shadow-rose-900/40 scale-105'
              : 'glass-pill text-rose-200 hover:text-white hover:bg-white/10 border-white/15'
          }`}
          title={isPlaying ? 'Pausar música romántica' : 'Reproducir música de aniversario'}
        >
          {isPlaying ? (
            <Disc3 className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          ) : (
            <Music className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}

          {/* Pulse ring when playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full border border-rose-400/50 animate-ping opacity-40 pointer-events-none" />
          )}
        </button>

        {/* Settings button to customize song or corrido */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="p-2.5 rounded-full glass-pill text-neutral-300 hover:text-white transition-colors"
          title="Ajustar canción o corrido romántico"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Audio Configuration Dropdown Panel */}
      {showConfig && (
        <div className="fixed top-18 right-4 z-40 w-80 sm:w-96 glass-panel rounded-xl p-4 text-xs shadow-2xl border border-rose-300/20 text-neutral-200 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 font-cinzel text-sm text-rose-200 font-semibold">
            <span className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-rose-400" />
              Música de Aniversario
            </span>
            <button
              onClick={() => setShowConfig(false)}
              className="text-neutral-400 hover:text-white text-base leading-none"
            >
              ×
            </button>
          </div>

          <p className="text-[11px] text-neutral-300 mb-3 leading-relaxed">
            Puedes escuchar nuestra melodía suave de guitarra acústica o poner tu corrido romántico favorito.
          </p>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10 mb-3">
            <button
              onClick={() => {
                setMusicMode('synth');
                setSongTitle('Melodía Romántica en Guitarra');
                if (isPlaying) {
                  audioRef.current?.pause();
                  romanticSynth.start();
                }
              }}
              className={`py-1.5 px-2 rounded font-medium transition-colors ${
                musicMode === 'synth'
                  ? 'bg-rose-500/30 text-rose-200 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Guitarra Romántica
            </button>
            <button
              onClick={() => {
                setMusicMode('audioTag');
                if (isPlaying) {
                  romanticSynth.stop();
                  if (customAudioUrl && audioRef.current) {
                    audioRef.current.play();
                  }
                }
              }}
              className={`py-1.5 px-2 rounded font-medium transition-colors ${
                musicMode === 'audioTag'
                  ? 'bg-rose-500/30 text-rose-200 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Canción Personalizada
            </button>
          </div>

          {musicMode === 'audioTag' && (
            <div className="space-y-3 pt-1">
              {/* File upload for custom MP3/corrido */}
              <div>
                <label className="block text-[11px] text-rose-200 mb-1">
                  1. Cargar archivo de audio (MP3, WAV):
                </label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-rose-200 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Seleccionar canción desde tu dispositivo</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Or audio URL */}
              <form onSubmit={handleUrlSubmit}>
                <label className="block text-[11px] text-rose-200 mb-1">
                  2. O enlace directo a la canción:
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={customAudioUrl}
                    onChange={(e) => setCustomAudioUrl(e.target.value)}
                    placeholder="https://ejemplo.com/nuestro-corrido.mp3"
                    className="flex-1 bg-black/40 border border-white/15 rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium"
                  >
                    Cargar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Volume slider */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-rose-300" />
              Volumen
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </>
  );
};
