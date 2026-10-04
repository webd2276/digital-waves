import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';
import { input } from './input';

/**
 * The camera flies along a smooth spline as the page scrolls: it starts low
 * over the water looking at the horizon, and rises to look down on the wave.
 * Pointer movement adds a little parallax on top.
 */
export const CAMERA_START: [number, number, number] = [0, 0.6, 10];

const POSITION_PATH = new CatmullRomCurve3(
  [
    new Vector3(0, 0.6, 10),
    new Vector3(1.5, 1.8, 6),
    new Vector3(-1.5, 3.4, 1),
    new Vector3(1.0, 5.0, -4),
    new Vector3(0, 6.5, -9),
  ],
  false,
  'catmullrom',
  0.5,
);

const LOOK_PATH = new CatmullRomCurve3(
  [
    new Vector3(0, -1.0, -8),
    new Vector3(0, -1.6, -10),
    new Vector3(0, -2.2, -12),
    new Vector3(0, -2.5, -14),
    new Vector3(0, -2.5, -16),
  ],
  false,
  'catmullrom',
  0.5,
);

export function CameraRig() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const position = useMemo(() => new Vector3(), []);
  const lookAt = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    // Damped follow: scroll jumps (anchor links, "back to top") glide instead of snapping.
    progress.current = MathUtils.damp(progress.current, input.scroll, 3.5, delta);
    pointer.current.x = MathUtils.damp(pointer.current.x, input.pointerX, 3, delta);
    pointer.current.y = MathUtils.damp(pointer.current.y, input.pointerY, 3, delta);

    const t = MathUtils.clamp(progress.current, 0, 1);
    POSITION_PATH.getPoint(t, position);
    LOOK_PATH.getPoint(t, lookAt);

    position.x += pointer.current.x * 0.7;
    position.y += pointer.current.y * 0.35;

    const camera = state.camera;
    camera.position.copy(position);
    camera.lookAt(lookAt);
    // Objects parented to the camera rig read this in the same frame.
    camera.updateMatrixWorld();
  });

  return null;
}
