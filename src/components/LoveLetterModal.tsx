import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles, Upload, Edit3, Check, RefreshCw, Calendar, Music } from 'lucide-react';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({ isOpen, onClose }) => {
  // Initial generated images
  const defaultPhoto1 = '/src/assets/images/anniversary_couple_sunset_1791430596521.jpg';
  const defaultPhoto2 = '/src/assets/images/anniversary_couple_cozy_1791430605820.jpg';

  const [photo1, setPhoto1] = useState<string>(defaultPhoto1);
  const [photo2, setPhoto2] = useState<string>(defaultPhoto2);
  const [textMode, setTextMode] = useState<'romantic' | 'lorem' | 'custom'>('romantic');

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Love letter text presets
  const romanticLetter = `Mi amor,

Hoy se cumple nuestro primer año juntos, 365 días desde que comenzaste a iluminar cada uno de mis días. Parece que fue ayer cuando empezamos a escribir esta historia, pero al mismo tiempo siento que nuestras almas se conocen desde siempre.

Gracias por cada sonrisa compartida, por los abrazos en los días difíciles, por cada canción que cantamos en el camino y por convertir los momentos más sencillos en recuerdos eternos. Mirar hacia atrás este año es ver complicidad, ternura y un amor que solo sigue creciendo con cada latido.

Te amo con todo mi corazón. Feliz primer aniversario, y por muchísimos años más de la mano.

Siempre tuyo,
Con todo mi amor ♥`;

  const loremLetter = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.

Aeterno tecum,
365 dies amoris nostri ♥`;

  const [customLetter, setCustomLetter] = useState<string>(romanticLetter);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Launch celebration confetti when opening modal
  useEffect(() => {
    if (isOpen) {
      // Fire romantic heart confetti burst
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#ffd166', '#fbcfe8', '#e11d48'],
          shapes: ['circle'],
        });

        const timer = setTimeout(() => {
          confetti({
            particleCount: 30,
            spread: 90,
            origin: { y: 0.4 },
            colors: ['#ffe4b5', '#fda4af', '#f43f5e'],
          });
        }, 400);

        return () => clearTimeout(timer);
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentDisplayLetter =
    textMode === 'romantic'
      ? romanticLetter
      : textMode === 'lorem'
      ? loremLetter
      : customLetter;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md transition-opacity duration-500 animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Main Glassmorphism Modal Card */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel rounded-2xl p-5 sm:p-8 text-neutral-100 shadow-2xl border border-rose-300/20 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative rose glow in corner */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Actions Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-rose-500/20 text-rose-300">
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
            </span>
            <div className="flex items-center gap-2 text-xs font-medium text-rose-200/80 tracking-wide uppercase">
              <span>Primer Aniversario</span>
              <span aria-hidden="true">·</span>
              <span>365 Días Juntos</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher: Romantic / Lorem Ipsum */}
            <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => {
                  setTextMode('romantic');
                  setIsEditing(false);
                }}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  textMode === 'romantic'
                    ? 'bg-rose-500/30 text-rose-200 font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Carta Romántica
              </button>
              <button
                onClick={() => {
                  setTextMode('lorem');
                  setIsEditing(false);
                }}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  textMode === 'lorem'
                    ? 'bg-rose-500/30 text-rose-200 font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Lorem Ipsum
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Title & Elegant Romantic Header */}
        <div className="text-center py-6 sm:py-8 space-y-2">
          <h2 className="font-cinzel text-2xl sm:text-4xl font-semibold tracking-wide text-rose-gradient">
            Nuestra Historia de Amor
          </h2>
          <p className="font-cormorant italic text-lg sm:text-xl text-rose-200/90 max-w-lg mx-auto">
            "El tiempo a tu lado no se mide en segundos, sino en latidos y momentos que nunca olvidaré."
          </p>

          {/* Elegant Stats Ribbon */}
          <div className="pt-2 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs text-amber-200/80 font-sans-clean">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              1 Año Completo
            </span>
            <span aria-hidden="true" className="text-white/20">|</span>
            <span>12 Meses de Recuerdos</span>
            <span aria-hidden="true" className="text-white/20">|</span>
            <span>8,760 Horas de Cariño</span>
          </div>
        </div>

        {/* Two Polaroids / Photograph Placeholders Grid */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Photo Slot 1 */}
          <div className="group relative bg-white/5 p-3 rounded-xl border border-white/10 hover:border-rose-400/30 transition-all duration-300 shadow-lg">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 border border-white/5">
              <img
                src={photo1}
                alt="Fotografía romántica de nosotros 1"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-rose-100 font-sans-clean">
                <span className="font-medium tracking-wide">El comienzo de nuestra magia</span>
                <span className="text-[11px] text-amber-200/90 font-cormorant italic">Foto 01</span>
              </div>
            </div>

            {/* Photo 1 Replacement Affordance */}
            <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-400 px-1">
              <span className="text-[11px] text-neutral-400">Recuerdo especial</span>
              <button
                onClick={() => fileInputRef1.current?.click()}
                className="flex items-center gap-1.5 text-[11px] text-rose-300 hover:text-rose-100 transition-colors"
                title="Cambiar por una foto tuya"
              >
                <Upload className="w-3 h-3" />
                <span>Cambiar foto</span>
              </button>
              <input
                type="file"
                ref={fileInputRef1}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, setPhoto1)}
              />
            </div>
          </div>

          {/* Photo Slot 2 */}
          <div className="group relative bg-white/5 p-3 rounded-xl border border-white/10 hover:border-rose-400/30 transition-all duration-300 shadow-lg">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 border border-white/5">
              <img
                src={photo2}
                alt="Fotografía romántica de nosotros 2"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-rose-100 font-sans-clean">
                <span className="font-medium tracking-wide">Caminando siempre juntos</span>
                <span className="text-[11px] text-amber-200/90 font-cormorant italic">Foto 02</span>
              </div>
            </div>

            {/* Photo 2 Replacement Affordance */}
            <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-400 px-1">
              <span className="text-[11px] text-neutral-400">Noches inolvidables</span>
              <button
                onClick={() => fileInputRef2.current?.click()}
                className="flex items-center gap-1.5 text-[11px] text-rose-300 hover:text-rose-100 transition-colors"
                title="Cambiar por una foto tuya"
              >
                <Upload className="w-3 h-3" />
                <span>Cambiar foto</span>
              </button>
              <input
                type="file"
                ref={fileInputRef2}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, setPhoto2)}
              />
            </div>
          </div>
        </div>

        {/* Love Letter Section */}
        <div className="relative mt-6 p-6 sm:p-8 rounded-xl bg-black/35 border border-rose-300/15 shadow-inner">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="font-cinzel text-sm sm:text-base tracking-wider uppercase text-rose-200">
                Carta de Amor
              </h3>
            </div>

            <button
              onClick={() => {
                if (textMode !== 'custom') {
                  setCustomLetter(currentDisplayLetter);
                  setTextMode('custom');
                }
                setIsEditing(!isEditing);
              }}
              className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-100 transition-colors"
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Guardar edición</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Personalizar texto</span>
                </>
              )}
            </button>
          </div>

          {/* Letter Body */}
          {isEditing ? (
            <textarea
              value={customLetter}
              onChange={(e) => setCustomLetter(e.target.value)}
              rows={8}
              className="w-full bg-black/50 border border-rose-300/30 rounded-lg p-4 font-playfair text-base sm:text-lg text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all resize-y"
              placeholder="Escribe aquí tu dedicatoria especial..."
            />
          ) : (
            <div className="font-playfair text-base sm:text-lg leading-relaxed sm:leading-loose text-rose-50/95 whitespace-pre-line tracking-normal">
              {currentDisplayLetter}
            </div>
          )}
        </div>

        {/* Bottom Closing Action */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-rose-200/70 font-sans-clean">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Creado con amor para celebrar 1 año inolvidable</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-medium text-xs tracking-wider uppercase hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-rose-900/30"
          >
            Volver a la Galaxia 3D
          </button>
        </div>
      </div>
    </div>
  );
};
