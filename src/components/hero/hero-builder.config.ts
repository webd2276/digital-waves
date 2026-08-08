export type Vec3 = readonly [number, number, number];

export type BuilderSlotId = 'header' | 'hero' | 'card-a' | 'card-b' | 'footer';

export interface BuilderSlotConfig {
  id: BuilderSlotId;
  label: string;
  position: Vec3;
  size: Vec3;
}

export interface BuilderSwatchConfig {
  id: string;
  label: string;
  color: string;
}

export interface HeroBuilderConfig {
  scene: {
    background: string;
    fog: string;
  };
  camera: {
    desktop: {
      fov: number;
      position: Vec3;
    };
    mobile: {
      fov: number;
      position: Vec3;
    };
  };
  renderer: {
    pixelRatioCap: number;
    antialiasBreakpoint: number;
    mobileFallbackBreakpoint: number;
  };
  layout: {
    window: {
      position: Vec3;
      size: Vec3;
    };
    palette: {
      position: Vec3;
      swatchSize: Vec3;
      gap: number;
    };
    builder: {
      position: Vec3;
      scale: number;
    };
    cursor: {
      size: Vec3;
      glowRadius: number;
    };
  };
  animation: {
    pickupDuration: number;
    travelDuration: number;
    snapDuration: number;
    settleDuration: number;
    pauseDuration: number;
    resetDuration: number;
    arcHeight: number;
    snapLift: number;
    bobAmplitude: number;
    bobSpeed: number;
  };
  paletteSwatches: readonly BuilderSwatchConfig[];
  slots: readonly BuilderSlotConfig[];
}

export const HERO_BUILDER_CONFIG = {
  scene: {
    background: '#061018',
    fog: '#061018',
  },
  camera: {
    desktop: {
      fov: 34,
      position: [0, 1.25, 12.2] as const,
    },
    mobile: {
      fov: 40,
      position: [0, 0.95, 13.5] as const,
    },
  },
  renderer: {
    pixelRatioCap: 2,
    antialiasBreakpoint: 768,
    mobileFallbackBreakpoint: 640,
  },
  layout: {
    window: {
      position: [1.6, 0.55, 0.2] as const,
      size: [7.2, 4.7, 0.28] as const,
    },
    palette: {
      position: [-4.85, -1.0, 0.1] as const,
      swatchSize: [0.66, 0.24, 0.18] as const,
      gap: 0.18,
    },
    builder: {
      position: [-4.0, -1.05, 0.3] as const,
      scale: 1.06,
    },
    cursor: {
      size: [0.56, 0.34, 0.2] as const,
      glowRadius: 0.28,
    },
  },
  animation: {
    pickupDuration: 0.34,
    travelDuration: 1.08,
    snapDuration: 0.3,
    settleDuration: 0.48,
    pauseDuration: 0.95,
    resetDuration: 0.72,
    arcHeight: 1.75,
    snapLift: 0.42,
    bobAmplitude: 0.07,
    bobSpeed: 1.3,
  },
  paletteSwatches: [
    { id: 'nav', label: 'Navigation', color: '#2dd9e6' },
    { id: 'hero', label: 'Hero', color: '#0f6f7a' },
    { id: 'cards', label: 'Cards', color: '#39e4d6' },
    { id: 'footer', label: 'Footer', color: '#184d58' },
    { id: 'cta', label: 'CTA', color: '#8ffcff' },
  ] as const,
  slots: [
    { id: 'header', label: 'Header', position: [0, 1.56, 0.06] as const, size: [3.0, 0.42, 0.16] as const },
    { id: 'hero', label: 'Hero', position: [0, 0.72, 0.06] as const, size: [4.0, 0.84, 0.16] as const },
    { id: 'card-a', label: 'Card A', position: [-1.36, -0.26, 0.06] as const, size: [1.78, 0.88, 0.16] as const },
    { id: 'card-b', label: 'Card B', position: [1.36, -0.26, 0.06] as const, size: [1.78, 0.88, 0.16] as const },
    { id: 'footer', label: 'Footer', position: [0, -1.24, 0.06] as const, size: [4.2, 0.34, 0.16] as const },
  ] as const,
} as const satisfies HeroBuilderConfig;
