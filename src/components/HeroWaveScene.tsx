import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DEFAULT_WAVE_COLOR = '#2dd9e6';
const DEFAULT_ACCENT_COLOR = '#0f6f7a';
const DEFAULT_PARTICLE_COLOR = '#7ff7ff';
const DEFAULT_BACKGROUND_COLOR = new THREE.Color(0x020c12);

interface HeroWaveSceneProps {
  className?: string;
  waveColor?: string;
  accentColor?: string;
  particleColor?: string;
}

export const HeroWaveScene: React.FC<HeroWaveSceneProps> = ({
  className = '',
  waveColor = DEFAULT_WAVE_COLOR,
  accentColor = DEFAULT_ACCENT_COLOR,
  particleColor = DEFAULT_PARTICLE_COLOR,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.setClearColor(DEFAULT_BACKGROUND_COLOR, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 2.6, 9.5);

    const waveGroup = new THREE.Group();
    scene.add(waveGroup);

    const ambientLight = new THREE.AmbientLight(0x8dfcff, 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x88f7ff, 2.4);
    keyLight.position.set(-2, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x0f6f7a, 1.5);
    fillLight.position.set(3, -2, 2);
    scene.add(fillLight);

    const viewport = {
      width: 1,
      height: 1,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCompactScreen = window.innerWidth < 768;
    const isTinyScreen = window.innerWidth < 480;
    const particlesEnabled = !isTinyScreen;
    const particleCount = particlesEnabled ? (isCompactScreen ? 10 : 24) : 0;
    const segmentsX = isCompactScreen ? 36 : 64;
    const segmentsZ = isCompactScreen ? 22 : 40;
    const waveWidth = isCompactScreen ? 14 : 16;
    const waveDepth = isCompactScreen ? 9 : 11;

    const primaryMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(waveColor),
      wireframe: true,
      transparent: true,
      opacity: 0.9,
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.35,
      roughness: 0.4,
      metalness: 0.1,
    });

    const secondaryMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      emissive: new THREE.Color(waveColor),
      emissiveIntensity: 0.22,
    });

    const geometry = new THREE.PlaneGeometry(waveWidth, waveDepth, segmentsX, segmentsZ);
    geometry.rotateX(-Math.PI / 2);

    const basePositions = new Float32Array(geometry.attributes.position.array.length);
    basePositions.set(geometry.attributes.position.array as Float32Array);

    const secondaryGeometry = geometry.clone();
    secondaryGeometry.translate(0, -0.18, 0);

    const primaryMesh = new THREE.Mesh(geometry, primaryMaterial);
    const secondaryMesh = new THREE.Mesh(secondaryGeometry, secondaryMaterial);
    waveGroup.add(secondaryMesh, primaryMesh);

    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const particles: Array<{
      mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
      base: THREE.Vector3;
      velocity: THREE.Vector3;
      phase: number;
    }> = [];

    const createParticleMaterial = (opacity: number) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(particleColor),
        emissive: new THREE.Color(waveColor),
        emissiveIntensity: 0.75,
        transparent: true,
        opacity,
        roughness: 0.2,
        metalness: 0.05,
      });

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 0.04 + Math.random() * 0.08;
      const material = createParticleMaterial(0.45 + Math.random() * 0.35);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 10, 10),
        material,
      );

      const base = new THREE.Vector3(
        (Math.random() - 0.5) * waveWidth,
        0.6 + Math.random() * 2.6,
        (Math.random() - 0.5) * waveDepth,
      );

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.0035,
        0.004 + Math.random() * 0.006,
        (Math.random() - 0.5) * 0.0035,
      );

      mesh.position.copy(base);
      particleGroup.add(mesh);
      particles.push({
        mesh,
        base,
        velocity,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const updateSize = () => {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;
      viewport.width = width;
      viewport.height = height;

      renderer.setPixelRatio(viewport.pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    updateSize();

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => updateSize())
      : null;

    resizeObserver?.observe(mount);
    window.addEventListener('resize', updateSize);

    const pointer = new THREE.Vector2(0, 0);
    let pointerInside = false;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      pointerInside = inside;

      if (inside) {
        pointer.x = (x - 0.5) * 2;
        pointer.y = (y - 0.5) * 2;
      }
    };

    const handlePointerLeave = () => {
      pointerInside = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
    const clock = new THREE.Clock();
    const temp = new THREE.Vector3();

    let frameId = 0;

    const render = () => {
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        const targetRotationY = pointerInside ? pointer.x * 0.18 : 0;
        const targetRotationX = pointerInside ? pointer.y * -0.1 : 0;
        waveGroup.rotation.y += (targetRotationY - waveGroup.rotation.y) * 0.05;
        waveGroup.rotation.x += (targetRotationX - waveGroup.rotation.x) * 0.05;
        camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.04;
        camera.position.y += ((2.6 + pointer.y * -0.35) - camera.position.y) * 0.04;
      }

      for (let i = 0; i < positionAttribute.count; i += 1) {
        const baseIndex = i * 3;
        const x = basePositions[baseIndex];
        const z = basePositions[baseIndex + 2];

        const waveA = Math.sin((x * 0.9) + elapsed * 1.55) * 0.34;
        const waveB = Math.cos((z * 1.1) + elapsed * 1.25) * 0.25;
        const waveC = Math.sin((x + z) * 0.45 + elapsed * 0.75) * 0.16;
        const ripple = pointerInside
          ? Math.sin((x - pointer.x * 3.5) * 1.2 + (z - pointer.y * 2.2) * 0.85 - elapsed * 2.2) * 0.06
          : 0;

        positionAttribute.array[baseIndex + 1] = waveA + waveB + waveC + ripple;
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();

      secondaryMesh.rotation.y = Math.sin(elapsed * 0.22) * 0.03;
      primaryMesh.rotation.y = -Math.sin(elapsed * 0.18) * 0.02;

      particles.forEach((particle, index) => {
        const { mesh, base, velocity, phase } = particle;

        if (!prefersReducedMotion) {
          base.x += velocity.x;
          base.z += velocity.z;

          if (base.x > waveWidth * 0.55) base.x = -waveWidth * 0.55;
          if (base.x < -waveWidth * 0.55) base.x = waveWidth * 0.55;
          if (base.z > waveDepth * 0.55) base.z = -waveDepth * 0.55;
          if (base.z < -waveDepth * 0.55) base.z = waveDepth * 0.55;

          temp.set(
            base.x,
            1.1 + Math.sin(elapsed * 1.2 + phase + index * 0.1) * 0.7,
            base.z,
          );

          mesh.position.lerp(temp, 0.03);
        }

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.008;
      });

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver?.disconnect();

      particles.forEach(({ mesh }) => {
        particleGroup.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      });

      particleGroup.clear();
      waveGroup.remove(secondaryMesh, primaryMesh);

      secondaryGeometry.dispose();
      geometry.dispose();
      primaryMaterial.dispose();
      secondaryMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [accentColor, particleColor, waveColor]);

  return <div ref={mountRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true" />;
};
