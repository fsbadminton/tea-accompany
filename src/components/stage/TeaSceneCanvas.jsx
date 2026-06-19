import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function CameraRig({ perspective, sceneId }) {
  useFrame((state) => {
    const sceneTargets = {
      lakeside: {
        firstPerson: { position: [0, 1.25, 5.6], lookAt: [0, 1.2, 0] },
        sideView: { position: [5.2, 2.4, 4.2], lookAt: [0, 1, 0] },
        topView: { position: [0, 7, 0.4], lookAt: [0, 0.7, 0] },
        orbitView: { position: [-4.8, 3.2, 5.2], lookAt: [0, 1.1, 0] },
      },
      courtyard: {
        firstPerson: { position: [0, 1.35, 5], lookAt: [0, 1.05, -0.2] },
        sideView: { position: [4.4, 2.5, 4.6], lookAt: [0, 0.95, 0] },
        topView: { position: [0, 7.1, 0.8], lookAt: [0, 0.5, -0.1] },
        orbitView: { position: [-4.5, 3.1, 4.6], lookAt: [0, 1.1, -0.1] },
      },
      tearoom: {
        firstPerson: { position: [0, 1.22, 3.45], lookAt: [0, 1.24, -2.85] },
        sideView: { position: [3.85, 1.92, 1.75], lookAt: [-0.18, 1.02, -1.95] },
        topView: { position: [0, 5.75, 0.62], lookAt: [0, 0.5, -1.75] },
        orbitView: { position: [-3.85, 2.45, 2.25], lookAt: [0, 1.08, -2.1] },
      },
    };

    const presets = sceneTargets[sceneId] ?? sceneTargets.lakeside;
    const current = presets[perspective] ?? presets.firstPerson;
    const targetPosition = new THREE.Vector3(...current.position);
    const targetLookAt = new THREE.Vector3(...current.lookAt);

    state.camera.position.lerp(targetPosition, 0.05);
    state.camera.lookAt(targetLookAt);
  });

  return null;
}

function TeaTable3D({ position = [0, 0.2, 1.1], wood = "#7c5538", tray = "#b48358", activeGesture, tableStyle }) {
  const gaiwanRef = useRef(null);
  const isPouring = activeGesture === "pour";
  const pourAngle = useRef(0);

  useFrame((_, delta) => {
    if (!gaiwanRef.current) return;
    if (isPouring) {
      pourAngle.current += delta * 0.8;
      gaiwanRef.current.rotation.z = Math.sin(pourAngle.current) * 0.28;
    } else {
      gaiwanRef.current.rotation.z *= 0.94;
      if (Math.abs(gaiwanRef.current.rotation.z) < 0.005) {
        gaiwanRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.02} floatIntensity={0.06}>
      <group position={position}>
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.55, 1.7, 0.18, 32]} />
          <meshStandardMaterial color={wood} roughness={0.72} />
        </mesh>

        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 0.84, 20]} />
          <meshStandardMaterial color="#5e3d28" roughness={0.76} />
        </mesh>

        <mesh position={[0, 0.49, 0]}>
          <boxGeometry args={[1.1, 0.06, 0.7]} />
          <meshStandardMaterial color={tray} roughness={0.65} />
        </mesh>

        <group ref={gaiwanRef} position={[-0.1, 0.6, -0.02]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.2, 0.2, 24]} />
            <meshStandardMaterial color="#ece4d8" roughness={0.25} />
          </mesh>
          <SteamParticles position={[0, 0.14, 0]} count={20} spread={0.08} riseSpeed={0.08} size={0.04} opacity={0.15} />
        </group>

        <mesh position={[0.3, 0.57, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.16, 24]} />
          <meshStandardMaterial color="#efe6dc" roughness={0.18} />
        </mesh>
        <SteamParticles position={[0.3, 0.7, 0]} count={10} spread={0.04} riseSpeed={0.06} size={0.03} opacity={0.1} />

        <mesh position={[-0.45, 0.54, 0.08]}>
          <cylinderGeometry args={[0.07, 0.08, 0.09, 20]} />
          <meshStandardMaterial color="#f5ede3" roughness={0.2} />
        </mesh>
        <GestureGlowRing active={activeGesture === "serve"} position={[-0.45, 0.55, 0.08]} />

        {tableStyle === "full" && (
          <mesh position={[0.02, 0.54, 0.18]}>
            <cylinderGeometry args={[0.07, 0.08, 0.09, 20]} />
            <meshStandardMaterial color="#f5ede3" roughness={0.2} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function FirstPersonHands({ active }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const targetLift = active ? 0.02 : -0.16;
    if (leftRef.current) {
      leftRef.current.position.y = -0.08 + Math.sin(t * 1.4) * 0.03 + targetLift;
      leftRef.current.position.x = -1.85 + Math.sin(t * 0.7) * 0.02;
      leftRef.current.rotation.z = 0.1 + Math.sin(t * 0.9) * 0.03;
    }
    if (rightRef.current) {
      rightRef.current.position.y = -0.1 + Math.cos(t * 1.2) * 0.03 + targetLift;
      rightRef.current.position.x = 1.82 + Math.cos(t * 0.8) * 0.02;
      rightRef.current.rotation.z = -0.12 + Math.cos(t * 0.85) * 0.03;
    }
  });

  return (
    <group>
      <mesh ref={leftRef} position={[-1.85, -0.08, 1.65]} rotation={[0.08, 0.2, 0.1]}>
        <capsuleGeometry args={[0.22, 0.9, 6, 12]} />
        <meshStandardMaterial color="#c7a07b" roughness={0.9} />
      </mesh>
      <mesh ref={rightRef} position={[1.82, -0.1, 1.72]} rotation={[0.1, -0.18, -0.12]}>
        <capsuleGeometry args={[0.22, 0.9, 6, 12]} />
        <meshStandardMaterial color="#c7a07b" roughness={0.9} />
      </mesh>
    </group>
  );
}

function FirstPersonCup() {
  return (
    <group position={[0.05, 0.16, 1.18]}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.18, 24]} />
        <meshStandardMaterial color="#f5ede3" roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.14, 0.15, 0.03, 24]} />
        <meshStandardMaterial color="#b68a60" roughness={0.8} />
      </mesh>
      <mesh position={[0.18, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.02, 12, 18]} />
        <meshStandardMaterial color="#e9ded1" roughness={0.3} />
      </mesh>
    </group>
  );
}

function FirstPersonTeaFocus({ active, sceneId }) {
  const tableY = sceneId === "tearoom" ? -0.18 : sceneId === "courtyard" ? -0.16 : -0.14;
  return (
    <group>
      <mesh position={[0, tableY, 2.05]}>
        <boxGeometry args={[6.2, 0.14, 2.1]} />
        <meshStandardMaterial color="#6a452f" roughness={0.82} />
      </mesh>
      <mesh position={[0, tableY + 0.1, 1.45]}>
        <cylinderGeometry args={[0.18, 0.21, 0.22, 24]} />
        <meshStandardMaterial color="#ece4d8" roughness={0.2} />
      </mesh>
      <mesh position={[0.42, tableY + 0.08, 1.55]}>
        <cylinderGeometry args={[0.08, 0.09, 0.13, 20]} />
        <meshStandardMaterial color="#f2e8dc" roughness={0.2} />
      </mesh>
      <mesh position={[-0.42, tableY + 0.08, 1.55]}>
        <cylinderGeometry args={[0.08, 0.09, 0.13, 20]} />
        <meshStandardMaterial color="#f2e8dc" roughness={0.2} />
      </mesh>
      <mesh position={[0, tableY + 0.17, 1.7]} rotation={[0, 0, active ? 0.12 : 0]}>
        <torusGeometry args={[0.22, 0.02, 12, 24]} />
        <meshStandardMaterial color="#d6c6b8" roughness={0.35} />
      </mesh>
    </group>
  );
}

function PourEffect({ active, teapotPosition = [0.78, 0.16, -0.08] }) {
  const teapotRef = useRef(null);
  const pouring = useRef(false);
  const angle = useRef(0);

  useFrame((state, delta) => {
    if (!teapotRef.current) return;
    if (active) {
      pouring.current = true;
    }
    if (pouring.current) {
      angle.current += delta * 0.8;
      const tilt = Math.sin(angle.current) * 0.35;
      teapotRef.current.rotation.z = active ? tilt : tilt * Math.max(0, 1 - (angle.current % 6));
      if (!active && angle.current % (Math.PI * 2) > Math.PI * 1.8) {
        pouring.current = false;
        teapotRef.current.rotation.z = 0;
        angle.current = 0;
      }
    }
  });

  return (
    <group ref={teapotRef} position={teapotPosition}>
      <mesh castShadow>
        <sphereGeometry args={[0.22, 24, 16]} />
        <meshStandardMaterial color="#2e2620" roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.08, 24]} />
        <meshStandardMaterial color="#1f1915" roughness={0.5} />
      </mesh>
      <mesh position={[0.3, 0.02, -0.01]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.15, 0.025, 10, 24]} />
        <meshStandardMaterial color="#2b211b" roughness={0.5} />
      </mesh>
      <mesh position={[-0.28, 0.03, 0]} rotation={[0, 0.15, -0.4]}>
        <coneGeometry args={[0.08, 0.42, 18]} />
        <meshStandardMaterial color="#2b211b" roughness={0.5} />
      </mesh>
      {active && (
        <mesh position={[-0.28, -0.15, 0]} rotation={[0, 0.15, -0.4]}>
          <cylinderGeometry args={[0.012, 0.02, 0.25, 8]} />
          <meshStandardMaterial color="#d4c4a8" transparent opacity={0.5} emissive="#c8b898" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
}

function GestureGlowRing({ active, position = [0, 0, 0] }) {
  const ringRef = useRef(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    if (active) {
      ringRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.08);
    } else {
      ringRef.current.material.opacity = 0;
    }
  });

  return (
    <mesh ref={ringRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.12, 0.18, 32]} />
      <meshStandardMaterial color="#e8d5b8" transparent opacity={0} emissive="#d4b896" emissiveIntensity={0.6} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function SilhouetteGuests({ perspective, sceneId, occupancy }) {
  if (perspective === "firstPerson") return null;

  const layout = {
    lakeside: [
      [0, 0.42, -0.65],
      [-1.65, 0.42, 0.55],
      [1.65, 0.42, 0.55],
    ],
    courtyard: [
      [0, 0.42, -0.92],
      [-1.85, 0.42, 0.25],
      [1.85, 0.42, 0.25],
    ],
    tearoom: [
      [0, 0.42, -1.1],
      [-1.75, 0.42, -0.05],
      [1.75, 0.42, -0.05],
    ],
  };

  const seats = layout[sceneId] ?? layout.lakeside;
  const count = occupancy === "solo" ? 1 : occupancy === "duo" ? 2 : 3;

  return (
    <group>
      {seats.slice(0, count).map((position, index) => (
        <group key={index} position={position}>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.18, 18, 18]} />
            <meshStandardMaterial color="#182022" transparent opacity={0.72} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <capsuleGeometry args={[0.2, 0.52, 6, 12]} />
            <meshStandardMaterial color="#182022" transparent opacity={0.72} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RainParticles({ visible, area = [12, 7, 10], size = 0.05, opacity = 0.7 }) {
  const rainRef = useRef(null);
  const positions = useMemo(() => {
    const values = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * area[0];
      values[i * 3 + 1] = Math.random() * area[1];
      values[i * 3 + 2] = (Math.random() - 0.5) * area[2];
    }
    return values;
  }, [area]);

  useFrame((state) => {
    if (!rainRef.current || !visible) return;
    rainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
  });

  if (!visible) return null;

  return (
    <points ref={rainRef} position={[0, 0.2, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#dfe9f2" size={size} transparent opacity={opacity} />
    </points>
  );
}

function FloatingMotes({ color = "#ffffff", count = 160, area = [10, 4, 8], speed = 0.12, size = 0.045 }) {
  const motesRef = useRef(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * area[0];
      values[i * 3 + 1] = Math.random() * area[1];
      values[i * 3 + 2] = (Math.random() - 0.5) * area[2];
    }
    return values;
  }, [area, count]);

  useFrame((state) => {
    if (!motesRef.current) return;
    motesRef.current.rotation.y = state.clock.elapsedTime * speed;
    motesRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
  });

  return (
    <points ref={motesRef} position={[0, 1.1, -1.2]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} transparent opacity={0.32} />
    </points>
  );
}

function SteamParticles({ position = [0, 0.5, 0], count = 40, spread = 0.15, riseSpeed = 0.12, size = 0.06, opacity = 0.2, visible = true }) {
  const pointsRef = useRef(null);
  const posArray = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * spread;
      values[i * 3 + 1] = Math.random() * 0.4;
      values[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return values;
  }, [count, spread]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !visible) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < count; i += 1) {
      pos.array[i * 3 + 1] += riseSpeed * delta;
      pos.array[i * 3] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.001;
      if (pos.array[i * 3 + 1] > 0.5) {
        pos.array[i * 3] = (Math.random() - 0.5) * spread;
        pos.array[i * 3 + 1] = 0;
        pos.array[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
    }
    pos.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={posArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#f5ede3" size={size} transparent opacity={opacity} depthWrite={false} />
    </points>
  );
}

function AnimatedWater({ color, position = [0, -0.36, -4.5], size = [24, 14], amplitude = 0.03, speed = 0.55 }) {
  const waterRef = useRef(null);

  useFrame((state) => {
    if (!waterRef.current) return;
    waterRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.015;
    waterRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * amplitude;
  });

  return (
    <mesh ref={waterRef} rotation-x={-Math.PI / 2} position={position}>
      <planeGeometry args={[...size, 32, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.82} roughness={0.18} metalness={0.08} />
    </mesh>
  );
}

function WindowRainSheet({ visible }) {
  const sheetRef = useRef(null);

  useFrame((state) => {
    if (!sheetRef.current || !visible) return;
    sheetRef.current.material.opacity = 0.07 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
  });

  if (!visible) return null;

  return (
    <mesh ref={sheetRef} position={[0, 1.78, -2.25]}>
      <planeGeometry args={[4.7, 2.3]} />
      <meshStandardMaterial color="#d7dde2" transparent opacity={0.08} />
    </mesh>
  );
}

function Mountain({ position, scale, color }) {
  return (
    <mesh position={position} scale={scale}>
      <coneGeometry args={[1.5, 2.4, 5]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

function Pavilion() {
  return (
    <group position={[0, -0.05, 0.4]}>
      <mesh position={[0, 1.9, -1.25]}>
        <boxGeometry args={[4.8, 0.18, 3.2]} />
        <meshStandardMaterial color="#4e3524" />
      </mesh>
      <mesh position={[0, 2.3, -1.25]} rotation={[0, 0, 0.04]}>
        <boxGeometry args={[5.3, 0.14, 3.7]} />
        <meshStandardMaterial color="#6b4730" />
      </mesh>
      {[
        [-2.1, 0.82, 0.2],
        [2.1, 0.82, 0.2],
        [-2.1, 0.82, -2.6],
        [2.1, 0.82, -2.6],
      ].map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.16, 1.65, 0.16]} />
          <meshStandardMaterial color="#65442e" />
        </mesh>
      ))}
      <mesh position={[0, 0.25, -1.15]}>
        <boxGeometry args={[5.2, 0.12, 4.2]} />
        <meshStandardMaterial color="#7a573c" />
      </mesh>
      <mesh position={[0, 0.55, 0.65]}>
        <boxGeometry args={[5.2, 0.12, 0.12]} />
        <meshStandardMaterial color="#6f4d35" />
      </mesh>
    </group>
  );
}

function CourtyardShelter() {
  return (
    <group position={[0, 0, -0.35]}>
      <mesh position={[0, 1.85, -1.35]}>
        <boxGeometry args={[5, 0.18, 3.4]} />
        <meshStandardMaterial color="#4c392b" />
      </mesh>
      <mesh position={[0, 2.2, -1.35]} rotation={[0, 0, 0.03]}>
        <boxGeometry args={[5.5, 0.16, 3.9]} />
        <meshStandardMaterial color="#6a503d" />
      </mesh>
      {[
        [-2.15, 0.82, 0.1],
        [2.15, 0.82, 0.1],
        [-2.15, 0.82, -2.8],
        [2.15, 0.82, -2.8],
      ].map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.18, 1.68, 0.18]} />
          <meshStandardMaterial color="#604735" />
        </mesh>
      ))}
      <mesh position={[0, 0.2, -1.25]}>
        <boxGeometry args={[5.4, 0.1, 4.5]} />
        <meshStandardMaterial color="#7b6350" />
      </mesh>
    </group>
  );
}

function StonePath() {
  const stones = [
    [-2.8, -0.31, 2.8],
    [-1.6, -0.3, 2.2],
    [-0.4, -0.3, 2.8],
    [1.1, -0.3, 2.15],
    [2.6, -0.31, 2.75],
  ];

  return (
    <group>
      {stones.map((position, index) => (
        <mesh key={index} position={position} rotation={[-Math.PI / 2, 0, index * 0.2]}>
          <cylinderGeometry args={[0.55, 0.65, 0.08, 18]} />
          <meshStandardMaterial color="#67726b" roughness={0.98} />
        </mesh>
      ))}
    </group>
  );
}

function BambooCluster({ x = -4.2, z = -2 }) {
  const clusterRef = useRef(null);

  useFrame((state) => {
    if (!clusterRef.current) return;
    clusterRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    clusterRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.42) * 0.015;
  });

  return (
    <group ref={clusterRef} position={[x, 0, z]}>
      {[
        [0, 1.2, 0],
        [0.35, 1.45, 0.4],
        [-0.3, 1.3, -0.25],
      ].map((position, index) => (
        <group key={index} position={position}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.06, 2.7, 10]} />
            <meshStandardMaterial color="#6d8268" roughness={0.85} />
          </mesh>
          <mesh position={[0.2, 0.85, 0.02]} rotation={[0.1, 0, -0.45]}>
            <coneGeometry args={[0.42, 1.1, 6]} />
            <meshStandardMaterial color="#83967b" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TearoomShell() {
  const wall = "#5b3f2b";

  return (
    <group>
      {[
        { position: [0, 3.76, -3.05], size: [8.4, 0.5, 0.24] },
        { position: [0, 0.18, -3.05], size: [8.4, 0.72, 0.24] },
        { position: [-3.76, 1.96, -3.05], size: [0.88, 3.28, 0.24] },
        { position: [3.76, 1.96, -3.05], size: [0.88, 3.28, 0.24] },
      ].map((part, index) => (
        <mesh key={index} position={part.position} receiveShadow>
          <boxGeometry args={part.size} />
          <meshStandardMaterial color={wall} roughness={0.86} />
        </mesh>
      ))}
      <mesh position={[0, 1.86, -2.92]}>
        <planeGeometry args={[5.65, 2.72]} />
        <meshStandardMaterial color="#95aaa7" emissive="#91aaa6" emissiveIntensity={0.1} transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, -0.36, -0.6]} receiveShadow>
        <boxGeometry args={[8.4, 0.12, 5.6]} />
        <meshStandardMaterial color="#7b5435" roughness={0.92} />
      </mesh>
      <mesh position={[0, 4, -0.6]} receiveShadow>
        <boxGeometry args={[8.6, 0.18, 5.8]} />
        <meshStandardMaterial color="#3e2a1d" roughness={0.82} />
      </mesh>
      <mesh position={[-4.2, 1.78, -0.55]} receiveShadow>
        <boxGeometry args={[0.18, 4.1, 5.5]} />
        <meshStandardMaterial color="#4f3727" roughness={0.84} />
      </mesh>
      <mesh position={[4.2, 1.78, -0.55]} receiveShadow>
        <boxGeometry args={[0.18, 4.1, 5.5]} />
        <meshStandardMaterial color="#4f3727" roughness={0.84} />
      </mesh>
      <WindowFrame3D />
    </group>
  );
}

function WindowFrame3D() {
  const wood = "#2b1a11";
  const frameParts = [
    { position: [0, 3.36, -2.72], size: [6.05, 0.32, 0.38] },
    { position: [0, 0.36, -2.72], size: [6.05, 0.36, 0.42] },
    { position: [-3.12, 1.86, -2.72], size: [0.34, 3.26, 0.4] },
    { position: [3.12, 1.86, -2.72], size: [0.34, 3.26, 0.4] },
  ];

  return (
    <group>
      {frameParts.map((part, index) => (
        <mesh key={index} position={part.position} castShadow receiveShadow>
          <boxGeometry args={part.size} />
          <meshStandardMaterial color={wood} roughness={0.74} />
        </mesh>
      ))}
      <OpenWindowLeaf side="left" />
      <OpenWindowLeaf side="right" />
      <mesh position={[0, 0.18, -2.2]} castShadow receiveShadow>
        <boxGeometry args={[6.6, 0.25, 1.08]} />
        <meshStandardMaterial color="#3f281a" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.38, -2.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.65, 0.9]} />
        <meshStandardMaterial color="#704a2f" roughness={0.9} />
      </mesh>
    </group>
  );
}

function OpenWindowLeaf({ side }) {
  const sign = side === "left" ? -1 : 1;
  const leafWidth = 1.86;
  const leafHeight = 2.48;
  const hingeX = sign * 2.95;
  const angle = sign * -0.72;
  const rail = "#2b1a11";

  return (
    <group position={[hingeX, 1.88, -2.86]} rotation={[0, angle, 0]}>
      {[
        [sign * leafWidth * 0.5, leafHeight * 0.5, 0.04, leafWidth, 0.08, 0.1],
        [sign * leafWidth * 0.5, -leafHeight * 0.5, 0.04, leafWidth, 0.08, 0.1],
        [sign * 0.08, 0, 0.04, 0.1, leafHeight, 0.1],
        [sign * (leafWidth - 0.08), 0, 0.04, 0.1, leafHeight, 0.1],
      ].map(([x, y, z, width, height, depth], index) => (
        <mesh key={index} position={[x, y, z]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={rail} roughness={0.74} />
        </mesh>
      ))}
      <mesh position={[sign * leafWidth * 0.5, 0, 0.055]}>
        <planeGeometry args={[leafWidth - 0.34, leafHeight - 0.38]} />
        <meshPhysicalMaterial color="#a9beb9" roughness={0.08} transmission={0.36} transparent opacity={0.14} />
      </mesh>
      <mesh position={[sign * leafWidth * 0.5, 0, 0.11]}>
        <boxGeometry args={[0.08, leafHeight - 0.3, 0.08]} />
        <meshStandardMaterial color={rail} roughness={0.74} />
      </mesh>
      <mesh position={[sign * leafWidth * 0.5, 0.48, 0.115]}>
        <boxGeometry args={[leafWidth - 0.28, 0.08, 0.08]} />
        <meshStandardMaterial color={rail} roughness={0.74} />
      </mesh>
      <mesh position={[sign * 0.18, 0, 0.13]}>
        <boxGeometry args={[0.07, leafHeight + 0.08, 0.12]} />
        <meshStandardMaterial color="#3d291c" roughness={0.78} />
      </mesh>
    </group>
  );
}

function SkyGradient({ timeSlot, weather }) {
  const palettes = {
    dawn:  { top: "#7a9aaa", mid: "#c4bfb0", low: "#e8cdb0" },
    day:   { top: "#6a98b0", mid: "#a8c4cc", low: "#d4dde0" },
    dusk:  { top: "#5a6a78", mid: "#8a8890", low: "#c4a888" },
    night: { top: "#1a2830", mid: "#283840", low: "#3a4a50" },
  };
  const p = palettes[timeSlot] || palettes.day;
  const rainDarken = weather === "rain" ? 0.85 : weather === "overcast" ? 0.92 : 1;

  return (
    <group>
      <mesh position={[0, 3.2, -5]}>
        <planeGeometry args={[16, 2.5]} />
        <meshBasicMaterial color={p.top} transparent opacity={rainDarken} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.8, -5]}>
        <planeGeometry args={[16, 2.5]} />
        <meshBasicMaterial color={p.mid} transparent opacity={rainDarken} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.6, -5]}>
        <planeGeometry args={[16, 2.2]} />
        <meshBasicMaterial color={p.low} transparent opacity={rainDarken} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function SunMoon({ timeSlot }) {
  const ref = useRef(null);
  const config = {
    dawn:  { pos: [-3, 1.2, -5.5], color: "#f0c87a", emissive: "#e8a040", size: 0.35, intensity: 0.4 },
    day:   { pos: [1, 2.8, -6], color: "#f5f0e0", emissive: "#e8dcc0", size: 0.4, intensity: 0.5 },
    dusk:  { pos: [3.5, 1.0, -5.5], color: "#e89060", emissive: "#d06830", size: 0.35, intensity: 0.35 },
    night: { pos: [2, 2.5, -6], color: "#c0d0e0", emissive: "#8098b0", size: 0.25, intensity: 0.15 },
  };
  const c = config[timeSlot] || config.day;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = c.pos[1] + Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
  });

  return (
    <mesh ref={ref} position={c.pos}>
      <sphereGeometry args={[c.size, 24, 24]} />
      <meshStandardMaterial color={c.color} emissive={c.emissive} emissiveIntensity={c.intensity} transparent opacity={0.9} />
    </mesh>
  );
}

function LayeredMountains({ timeSlot, weather }) {
  const far = weather === "rain" ? "#7a8a82" : "#96aea4";
  const mid = weather === "rain" ? "#5a7068" : "#728a7e";
  const near = weather === "rain" ? "#3e5550" : "#4e6a60";

  return (
    <group>
      {[
        { x: -3.5, y: 1.3, z: -6.5, sx: 2.5, sy: 3.2, sz: 2.2, color: far, opacity: 0.55 },
        { x: 1.5, y: 1.5, z: -7, sx: 3.2, sy: 3.8, sz: 2.8, color: far, opacity: 0.5 },
        { x: 5, y: 1.2, z: -6.2, sx: 2.2, sy: 2.8, sz: 2, color: far, opacity: 0.55 },
        { x: -2, y: 1.0, z: -5, sx: 2.8, sy: 2.6, sz: 2.4, color: mid, opacity: 0.7 },
        { x: 3, y: 0.9, z: -4.8, sx: 2.4, sy: 2.2, sz: 2, color: mid, opacity: 0.72 },
        { x: -4.5, y: 0.6, z: -3.8, sx: 2, sy: 1.6, sz: 1.8, color: near, opacity: 0.85 },
        { x: 0, y: 0.5, z: -3.5, sx: 2.2, sy: 1.4, sz: 2, color: near, opacity: 0.88 },
        { x: 4.5, y: 0.55, z: -3.6, sx: 1.8, sy: 1.3, sz: 1.6, color: near, opacity: 0.85 },
      ].map((m, i) => (
        <mesh key={i} position={[m.x, m.y, m.z]} scale={[m.sx, m.sy, m.sz]}>
          <coneGeometry args={[0.8, 1, 6]} />
          <meshStandardMaterial color={m.color} transparent opacity={m.opacity} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function AnimatedTrees({ x, z = -1.5, mirrored = false }) {
  const ref = useRef(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + x) * 0.04;
  });

  return (
    <group ref={ref} position={[x, 0, z]} scale={[mirrored ? -1 : 1, 1, 1]}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 2.4, 8]} />
        <meshStandardMaterial color="#3a2a1e" roughness={0.9} />
      </mesh>
      {[0, 0.45, 0.85].map((y, i) => (
        <mesh key={i} position={[0, 1.8 + y, 0]}>
          <sphereGeometry args={[0.55 - i * 0.1, 12, 10]} />
          <meshStandardMaterial color={i === 0 ? "#3a5840" : "#4a6a4e"} transparent opacity={0.88 - i * 0.06} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function DriftingMist({ weather }) {
  const ref = useRef(null);
  const density = weather === "rain" ? 1.8 : weather === "overcast" ? 1.3 : 1;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.x = Math.sin(t * 0.1) * 1.2;
    ref.current.children.forEach((child, i) => {
      if (child.material) {
        child.material.opacity = (0.22 - i * 0.04) * density * (0.85 + Math.sin(t * 0.35 + i * 2) * 0.15);
      }
    });
  });

  return (
    <group ref={ref} position={[0, 0.8, -3]}>
      {[0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[i * 0.5, y, -i * 0.6]}>
          <planeGeometry args={[8 - i, 0.35]} />
          <meshBasicMaterial color="#dce8e0" transparent opacity={0.22 - i * 0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function WaveRipples({ weather }) {
  const refs = useRef([]);
  const speed = weather === "rain" ? 2 : 1;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = 1 + Math.sin(t * speed * 0.7 + i * 1.3) * 0.12;
      mesh.scale.set(pulse, pulse, 1);
      mesh.material.opacity = 0.55 * (0.8 + Math.sin(t * speed * 0.4 + i) * 0.2);
    });
  });

  return (
    <group position={[0, 0.12, -1.5]}>
      {[-1.8, -0.7, 0.3, 1.2, 2.1].map((x, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={[x, 0.02, -i * 0.3]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.3 + i * 0.04, 0.35 + i * 0.04, 48]} />
          <meshBasicMaterial color="#c0dcd8" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function FlyingBirds({ weather }) {
  const ref = useRef(null);
  const birds = [
    { x: -1.2, y: 2.0, z: -3, speed: 0.18, phase: 0, wingSpeed: 3 },
    { x: 0.5, y: 2.3, z: -2.8, speed: 0.14, phase: 1.5, wingSpeed: 2.5 },
    { x: 2.0, y: 1.8, z: -3.2, speed: 0.2, phase: 3, wingSpeed: 3.5 },
  ];

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((bird, i) => {
      const b = birds[i];
      bird.position.x = b.x + Math.sin(t * b.speed + b.phase) * 3;
      bird.position.y = b.y + Math.sin(t * b.speed * 0.6 + b.phase) * 0.25;
      bird.children.forEach((wing) => {
        wing.rotation.z = Math.sin(t * b.wingSpeed + b.phase) * 0.4;
      });
    });
  });

  if (weather === "rain") return null;

  return (
    <group ref={ref}>
      {birds.map((b, i) => (
        <group key={i} position={[b.x, b.y, b.z]}>
          <mesh position={[-0.12, 0, 0]}>
            <planeGeometry args={[0.25, 0.05]} />
            <meshBasicMaterial color="#1a2828" transparent opacity={0.55} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <planeGeometry args={[0.25, 0.05]} />
            <meshBasicMaterial color="#1a2828" transparent opacity={0.55} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ShorelineReeds({ weather }) {
  const groupRef = useRef(null);
  const reeds = [-3.2, -2.8, -2.5, 2.3, 2.6, 2.9, 3.2];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(t * 0.7 + i * 0.8) * 0.12;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.35, -2]}>
      {reeds.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.035, 1.1, 6]} />
            <meshStandardMaterial color="#2a4035" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
            <meshStandardMaterial color="#8a7a50" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WindowLandscape({ weather, timeSlot }) {
  return (
    <group position={[0, 0, -4.95]}>
      <SkyGradient timeSlot={timeSlot} weather={weather} />
      <SunMoon timeSlot={timeSlot} />
      <AnimatedWater color={weather === "rain" ? "#4a7070" : "#6a9aa5"} position={[0, 0.08, -0.12]} size={[15, 8]} amplitude={0.06} speed={0.55} />
      <ExteriorWrap color={weather === "rain" ? "#2a3a40" : "#5a7a78"} />
      <mesh position={[0, 0.34, -0.98]}>
        <boxGeometry args={[9.6, 0.16, 0.42]} />
        <meshStandardMaterial color="#344b41" roughness={0.96} />
      </mesh>
      <ShorelineReeds weather={weather} />
      <LayeredMountains timeSlot={timeSlot} weather={weather} />
      <group position={[-1.35, 0.3, -2.2]} scale={[0.42, 0.42, 0.42]}>
        <Pavilion />
      </group>
      <AnimatedTrees x={-4} z={-1.8} />
      <AnimatedTrees x={4.2} z={-1.6} mirrored />
      <WaveRipples weather={weather} />
      <DriftingMist weather={weather} />
      <FlyingBirds weather={weather} />
    </group>
  );
}

function ExteriorWrap({ color }) {
  return (
    <group>
      <SideSceneryPanel side="left" color={color} />
      <SideSceneryPanel side="right" color={color} />
      <mesh position={[0, 3.82, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14.4, 7.2]} />
        <meshBasicMaterial color="#728785" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function SideSceneryPanel({ side, color }) {
  const sign = side === "left" ? -1 : 1;
  const rotationY = sign < 0 ? Math.PI / 2 : -Math.PI / 2;
  const x = sign * 7.2;

  return (
    <group position={[x, 0, -0.8]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 2.35, 0]}>
        <planeGeometry args={[7.2, 2.7]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <planeGeometry args={[7.2, 1.25]} />
        <meshBasicMaterial color="#597b7c" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-1.9, 1.48, 0.02]}>
        <coneGeometry args={[1.08, 2.35, 5]} />
        <meshBasicMaterial color="#496159" transparent opacity={0.72} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.35, 1.32, 0.02]}>
        <coneGeometry args={[0.86, 1.92, 5]} />
        <meshBasicMaterial color="#3e554d" transparent opacity={0.78} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.78, 0.04]}>
        <boxGeometry args={[6.6, 0.13, 0.08]} />
        <meshBasicMaterial color="#789084" />
      </mesh>
      <mesh position={[0.08, 1.08, 0.05]}>
        <planeGeometry args={[6.4, 0.28]} />
        <meshBasicMaterial color="#d6e2dc" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function RectTeaTable3D({ activeGesture, tableStyle }) {
  return (
    <Float speed={0.7} rotationIntensity={0.008} floatIntensity={0.025}>
      <group position={[0, -0.23, 0.12]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.55, 0.2, 1.72]} />
          <meshStandardMaterial color="#6a4229" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.49, -0.18]} castShadow receiveShadow>
          <boxGeometry args={[2.46, 0.1, 0.96]} />
          <meshStandardMaterial color="#a06f45" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.57, -0.18]}>
          <boxGeometry args={[2.16, 0.035, 0.72]} />
          <meshStandardMaterial color="#342219" roughness={0.78} />
        </mesh>
        {[[-1.92, -0.08, -0.58], [1.92, -0.08, -0.58], [-1.92, -0.08, 0.58], [1.92, -0.08, 0.58]].map((position, index) => (
          <mesh key={index} position={position} castShadow>
            <boxGeometry args={[0.18, 0.76, 0.18]} />
            <meshStandardMaterial color="#432918" roughness={0.84} />
          </mesh>
        ))}
        <TeaSetOnTray activeGesture={activeGesture} tableStyle={tableStyle} />
      </group>
    </Float>
  );
}

function TeaSetOnTray({ activeGesture, tableStyle }) {
  const isPouring = activeGesture === "pour";
  const teapotGroupRef = useRef(null);
  const pourAngle = useRef(0);

  useFrame((_, delta) => {
    if (!teapotGroupRef.current) return;
    if (isPouring) {
      pourAngle.current += delta * 0.8;
      teapotGroupRef.current.rotation.z = Math.sin(pourAngle.current) * 0.32;
    } else {
      teapotGroupRef.current.rotation.z *= 0.94;
      if (Math.abs(teapotGroupRef.current.rotation.z) < 0.005) {
        teapotGroupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group position={[0, 0.58, -0.08]}>
      <group ref={teapotGroupRef} position={[0.78, 0.16, -0.08]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 24, 16]} />
          <meshStandardMaterial color="#2e2620" roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.08, 24]} />
          <meshStandardMaterial color="#1f1915" roughness={0.5} />
        </mesh>
        <mesh position={[0.3, 0.02, -0.01]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.15, 0.025, 10, 24]} />
          <meshStandardMaterial color="#2b211b" roughness={0.5} />
        </mesh>
        <mesh position={[-0.28, 0.03, 0]} rotation={[0, 0.15, -0.4]}>
          <coneGeometry args={[0.08, 0.42, 18]} />
          <meshStandardMaterial color="#2b211b" roughness={0.5} />
        </mesh>
        <SteamParticles position={[0, 0.28, 0]} count={30} spread={0.1} riseSpeed={0.1} size={0.05} opacity={0.18} />
      </group>

      <group position={[-0.05, 0.14, -0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.36, 24]} />
          <meshPhysicalMaterial color="#d8cbbb" roughness={0.12} transmission={0.15} transparent opacity={0.58} />
        </mesh>
        <mesh position={[0.21, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.12, 0.018, 10, 22]} />
          <meshStandardMaterial color="#cbb9a5" roughness={0.28} />
        </mesh>
        <SteamParticles position={[0, 0.22, 0]} count={20} spread={0.08} riseSpeed={0.08} size={0.04} opacity={0.14} />
      </group>

      {[[-0.72, 0.07, 0.2], [-0.34, 0.07, 0.28], [0.27, 0.07, 0.27], [0.55, 0.07, 0.22]].slice(0, tableStyle === "full" ? 4 : 2).map((position, index) => (
        <group key={index} position={position}>
          <mesh castShadow>
            <cylinderGeometry args={[0.105, 0.13, 0.14, 24]} />
            <meshStandardMaterial color="#eee4d8" roughness={0.24} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.088, 0.094, 0.015, 24]} />
            <meshStandardMaterial color="#9f6f3e" emissive="#6e3f1f" emissiveIntensity={0.05} roughness={0.4} />
          </mesh>
          <SteamParticles position={[0, 0.1, 0]} count={12} spread={0.05} riseSpeed={0.06} size={0.03} opacity={0.1} />
          <GestureGlowRing active={activeGesture === "serve" && index === 0} position={[0, 0.02, 0]} />
        </group>
      ))}
    </group>
  );
}

function SharedLighting({ mood, intensity = 1.5, spotColor = "#f9ead8", fogRange = [7, 20] }) {
  return (
    <>
      <fog attach="fog" args={[mood.mist, fogRange[0], fogRange[1]]} />
      <color attach="background" args={[mood.sky]} />
      <ambientLight intensity={0.92} color={mood.glow} />
      <directionalLight
        castShadow
        position={[4, 6, 3]}
        intensity={intensity}
        color={mood.glow}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight position={[-3, 4, 4]} intensity={1.1} angle={0.45} penumbra={0.7} color={spotColor} />
    </>
  );
}

function LakesideScene({ mood, weather, perspective, activeGesture, tableStyle, occupancy }) {
  return (
    <>
      <SharedLighting mood={mood} intensity={1.6} />
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.42, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#6a7b72" roughness={0.9} />
      </mesh>
      <AnimatedWater color={weather === "rain" ? "#6e8d97" : "#86a9b7"} />
      <Mountain position={[-5.4, 1.1, -7.8]} scale={[2.3, 2.5, 2.3]} color="#6e827f" />
      <Mountain position={[0.8, 1.35, -8.2]} scale={[2.8, 3.2, 2.7]} color="#778d8c" />
      <Mountain position={[5.7, 1, -7.5]} scale={[2.2, 2.4, 2.2]} color="#69807d" />
      <Pavilion />
      <TeaTable3D activeGesture={activeGesture} tableStyle={tableStyle} />
      <SilhouetteGuests perspective={perspective} sceneId="lakeside" occupancy={occupancy} />
      {perspective === "firstPerson" && (
        <>
          <FirstPersonTeaFocus active sceneId="lakeside" />
          <FirstPersonHands active />
          <FirstPersonCup />
        </>
      )}
      <RainParticles visible={weather === "rain"} />
      <FloatingMotes color="#f9f4ea" count={140} area={[11, 3.4, 10]} speed={0.08} size={0.05} />
      <Environment preset="sunset" />
    </>
  );
}

function CourtyardScene({ mood, weather, perspective, activeGesture, tableStyle, occupancy }) {
  return (
    <>
      <SharedLighting mood={mood} intensity={1.25} spotColor="#e7dccf" />
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.36, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#556058" roughness={1} />
      </mesh>
      <CourtyardShelter />
      <StonePath />
      <BambooCluster x={-4.1} z={-1.7} />
      <BambooCluster x={4.2} z={-2.2} />
      <Mountain position={[-6.2, 1.4, -7.5]} scale={[2.8, 3.4, 2.8]} color="#58685e" />
      <Mountain position={[0.2, 1.8, -8.4]} scale={[3.4, 4.2, 3.4]} color="#65766b" />
      <Mountain position={[6.1, 1.2, -7.1]} scale={[2.4, 3, 2.4]} color="#536157" />
      <TeaTable3D position={[0, 0.18, 0.6]} wood="#70513b" tray="#ae845d" activeGesture={activeGesture} tableStyle={tableStyle} />
      <SilhouetteGuests perspective={perspective} sceneId="courtyard" occupancy={occupancy} />
      {perspective === "firstPerson" && (
        <>
          <FirstPersonTeaFocus active sceneId="courtyard" />
          <FirstPersonHands active />
          <FirstPersonCup />
        </>
      )}
      <RainParticles visible={weather === "rain"} area={[11, 7.5, 11]} />
      <FloatingMotes color="#dfe8dd" count={120} area={[9, 4, 9]} speed={0.11} size={0.04} />
      <Environment preset="city" />
    </>
  );
}

function TearoomScene({ mood, weather, perspective, activeGesture, tableStyle, occupancy, timeSlot }) {
  return (
    <>
      <SharedLighting mood={mood} intensity={1.18} spotColor="#efd2ad" fogRange={[10, 24]} />
      <TearoomShell />
      <WindowLandscape weather={weather} timeSlot={timeSlot} />
      <WindowRainSheet visible={weather === "rain"} />
      <RectTeaTable3D activeGesture={activeGesture} tableStyle={tableStyle} />
      <SilhouetteGuests perspective={perspective} sceneId="tearoom" occupancy={occupancy} />
      {perspective === "firstPerson" && <FirstPersonHands active />}
      <RainParticles visible={weather === "rain"} area={[6.5, 4.6, 3.2]} size={0.026} opacity={0.34} />
      <FloatingMotes color="#f4e2cb" count={180} area={[7.2, 3.2, 4.5]} speed={0.1} size={0.038} />
      <Environment preset="warehouse" />
    </>
  );
}

function SceneContent({ sceneId, mood, weather, perspective, activeGesture, tableStyle, occupancy, timeSlot }) {
  const sceneProps = { mood, weather, perspective, activeGesture, tableStyle, occupancy, timeSlot };

  if (sceneId === "courtyard") {
    return <CourtyardScene {...sceneProps} />;
  }

  if (sceneId === "tearoom") {
    return <TearoomScene {...sceneProps} />;
  }

  return <LakesideScene {...sceneProps} />;
}

export function TeaSceneCanvas({ scene, weather, perspective, mood, activeGesture, tableStyle, occupancy, timeSlot }) {
  return (
    <div className="tea-scene-canvas">
      <Canvas shadows camera={{ position: [0, 1.25, 5.6], fov: 42 }}>
        <CameraRig perspective={perspective} sceneId={scene.id} />
        <SceneContent
          sceneId={scene.id}
          weather={weather}
          perspective={perspective}
          mood={mood}
          activeGesture={activeGesture}
          tableStyle={tableStyle}
          occupancy={occupancy}
          timeSlot={timeSlot}
        />
        {perspective !== "orbitView" ? null : (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3.4}
          />
        )}
      </Canvas>
    </div>
  );
}
