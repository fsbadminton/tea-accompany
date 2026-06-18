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

function AnimatedWater({ color }) {
  const waterRef = useRef(null);

  useFrame((state) => {
    if (!waterRef.current) return;
    waterRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.015;
    waterRef.current.position.y = -0.36 + Math.sin(state.clock.elapsedTime * 0.55) * 0.03;
  });

  return (
    <mesh ref={waterRef} rotation-x={-Math.PI / 2} position={[0, -0.36, -4.5]}>
      <planeGeometry args={[24, 14, 32, 32]} />
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

function WindowLandscape({ weather }) {
  const water = weather === "rain" ? "#58777a" : "#7da2a8";
  const mountain = weather === "rain" ? "#536a62" : "#71877c";

  return (
    <group position={[0, 0, -4.95]}>
      <mesh position={[0, 1.95, -4.2]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color={weather === "rain" ? "#617174" : "#9eb8bd"} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.08, -0.12]}>
        <planeGeometry args={[15, 8]} />
        <meshStandardMaterial color={water} transparent opacity={0.94} roughness={0.28} metalness={0.06} side={THREE.DoubleSide} />
      </mesh>
      <ExteriorWrap color={weather === "rain" ? "#31434a" : "#678188"} />
      <mesh position={[0, 0.34, -0.98]}>
        <boxGeometry args={[9.6, 0.16, 0.42]} />
        <meshStandardMaterial color="#344b41" roughness={0.96} />
      </mesh>
      <ShorelineStones />
      <Mountain position={[-4.8, 1.42, -3.95]} scale={[1.9, 2.42, 1.8]} color={mountain} />
      <Mountain position={[-1.1, 1.82, -4.65]} scale={[2.45, 3.08, 2.25]} color="#697e73" />
      <Mountain position={[2.85, 1.6, -4.18]} scale={[2.1, 2.72, 2]} color="#50695f" />
      <Mountain position={[5.35, 1.3, -3.72]} scale={[1.56, 2.08, 1.5]} color="#435b52" />
      <group position={[-1.35, 0.43, -1.72]} scale={[0.48, 0.48, 0.48]}>
        <Pavilion />
      </group>
      <LakeIslands />
      <WindowTree x={-4.15} z={-0.72} />
      <WindowTree x={3.9} z={-0.64} mirrored />
      <DistantReeds />
      <WaterRipples color={weather === "rain" ? "#c9dddd" : "#e0ede9"} />
      <MistBands />
    </group>
  );
}

function WindowTree({ x, z = -0.85, mirrored = false }) {
  return (
    <group position={[x, 0.25, z]} scale={[mirrored ? -1 : 1, 1, 1]}>
      <mesh position={[0, 0.85, 0]} rotation={[0.08, 0, -0.22]}>
        <cylinderGeometry args={[0.035, 0.055, 1.75, 8]} />
        <meshStandardMaterial color="#283529" roughness={0.9} />
      </mesh>
      {[-0.2, 0.2, 0.58].map((y, index) => (
        <mesh key={index} position={[0.18 + index * 0.12, 1.2 + y, 0]} rotation={[0.1, 0, -0.72 + index * 0.12]}>
          <coneGeometry args={[0.18, 1.05, 6]} />
          <meshStandardMaterial color="#435846" roughness={0.96} transparent opacity={0.74} />
        </mesh>
      ))}
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

function DistantReeds() {
  const reeds = [-3.42, -3.12, -2.82, -2.52, 2.2, 2.52, 2.86, 3.18, 3.48];

  return (
    <group position={[0, 0.5, -0.74]}>
      {reeds.map((x, index) => (
        <group key={index} position={[x, 0.28 + (index % 2) * 0.1, 0]} rotation={[0, 0, -0.22 + index * 0.065]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.03, 0.9, 6]} />
            <meshStandardMaterial color="#1f352b" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <capsuleGeometry args={[0.045, 0.16, 4, 8]} />
            <meshStandardMaterial color="#796f4e" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ShorelineStones() {
  const stones = [
    [-4.05, 0.62, -0.46, 0.42],
    [-3.48, 0.6, -0.5, 0.34],
    [-2.9, 0.61, -0.48, 0.3],
    [-0.92, 0.61, -0.52, 0.38],
    [-0.38, 0.6, -0.46, 0.3],
    [0.2, 0.62, -0.52, 0.35],
    [2.66, 0.6, -0.48, 0.36],
    [3.2, 0.62, -0.52, 0.32],
    [3.72, 0.61, -0.47, 0.38],
  ];

  return (
    <group>
      <mesh position={[0, 0.5, -0.55]}>
        <boxGeometry args={[8.4, 0.14, 0.18]} />
        <meshBasicMaterial color="#7c9082" />
      </mesh>
      {stones.map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[-Math.PI / 2, 0, index * 0.36]} scale={[1.25, 0.58, 1]}>
          <cylinderGeometry args={[radius, radius * 1.12, 0.12, 18]} />
          <meshBasicMaterial color={index % 2 ? "#8da092" : "#6f8678"} />
        </mesh>
      ))}
    </group>
  );
}

function LakeIslands() {
  return (
    <group position={[0, 0.42, -1.02]}>
      {[
        [-3.12, 0.08, -0.05, 0.78, 0.16, 0.34],
        [-0.1, 0.08, -0.34, 1.08, 0.16, 0.36],
        [2.18, 0.08, 0.02, 0.9, 0.16, 0.34],
      ].map(([x, y, z, width, height, depth], index) => (
        <group key={index} position={[x, y, z]}>
          <mesh>
            <cylinderGeometry args={[width * 0.42, width * 0.52, height, 20]} />
            <meshStandardMaterial color={index === 1 ? "#40594e" : "#304b40"} roughness={0.98} />
          </mesh>
          {[...Array(4)].map((_, tuftIndex) => (
            <mesh
              key={tuftIndex}
              position={[-width * 0.22 + tuftIndex * width * 0.15, 0.16, -depth * 0.1 + (tuftIndex % 2) * depth * 0.18]}
              rotation={[0.08, 0, -0.32 + tuftIndex * 0.18]}
            >
              <coneGeometry args={[0.055, 0.36, 6]} />
              <meshStandardMaterial color="#263c31" roughness={0.96} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function MistBands() {
  return (
    <group position={[0, 0, -1.52]}>
      {[0.78, 1.08, 1.42].map((y, index) => (
        <mesh key={index} position={[0.05 - index * 0.18, y, -0.25 - index * 0.42]}>
          <planeGeometry args={[7.6 - index * 0.5, 0.3]} />
          <meshBasicMaterial color="#e2ece6" transparent opacity={0.28 - index * 0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function WaterRipples({ color }) {
  return (
    <group position={[0, 0.2, -0.22]}>
      {[-2.5, -1.3, -0.2, 1.05, 2.35].map((x, index) => (
        <mesh key={index} position={[x, 0.035, -0.16 - index * 0.22]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.55, 0.42, 1]}>
          <ringGeometry args={[0.36 + index * 0.05, 0.4 + index * 0.05, 56]} />
          <meshBasicMaterial color={color} transparent opacity={0.68} />
        </mesh>
      ))}
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

function TearoomScene({ mood, weather, perspective, activeGesture, tableStyle, occupancy }) {
  return (
    <>
      <SharedLighting mood={mood} intensity={1.18} spotColor="#efd2ad" fogRange={[10, 24]} />
      <TearoomShell />
      <WindowLandscape weather={weather} />
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

function SceneContent({ sceneId, mood, weather, perspective, activeGesture, tableStyle, occupancy }) {
  const sceneProps = { mood, weather, perspective, activeGesture, tableStyle, occupancy };

  if (sceneId === "courtyard") {
    return <CourtyardScene {...sceneProps} />;
  }

  if (sceneId === "tearoom") {
    return <TearoomScene {...sceneProps} />;
  }

  return <LakesideScene {...sceneProps} />;
}

export function TeaSceneCanvas({ scene, weather, perspective, mood, activeGesture, tableStyle, occupancy }) {
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
