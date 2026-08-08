import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { HERO_BUILDER_CONFIG, type Vec3 } from './hero-builder.config';

type RenderMode = 'scene' | 'static';
type BuildPhase = 'pickup' | 'travel' | 'snap' | 'settle' | 'reset';

interface HeroBuilderSceneProps {
  className?: string;
}

const supportsWebGL = () => {
  if (typeof document === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const toVec3 = (value: Vec3) => new THREE.Vector3(value[0], value[1], value[2]);

const cubicBezier = (
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  t: number,
) => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const point = new THREE.Vector3();
  point.addScaledVector(p0, uuu);
  point.addScaledVector(p1, 3 * uu * t);
  point.addScaledVector(p2, 3 * u * tt);
  point.addScaledVector(p3, ttt);
  return point;
};

const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material.dispose();
};

const buildRenderMode = (): RenderMode => {
  if (typeof window === 'undefined') return 'static';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isNarrowViewport = window.matchMedia(
    `(max-width: ${HERO_BUILDER_CONFIG.renderer.mobileFallbackBreakpoint - 1}px)`,
  ).matches;

  if (prefersReducedMotion || isNarrowViewport) return 'static';
  if (!supportsWebGL()) return 'static';
  return 'scene';
};

const getCameraPreset = () => {
  if (window.innerWidth < HERO_BUILDER_CONFIG.renderer.antialiasBreakpoint) {
    return HERO_BUILDER_CONFIG.camera.mobile;
  }

  return HERO_BUILDER_CONFIG.camera.desktop;
};

export const HeroBuilderScene: React.FC<HeroBuilderSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>(() => buildRenderMode());

  useEffect(() => {
    const updateRenderMode = () => setRenderMode(buildRenderMode());
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia(
      `(max-width: ${HERO_BUILDER_CONFIG.renderer.mobileFallbackBreakpoint - 1}px)`,
    );

    reducedMotionQuery.addEventListener('change', updateRenderMode);
    mobileQuery.addEventListener('change', updateRenderMode);
    window.addEventListener('resize', updateRenderMode);

    return () => {
      reducedMotionQuery.removeEventListener('change', updateRenderMode);
      mobileQuery.removeEventListener('change', updateRenderMode);
      window.removeEventListener('resize', updateRenderMode);
    };
  }, []);

  const staticBackground = useMemo(() => {
    const swatches = HERO_BUILDER_CONFIG.paletteSwatches;
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,217,230,0.18),transparent_35%),linear-gradient(180deg,#061018_0%,#07151e_55%,#03070b_100%)]" />
        <div className="absolute left-[10%] top-[18%] h-60 w-60 rounded-full bg-[#2dd9e6]/12 blur-3xl" />
        <div className="absolute right-[8%] top-[12%] h-72 w-72 rounded-full bg-[#0f6f7a]/12 blur-3xl" />
        <div className="absolute left-[8%] bottom-[18%] w-48 h-40 rounded-[1.4rem] border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_45px_rgba(45,217,230,0.14)] rotate-[-7deg]" />
        <div className="absolute left-[15%] bottom-[24%] w-24 h-7 rounded-lg border border-dashed border-[#2dd9e6]/30 bg-[#2dd9e6]/5" />
        <div className="absolute left-[24%] bottom-[24%] w-24 h-7 rounded-lg border border-dashed border-[#2dd9e6]/30 bg-[#2dd9e6]/5" />
        <div className="absolute right-[11%] bottom-[26%] w-[18rem] h-[10rem] rounded-[1.6rem] border border-white/10 bg-[#09131b]/70 shadow-[0_0_50px_rgba(15,111,122,0.18)]" />
        <div className="absolute right-[14%] bottom-[33%] h-4 w-32 rounded-full bg-[#2dd9e6]/10" />
        <div className="absolute right-[14%] bottom-[29%] h-8 w-24 rounded-lg bg-[#2dd9e6]/15" />
        <div className="absolute right-[19%] bottom-[29%] h-8 w-12 rounded-lg bg-[#0f6f7a]/20" />
        <div className="absolute left-[50%] top-[16%] h-3 w-28 -translate-x-1/2 rounded-full bg-[#8ffcff]/18 blur-sm" />
        <div className="absolute left-[50%] top-[10%] h-1 w-[42rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#2dd9e6]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#02070b] to-transparent" />
        <div className="absolute inset-0 opacity-90">
          {swatches.map((swatch, index) => (
            <div
              key={swatch.id}
              className="absolute rounded-xl border border-white/10 shadow-[0_0_24px_rgba(45,217,230,0.12)]"
              style={{
                left: `${8 + index * 6}%`,
                top: `${60 + index * 2}%`,
                width: '2.8rem',
                height: '1.4rem',
                background: swatch.color,
                opacity: 0.45 - index * 0.05,
                transform: `rotate(${index % 2 === 0 ? -10 : 8}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }, [className]);

  useEffect(() => {
    if (renderMode !== 'scene') return undefined;

    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer: THREE.WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let frameId = 0;
    let isRunning = false;
    let isVisible = true;
    let isTabVisible = document.visibilityState === 'visible';
    let elapsed = 0;
    let lastTimestamp = performance.now();

    const sceneNodes: THREE.Object3D[] = [];
    const cursorColor = new THREE.Color();

    const slotMeshes: THREE.Mesh[] = [];
    const placedMeshes: THREE.Mesh[] = [];
    const paletteMeshes: THREE.Mesh[] = [];

    const slotPositions = HERO_BUILDER_CONFIG.slots.map((slot) => toVec3(slot.position));
    const palettePositions = HERO_BUILDER_CONFIG.paletteSwatches.map((_, index) => {
      const start = toVec3(HERO_BUILDER_CONFIG.layout.palette.position);
      const offset = index * (HERO_BUILDER_CONFIG.layout.palette.swatchSize[0] + HERO_BUILDER_CONFIG.layout.palette.gap);
      return start.clone().add(new THREE.Vector3(0, index * 0.35, 0)).add(new THREE.Vector3(offset, 0, 0));
    });

    const getPalettePosition = (index: number) => palettePositions[index % palettePositions.length].clone();

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(HERO_BUILDER_CONFIG.scene.background);
      scene.fog = new THREE.Fog(HERO_BUILDER_CONFIG.scene.fog, 12, 26);

      const cameraPreset = getCameraPreset();
      const camera = new THREE.PerspectiveCamera(cameraPreset.fov, 1, 0.1, 100);
      camera.position.set(cameraPreset.position[0], cameraPreset.position[1], cameraPreset.position[2]);
      camera.lookAt(0, 0.75, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: window.innerWidth >= HERO_BUILDER_CONFIG.renderer.antialiasBreakpoint && !window.matchMedia('(pointer: coarse)').matches,
        alpha: true,
        powerPreference: 'high-performance',
      });

      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      mount.appendChild(renderer.domElement);

      const root = new THREE.Group();
      scene.add(root);
      sceneNodes.push(root);

      const ambient = new THREE.AmbientLight(0xc9ffff, 1.3);
      const keyLight = new THREE.DirectionalLight(0xb2ffff, 2.3);
      keyLight.position.set(-3.5, 5.5, 7);
      const fillLight = new THREE.DirectionalLight(0x0f6f7a, 1.1);
      fillLight.position.set(4, -2.5, 5);
      const rimLight = new THREE.PointLight(0x2dd9e6, 1.8, 18);
      rimLight.position.set(-4.6, 0.8, 4.5);
      scene.add(ambient, keyLight, fillLight, rimLight);
      sceneNodes.push(ambient, keyLight, fillLight, rimLight);

      const windowGroup = new THREE.Group();
      windowGroup.position.set(...HERO_BUILDER_CONFIG.layout.window.position);
      root.add(windowGroup);
      sceneNodes.push(windowGroup);

      const windowFrameMaterial = new THREE.MeshStandardMaterial({
        color: '#071a22',
        roughness: 0.58,
        metalness: 0.08,
        transparent: true,
        opacity: 0.95,
      });

      const windowGlassMaterial = new THREE.MeshStandardMaterial({
        color: '#0c2430',
        roughness: 0.32,
        metalness: 0.04,
        transparent: true,
        opacity: 0.88,
      });

      const windowAccentMaterial = new THREE.MeshStandardMaterial({
        color: '#123342',
        emissive: '#0f6f7a',
        emissiveIntensity: 0.3,
        roughness: 0.4,
        metalness: 0.15,
        transparent: true,
        opacity: 0.95,
      });

      const outerWindow = new THREE.Mesh(
        new THREE.BoxGeometry(
          HERO_BUILDER_CONFIG.layout.window.size[0],
          HERO_BUILDER_CONFIG.layout.window.size[1],
          HERO_BUILDER_CONFIG.layout.window.size[2],
        ),
        windowFrameMaterial,
      );
      outerWindow.position.z = 0;
      windowGroup.add(outerWindow);
      sceneNodes.push(outerWindow);

      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(
          HERO_BUILDER_CONFIG.layout.window.size[0] - 0.28,
          HERO_BUILDER_CONFIG.layout.window.size[1] - 0.34,
          0.08,
        ),
        windowGlassMaterial,
      );
      screen.position.z = 0.02;
      windowGroup.add(screen);
      sceneNodes.push(screen);

      const topBar = new THREE.Mesh(
        new THREE.BoxGeometry(HERO_BUILDER_CONFIG.layout.window.size[0] - 0.28, 0.28, 0.06),
        windowAccentMaterial,
      );
      topBar.position.set(0, HERO_BUILDER_CONFIG.layout.window.size[1] / 2 - 0.28, 0.07);
      windowGroup.add(topBar);
      sceneNodes.push(topBar);

      const chromeDotGeometry = new THREE.SphereGeometry(0.06, 14, 14);
      [-2.95, -2.7, -2.45].forEach((x, index) => {
        const dot = new THREE.Mesh(
          chromeDotGeometry,
          new THREE.MeshStandardMaterial({
            color: index === 0 ? '#ff7b7b' : index === 1 ? '#ffd866' : '#8ffcff',
            emissive: index === 2 ? '#2dd9e6' : '#000000',
            emissiveIntensity: 0.2,
            roughness: 0.2,
            metalness: 0.1,
          }),
        );
        dot.position.set(x, HERO_BUILDER_CONFIG.layout.window.size[1] / 2 - 0.14, 0.1);
        windowGroup.add(dot);
        sceneNodes.push(dot);
      });

      const slotFrameMaterial = new THREE.MeshStandardMaterial({
        color: '#123642',
        transparent: true,
        opacity: 0.72,
        roughness: 0.45,
        metalness: 0.08,
      });

      HERO_BUILDER_CONFIG.slots.forEach((slot) => {
        const slotGroup = new THREE.Group();
        slotGroup.position.set(slot.position[0], slot.position[1], slot.position[2]);
        windowGroup.add(slotGroup);
        sceneNodes.push(slotGroup);

        const slotBorderMaterial = slotFrameMaterial.clone();
        slotBorderMaterial.transparent = true;
        slotBorderMaterial.opacity = 0.5;
        const slotBorder = new THREE.Mesh(
          new THREE.BoxGeometry(slot.size[0], slot.size[1], slot.size[2]),
          slotBorderMaterial,
        );
        slotGroup.add(slotBorder);
        slotMeshes.push(slotBorder);
        sceneNodes.push(slotBorder);

        const slotGlow = new THREE.Mesh(
          new THREE.BoxGeometry(slot.size[0] - 0.08, slot.size[1] - 0.08, 0.04),
          new THREE.MeshStandardMaterial({
            color: '#0b2028',
            emissive: '#0f6f7a',
            emissiveIntensity: 0.12,
            transparent: true,
            opacity: 0.35,
          }),
        );
        slotGlow.position.z = -0.02;
        slotGroup.add(slotGlow);
        sceneNodes.push(slotGlow);

        const placedMaterial = new THREE.MeshStandardMaterial({
          color: '#2dd9e6',
          emissive: '#2dd9e6',
          emissiveIntensity: 0.45,
          roughness: 0.34,
          metalness: 0.06,
          transparent: true,
          opacity: 0,
        });
        const placedBlock = new THREE.Mesh(
          new THREE.BoxGeometry(slot.size[0] - 0.16, slot.size[1] - 0.14, 0.12),
          placedMaterial,
        );
        placedBlock.visible = false;
        placedBlock.position.z = 0.03;
        slotGroup.add(placedBlock);
        placedMeshes.push(placedBlock);
        sceneNodes.push(placedBlock);
      });

      HERO_BUILDER_CONFIG.paletteSwatches.forEach((swatch, index) => {
        const paletteGroup = new THREE.Group();
        paletteGroup.position.set(
          HERO_BUILDER_CONFIG.layout.palette.position[0] + index * (HERO_BUILDER_CONFIG.layout.palette.swatchSize[0] + HERO_BUILDER_CONFIG.layout.palette.gap),
          HERO_BUILDER_CONFIG.layout.palette.position[1] + index * 0.35,
          HERO_BUILDER_CONFIG.layout.palette.position[2],
        );
        root.add(paletteGroup);
        sceneNodes.push(paletteGroup);

        const swatchMesh = new THREE.Mesh(
          new THREE.BoxGeometry(
            HERO_BUILDER_CONFIG.layout.palette.swatchSize[0],
            HERO_BUILDER_CONFIG.layout.palette.swatchSize[1],
            HERO_BUILDER_CONFIG.layout.palette.swatchSize[2],
          ),
          new THREE.MeshStandardMaterial({
            color: swatch.color,
            emissive: swatch.color,
            emissiveIntensity: 0.3,
            roughness: 0.22,
            metalness: 0.08,
          }),
        );
        swatchMesh.position.z = 0.15;
        paletteGroup.add(swatchMesh);
        paletteMeshes.push(swatchMesh);
        sceneNodes.push(swatchMesh);
      });

      const builderGroup = new THREE.Group();
      builderGroup.position.set(...HERO_BUILDER_CONFIG.layout.builder.position);
      builderGroup.scale.setScalar(HERO_BUILDER_CONFIG.layout.builder.scale);
      root.add(builderGroup);
      sceneNodes.push(builderGroup);

      const builderSkin = new THREE.MeshStandardMaterial({
        color: '#d4f8ff',
        roughness: 0.42,
        metalness: 0.04,
      });
      const builderDark = new THREE.MeshStandardMaterial({
        color: '#0b2630',
        roughness: 0.62,
        metalness: 0.05,
      });
      const builderAccent = new THREE.MeshStandardMaterial({
        color: '#2dd9e6',
        emissive: '#2dd9e6',
        emissiveIntensity: 0.35,
        roughness: 0.22,
        metalness: 0.1,
      });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.08, 0.52), builderDark);
      torso.position.set(0, 0.18, 0);
      builderGroup.add(torso);
      sceneNodes.push(torso);

      const chestBadge = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.08), builderAccent);
      chestBadge.position.set(0, 0.16, 0.28);
      builderGroup.add(chestBadge);
      sceneNodes.push(chestBadge);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.58, 0.52), builderSkin);
      head.position.set(0, 1.12, 0);
      builderGroup.add(head);
      sceneNodes.push(head);

      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 0.56), builderDark);
      hair.position.set(0, 1.42, 0);
      builderGroup.add(hair);
      sceneNodes.push(hair);

      const armGeo = new THREE.BoxGeometry(0.18, 0.8, 0.18);
      const leftArm = new THREE.Mesh(armGeo, builderDark);
      leftArm.position.set(-0.55, 0.18, 0);
      leftArm.rotation.z = 0.48;
      builderGroup.add(leftArm);
      sceneNodes.push(leftArm);

      const rightArm = new THREE.Mesh(armGeo, builderDark);
      rightArm.position.set(0.56, 0.2, 0);
      rightArm.rotation.z = -0.35;
      builderGroup.add(rightArm);
      sceneNodes.push(rightArm);

      const legGeo = new THREE.BoxGeometry(0.2, 0.84, 0.2);
      const leftLeg = new THREE.Mesh(legGeo, builderDark);
      leftLeg.position.set(-0.22, -0.8, 0.02);
      builderGroup.add(leftLeg);
      sceneNodes.push(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, builderDark);
      rightLeg.position.set(0.22, -0.8, -0.02);
      builderGroup.add(rightLeg);
      sceneNodes.push(rightLeg);

      const tool = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.08), builderAccent);
      tool.position.set(0.74, -0.06, 0.1);
      tool.rotation.z = -0.25;
      builderGroup.add(tool);
      sceneNodes.push(tool);

      const cursorGroup = new THREE.Group();
      root.add(cursorGroup);
      sceneNodes.push(cursorGroup);

      const cursorBodyMaterial = new THREE.MeshStandardMaterial({
        color: '#2dd9e6',
        emissive: '#8ffcff',
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 1,
      });

      const cursorBody = new THREE.Mesh(
        new THREE.BoxGeometry(
          HERO_BUILDER_CONFIG.layout.cursor.size[0],
          HERO_BUILDER_CONFIG.layout.cursor.size[1],
          HERO_BUILDER_CONFIG.layout.cursor.size[2],
        ),
        cursorBodyMaterial,
      );
      cursorGroup.add(cursorBody);
      sceneNodes.push(cursorBody);

      const cursorGlow = new THREE.Mesh(
        new THREE.SphereGeometry(HERO_BUILDER_CONFIG.layout.cursor.glowRadius, 20, 20),
        new THREE.MeshBasicMaterial({
          color: '#8ffcff',
          transparent: true,
          opacity: 0.18,
        }),
      );
      cursorGlow.scale.set(1.8, 0.9, 1.8);
      cursorGroup.add(cursorGlow);
      sceneNodes.push(cursorGlow);

      const cursorLight = new THREE.PointLight(0x2dd9e6, 2.0, 8, 2);
      cursorGroup.add(cursorLight);
      sceneNodes.push(cursorLight);

      const stepTargets = HERO_BUILDER_CONFIG.slots.map((slot, index) => ({
        slot,
        source: getPalettePosition(index),
        target: slotPositions[index].clone().add(new THREE.Vector3(0, 0, 0.08)),
      }));

      const steps = stepTargets.map((target, index) => ({
        ...target,
        swatch: HERO_BUILDER_CONFIG.paletteSwatches[index % HERO_BUILDER_CONFIG.paletteSwatches.length],
      }));

      const currentStep = {
        index: 0,
        phase: 'pickup' as BuildPhase,
        phaseElapsed: 0,
      };

      const setMeshAlpha = (mesh: THREE.Mesh, alpha: number) => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.transparent = true;
        material.opacity = alpha;
      };

      const resetPlacedMeshes = () => {
        placedMeshes.forEach((mesh) => {
          mesh.visible = false;
          setMeshAlpha(mesh, 0);
          mesh.scale.setScalar(1);
        });
      };

      resetPlacedMeshes();
      cursorGroup.visible = true;
      cursorGroup.position.copy(steps[0].source);

      const updateHighlighting = () => {
        slotMeshes.forEach((mesh, index) => {
          const material = mesh.material as THREE.MeshStandardMaterial;
          const active = index === currentStep.index && currentStep.phase !== 'reset';
          material.emissive = new THREE.Color(active ? '#2dd9e6' : '#0f6f7a');
          material.emissiveIntensity = active ? 0.38 : 0.12;
          material.opacity = active ? 0.78 : 0.48;
        });

        paletteMeshes.forEach((mesh, index) => {
          const material = mesh.material as THREE.MeshStandardMaterial;
          const active = index === currentStep.index;
          material.emissive = new THREE.Color(active ? steps[index].swatch.color : '#000000');
          material.emissiveIntensity = active ? 0.58 : 0.3;
          mesh.scale.setScalar(active ? 1.12 : 1);
        });
      };

      const buildCurve = (source: THREE.Vector3, target: THREE.Vector3) => {
        const lift = new THREE.Vector3(0, HERO_BUILDER_CONFIG.animation.arcHeight, 0);
        return {
          start: source.clone(),
          ctrl1: source.clone().add(new THREE.Vector3(0.6, 0.2, 0)).add(lift.clone().multiplyScalar(0.25)),
          ctrl2: target.clone().add(new THREE.Vector3(-0.65, 0.08, 0)).add(lift.clone().multiplyScalar(0.8)),
          end: target.clone(),
        };
      };

      const render = () => {
        if (!isRunning) return;

        const now = performance.now();
        const delta = Math.min((now - lastTimestamp) / 1000, 0.05);
        lastTimestamp = now;
        elapsed += delta;
        currentStep.phaseElapsed += delta;

        const bob = Math.sin(elapsed * HERO_BUILDER_CONFIG.animation.bobSpeed) * HERO_BUILDER_CONFIG.animation.bobAmplitude;
        builderGroup.position.y = HERO_BUILDER_CONFIG.layout.builder.position[1] + bob;
        builderGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.06;
        builderGroup.rotation.z = Math.sin(elapsed * 0.55) * 0.03;

        const activeStep = steps[currentStep.index] ?? steps[0];
        const activeSource = activeStep?.source ?? steps[0].source;
        const activeTarget = activeStep?.target ?? steps[0].target;
        const cursorMaterial = cursorBody.material as THREE.MeshStandardMaterial;
        cursorColor.set(activeStep?.swatch.color ?? '#2dd9e6');
        cursorMaterial.color.copy(cursorColor);
        cursorMaterial.emissive.copy(cursorColor);

        if (currentStep.phase === 'pickup') {
          const t = clamp01(currentStep.phaseElapsed / HERO_BUILDER_CONFIG.animation.pickupDuration);
          const raisedSource = activeSource.clone().add(new THREE.Vector3(0, 0.24, 0));
          cursorGroup.visible = true;
          cursorGroup.position.copy(activeSource).lerp(raisedSource, easeOutCubic(t));
          cursorGroup.scale.setScalar(0.88 + 0.14 * easeOutBack(t));
          cursorGroup.rotation.z = -0.08 + t * 0.12;
          cursorLight.intensity = 1.8 + t * 0.6;

          if (t >= 1) {
            currentStep.phase = 'travel';
            currentStep.phaseElapsed = 0;
          }
        } else if (currentStep.phase === 'travel') {
          const t = clamp01(currentStep.phaseElapsed / HERO_BUILDER_CONFIG.animation.travelDuration);
          const curve = buildCurve(activeSource, activeTarget);
          const eased = easeInOutCubic(t);
          cursorGroup.position.copy(cubicBezier(curve.start, curve.ctrl1, curve.ctrl2, curve.end, eased));
          cursorGroup.scale.setScalar(1.0 + 0.06 * Math.sin(t * Math.PI));
          cursorGroup.rotation.z = -0.08 + t * 0.22;
          cursorLight.intensity = 2.1;

          if (t >= 1) {
            currentStep.phase = 'snap';
            currentStep.phaseElapsed = 0;
          }
        } else if (currentStep.phase === 'snap') {
          const t = clamp01(currentStep.phaseElapsed / HERO_BUILDER_CONFIG.animation.snapDuration);
          const snapStart = activeTarget.clone().add(new THREE.Vector3(0, HERO_BUILDER_CONFIG.animation.snapLift, 0));
          cursorGroup.position.copy(snapStart).lerp(activeTarget, easeOutBack(t));
          cursorGroup.scale.setScalar(1.08 - 0.08 * t);
          cursorGroup.rotation.z = 0.02 * (1 - t);
          cursorLight.intensity = 2.4 - 0.5 * t;

          if (t >= 1) {
            const placedMesh = placedMeshes[currentStep.index];
            placedMesh.visible = true;
            placedMesh.position.copy(activeTarget);
            setMeshAlpha(placedMesh, 1);
            currentStep.phase = 'settle';
            currentStep.phaseElapsed = 0;
          }
        } else if (currentStep.phase === 'settle') {
          const t = clamp01(currentStep.phaseElapsed / HERO_BUILDER_CONFIG.animation.settleDuration);
          const pulse = 1 + Math.sin(elapsed * 5.2) * 0.035;
          const placedMesh = placedMeshes[currentStep.index];
          placedMesh.scale.setScalar(pulse);
          cursorGroup.position.copy(activeTarget);
          cursorGroup.scale.setScalar(1.0);
          cursorLight.intensity = 1.7;

          if (t >= 1) {
            if (currentStep.index < steps.length - 1) {
              currentStep.index += 1;
              currentStep.phase = 'pickup';
              currentStep.phaseElapsed = 0;
            } else {
              currentStep.phase = 'reset';
              currentStep.phaseElapsed = 0;
            }
          }
        } else if (currentStep.phase === 'reset') {
          const totalResetTime = HERO_BUILDER_CONFIG.animation.pauseDuration + HERO_BUILDER_CONFIG.animation.resetDuration;
          const t = clamp01(currentStep.phaseElapsed / totalResetTime);

          if (currentStep.phaseElapsed <= HERO_BUILDER_CONFIG.animation.pauseDuration) {
            cursorGroup.position.copy(activeTarget);
            cursorGroup.scale.setScalar(1);
            cursorLight.intensity = 1.4;
          } else {
            const resetProgress = clamp01(
              (currentStep.phaseElapsed - HERO_BUILDER_CONFIG.animation.pauseDuration) /
                HERO_BUILDER_CONFIG.animation.resetDuration,
            );
            const curve = buildCurve(activeTarget, steps[0].source);
            const eased = easeInOutCubic(resetProgress);
            cursorGroup.position.copy(cubicBezier(curve.start, curve.ctrl1, curve.ctrl2, curve.end, eased));
            cursorGroup.scale.setScalar(1.0 - 0.1 * resetProgress);
            cursorLight.intensity = 1.2 - 0.5 * resetProgress;
            placedMeshes.forEach((mesh, index) => {
              const material = mesh.material as THREE.MeshStandardMaterial;
              material.opacity = 1 - resetProgress;
              if (resetProgress > 0.96) {
                mesh.visible = false;
              }
              mesh.scale.setScalar(1 - resetProgress * 0.1);
              if (index === 0) {
                mesh.position.copy(activeTarget);
              }
            });

            if (resetProgress >= 1) {
              resetPlacedMeshes();
              currentStep.index = 0;
              currentStep.phase = 'pickup';
              currentStep.phaseElapsed = 0;
              cursorGroup.position.copy(steps[0].source);
              cursorGroup.scale.setScalar(0.9);
            }
          }

          if (t >= 1 && currentStep.phase === 'reset') {
            resetPlacedMeshes();
          }
        }

        updateHighlighting();
        renderer?.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };

      const updateSize = () => {
        if (!renderer) return;
        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;
        const aspect = width / height;
        const cameraPreset = width < HERO_BUILDER_CONFIG.renderer.antialiasBreakpoint
          ? HERO_BUILDER_CONFIG.camera.mobile
          : HERO_BUILDER_CONFIG.camera.desktop;

        camera.fov = cameraPreset.fov;
        camera.position.set(cameraPreset.position[0], cameraPreset.position[1], cameraPreset.position[2]);
        camera.lookAt(0, 0.75, 0);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, HERO_BUILDER_CONFIG.renderer.pixelRatioCap));
        renderer.setSize(width, height, false);
      };

      const start = () => {
        if (isRunning || !isVisible || !isTabVisible) return;
        isRunning = true;
        lastTimestamp = performance.now();
        frameId = window.requestAnimationFrame(render);
      };

      const stop = () => {
        if (!isRunning) return;
        isRunning = false;
        window.cancelAnimationFrame(frameId);
      };

      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(mount);
      updateSize();

      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry ? entry.isIntersecting && entry.intersectionRatio > 0.15 : true;
          if (isVisible && isTabVisible) start();
          else stop();
        },
        { threshold: [0.15, 0.25, 0.5] },
      );
      intersectionObserver.observe(mount);

      const handleVisibilityChange = () => {
        isTabVisible = document.visibilityState === 'visible';
        if (isVisible && isTabVisible) start();
        else stop();
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      start();

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        stop();
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();

        const geometries = new Set<THREE.BufferGeometry>();
        const materials = new Set<THREE.Material>();

        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            geometries.add(object.geometry);
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => materials.add(material));
            } else {
              materials.add(object.material);
            }
          }
        });

        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());

        scene.clear();
        renderer?.dispose();

        if (renderer?.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.warn('HeroBuilderScene failed to initialize; falling back to static background.', error);
      setRenderMode('static');
      return undefined;
    }
  }, [renderMode]);

  if (renderMode === 'static') {
    return staticBackground;
  }

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
};
