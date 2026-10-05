import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, Color, Float32BufferAttribute, ShaderMaterial } from 'three';

const AREA_X = 40;
const Z_NEAR = 8;
const Z_FAR = -52;
const RISE_HEIGHT = 11;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHeight;

  attribute float aSeed;
  attribute float aSize;

  varying float vAlpha;

  void main() {
    vec3 p = position;

    // Each particle loops upward from the water line, fading in and out.
    float rise = fract(aSeed * 7.31 + uTime * (0.015 + aSeed * 0.03));
    p.y = -2.2 + rise * uHeight;
    p.x += sin(uTime * 0.4 + aSeed * 40.0) * 0.6;
    p.z += cos(uTime * 0.3 + aSeed * 25.0) * 0.6;

    vAlpha = smoothstep(0.0, 0.15, rise) * (1.0 - smoothstep(0.7, 1.0, rise));

    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = min(aSize * uPixelRatio * (22.0 / -viewPosition.z), 48.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor, soft * vAlpha * 0.85);
    #include <colorspace_fragment>
  }
`;

interface ParticlesProps {
  count: number;
}

export function Particles({ count }: ParticlesProps) {
  const pixelRatio = useThree((state) => state.viewport.dpr);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 2 * AREA_X;
      positions[i * 3 + 1] = 0; // y is driven by the shader
      positions[i * 3 + 2] = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
      seeds[i] = Math.random();
      sizes[i] = 1 + Math.random() * 2.2;
    }

    const bufferGeometry = new BufferGeometry();
    bufferGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1));
    bufferGeometry.setAttribute('aSize', new Float32BufferAttribute(sizes, 1));
    return bufferGeometry;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uHeight: { value: RISE_HEIGHT },
          uColor: { value: new Color('#00c8e6') },
        },
      }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = pixelRatio;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
