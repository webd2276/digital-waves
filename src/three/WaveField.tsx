import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Color,
  MathUtils,
  Mesh,
  PlaneGeometry,
  Plane,
  Ray,
  ShaderMaterial,
  Vector2,
  Vector3,
} from 'three';
import { input } from './input';

export const WAVE_Y = -2.5;
export const WAVE_CENTER_Z = -22;
const WAVE_WIDTH = 90;
const WAVE_DEPTH = 80;

/**
 * The wave is displaced entirely on the GPU. The previous HeroWaveScene looped
 * over every vertex in JavaScript and recomputed normals each frame; here the
 * CPU only updates a handful of uniforms.
 */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uRipple;

  varying vec2 vGrid;
  varying float vHeight;
  varying float vDepth;
  varying vec3 vNormal;

  float waveHeight(vec2 p) {
    float t = uTime;
    float h = 0.0;
    h += sin(p.x * 0.55 + t * 0.9) * 0.55;
    h += sin(p.y * 0.70 - t * 0.7) * 0.40;
    h += sin((p.x + p.y) * 0.32 + t * 0.5) * 0.35;

    // Ripple that follows the pointer across the surface.
    float d = length(p - uPointer);
    h += sin(d * 1.6 - t * 2.4) * 0.22 * uRipple * smoothstep(8.0, 0.0, d);
    return h;
  }

  void main() {
    vec3 pos = position;
    float h = waveHeight(pos.xz);

    // Analytic-ish normal from finite differences, so the surface can be lit
    // without recomputing normals on the CPU.
    float e = 0.12;
    float hx = waveHeight(pos.xz + vec2(e, 0.0));
    float hz = waveHeight(pos.xz + vec2(0.0, e));
    vec3 n = normalize(vec3(h - hx, e, h - hz));

    pos.y += h;

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);

    vGrid = position.xz;
    vHeight = h;
    vDepth = -viewPosition.z;
    vNormal = normalize(mat3(modelMatrix) * n);

    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  uniform float uNear;
  uniform float uFar;
  uniform float uHalfWidth;

  varying vec2 vGrid;
  varying float vHeight;
  varying float vDepth;
  varying vec3 vNormal;

  // Anti-aliased grid line, width in screen pixels.
  float gridLine(vec2 coord, float width) {
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y);
    return 1.0 - min(line / width, 1.0);
  }

  void main() {
    float major = gridLine(vGrid * 0.25, 1.1);
    float minor = gridLine(vGrid, 0.8) * 0.35 * (1.0 - smoothstep(10.0, 30.0, vDepth));
    float lines = max(major, minor);

    float crest = smoothstep(-0.7, 1.2, vHeight);
    float diffuse = max(dot(normalize(vNormal), normalize(vec3(-0.4, 0.9, 0.5))), 0.0);

    vec3 color = mix(uColorB, uColorA, crest);

    // Soft translucent fill, plus the grid lines on top.
    float fill = 0.07 + 0.12 * diffuse + 0.10 * crest;
    float alpha = clamp(lines * 0.8 + fill, 0.0, 1.0);

    // Fade with distance and toward the plane's left/right edges.
    alpha *= 1.0 - smoothstep(uNear, uFar, vDepth);
    alpha *= 1.0 - smoothstep(uHalfWidth * 0.55, uHalfWidth * 0.95, abs(vGrid.x));
    alpha *= uOpacity;

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

interface WaveFieldProps {
  segments: [number, number];
}

export function WaveField({ segments }: WaveFieldProps) {
  const camera = useThree((state) => state.camera);
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(WAVE_WIDTH, WAVE_DEPTH, segments[0], segments[1]);
    plane.rotateX(-Math.PI / 2);
    return plane;
  }, [segments[0], segments[1]]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new Vector2(999, 999) },
          uRipple: { value: 0 },
          uOpacity: { value: 0.95 },
          uColorA: { value: new Color('#00e5ff') },
          uColorB: { value: new Color('#0b8fa6') },
          uNear: { value: 20 },
          uFar: { value: 64 },
          uHalfWidth: { value: WAVE_WIDTH / 2 },
        },
      }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  // Scratch objects, allocated once.
  const scratch = useMemo(
    () => ({
      ray: new Ray(),
      plane: new Plane(new Vector3(0, 1, 0), -WAVE_Y),
      ndc: new Vector3(),
      hit: new Vector3(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const uniforms = material.uniforms;
    uniforms.uTime.value = state.clock.elapsedTime;

    // Where is the pointer on the wave surface? Cast a ray from the camera.
    scratch.ndc.set(input.pointerX, input.pointerY, 0.5).unproject(camera);
    scratch.ray.origin.copy(camera.position);
    scratch.ray.direction.copy(scratch.ndc).sub(camera.position).normalize();
    const point = scratch.ray.intersectPlane(scratch.plane, scratch.hit);

    const recentlyMoved = performance.now() - input.lastPointerAt < 1500;
    uniforms.uRipple.value = MathUtils.damp(uniforms.uRipple.value, point && recentlyMoved ? 1 : 0, 4, delta);
    if (point) {
      uniforms.uPointer.value.set(point.x - mesh.position.x, point.z - mesh.position.z);
    }

    // Calm the wave down once the visitor is reading content further down.
    const dim = MathUtils.smoothstep(input.scroll, 0, 0.18);
    uniforms.uOpacity.value = MathUtils.lerp(0.95, 0.55, dim);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, WAVE_Y, WAVE_CENTER_Z]}
      frustumCulled={false}
    />
  );
}
