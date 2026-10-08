import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface RomanticScene3DProps {
  onHeartClick: () => void;
  isModalOpen: boolean;
}

export const RomanticScene3D: React.FC<RomanticScene3DProps> = ({
  onHeartClick,
  isModalOpen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isModalOpenRef = useRef(isModalOpen);
  isModalOpenRef.current = isModalOpen;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene & Renderer Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08040f, 0.025);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const defaultCamZ = isMobile ? 8.8 : 6.8;
    camera.position.set(0, 0, defaultCamZ);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- 2. Lighting System (Three-Point Romantic Atmosphere) ---
    const ambientLight = new THREE.AmbientLight(0x28122c, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 3.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf43f5e, 1.8);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xfbcfe8, 3.5, 25);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Pulsing inner heartbeat light
    const heartInternalLight = new THREE.PointLight(0xff1493, 3.0, 10);
    heartInternalLight.position.set(0, 0, 0);
    scene.add(heartInternalLight);

    // --- 3. Central 3D Heart Geometry & Jewel Finish ---
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.4);
    heartShape.bezierCurveTo(0, 0.7, -0.45, 1.25, -1.0, 1.25);
    heartShape.bezierCurveTo(-1.6, 1.25, -1.6, 0.65, -1.6, 0.65);
    heartShape.bezierCurveTo(-1.6, 0.05, -0.9, -0.6, 0, -1.45);
    heartShape.bezierCurveTo(0.9, -0.6, 1.6, 0.05, 1.6, 0.65);
    heartShape.bezierCurveTo(1.6, 0.65, 1.6, 1.25, 1.0, 1.25);
    heartShape.bezierCurveTo(0.45, 1.25, 0, 0.7, 0, 0.4);

    const extrudeSettings = {
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 20,
      steps: 4,
      bevelSize: 0.28,
      bevelThickness: 0.32,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.center();

    // Luxurious Ruby / Rose-Gold Physical Material
    const heartMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xbe123c, // Deep romantic crimson ruby
      emissive: 0x881337,
      emissiveIntensity: 0.45,
      roughness: 0.16,
      metalness: 0.82,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    heartMesh.scale.set(1.1, 1.1, 1.1);

    const heartGroup = new THREE.Group();
    heartGroup.add(heartMesh);
    scene.add(heartGroup);

    // Celestial Golden Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.016, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xd97706,
      emissiveIntensity: 0.3,
      metalness: 0.95,
      roughness: 0.2,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.8;
    ringMesh1.rotation.y = Math.PI / 6;
    heartGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xdb2777,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.25,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 3.2;
    ringMesh2.rotation.z = Math.PI / 5;
    heartGroup.add(ringMesh2);

    // Orbiting mini sparkling crystal satellites
    const satelliteGroup = new THREE.Group();
    const satelliteCount = 6;
    const satellites: THREE.Mesh[] = [];

    const gemGeo = new THREE.OctahedronGeometry(0.12, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xfecdd3,
      emissive: 0xff4d6d,
      emissiveIntensity: 0.7,
      metalness: 0.9,
      roughness: 0.1,
    });

    for (let i = 0; i < satelliteCount; i++) {
      const sat = new THREE.Mesh(gemGeo, gemMat);
      const angle = (i / satelliteCount) * Math.PI * 2;
      const radius = 2.1 + (i % 2) * 0.35;
      sat.position.set(
        Math.cos(angle) * radius,
        (Math.sin(angle * 2) * 0.4),
        Math.sin(angle) * radius
      );
      satelliteGroup.add(sat);
      satellites.push(sat);
    }
    heartGroup.add(satelliteGroup);

    // --- 4. Magical Fairy Dust & Starfield Particle System ---
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 230, 200, 0.9)');
        gradient.addColorStop(0.5, 'rgba(244, 114, 182, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createCircleTexture();
    const particleCount = 2800;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleVelocities = new Float32Array(particleCount);

    const romanticColorPalette = [
      new THREE.Color(0xffeedd), // Champagne gold
      new THREE.Color(0xfbcfe8), // Rose pink
      new THREE.Color(0xfdba74), // Warm amber
      new THREE.Color(0xffffff), // Pure starlight
      new THREE.Color(0xf43f5e), // Rose red
    ];

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a spherical celestial halo
      const r = 1.5 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const pickedColor = romanticColorPalette[Math.floor(Math.random() * romanticColorPalette.length)];
      particleColors[i * 3] = pickedColor.r;
      particleColors[i * 3 + 1] = pickedColor.g;
      particleColors[i * 3 + 2] = pickedColor.b;

      particleSizes[i] = 0.08 + Math.random() * 0.22;
      particleVelocities[i] = 0.003 + Math.random() * 0.007;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 5. Interaction (Mouse Parallax, Touch, Gyroscope & Raycasting) ---
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    let gyroGamma = 0; // Left-Right [-90, 90]
    let gyroBeta = 0;  // Front-Back [-180, 180]

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      targetMouseX = (clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        gyroGamma = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
        gyroBeta = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    // Raycaster for clicking on 3D Heart
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // If modal is already open, do not trigger
      if (isModalOpenRef.current) return;

      let clientX = 0;
      let clientY = 0;
      if ('changedTouches' in e && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      mouseVector.x = (clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects([heartMesh, ringMesh1, ringMesh2], true);

      // Hit detected or click near central region
      if (intersects.length > 0) {
        onHeartClick();
      }
    };

    window.addEventListener('click', handlePointerDown);

    // --- 6. Resize Handling ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // WebGL Context Safety Handlers
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost, pausing rendering.');
    };
    const handleContextRestored = () => {
      console.info('WebGL context restored.');
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    // --- 7. Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse & gyroscope parallax interpolation
      currentMouseX += (targetMouseX + gyroGamma * 0.6 - currentMouseX) * 0.045;
      currentMouseY += (targetMouseY + gyroBeta * 0.6 - currentMouseY) * 0.045;

      // Romantic Heartbeat Animation: Double-beat lub-dub cycle
      const lub = Math.pow(Math.sin(elapsedTime * 3.3), 28) * 0.14;
      const dub = Math.pow(Math.sin(elapsedTime * 3.3 - 0.4), 28) * 0.09;
      const heartPulse = lub + dub;
      const baseScale = 1.05 + heartPulse;
      heartMesh.scale.set(baseScale, baseScale, baseScale);

      // Inner point light intensity reacts to heartbeat
      heartInternalLight.intensity = 2.4 + heartPulse * 9.0;
      keyLight.intensity = 3.0 + heartPulse * 1.5;

      // Slow, poetic rotation of central 3D heart
      heartGroup.rotation.y = elapsedTime * 0.28 + currentMouseX * 0.45;
      heartGroup.rotation.x = Math.sin(elapsedTime * 0.45) * 0.1 + currentMouseY * 0.35;
      heartGroup.rotation.z = Math.cos(elapsedTime * 0.3) * 0.05;

      // Celestial rings counter-rotation
      ringMesh1.rotation.z += 0.007;
      ringMesh2.rotation.z -= 0.009;

      // Satellite gems orbit
      satelliteGroup.rotation.y = elapsedTime * 0.6;
      satellites.forEach((sat, idx) => {
        sat.rotation.x += 0.03;
        sat.rotation.y += 0.02;
        sat.position.y += Math.sin(elapsedTime * 2.5 + idx) * 0.003;
      });

      // Particle Drift: Upward floating fairy dust with gentle spiral
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Float upward
        positions[i3 + 1] += particleVelocities[i];
        // Slight sway
        positions[i3] += Math.sin(elapsedTime * 0.8 + i) * 0.002;
        positions[i3 + 2] += Math.cos(elapsedTime * 0.7 + i) * 0.002;

        // Reset if float too high
        if (positions[i3 + 1] > 18) {
          positions[i3 + 1] = -18;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.025;

      // --- Dramatic Camera Approach on Interaction ---
      const activeMobile = window.innerWidth < 768;
      const targetZ = isModalOpenRef.current
        ? (activeMobile ? 4.9 : 3.8)
        : (activeMobile ? 8.8 : 6.8);

      const targetCamY = isModalOpenRef.current ? 0.3 : 0.0;

      camera.position.z += (targetZ - camera.position.z) * 0.065;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.x += (currentMouseX * 0.8 - camera.position.x) * 0.05;

      camera.lookAt(0, isModalOpenRef.current ? 0.2 : 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('click', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      heartGeometry.dispose();
      heartMaterial.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      gemGeo.dispose();
      gemMat.dispose();
    };
  }, [onHeartClick]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden cursor-pointer"
      title="Toca el corazón 3D para abrir nuestra carta de aniversario"
    />
  );
};
