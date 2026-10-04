import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraRig, CAMERA_START } from './CameraRig';
import { Particles } from './Particles';
import { Showcase } from './Showcase';
import { WaveField } from './WaveField';
import { attachInput } from './input';
import { QUALITY_PROFILES, stepDown, writeTierCap, type QualityTier } from './quality';

interface Scene3DProps {
  tier: Exclude<QualityTier, 'none'>;
  /** Called once the first frames have rendered (shaders compiled). */
  onReady: () => void;
  /** Called when the scene must drop to a lower tier ('none' = give up on 3D). */
  onDegrade: (tier: QualityTier) => void;
}

/** Fires onReady after a few frames so the CSS fade-in hides shader-compile jank. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const fired = useRef(false);

  useFrame(() => {
    if (fired.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      fired.current = true;
      onReady();
    }
  });

  return null;
}

/** Caps the frame rate on low-end devices by invalidating a demand-driven loop. */
function FrameLimiter({ fps }: { fps: number }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const interval = 1000 / fps;
    let last = 0;
    let frameId = 0;

    const loop = (now: number) => {
      frameId = window.requestAnimationFrame(loop);
      if (now - last >= interval - 1) {
        last = now;
        invalidate();
      }
    };

    frameId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frameId);
  }, [fps, invalidate]);

  return null;
}

/**
 * A genuinely lost GPU context (driver reset, too many tabs) can't be recovered mid-session,
 * so give up on 3D. The listener only lives as long as the scene: when React unmounts the
 * canvas on purpose (e.g. leaving the home route), R3F releases the context itself, which also
 * fires "webglcontextlost". Removing the listener in cleanup keeps that from being mistaken for a crash.
 */
function ContextGuard({ onLost }: { onLost: () => void }) {
  const canvas = useThree((state) => state.gl.domElement);

  useEffect(() => {
    const handle = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    canvas.addEventListener('webglcontextlost', handle);
    return () => canvas.removeEventListener('webglcontextlost', handle);
  }, [canvas, onLost]);

  return null;
}

/** Ignore the first stretch: shader compilation and first-paint work make early frames unrepresentative. */
const WARMUP_SECONDS = 2.5;
/** Each measurement window covers this much wall time (not a frame count, so a 3 fps device still gets judged). */
const WINDOW_SECONDS = 2;
/** Degrade only if we stay below this fraction of the target fps... */
const MIN_FPS_RATIO = 0.72;
/** ...for this many consecutive windows (one janky scroll isn't enough). */
const BAD_WINDOWS_BEFORE_DEGRADE = 2;
/** A frame this long means the tab was backgrounded or throttled, not that the GPU is slow. */
const BACKGROUND_STALL_SECONDS = 2;

/**
 * Watches real frame times and steps the quality tier down if the device
 * can't keep up. It never steps up, so quality can't oscillate.
 * Scene3D is remounted on a tier change, so this state starts fresh each time.
 */
function Governor({ targetFps, onDegrade }: { targetFps: number; onDegrade: () => void }) {
  const state = useRef({ warmup: 0, frames: 0, time: 0, badWindows: 0 });

  useFrame((_, delta) => {
    const s = state.current;

    if (document.hidden || delta > BACKGROUND_STALL_SECONDS) return;

    if (s.warmup < WARMUP_SECONDS) {
      s.warmup += delta;
      return;
    }

    s.frames += 1;
    s.time += delta;
    if (s.time < WINDOW_SECONDS) return;

    const fps = s.frames / s.time;
    s.frames = 0;
    s.time = 0;

    if (fps < targetFps * MIN_FPS_RATIO) {
      s.badWindows += 1;
      if (s.badWindows >= BAD_WINDOWS_BEFORE_DEGRADE) onDegrade();
    } else {
      s.badWindows = 0;
    }
  });

  return null;
}

export default function Scene3D({ tier, onReady, onDegrade }: Scene3DProps) {
  const profile = QUALITY_PROFILES[tier];

  useEffect(() => attachInput(), []);

  const handleDegrade = () => {
    const next = stepDown(tier);
    writeTierCap(next);
    onDegrade(next);
  };

  return (
    <Canvas
      flat
      dpr={profile.dpr}
      frameloop={profile.fps ? 'demand' : 'always'}
      camera={{ fov: 42, near: 0.1, far: 140, position: CAMERA_START }}
      gl={{
        antialias: profile.antialias,
        alpha: true,
        stencil: false,
        powerPreference: 'high-performance',
      }}
    >
      {/* Order matters: the camera moves first, everything else reads it. */}
      <CameraRig />
      <WaveField segments={profile.waveSegments} />
      <Particles count={profile.particles} />
      {profile.showcase && <Showcase />}

      {profile.fps ? <FrameLimiter fps={profile.fps} /> : null}
      <Governor targetFps={profile.fps ?? 60} onDegrade={handleDegrade} />
      <ReadySignal onReady={onReady} />
      <ContextGuard onLost={() => onDegrade('none')} />
    </Canvas>
  );
}
