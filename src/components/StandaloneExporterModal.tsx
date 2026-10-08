import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, X, Sparkles } from 'lucide-react';

interface StandaloneExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExporterModal: React.FC<StandaloneExporterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // The complete, pure single-file index.html implementation with EffectComposer, UnrealBloomPass, GSAP, 7,500+ particles
  const standaloneHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>1 Año Juntos - Nuestra Galaxia 3D</title>

  <!-- Tipografías elegantes de Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap" rel="stylesheet">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      background-color: #000000;
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
    }

    #webgl-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: #000000;
    }

    /* 1. OVERLAY DE INTRODUCCIÓN */
    .intro-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000000;
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      text-align: center;
      transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 1.2s;
    }

    .intro-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .intro-badge {
      font-size: 0.72rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #fbcfe8;
      border: 1px solid rgba(244, 114, 182, 0.25);
      background: rgba(225, 29, 72, 0.1);
      padding: 0.45rem 1.2rem;
      border-radius: 9999px;
      margin-bottom: 1.5rem;
    }

    .intro-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(2.2rem, 5vw, 4.2rem);
      font-weight: 600;
      letter-spacing: 0.12em;
      background: linear-gradient(135deg, #ffffff 0%, #fed7aa 40%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .intro-sub {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
      color: rgba(254, 215, 170, 0.85);
      margin-bottom: 2.5rem;
    }

    .btn-enter {
      background: rgba(15, 5, 20, 0.6);
      border: 1px solid rgba(244, 114, 182, 0.4);
      color: #fff;
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 1.1rem 2.4rem;
      border-radius: 9999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 0 35px rgba(225, 29, 72, 0.3);
      transition: all 0.4s ease;
      backdrop-filter: blur(10px);
    }

    .btn-enter:hover {
      background: rgba(225, 29, 72, 0.35);
      border-color: #f472b6;
      box-shadow: 0 0 50px rgba(244, 63, 94, 0.6);
      transform: scale(1.05);
    }

    /* 2. UI PRINCIPAL (REVELADA POST-VUELO) */
    .main-ui {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2.5rem 1.5rem;
      opacity: 0;
      transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .main-ui.visible {
      opacity: 1;
    }

    .hero-text {
      text-align: center;
      transform: translateY(-20px);
      transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .main-ui.visible .hero-text {
      transform: translateY(0);
    }

    .anniversary-badge {
      font-size: 0.72rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #fbcfe8;
      display: inline-block;
      margin-bottom: 0.4rem;
    }

    .hero-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(2.4rem, 6vw, 4.8rem);
      font-weight: 700;
      letter-spacing: 0.08em;
      background: linear-gradient(135deg, #ffffff 0%, #fed7aa 45%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 45px rgba(244, 114, 182, 0.4);
    }

    .hero-sub {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
      color: rgba(254, 215, 170, 0.85);
      margin-top: 0.3rem;
    }

    .bottom-hint {
      text-align: center;
      transform: translateY(20px);
      transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .main-ui.visible .bottom-hint {
      transform: translateY(0);
    }

    .open-letter-btn {
      pointer-events: auto;
      background: rgba(18, 8, 24, 0.65);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 215, 180, 0.25);
      color: #fff;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.85rem 2rem;
      border-radius: 9999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      transition: all 0.3s;
    }

    .open-letter-btn:hover {
      background: rgba(225, 29, 72, 0.3);
      border-color: #f472b6;
      box-shadow: 0 0 35px rgba(244, 63, 94, 0.5);
      transform: scale(1.04);
    }

    /* 3. MODAL GLASSMORPHISM CON FOTOGRAFÍAS Y CARTA */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .glass-card {
      background: rgba(15, 8, 20, 0.75);
      backdrop-filter: blur(32px) saturate(180%);
      -webkit-backdrop-filter: blur(32px) saturate(180%);
      border: 1px solid rgba(255, 215, 180, 0.2);
      border-radius: 1.5rem;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(225, 29, 72, 0.2);
      max-width: 840px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 2.2rem;
      color: #ffffff;
      position: relative;
      transform: scale(0.92) translateY(20px);
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-overlay.active .glass-card {
      transform: scale(1) translateY(0);
    }

    .close-btn {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #fbcfe8;
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .photo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      margin: 1.8rem 0;
    }

    .photo-frame {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 0.75rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .photo-img {
      width: 100%;
      aspect-ratio: 4/3;
      object-fit: cover;
      border-radius: 0.6rem;
      display: block;
      background: #140a1c;
    }

    .photo-caption {
      margin-top: 0.6rem;
      font-size: 0.75rem;
      color: #fed7aa;
      font-style: italic;
      font-family: 'Cormorant Garamond', serif;
      text-align: center;
    }

    .letter-body {
      font-family: 'Playfair Display', serif;
      font-size: 1.05rem;
      line-height: 1.9;
      color: rgba(255, 245, 245, 0.95);
      background: rgba(0, 0, 0, 0.45);
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      white-space: pre-line;
      margin-top: 1.2rem;
    }

    /* 4. BOTÓN DE AUDIO MINIMALISTA */
    .music-btn {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 50;
      background: rgba(18, 8, 24, 0.65);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #fbcfe8;
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(0,0,0,0.6);
      transition: all 0.3s;
    }
    .music-btn:hover {
      transform: scale(1.08);
      border-color: #f472b6;
    }
    .music-btn.playing {
      background: linear-gradient(135deg, #e11d48, #f43f5e);
      color: #ffffff;
      box-shadow: 0 0 30px rgba(244, 63, 94, 0.6);
    }
  </style>

  <!-- GSAP CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

  <!-- Import maps para Three.js y Addons (EffectComposer & UnrealBloomPass) -->
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
      }
    }
  </script>
</head>
<body>

  <!-- Lienzo WebGL con Bloom -->
  <canvas id="webgl-canvas"></canvas>

  <!-- 1. Pantalla de Entrada Inicial -->
  <div id="introOverlay" class="intro-overlay">
    <span class="intro-badge">✦ Primer Aniversario ✦</span>
    <h1 class="intro-title">Nuestra Galaxia</h1>
    <p class="intro-sub">"365 días donde cada latido tuyo es una estrella"</p>
    <button id="btnEnter" class="btn-enter">
      <span>Enciende el sonido y haz clic</span>
      <span>♥</span>
    </button>
  </div>

  <!-- 2. UI Principal Superpuesta -->
  <div id="mainUI" class="main-ui">
    <div class="hero-text">
      <span class="anniversary-badge">365 Días Juntos</span>
      <h1 class="hero-title">1 Año Juntos</h1>
      <p class="hero-sub">"Construyendo un universo donde solo existimos tú y yo"</p>
    </div>

    <div class="bottom-hint">
      <button id="btnOpenLetter" class="open-letter-btn">
        <span>♥</span>
        <span>Abrir Nuestra Carta de Aniversario</span>
      </button>
    </div>
  </div>

  <!-- 3. Botón de Audio Minimalista -->
  <button id="musicToggle" class="music-btn" title="Audio">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  </button>

  <!-- Etiqueta <audio> estructurada para tu corrido o canción favorita -->
  <!-- Coloca la ruta de tu audio en 'src', ejemplo: src="nuestro_corrido.mp3" -->
  <audio id="audioPlayer" loop preload="auto" src=""></audio>

  <!-- 4. Modal Glassmorphism con Carta y Fotografías -->
  <div id="loveModal" class="modal-overlay">
    <div class="glass-card">
      <button id="closeModal" class="close-btn" title="Cerrar">&times;</button>
      
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span style="font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: #f472b6;">Para la persona más especial</span>
        <h2 style="font-family: 'Cinzel', serif; font-size: 2rem; margin-top: 0.3rem; color: #fed7aa;">Nuestra Historia de Amor</h2>
      </div>

      <!-- 2 Espacios para Fotografías -->
      <div class="photo-grid">
        <div class="photo-frame">
          <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" alt="Recuerdo 1" class="photo-img">
          <p class="photo-caption">El día que todo comenzó</p>
        </div>
        <div class="photo-frame">
          <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80" alt="Recuerdo 2" class="photo-img">
          <p class="photo-caption">Uno de tantos momentos mágicos juntos</p>
        </div>
      </div>

      <!-- Carta de Aniversario -->
      <div class="letter-body">
Mi amor,

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Hoy cumplimos 365 días de complicidad, risas infinitas y amor verdadero. Gracias por ser mi lugar seguro y por hacerme tan feliz cada día.

Feliz primer aniversario ♥
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <button id="closeModalBtn" style="padding: 0.75rem 2.2rem; border-radius: 9999px; background: linear-gradient(135deg, #e11d48, #f43f5e); border: none; color: white; font-weight: 500; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem;">
          Volver a la Galaxia 3D
        </button>
      </div>
    </div>
  </div>

  <!-- Lógica WebGL con Three.js, EffectComposer, UnrealBloomPass y GSAP -->
  <script type="module">
    import * as THREE from 'three';
    import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

    // 1. Escena y Fondo Negro Absoluto
    const canvas = document.getElementById('webgl-canvas');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.018);

    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < 768;

    // Cámara: Posición inicial alejada para paneo orbital previo al clic
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(0, 16, 26);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      powerPreference: 'high-performance',
      antialias: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 2. Post-procesado con EffectComposer y UnrealBloomPass (Resplandor de Alto Contraste)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.75, // Fuerza del resplandor
      0.5,  // Radio
      0.08  // Umbral
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Textura suave para las partículas
    const createParticleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.18, 'rgba(255, 235, 230, 0.95)');
        grad.addColorStop(0.45, 'rgba(244, 63, 94, 0.6)');
        grad.addColorStop(0.8, 'rgba(225, 29, 72, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(c);
    };
    const particleMap = createParticleTexture();

    // 3. Sistema Masivo de 7,800 Partículas (Corazón 3D + Anillos Galácticos + Estrellas)
    const totalCount = 7800;
    const positions = new Float32Array(totalCount * 3);
    const originalPositions = new Float32Array(totalCount * 3);
    const colors = new Float32Array(totalCount * 3);
    const phases = new Float32Array(totalCount);
    const speeds = new Float32Array(totalCount);
    const particleTypes = new Uint8Array(totalCount); // 0 = Corazón, 1 = Anillo, 2 = Estrellas

    const crimson = new THREE.Color(0xe11d48);
    const deepRuby = new THREE.Color(0xbe123c);
    const magenta = new THREE.Color(0xff1493);
    const roseGlow = new THREE.Color(0xf43f5e);
    const goldenAmber = new THREE.Color(0xfbbf24);
    const starlightWhite = new THREE.Color(0xffffff);

    let pIdx = 0;

    // Núcleo: Corazón 3D Paramétrico (3,600 partículas)
    const heartCount = 3600;
    for (let i = 0; i < heartCount; i++, pIdx++) {
      const t = Math.PI * 2 * Math.random();
      const sinT = Math.sin(t);
      const hx = 16 * Math.pow(sinT, 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      const volumeScale = Math.pow(Math.random(), 0.55);
      const scaleFactor = 0.16;

      const px = hx * scaleFactor * volumeScale + (Math.random() - 0.5) * 0.18;
      const py = hy * scaleFactor * volumeScale + (Math.random() - 0.5) * 0.18;
      const maxZ = 0.95 * Math.sqrt(Math.max(0.01, 1 - Math.pow(volumeScale, 2)));
      const pz = (Math.random() * 2 - 1) * maxZ + (Math.random() - 0.5) * 0.15;

      positions[pIdx * 3] = px;
      positions[pIdx * 3 + 1] = py;
      positions[pIdx * 3 + 2] = pz;

      originalPositions[pIdx * 3] = px;
      originalPositions[pIdx * 3 + 1] = py;
      originalPositions[pIdx * 3 + 2] = pz;

      phases[pIdx] = Math.random() * Math.PI * 2;
      speeds[pIdx] = 0.8 + Math.random() * 1.4;
      particleTypes[pIdx] = 0;

      const centerDist = Math.sqrt(px * px + py * py + pz * pz) / 2.5;
      const col = new THREE.Color();
      if (centerDist < 0.35) {
        col.lerpColors(starlightWhite, goldenAmber, Math.random());
      } else if (centerDist < 0.7) {
        col.lerpColors(magenta, roseGlow, Math.random());
      } else {
        col.lerpColors(deepRuby, crimson, Math.random());
      }

      colors[pIdx * 3] = col.r;
      colors[pIdx * 3 + 1] = col.g;
      colors[pIdx * 3 + 2] = col.b;
    }

    // Anillos Entrelazados de la Nebulosa (2,400 partículas)
    const ringCount = 2400;
    for (let i = 0; i < ringCount; i++, pIdx++) {
      const armIndex = i % 2;
      const angle = (i / ringCount) * Math.PI * 8;
      const radius = 2.4 + (i / ringCount) * 4.2;
      const tilt = armIndex === 0 ? 0.65 : -0.75;

      const ringX = Math.cos(angle) * radius;
      const ringY = Math.sin(angle * 2) * 0.45;
      const ringZ = Math.sin(angle) * radius;

      const tiltedY = ringY * Math.cos(tilt) - ringZ * Math.sin(tilt);
      const tiltedZ = ringY * Math.sin(tilt) + ringZ * Math.cos(tilt);

      const jitter = (Math.random() - 0.5) * 0.4;
      const px = ringX + jitter;
      const py = tiltedY + jitter;
      const pz = tiltedZ + jitter;

      positions[pIdx * 3] = px;
      positions[pIdx * 3 + 1] = py;
      positions[pIdx * 3 + 2] = pz;

      originalPositions[pIdx * 3] = px;
      originalPositions[pIdx * 3 + 1] = py;
      originalPositions[pIdx * 3 + 2] = pz;

      phases[pIdx] = angle;
      speeds[pIdx] = 0.5 + Math.random() * 0.8;
      particleTypes[pIdx] = 1;

      const col = armIndex === 0
        ? new THREE.Color().lerpColors(goldenAmber, starlightWhite, Math.random() * 0.6)
        : new THREE.Color().lerpColors(magenta, crimson, Math.random() * 0.8);

      colors[pIdx * 3] = col.r;
      colors[pIdx * 3 + 1] = col.g;
      colors[pIdx * 3 + 2] = col.b;
    }

    // Estrellas Cósmicas Profundas (1,800 partículas)
    const starCount = totalCount - pIdx;
    for (let i = 0; i < starCount; i++, pIdx++) {
      const dist = 6.0 + Math.random() * 26.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const px = dist * Math.sin(phi) * Math.cos(theta);
      const py = dist * Math.sin(phi) * Math.sin(theta);
      const pz = dist * Math.cos(phi);

      positions[pIdx * 3] = px;
      positions[pIdx * 3 + 1] = py;
      positions[pIdx * 3 + 2] = pz;

      originalPositions[pIdx * 3] = px;
      originalPositions[pIdx * 3 + 1] = py;
      originalPositions[pIdx * 3 + 2] = pz;

      phases[pIdx] = Math.random() * Math.PI * 2;
      speeds[pIdx] = 0.2 + Math.random() * 0.4;
      particleTypes[pIdx] = 2;

      const col = Math.random() > 0.85 ? goldenAmber : (Math.random() > 0.5 ? roseGlow : starlightWhite);
      colors[pIdx * 3] = col.r;
      colors[pIdx * 3 + 1] = col.g;
      colors[pIdx * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.24 : 0.20,
      map: particleMap,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.95
    });

    const galaxyParticles = new THREE.Points(geometry, material);
    scene.add(galaxyParticles);

    // 4. Variables de Control, Cámara y GSAP
    let hasEntered = false;
    let isModalOpen = false;
    let mouseX = 0, mouseY = 0;
    let parallaxX = 0, parallaxY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    }, { passive: true });

    // 5. Vuelo Cinemático de Cámara con GSAP
    const introOverlay = document.getElementById('introOverlay');
    const mainUI = document.getElementById('mainUI');
    const btnEnter = document.getElementById('btnEnter');

    btnEnter.addEventListener('click', () => {
      hasEntered = true;
      introOverlay.classList.add('hidden');

      // Intentar iniciar audio
      iniciarAudio();

      // Vuelo cinemático dramático hacia el centro con GSAP
      const targetZ = isMobile ? 7.2 : 5.4;
      const tl = gsap.timeline({
        onComplete: () => {
          mainUI.classList.add('visible');
        }
      });

      // Fase 1: Descenso rápido hacia el brazo estelar con subida de Bloom
      tl.to(camera.position, {
        x: isMobile ? 1.5 : 2.5,
        y: 3.5,
        z: 11.0,
        duration: 2.2,
        ease: 'power2.inOut'
      }, 0)
      .to(bloomPass, {
        strength: 2.7,
        duration: 1.2,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut'
      }, 0.8)
      // Fase 2: Frenado suave y entrada frontal al corazón
      .to(camera.position, {
        x: 0,
        y: 0,
        z: targetZ,
        duration: 2.6,
        ease: 'expo.out'
      }, 2.0);
    });

    // 6. Modal y Raycasting
    const modal = document.getElementById('loveModal');
    function openModal() {
      isModalOpen = true;
      modal.classList.add('active');
    }
    function closeModal() {
      isModalOpen = false;
      modal.classList.remove('active');
    }

    document.getElementById('btnOpenLetter').addEventListener('click', openModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Clic en la galaxia
    window.addEventListener('click', (e) => {
      if (!hasEntered || isModalOpen) return;
      if (e.target === canvas) {
        openModal();
      }
    });

    // 7. Redimensionamiento Responsivo
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      composer.setSize(width, height);
      bloomPass.setSize(width, height);
    });

    // 8. Bucle de Animación Ondulatorio (Math.sin/cos + Breathing Effect)
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Parallax suave
      parallaxX += (mouseX - parallaxX) * 0.04;
      parallaxY += (mouseY - parallaxY) * 0.04;

      // Efecto Latido ("Breathing effect" biológico: lub-dub)
      const lub = Math.pow(Math.sin(time * 3.2), 24) * 0.16;
      const dub = Math.pow(Math.sin(time * 3.2 - 0.35), 24) * 0.10;
      const breathingScale = 1.0 + lub + dub;

      // Ondas en las partículas
      const posArr = geometry.attributes.position.array;
      for (let i = 0; i < totalCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];
        const pType = particleTypes[i];
        const ph = phases[i];
        const sp = speeds[i];

        if (pType === 0) {
          // Corazón: latido + micro-ondas armónicas
          posArr[i3] = ox * breathingScale + Math.sin(time * 1.5 + oy * 2.0) * 0.035;
          posArr[i3 + 1] = oy * breathingScale + Math.cos(time * 1.5 + ox * 2.0) * 0.035;
          posArr[i3 + 2] = oz * breathingScale + Math.sin(time * 2.0 * sp + ph) * 0.04;
        } else if (pType === 1) {
          // Anillos galácticos: rotación espiral y ondulación
          const swirlSpeed = time * 0.35 * sp;
          const currentRadius = Math.sqrt(ox * ox + oz * oz);
          const currentAngle = ph + swirlSpeed;
          posArr[i3] = Math.cos(currentAngle) * currentRadius;
          posArr[i3 + 1] = oy + Math.sin(time * 2.0 + ph) * 0.12;
          posArr[i3 + 2] = Math.sin(currentAngle) * currentRadius;
        } else {
          // Estrellas lejanas: oscilación sutil
          posArr[i3 + 1] = oy + Math.sin(time * 0.8 + ph) * 0.08;
          posArr[i3] = ox + Math.cos(time * 0.6 + ph) * 0.05;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Rotación global de la galaxia
      galaxyParticles.rotation.y = time * 0.12 + parallaxX * 0.25;
      galaxyParticles.rotation.x = Math.sin(time * 0.2) * 0.05 + parallaxY * 0.2;

      // Manejo de cámara
      if (!hasEntered) {
        // Paneo orbital lento antes de hacer clic en entrar
        const orbitRadius = 26;
        const orbitSpeed = time * 0.08;
        camera.position.x = Math.sin(orbitSpeed) * orbitRadius * 0.4 + parallaxX * 2.0;
        camera.position.z = Math.cos(orbitSpeed) * orbitRadius * 0.8;
        camera.position.y = 12 + Math.sin(time * 0.2) * 2.0 + parallaxY * 1.5;
        camera.lookAt(0, 0, 0);
      } else {
        // Tras entrar: acercamiento según el modal
        const targetZ = isModalOpen ? (isMobile ? 4.8 : 3.8) : (isMobile ? 7.2 : 5.4);
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        camera.position.x += (parallaxX * 0.8 - camera.position.x) * 0.05;
        camera.position.y += (-parallaxY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(0, isModalOpen ? 0.15 : 0, 0);
      }

      // Renderizado con Bloom Postprocessing
      composer.render();
    }
    animate();

    // 9. Audio y Música
    const musicBtn = document.getElementById('musicToggle');
    const audio = document.getElementById('audioPlayer');
    let isPlaying = false;

    function iniciarAudio() {
      if (audio.src && audio.src !== window.location.href) {
        audio.play().then(() => {
          isPlaying = true;
          musicBtn.classList.add('playing');
        }).catch(() => {});
      } else {
        // Melodía romántica en Web Audio API para sonar de inmediato
        sonarMelodiaSintetica();
      }
    }

    function sonarMelodiaSintetica() {
      try {
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, actx.currentTime); // E4
        osc.frequency.exponentialRampToValueAtTime(261.63, actx.currentTime + 1.5); // C4
        g.gain.setValueAtTime(0.25, actx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 3);
        osc.connect(g);
        g.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 3);
        isPlaying = true;
        musicBtn.classList.add('playing');
      } catch(e) {}
    }

    musicBtn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
      } else {
        iniciarAudio();
      }
    });
  </script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aniversario_awwwards_3d.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl p-6 text-neutral-100 shadow-2xl border border-rose-300/20">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
              <FileCode className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-cinzel text-base font-semibold text-rose-gradient">
                index.html Awwwards 3D (Un Solo Archivo)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Three.js + EffectComposer + UnrealBloomPass + GSAP vía CDN (100% Autónomo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-3 text-xs text-neutral-300 leading-relaxed">
          <p>
            Archivo único <code>index.html</code> listo para guardar y abrir en cualquier navegador:
          </p>
          <ul className="list-disc list-inside space-y-1 text-rose-200/90 pl-1">
            <li><strong>Post-procesado:</strong> <code>EffectComposer</code> + <code>UnrealBloomPass</code> sobre fondo negro puro <code>#000000</code>.</li>
            <li><strong>Partículas complejas:</strong> Más de <strong>7,800 partículas</strong> con forma de corazón paramétrico, anillos galácticos y efecto latido (breathing wave).</li>
            <li><strong>Cámara Cinemática:</strong> GSAP con vuelo dramático desde órbita lejana al presionar "Entrar".</li>
            <li><strong>Interfaz de Usuario:</strong> Pantalla inicial de entrada, tipografías Cinzel y Playfair Display, panel Glassmorphism con carta y 2 fotos.</li>
            <li><strong>Audio:</strong> Botón mute/unmute y etiqueta <code>&lt;audio&gt;</code> lista para tu corrido o canción.</li>
          </ul>
        </div>

        {/* Code Preview Box */}
        <div className="relative rounded-lg bg-black/80 border border-white/10 p-3 max-h-48 overflow-y-auto font-mono text-[11px] text-neutral-400">
          <pre className="whitespace-pre-wrap">{standaloneHTML.slice(0, 780)}... [código completo optimizado]</pre>
        </div>

        {/* Download & Copy Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">¡Código copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Código HTML</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center gap-2 text-xs font-semibold hover:opacity-95 shadow-lg shadow-rose-900/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Descargar archivo index.html</span>
          </button>
        </div>
      </div>
    </div>
  );
};
