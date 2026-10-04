import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute, Group, MathUtils, Mesh, PerspectiveCamera, Vector3 } from 'three';
import { input } from './input';

/**
 * Three objects, one per service, built from primitives so the scene needs no
 * model downloads. (When real .glb assets exist later they can replace these
 * without touching the camera/scroll/quality plumbing.)
 */

const NAVY = '#0f172a';
const SLATE = '#1e293b';
const CYAN = '#00e5ff';
const TEAL = '#0b8fa6';

const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/* ------------------------------------------------------------------ */
/* Website development: a browser window that "builds" itself          */
/* ------------------------------------------------------------------ */
function WebWindow() {
  const blocks = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    blocks.current.forEach((mesh, index) => {
      if (!mesh) return;
      // Content blocks gently slide in and out of the page.
      mesh.position.z = 0.1 + Math.sin(t * 1.2 + index * 1.1) * 0.035;
    });
  });

  const setBlock = (index: number) => (mesh: Mesh | null) => {
    blocks.current[index] = mesh;
  };

  return (
    <group>
      <mesh>
        <boxGeometry args={[2.4, 1.6, 0.14]} />
        <meshStandardMaterial color={NAVY} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.68, 0.01]}>
        <boxGeometry args={[2.4, 0.24, 0.16]} />
        <meshStandardMaterial color={SLATE} roughness={0.5} metalness={0.2} />
      </mesh>
      {[-1.05, -0.92, -0.79].map((x, index) => (
        <mesh key={x} position={[x, 0.68, 0.1]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color={index === 0 ? '#ff7b7b' : index === 1 ? '#ffd866' : CYAN}
            emissive={index === 2 ? CYAN : '#000000'}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
      <mesh ref={setBlock(0)} position={[0, 0.22, 0.1]}>
        <boxGeometry args={[1.95, 0.5, 0.06]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.35} roughness={0.3} />
      </mesh>
      <mesh ref={setBlock(1)} position={[-0.5, -0.5, 0.1]}>
        <boxGeometry args={[0.9, 0.5, 0.06]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.25} roughness={0.35} />
      </mesh>
      <mesh ref={setBlock(2)} position={[0.5, -0.5, 0.1]}>
        <boxGeometry args={[0.9, 0.5, 0.06]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.25} roughness={0.35} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* AI agents: a voice orb with orbiting rings                          */
/* ------------------------------------------------------------------ */
function VoiceOrb() {
  const core = useRef<Mesh>(null);
  const rings = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (core.current) {
      // A few detuned sines read as "someone is speaking".
      const voice = Math.sin(t * 3.1) * 0.5 + Math.sin(t * 5.3 + 1.2) * 0.3 + Math.sin(t * 1.7) * 0.2;
      core.current.scale.setScalar(1 + voice * 0.05);
    }

    rings.current.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.x = t * (0.35 + index * 0.12) + index;
      ring.rotation.y = t * (0.25 - index * 0.07);
    });
  });

  const setRing = (index: number) => (mesh: Mesh | null) => {
    rings.current[index] = mesh;
  };

  return (
    <group>
      <mesh ref={core}>
        <sphereGeometry args={[0.6, 40, 40]} />
        <meshStandardMaterial color={CYAN} emissive="#00b3cc" emissiveIntensity={0.7} roughness={0.2} metalness={0.1} />
      </mesh>
      {[0.95, 1.15, 1.35].map((radius, index) => (
        <mesh key={radius} ref={setRing(index)}>
          <torusGeometry args={[radius, 0.014, 8, 112]} />
          <meshStandardMaterial
            color={index === 1 ? NAVY : TEAL}
            emissive={index === 1 ? '#000000' : TEAL}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Automation: a node graph with data pulses travelling along edges    */
/* ------------------------------------------------------------------ */
const NODE_COUNT = 9;

const buildGraph = () => {
  const nodes: Vector3[] = [];
  // Fibonacci sphere gives evenly spread nodes without randomness (stable across renders).
  for (let i = 0; i < NODE_COUNT; i += 1) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = i * 2.399963;
    nodes.push(new Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).multiplyScalar(0.95));
  }

  const edges: [number, number][] = [];
  for (let a = 0; a < nodes.length; a += 1) {
    for (let b = a + 1; b < nodes.length; b += 1) {
      if (nodes[a].distanceTo(nodes[b]) < 1.25) edges.push([a, b]);
    }
  }

  const positions: number[] = [];
  edges.forEach(([a, b]) => {
    positions.push(nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z);
  });
  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

  return { nodes, edges, lineGeometry };
};

function NodeGraph() {
  const graph = useMemo(buildGraph, []);
  const group = useRef<Group>(null);
  const pulses = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.25;
      group.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }

    pulses.current.forEach((pulse, index) => {
      if (!pulse || graph.edges.length === 0) return;
      const cycle = t * 0.55 + index * 0.37;
      const edgeIndex = Math.floor(cycle + index * 3) % graph.edges.length;
      const [a, b] = graph.edges[edgeIndex];
      const progress = cycle - Math.floor(cycle);
      pulse.position.lerpVectors(graph.nodes[a], graph.nodes[b], progress);
    });
  });

  const setPulse = (index: number) => (mesh: Mesh | null) => {
    pulses.current[index] = mesh;
  };

  return (
    <group ref={group}>
      <lineSegments geometry={graph.lineGeometry}>
        <lineBasicMaterial color={NAVY} transparent opacity={0.45} />
      </lineSegments>
      {graph.nodes.map((node, index) => (
        <mesh key={index} position={node}>
          <sphereGeometry args={[index % 3 === 0 ? 0.11 : 0.075, 16, 16]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? CYAN : NAVY}
            emissive={index % 3 === 0 ? CYAN : '#000000'}
            emissiveIntensity={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
      {[0, 1].map((index) => (
        <mesh key={index} ref={setPulse(index)}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#7ff7ff" />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Layout: a vertical column hugging one screen edge, riding the camera */
/* ------------------------------------------------------------------ */
const CLUSTER_DEPTH = 11;
/** Half the column's width in world units (object radius + rings), used to keep it fully on screen. */
const COLUMN_HALF_WIDTH = 1.9;

export function Showcase() {
  const rig = useRef<Group>(null);
  const cluster = useRef<Group>(null);
  const smooth = useRef({ side: 1, scroll: 0, px: 0, py: 0 });
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera) as PerspectiveCamera;

  useFrame((state, delta) => {
    const rigGroup = rig.current;
    const clusterGroup = cluster.current;
    if (!rigGroup || !clusterGroup) return;

    // Ride with the camera so the objects keep their place on screen.
    rigGroup.position.copy(camera.position);
    rigGroup.quaternion.copy(camera.quaternion);

    const aspect = size.width / size.height;
    // On portrait / narrow screens there is no free margin; the 2D page owns the space.
    const compact = aspect < 1.05;

    const halfHeight = CLUSTER_DEPTH * Math.tan(MathUtils.degToRad(camera.fov / 2));
    const halfWidth = halfHeight * aspect;
    // Hug the screen edge but never get clipped by it.
    const baseX = Math.max(halfWidth - COLUMN_HALF_WIDTH, 2.4);

    // The column switches sides as sections change so it isn't always behind the same content.
    const side = Math.cos(input.scroll * Math.PI * 2.5) >= 0 ? 1 : -1;
    smooth.current.side = MathUtils.damp(smooth.current.side, side, 2.5, delta);
    smooth.current.scroll = MathUtils.damp(smooth.current.scroll, input.scroll, 3, delta);
    smooth.current.px = MathUtils.damp(smooth.current.px, input.pointerX, 3, delta);
    smooth.current.py = MathUtils.damp(smooth.current.py, input.pointerY, 3, delta);

    clusterGroup.position.set(baseX * smooth.current.side, 0, -CLUSTER_DEPTH);
    // A gentle sway (not a full turn), so flat objects like the browser window never show their back.
    clusterGroup.rotation.y = Math.sin(smooth.current.scroll * Math.PI * 4) * 0.45 + smooth.current.px * 0.25;
    clusterGroup.rotation.x = smooth.current.py * -0.12;

    // Hero stays a clean wave: the column fades in as the visitor starts scrolling,
    // pops in with a small overshoot, and fades out before the dark CTA band.
    const intro = MathUtils.clamp((state.clock.elapsedTime - 0.5) / 1.4, 0, 1);
    const reveal = MathUtils.smoothstep(input.scroll, 0.03, 0.10);
    const outro = 1 - MathUtils.smoothstep(input.scroll, 0.82, 0.95);
    const baseScale = (compact ? 0 : 1) * easeOutBack(intro) * reveal * outro * 0.85;
    clusterGroup.scale.setScalar(Math.max(baseScale, 0.0001));
    clusterGroup.visible = baseScale > 0.001;
  });

  return (
    <group ref={rig}>
      {/* Lights live in camera space so the objects are always lit from the upper left. */}
      <ambientLight intensity={0.7} />
      <pointLight position={[-4, 5, 4]} intensity={1.8} decay={0} color="#ffffff" />
      <pointLight position={[4, -3, 3]} intensity={1.0} decay={0} color="#7ff7ff" />

      <group ref={cluster}>
        <group position={[0, 2.25, 0]}>
          <WebWindow />
        </group>
        <group position={[0, 0, 0.3]} scale={0.9}>
          <VoiceOrb />
        </group>
        <group position={[0, -2.25, 0]} scale={0.95}>
          <NodeGraph />
        </group>
      </group>
    </group>
  );
}
