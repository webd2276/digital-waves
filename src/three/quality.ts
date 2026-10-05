/**
 * Device capability detection and quality profiles for the 3D backdrop.
 *
 * Tiers go from 'high' (desktop GPU) down to 'none' (no WebGL layer at all).
 * The runtime governor in Scene3D can only ever step DOWN a tier, never up,
 * so the scene never flaps between qualities.
 */

export type QualityTier = 'none' | 'low' | 'medium' | 'high';

export interface QualityProfile {
  /** R3F dpr range: [min, max]. The renderer picks within it. */
  dpr: [number, number];
  antialias: boolean;
  /** Wave plane subdivisions [x, z]. */
  waveSegments: [number, number];
  /** Number of floating particles. */
  particles: number;
  /** Render the three service objects. */
  showcase: boolean;
  /** Frame cap. null = render every display frame. */
  fps: number | null;
}

export const QUALITY_PROFILES: Record<Exclude<QualityTier, 'none'>, QualityProfile> = {
  high: {
    dpr: [1, 2],
    antialias: true,
    waveSegments: [160, 110],
    particles: 700,
    showcase: true,
    fps: null,
  },
  medium: {
    dpr: [1, 1.5],
    antialias: true,
    waveSegments: [110, 76],
    particles: 320,
    showcase: true,
    fps: null,
  },
  low: {
    dpr: [1, 1],
    antialias: false,
    waveSegments: [56, 40],
    particles: 110,
    showcase: true,
    fps: 30,
  },
};

const TIER_ORDER: QualityTier[] = ['none', 'low', 'medium', 'high'];

/** The next tier below `tier`. 'none' stays 'none'. */
export const stepDown = (tier: QualityTier): QualityTier => {
  const index = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[Math.max(0, index - 1)];
};

/** Lower of two tiers. */
export const minTier = (a: QualityTier, b: QualityTier): QualityTier =>
  TIER_ORDER.indexOf(a) <= TIER_ORDER.indexOf(b) ? a : b;

/**
 * Remembers, for this browser session, the lowest tier the FPS governor had to
 * fall back to. Without this, every visit to the home page would re-run the
 * (visible) degradation on a slow device.
 */
const TIER_CAP_KEY = 'digital-waves-3d-tier-cap';

export const readTierCap = (): QualityTier => {
  try {
    const stored = window.sessionStorage.getItem(TIER_CAP_KEY) as QualityTier | null;
    return stored && TIER_ORDER.includes(stored) ? stored : 'high';
  } catch {
    return 'high';
  }
};

export const writeTierCap = (tier: QualityTier) => {
  try {
    window.sessionStorage.setItem(TIER_CAP_KEY, tier);
  } catch {
    // Private mode / storage disabled: the cap just won't persist.
  }
};

const hasWebGL2 = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    // Release the probe context immediately so it doesn't count against the
    // browser's limit of live WebGL contexts.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** Pick the starting tier from device hints. Safe to call only in the browser. */
export const detectQualityTier = (): QualityTier => {
  if (typeof window === 'undefined') return 'none';

  const nav = navigator as NavigatorWithHints;

  // Respect user preferences first: no motion, or "data saver" on.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none';
  if (nav.connection?.saveData) return 'none';

  // three.js r163+ is WebGL2-only.
  if (!hasWebGL2()) return 'none';

  const memory = nav.deviceMemory ?? 8; // Safari/Firefox don't report it
  const cores = nav.hardwareConcurrency ?? 8;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 768;

  // Truly tiny devices: skip 3D. Few cores alone is NOT enough to skip, because
  // privacy modes (e.g. Firefox resistFingerprinting) report 2 cores on fast machines.
  // Those start at 'low' and the FPS governor drops to 'none' if they really can't cope.
  if (memory <= 1) return 'none';

  if (coarsePointer || narrow || memory <= 4 || cores <= 4) return 'low';
  if (memory >= 8 && cores >= 8) return 'high';
  return 'medium';
};

/**
 * QA override: `?3d=high|medium|low|off`. Handy for testing a tier on any machine.
 * It still can't force 3D on when WebGL2 is missing.
 */
const readOverride = (): QualityTier | null => {
  try {
    const value = new URLSearchParams(window.location.search).get('3d');
    if (value === 'off') return 'none';
    if (value === 'low' || value === 'medium' || value === 'high') return value;
  } catch {
    // ignore malformed URLs
  }
  return null;
};

/** Starting tier after applying the session cap from earlier degradations. */
export const getInitialTier = (): QualityTier => {
  const override = readOverride();
  if (override) return override === 'none' || hasWebGL2() ? override : 'none';
  return minTier(detectQualityTier(), readTierCap());
};
