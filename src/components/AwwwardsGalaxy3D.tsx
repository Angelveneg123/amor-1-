import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

interface AwwwardsGalaxy3DProps {
  hasEntered: boolean;
  onEnterFinished: () => void;
  onHeartClick: () => void;
  isModalOpen: boolean;
}

export const AwwwardsGalaxy3D: React.FC<AwwwardsGalaxy3DProps> = ({
  hasEntered,
  onEnterFinished,
  onHeartClick,
  isModalOpen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const isModalOpenRef = useRef(isModalOpen);
  isModalOpenRef.current = isModalOpen;

  const hasEnteredRef = useRef(hasEntered);
  hasEnteredRef.current = hasEntered;

  const flightProgressRef = useRef<{ t: number }>({ t: 0 });
  const isFlightActiveRef = useRef<boolean>(false);
  const isFlightFinishedRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 768;

    // --- 1. Scene & Pure Pitch-Black Environment ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.012);

    // Camera starts far away for the establishing orbital shot
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1200);
    camera.position.set(0, 36, 68);
    cameraRef.current = camera;

    // Lighting for 3D flowers and hearts
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffd1dc, 2.2);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 1.8);
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- 2. Postprocessing: EffectComposer & UnrealBloomPass ---
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.75, // Bloom Strength
      0.5,  // Bloom Radius
      0.08  // Bloom Threshold
    );
    bloomPassRef.current = bloomPass;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // --- 3. Dynamic Particle Texture (Soft Glow Disc) ---
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

    // --- 4. Complex Particle Galaxy Generation (7,800+ Particles) ---
    // Section A: Parametric 3D Heart Galaxy (3,600 points)
    // Section B: Interlocking Spiral Nebula Rings (2,400 points)
    // Section C: Deep Celestial Starfield (1,800 points)
    const totalCount = 7800;
    const positions = new Float32Array(totalCount * 3);
    const originalPositions = new Float32Array(totalCount * 3);
    const colors = new Float32Array(totalCount * 3);
    const phases = new Float32Array(totalCount);
    const speeds = new Float32Array(totalCount);
    const particleTypes = new Uint8Array(totalCount);

    const crimson = new THREE.Color(0xe11d48);
    const deepRuby = new THREE.Color(0xbe123c);
    const magenta = new THREE.Color(0xff1493);
    const roseGlow = new THREE.Color(0xf43f5e);
    const goldenAmber = new THREE.Color(0xfbbf24);
    const starlightWhite = new THREE.Color(0xffffff);

    let pIdx = 0;

    // 4A. Parametric 3D Heart Core (Preserved)
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

    // 4B. Spiral Nebula Arms & Celestial Interlocking Rings
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

    // 4C. Deep Outer Celestial Starfield
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
      opacity: 0.95,
    });

    const galaxyParticles = new THREE.Points(geometry, material);
    scene.add(galaxyParticles);

    // --- 5. ETAPAS 2 & 3: ROSAS TRIDIMENSIONALES, JARDÍN FLOTANTE Y TÚNEL ROMÁNTICO ---
    const rosesGroup = new THREE.Group();
    scene.add(rosesGroup);

    // Función constructora de rosas 3D con pétalos concéntricos y volumen orgánico
    const create3DRose = (roseColor: THREE.Color, scale = 1.0) => {
      const g = new THREE.Group();

      const petalMat = new THREE.MeshStandardMaterial({
        color: roseColor,
        roughness: 0.35,
        metalness: 0.12,
        side: THREE.DoubleSide,
        emissive: roseColor.clone().multiplyScalar(0.22),
      });

      // Capa central: capullo en espiral
      const budGeo = new THREE.SphereGeometry(0.32 * scale, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.65);
      const bud = new THREE.Mesh(budGeo, petalMat);
      bud.rotation.x = Math.PI;
      g.add(bud);

      // Capa intermedia: 5 pétalos curvados
      const midPetalGeo = new THREE.CylinderGeometry(0.55 * scale, 0.22 * scale, 0.5 * scale, 12, 1, true, 0, Math.PI * 1.3);
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        const p = new THREE.Mesh(midPetalGeo, petalMat);
        p.position.set(Math.cos(ang) * 0.16 * scale, 0.08 * scale, Math.sin(ang) * 0.16 * scale);
        p.rotation.y = ang;
        p.rotation.z = 0.35;
        p.rotation.x = 0.2;
        g.add(p);
      }

      // Capa exterior: 7 pétalos desplegados
      const outPetalGeo = new THREE.CylinderGeometry(0.9 * scale, 0.38 * scale, 0.7 * scale, 12, 1, true, 0, Math.PI * 1.25);
      for (let i = 0; i < 7; i++) {
        const ang = (i / 7) * Math.PI * 2 + 0.3;
        const p = new THREE.Mesh(outPetalGeo, petalMat);
        p.position.set(Math.cos(ang) * 0.3 * scale, -0.04 * scale, Math.sin(ang) * 0.3 * scale);
        p.rotation.y = ang;
        p.rotation.z = 0.55;
        p.rotation.x = 0.25;
        g.add(p);
      }

      // Cáliz verde en la base
      const calyxGeo = new THREE.ConeGeometry(0.28 * scale, 0.35 * scale, 5);
      const calyxMat = new THREE.MeshStandardMaterial({
        color: 0x14532d,
        roughness: 0.65,
      });
      const calyx = new THREE.Mesh(calyxGeo, calyxMat);
      calyx.position.y = -0.32 * scale;
      calyx.rotation.x = Math.PI;
      g.add(calyx);

      return g;
    };

    const roseColorPalette = [
      new THREE.Color(0xe11d48), // Rojo rubí
      new THREE.Color(0xf43f5e), // Rosa vibrante
      new THREE.Color(0xfda4af), // Rosa pastel suave
      new THREE.Color(0xfff1f2), // Blanco perla puro
      new THREE.Color(0xbe123c), // Carmesí profundo
    ];

    // Distribución del Jardín de Rosas (Etapa 2: x ~ 10..22, z ~ 10..30)
    const gardenRoseCount = isMobile ? 32 : 48;
    const floatingRoses: { mesh: THREE.Group; basePos: THREE.Vector3; rotSpeed: number }[] = [];

    for (let i = 0; i < gardenRoseCount; i++) {
      const color = roseColorPalette[i % roseColorPalette.length];
      const scale = 0.75 + Math.random() * 0.55;
      const rose = create3DRose(color, scale);

      // Posicionar a ambos lados del pasaje
      const side = i % 2 === 0 ? 1 : -1;
      const pathDist = (i / gardenRoseCount) * 24.0;
      const px = 18.0 - pathDist * 0.6 + side * (3.5 + Math.random() * 4.5);
      const py = 4.0 + (Math.random() - 0.5) * 5.0;
      const pz = 32.0 - pathDist + (Math.random() - 0.5) * 3.0;

      rose.position.set(px, py, pz);
      rose.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rosesGroup.add(rose);

      floatingRoses.push({
        mesh: rose,
        basePos: new THREE.Vector3(px, py, pz),
        rotSpeed: 0.2 + Math.random() * 0.4,
      });
    }

    // Túnel Romántico de Rosas y Arcos Florales (Etapa 3: z ~ -8.. -30)
    const tunnelRoseCount = isMobile ? 36 : 56;
    for (let i = 0; i < tunnelRoseCount; i++) {
      const color = roseColorPalette[(i + 2) % roseColorPalette.length];
      const scale = 0.8 + Math.random() * 0.6;
      const rose = create3DRose(color, scale);

      // Forma un pasillo cilíndrico / arco alrededor de la trayectoria
      const progress = i / tunnelRoseCount;
      const tz = 4.0 - progress * 32.0;
      const tx = -4.0 - Math.sin(progress * Math.PI) * 9.0;
      const ty = 2.5 + Math.cos(progress * Math.PI * 1.5) * 1.5;

      const angle = (i * 1.2) + Math.PI;
      const radius = 3.6 + (i % 3) * 0.8;

      const px = tx + Math.cos(angle) * radius;
      const py = ty + Math.sin(angle) * (radius * 0.8);
      const pz = tz + (Math.random() - 0.5) * 1.5;

      rose.position.set(px, py, pz);
      rose.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rosesGroup.add(rose);

      floatingRoses.push({
        mesh: rose,
        basePos: new THREE.Vector3(px, py, pz),
        rotSpeed: 0.15 + Math.random() * 0.35,
      });
    }

    // Corazones translúcidos flotantes en el túnel romántico
    const heartShape2D = new THREE.Shape();
    heartShape2D.moveTo(0, 0.2);
    heartShape2D.bezierCurveTo(0, 0.4, -0.25, 0.7, -0.6, 0.7);
    heartShape2D.bezierCurveTo(-0.95, 0.7, -0.95, 0.35, -0.95, 0.35);
    heartShape2D.bezierCurveTo(-0.95, 0.05, -0.5, -0.35, 0, -0.85);
    heartShape2D.bezierCurveTo(0.5, -0.35, 0.95, 0.05, 0.95, 0.35);
    heartShape2D.bezierCurveTo(0.95, 0.35, 0.95, 0.7, 0.6, 0.7);
    heartShape2D.bezierCurveTo(0.25, 0.7, 0, 0.4, 0, 0.2);

    const miniHeartGeo = new THREE.ExtrudeGeometry(heartShape2D, {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    });
    miniHeartGeo.center();

    const miniHeartMat = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      emissive: 0xff1493,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.2,
      transmission: 0.75,
      transparent: true,
      opacity: 0.85,
    });

    const floatingHearts: { mesh: THREE.Mesh; seed: number }[] = [];
    const heartMeshCount = isMobile ? 12 : 20;

    for (let i = 0; i < heartMeshCount; i++) {
      const mh = new THREE.Mesh(miniHeartGeo, miniHeartMat);
      const scale = 0.35 + Math.random() * 0.3;
      mh.scale.set(scale, scale, scale);

      const prog = i / heartMeshCount;
      const px = -3.0 - Math.sin(prog * Math.PI) * 7.0 + (Math.random() - 0.5) * 4.0;
      const py = 2.0 + (Math.random() - 0.5) * 3.5;
      const pz = 2.0 - prog * 28.0;

      mh.position.set(px, py, pz);
      rosesGroup.add(mh);
      floatingHearts.push({ mesh: mh, seed: Math.random() * 10 });
    }

    // Pétalos flotantes arrastrados por el viento
    const petalDriftCount = isMobile ? 350 : 650;
    const petalDriftGeo = new THREE.BufferGeometry();
    const petalDriftPositions = new Float32Array(petalDriftCount * 3);
    const petalDriftVelocities = new Float32Array(petalDriftCount);

    for (let i = 0; i < petalDriftCount; i++) {
      petalDriftPositions[i * 3] = (Math.random() - 0.5) * 35.0;
      petalDriftPositions[i * 3 + 1] = -4.0 + Math.random() * 16.0;
      petalDriftPositions[i * 3 + 2] = -35.0 + Math.random() * 75.0;
      petalDriftVelocities[i] = 0.02 + Math.random() * 0.04;
    }

    petalDriftGeo.setAttribute('position', new THREE.BufferAttribute(petalDriftPositions, 3));
    const petalDriftMat = new THREE.PointsMaterial({
      size: isMobile ? 0.38 : 0.32,
      map: particleMap,
      color: 0xf43f5e,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
      depthWrite: false,
    });
    const petalDriftPoints = new THREE.Points(petalDriftGeo, petalDriftMat);
    scene.add(petalDriftPoints);

    // Hit-area transparente para el corazón
    const hitAreaGeo = new THREE.SphereGeometry(1.6, 16, 16);
    const hitAreaMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitAreaMesh = new THREE.Mesh(hitAreaGeo, hitAreaMat);
    scene.add(hitAreaMesh);

    // --- 6. TRAYECTORIA CURVA CINEMATOGRÁFICA (CatmullRomCurve3) ---
    // Trayectoria curva continua de 35 a 45 segundos:
    // Etapa 1 (0-8s): Comienzo desde las afueras hacia el borde estelar.
    // Etapa 2 (8-18s): Descenso flotante en el Jardín de Rosas.
    // Etapa 3 (18-28s): Recorrido sinuoso por el Túnel Romántico con giros suaves.
    // Etapa 4 (28-37s): Salida hacia espacio abierto, descubrimiento del Corazón Gigante.
    // Etapa 5 (37-45s): Desaceleración y posición final frente al Corazón latiendo.
    const finalCamZ = isMobile ? 7.2 : 5.4;

    const pathPoints = [
      new THREE.Vector3(0, 36, 68),       // 0s: Salida en órbita lejana
      new THREE.Vector3(14, 26, 52),      // ~5s: Aproximación inicial
      new THREE.Vector3(22, 16, 36),      // ~8s: Entrada a la niebla de rosas
      new THREE.Vector3(16, 8, 22),       // ~13s: Jardín de Rosas Flotante
      new THREE.Vector3(6, 3.5, 10),      // ~18s: Transición al umbral del túnel
      new THREE.Vector3(-4, 2.2, 0),      // ~22s: Túnel Romántico (parte 1)
      new THREE.Vector3(-12, 3.2, -12),   // ~25s: Curva suave con corazones flotantes
      new THREE.Vector3(-7, 2.8, -25),    // ~28s: Fondo del túnel
      new THREE.Vector3(6, 2.0, -20),     // ~32s: Apertura y Descubrimiento del Corazón
      new THREE.Vector3(14, 1.4, -6),     // ~35s: Órbita parcial alrededor
      new THREE.Vector3(8, 0.8, 4.5),     // ~38s: Aproximación frontal
      new THREE.Vector3(0, 0.1, finalCamZ)// ~42-45s: Posición final frente al Corazón
    ];

    const cameraSpline = new THREE.CatmullRomCurve3(pathPoints, false, 'catmullrom', 0.35);

    // Spline para la orientación suave de la cámara (LookAt)
    const lookPoints = [
      new THREE.Vector3(0, 4, 0),
      new THREE.Vector3(12, 8, 25),
      new THREE.Vector3(14, 4, 15),
      new THREE.Vector3(2, 2, 2),
      new THREE.Vector3(-6, 2, -5),
      new THREE.Vector3(-10, 2, -18),
      new THREE.Vector3(-2, 2, -22),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ];
    const lookSpline = new THREE.CatmullRomCurve3(lookPoints, false, 'catmullrom', 0.35);

    // --- 7. Mouse Parallax, Touch & Raycasting ---
    let mouseX = 0;
    let mouseY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let cx = 0;
      let cy = 0;
      if ('touches' in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ('clientX' in e) {
        cx = e.clientX;
        cy = e.clientY;
      }
      mouseX = (cx / window.innerWidth - 0.5) * 2;
      mouseY = (cy / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      if (!isFlightFinishedRef.current || isModalOpenRef.current) return;
      mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObject(hitAreaMesh);
      if (intersects.length > 0) {
        onHeartClick();
      }
    };
    window.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      composer.setSize(width, height);
      bloomPass.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // --- 8. Animation Loop ---
    let animId: number;
    const clock = new THREE.Clock();
    const currentLookTarget = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Parallax suave
      currentParallaxX += (mouseX - currentParallaxX) * 0.04;
      currentParallaxY += (mouseY - currentParallaxY) * 0.04;

      // 1) Latido biológico del Corazón (Lub-dub rítmico con senos armónicos)
      const lub = Math.pow(Math.sin(time * 3.2), 24) * 0.16;
      const dub = Math.pow(Math.sin(time * 3.2 - 0.35), 24) * 0.10;
      const pulse = lub + dub;
      const breathingScale = 1.0 + pulse;

      // 2) Ondas y respiración de partículas
      const posArr = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < totalCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];
        const pType = particleTypes[i];
        const ph = phases[i];
        const sp = speeds[i];

        if (pType === 0) {
          const wave = Math.sin(time * 2.0 * sp + ph) * 0.04;
          posArr[i3] = ox * breathingScale + Math.sin(time * 1.5 + oy * 2.0) * 0.035;
          posArr[i3 + 1] = oy * breathingScale + Math.cos(time * 1.5 + ox * 2.0) * 0.035;
          posArr[i3 + 2] = oz * breathingScale + wave;
        } else if (pType === 1) {
          const swirlSpeed = time * 0.35 * sp;
          const currentRadius = Math.sqrt(ox * ox + oz * oz);
          const currentAngle = ph + swirlSpeed;
          const waveY = Math.sin(time * 2.0 + ph) * 0.12;

          posArr[i3] = Math.cos(currentAngle) * currentRadius;
          posArr[i3 + 1] = oy + waveY;
          posArr[i3 + 2] = Math.sin(currentAngle) * currentRadius;
        } else {
          posArr[i3 + 1] = oy + Math.sin(time * 0.8 + ph) * 0.08;
          posArr[i3] = ox + Math.cos(time * 0.6 + ph) * 0.05;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Rotación de la Galaxia de fondo
      galaxyParticles.rotation.y = time * 0.12;
      galaxyParticles.rotation.x = Math.sin(time * 0.2) * 0.05;

      // 3) Animación suave de rosas flotantes y viento
      floatingRoses.forEach((item, idx) => {
        item.mesh.rotation.y += item.rotSpeed * 0.015;
        item.mesh.rotation.z = Math.sin(time * 1.2 + idx) * 0.15;
        item.mesh.position.y = item.basePos.y + Math.sin(time * 1.5 + idx) * 0.35;
      });

      // Animación de pequeños corazones translúcidos
      floatingHearts.forEach((h, idx) => {
        h.mesh.rotation.y += 0.02;
        h.mesh.rotation.x = Math.sin(time * 1.6 + h.seed) * 0.2;
        h.mesh.position.y += Math.sin(time * 2.0 + idx) * 0.006;
      });

      // Animación de lluvia de pétalos arrastrados por el viento
      const pPositions = petalDriftGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < petalDriftCount; i++) {
        const i3 = i * 3;
        pPositions[i3 + 1] += petalDriftVelocities[i]; // Flotando hacia arriba
        pPositions[i3] += Math.sin(time * 1.2 + i) * 0.012; // Brisa suave
        if (pPositions[i3 + 1] > 14.0) {
          pPositions[i3 + 1] = -5.0; // Reiniciar en la base
        }
      }
      petalDriftGeo.attributes.position.needsUpdate = true;

      // 4) Cinemática de Cámara (Curva CatmullRom vs Órbita Inicial / Final)
      if (!isFlightActiveRef.current && !isFlightFinishedRef.current) {
        // Órbita inicial lenta y majestuosa previa a presionar "Entrar"
        const orbitR = 64;
        const orbitSpeed = time * 0.05;
        camera.position.x = Math.sin(orbitSpeed) * orbitR * 0.5 + currentParallaxX * 2.5;
        camera.position.z = Math.cos(orbitSpeed) * orbitR;
        camera.position.y = 30 + Math.sin(time * 0.18) * 3.0 + currentParallaxY * 2.0;
        camera.lookAt(0, 6, 0);
      } else if (isFlightActiveRef.current) {
        // En pleno vuelo cinematográfico a lo largo de CatmullRomCurve3
        const u = flightProgressRef.current.t;
        const camPos = cameraSpline.getPointAt(u);
        const lookTarget = lookSpline.getPointAt(u);

        // Suave adición de parallax para sensación de cámara en mano / flotante
        camera.position.copy(camPos);
        camera.position.x += currentParallaxX * 0.35;
        camera.position.y += -currentParallaxY * 0.25;

        currentLookTarget.lerp(lookTarget, 0.08);
        camera.lookAt(currentLookTarget);
      } else if (isFlightFinishedRef.current) {
        // Etapa 5: Final Romántico - Micro-órbita sutil y elegante frente al corazón
        const endZ = isMobile ? 7.2 : 5.4;
        const subtleOrbit = Math.sin(time * 0.2) * 0.6;
        const targetX = currentParallaxX * 0.6 + subtleOrbit;
        const targetY = -currentParallaxY * 0.4 + Math.cos(time * 0.25) * 0.2;
        const targetZ = isModalOpenRef.current ? (isMobile ? 5.2 : 4.0) : endZ;

        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.position.z += (targetZ - camera.position.z) * 0.05;

        camera.lookAt(0, isModalOpenRef.current ? 0.25 : 0, 0);
      }

      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particleMap.dispose();
      petalDriftGeo.dispose();
      petalDriftMat.dispose();
      miniHeartGeo.dispose();
      miniHeartMat.dispose();
      hitAreaGeo.dispose();
      hitAreaMat.dispose();
    };
  }, []);

  // --- 9. Secuencia Cinematográfica Continua de 40 Segundos con GSAP ---
  useEffect(() => {
    if (hasEntered && bloomPassRef.current) {
      isFlightActiveRef.current = true;
      const bloom = bloomPassRef.current;

      const tl = gsap.timeline({
        onComplete: () => {
          isFlightActiveRef.current = false;
          isFlightFinishedRef.current = true;
          onEnterFinished();
        },
      });

      // Recorrido suave y continuo a lo largo del spline (Duración total: 40 segundos)
      tl.to(flightProgressRef.current, {
        t: 1.0,
        duration: 40.0,
        ease: 'power1.inOut',
      }, 0);

      // Coreografía de Bloom e intensidad durante el viaje:
      // Etapa 1 (0-8s): Resplandor que sube al atravesar la niebla estelar
      tl.to(bloom, {
        strength: 2.5,
        duration: 3.5,
        ease: 'sine.inOut',
      }, 3.0);
      tl.to(bloom, {
        strength: 1.7,
        duration: 3.0,
        ease: 'sine.out',
      }, 7.0);

      // Etapa 3 (18-28s): Brillo cálido al recorrer el túnel
      tl.to(bloom, {
        strength: 2.2,
        duration: 4.0,
        ease: 'sine.inOut',
      }, 19.0);
      tl.to(bloom, {
        strength: 1.75,
        duration: 3.0,
        ease: 'sine.out',
      }, 25.0);

      // Etapa 4 (28-37s): Destello al descubrir el Corazón
      tl.to(bloom, {
        strength: 2.8,
        duration: 3.0,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut',
      }, 30.0);
    }
  }, [hasEntered, onEnterFinished]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black"
    />
  );
};

