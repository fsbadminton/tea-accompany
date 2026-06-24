import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

function CameraRig({ perspective, sceneId }) {
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

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
    targetPosition.current.fromArray(current.position);
    targetLookAt.current.fromArray(current.lookAt);

    state.camera.position.lerp(targetPosition.current, 0.05);
    state.camera.lookAt(targetLookAt.current);
  });

  return null;
}

function TeaFilter({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Funnel top - inverted cone */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.05, 0.08, 16]} />
        <meshStandardMaterial color="#b8b8b8" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Small cylinder base */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 0.04, 12]} />
        <meshStandardMaterial color="#b8b8b8" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Small saucer plate */}
      <mesh position={[0.08, -0.03, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.012, 16]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.28} metalness={0.35} />
      </mesh>
    </group>
  );
}

function WasteBowl({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Bowl body */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.055, 0.08, 20]} />
        <meshStandardMaterial color="#3a5a58" roughness={0.4} />
      </mesh>
      {/* Inner water surface */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.078, 0.078, 0.005, 18]} />
        <meshStandardMaterial color="#2a4a48" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}

function TeaCloth({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Main cloth body */}
      <mesh position={[0, 0.012, 0]} castShadow>
        <boxGeometry args={[0.14, 0.015, 0.1]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.9} />
      </mesh>
      {/* Fold wrinkle 1 */}
      <mesh position={[0.03, 0.022, 0.01]} rotation={[0, 0.2, 0.05]}>
        <boxGeometry args={[0.08, 0.01, 0.06]} />
        <meshStandardMaterial color="#e4dccc" roughness={0.92} />
      </mesh>
      {/* Fold wrinkle 2 */}
      <mesh position={[-0.02, 0.02, -0.015]} rotation={[0.03, -0.15, -0.03]}>
        <boxGeometry args={[0.06, 0.008, 0.045]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.92} />
      </mesh>
    </group>
  );
}

function TeaPet({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Body - flattened sphere */}
      <mesh position={[0, 0.025, 0]} scale={[1.1, 0.65, 0.95]} castShadow>
        <sphereGeometry args={[0.04, 14, 12]} />
        <meshStandardMaterial color="#a07848" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.045, 0.03]} scale={[0.85, 0.75, 0.8]}>
        <sphereGeometry args={[0.03, 12, 10]} />
        <meshStandardMaterial color="#a07848" roughness={0.7} />
      </mesh>
      {/* Left eye */}
      <mesh position={[-0.015, 0.055, 0.045]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.5} />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.015, 0.055, 0.045]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function TeaTable3D({ position = [0, 0.2, 1.1], wood = "#8a6548", tray = "#c89868", activeGesture, tableStyle }) {
  const gaiwanRef = useRef(null);
  const cupRef = useRef(null);
  const smellRef = useRef(0);
  const serveGuestRef = useRef(0);
  const pourRef = useRef(0);
  const serveRef = useRef(0);
  const isPouring = activeGesture === "pour";
  const isBrewing = activeGesture === "brew";

  // Cup flip and distribute state
  const flipProgress = useRef(0);
  const flippedPersisted = useRef(false);
  const cup0Flipped = useRef(false);
  const cup0Filled = useRef(false);
  const cup0LiquidLevel = useRef(null);
  const cup1Ref = useRef(null);
  const cup1Flipped = useRef(false);
  const cup1Filled = useRef(false);
  const cup1LiquidLevel = useRef(null);
  const distributeTarget = useRef(-1);
  const distributeProgress = useRef(0);

  useFrame((state, delta) => {
    if (!gaiwanRef.current) return;

    try {
      // Pour/brew animation
      if (isPouring) {
        pourRef.current = Math.min(pourRef.current + delta * 0.9, 1);
      } else {
        pourRef.current = Math.max(pourRef.current - delta * 0.8, 0);
      }

      // Smell animation
      if (activeGesture === "smell") {
        smellRef.current = Math.min(smellRef.current + delta * 0.7, 1);
      } else {
        smellRef.current = Math.max(smellRef.current - delta * 0.6, 0);
      }

      // ServeGuest animation
      if (activeGesture === "serveGuest") {
        serveGuestRef.current = Math.min(serveGuestRef.current + delta * 0.6, 1);
      } else {
        serveGuestRef.current = Math.max(serveGuestRef.current - delta * 0.5, 0);
      }

      // Serve animation
      if (activeGesture === "serve") {
        serveRef.current = Math.min(serveRef.current + delta * 0.7, 1);
      } else {
        serveRef.current = Math.max(serveRef.current - delta * 0.6, 0);
      }

      // Gaiwan tilt for pour/brew
      if (isPouring || isBrewing) {
        gaiwanRef.current.rotation.z = Math.sin(pourRef.current * Math.PI) * 0.28 * (isBrewing ? 0.2 : 1);
        gaiwanRef.current.rotation.x = isBrewing ? Math.cos(pourRef.current * Math.PI * 0.7) * 0.03 : 0;
      } else {
        gaiwanRef.current.rotation.z *= 0.94;
        gaiwanRef.current.rotation.x *= 0.94;
        if (Math.abs(gaiwanRef.current.rotation.z) < 0.005) gaiwanRef.current.rotation.z = 0;
        if (Math.abs(gaiwanRef.current.rotation.x) < 0.005) gaiwanRef.current.rotation.x = 0;
      }

      // Cup flip animation — toggle on flipCup, persist state when gesture changes
      if (activeGesture === "flipCup") {
        if (!flippedPersisted.current) {
          flipProgress.current = Math.min(flipProgress.current + delta * 0.8, 1);
          if (flipProgress.current >= 0.98) flippedPersisted.current = true;
        } else {
          flipProgress.current = Math.max(flipProgress.current - delta * 0.8, 0);
          if (flipProgress.current <= 0.02) flippedPersisted.current = false;
        }
      }

      // Apply flip to cups — easeFlip computed once, shared across both cups
      const easeFlip = 1 - Math.pow(1 - flipProgress.current, 3);

      // Apply flip to cup0
      if (cupRef.current) {
        cupRef.current.rotation.x = Math.PI * (1 - easeFlip);

        if (flipProgress.current >= 0.98 && !cup0Flipped.current) {
          cup0Flipped.current = true;
        } else if (flipProgress.current < 0.02 && cup0Flipped.current) {
          cup0Flipped.current = false;
        }
      }

      // Apply flip to cup1
      if (cup1Ref.current) {
        cup1Ref.current.rotation.x = Math.PI * (1 - easeFlip);

        if (flipProgress.current >= 0.98 && !cup1Flipped.current) {
          cup1Flipped.current = true;
        } else if (flipProgress.current < 0.02 && cup1Flipped.current) {
          cup1Flipped.current = false;
        }
      }

      // Cup0 smell/serveGuest/serve position animation
      if (cupRef.current) {
        const easeSmell = 1 - Math.pow(1 - smellRef.current, 3);
        const easeServeGuest = 1 - Math.pow(1 - serveGuestRef.current, 3);
        const easeServe = 1 - Math.pow(1 - serveRef.current, 3);
        cupRef.current.position.y = 0.565 + easeSmell * 0.3 + easeServeGuest * 0.05;
        cupRef.current.position.z = 0.08 + easeServe * 0.15;
        const floatVal = serveGuestRef.current * Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
        cupRef.current.position.y += easeServeGuest * 0.4 + floatVal;
      }

      // Liquid level opacity animation
      if (cup0LiquidLevel.current) {
        const targetOpacity = cup0Flipped.current && cup0Filled.current ? 0.85 : 0;
        cup0LiquidLevel.current.material.opacity += (targetOpacity - cup0LiquidLevel.current.material.opacity) * delta * 3;
      }
      if (cup1LiquidLevel.current) {
        const targetOpacity = cup1Flipped.current && cup1Filled.current ? 0.85 : 0;
        cup1LiquidLevel.current.material.opacity += (targetOpacity - cup1LiquidLevel.current.material.opacity) * delta * 3;
      }
    } catch (e) {
      // Prevent animation errors from crashing the render loop
    }

    // Distribute animation
    if (distributeTarget.current >= 0) {
      distributeProgress.current = Math.min(distributeProgress.current + delta * 0.55, 1);
      if (distributeProgress.current >= 1) {
        const idx = distributeTarget.current;
        if (idx === 0) cup0Filled.current = true;
        else cup1Filled.current = true;
        distributeTarget.current = -1;
        distributeProgress.current = 0;
      }
    }
  });

  const handleCupClick = (cupIndex) => {
    if (activeGesture !== "distribute") return;
    const isFlipped = cupIndex === 0 ? cup0Flipped.current : cup1Flipped.current;
    const isFilled = cupIndex === 0 ? cup0Filled.current : cup1Filled.current;
    if (!isFlipped || isFilled || distributeTarget.current >= 0) return;
    distributeTarget.current = cupIndex;
    distributeProgress.current = 0;
  };

  const pourSpoutCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.6, -0.02),
      new THREE.Vector3(0.1, 0.55, -0.02),
      new THREE.Vector3(0.2, 0.48, 0.0),
      new THREE.Vector3(0.22, 0.42, 0.02),
    ]);
  }, []);

  return (
    <Float speed={1.2} rotationIntensity={0.02} floatIntensity={0.06}>
      <group position={position}>
        {/* Table top */}
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.55, 1.7, 0.18, 32]} />
          <meshStandardMaterial color={wood} roughness={0.78} />
        </mesh>

        {/* Table leg */}
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 0.84, 20]} />
          <meshStandardMaterial color="#705238" roughness={0.82} />
        </mesh>

        {/* Tray */}
        <mesh position={[0, 0.49, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.06, 0.7]} />
          <meshStandardMaterial color={tray} roughness={0.72} />
        </mesh>

        {/* Gaiwan */}
        <group ref={gaiwanRef} position={[-0.1, 0.62, -0.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.2, 0.2, 24]} />
            <meshStandardMaterial color="#f8f2ea" roughness={0.2} />
          </mesh>
          <SteamParticles position={[0, 0.14, 0]} count={isBrewing ? 40 : 20} spread={0.08} riseSpeed={isBrewing ? 0.14 : 0.08} size={isBrewing ? 0.05 : 0.04} opacity={isBrewing ? 0.28 : 0.15} />
          <WarmWaterParticles active={activeGesture === 'brew' || activeGesture === 'rinseTea'} position={[0, 0.14, 0]} />
          <LeafDropParticles active={activeGesture === 'appreciateTea'} position={[0, 0.16, 0]} />
        </group>

        {/* Pour particles - from gaiwan spout area toward fairness cup */}
        <TeaPourParticles position={[0.1, 0.65, -0.02]} active={isPouring} count={35} direction={[0.55, 0.15, 0.05]} />

        {/* Fairness cup (公道杯) */}
        <mesh position={[0.3, 0.60, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.16, 24]} />
          <meshStandardMaterial color="#f8f2ea" roughness={0.18} />
        </mesh>
        <SteamParticles position={[0.3, 0.7, 0]} count={10} spread={0.04} riseSpeed={0.06} size={0.03} opacity={0.1} />

        {/* Cup 0 - 品茗杯 */}
        <group
          ref={cupRef}
          position={[-0.45, 0.565, 0.08]}
          onClick={(e) => { e.stopPropagation(); handleCupClick(0); }}
        >
          <mesh rotation={[Math.PI, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.09, 20]} />
            <meshStandardMaterial color="#f8f2ea" roughness={0.18} />
          </mesh>
          {/* Cup rim — visible color band so flip is noticeable */}
          <mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
            <torusGeometry args={[0.07, 0.006, 8, 20]} />
            <meshStandardMaterial color="#c89868" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.04, 0]} rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.065, 0.008, 18]} />
            <meshStandardMaterial color="#c89868" emissive="#a07040" emissiveIntensity={0.08} roughness={0.35} />
          </mesh>
          <mesh ref={cup0LiquidLevel} position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.06, 0.025, 18]} />
            <meshStandardMaterial color="#8a6a30" transparent opacity={0} roughness={0.15} />
          </mesh>
          <GestureGlowRing active={activeGesture === "serve" || activeGesture === "smell" || activeGesture === "serveGuest"} position={[0, -0.01, 0]} />
          <AromaParticles position={[0, 0.06, 0]} active={activeGesture === "smell"} count={18} />
        </group>

        {/* Cup 1 - 品茗杯 (full table only) */}
        {tableStyle === "full" && (
          <group
            ref={cup1Ref}
            position={[0.02, 0.565, 0.18]}
            onClick={(e) => { e.stopPropagation(); handleCupClick(1); }}
          >
            <mesh rotation={[Math.PI, 0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.08, 0.09, 20]} />
              <meshStandardMaterial color="#f8f2ea" roughness={0.18} />
            </mesh>
            {/* Cup rim — visible color band so flip is noticeable */}
            <mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
              <torusGeometry args={[0.07, 0.006, 8, 20]} />
              <meshStandardMaterial color="#c89868" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.04, 0]} rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.065, 0.008, 18]} />
              <meshStandardMaterial color="#c89868" emissive="#a07040" emissiveIntensity={0.08} roughness={0.35} />
            </mesh>
            <mesh ref={cup1LiquidLevel} position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.055, 0.06, 0.025, 18]} />
              <meshStandardMaterial color="#8a6a30" transparent opacity={0} roughness={0.15} />
            </mesh>
          </group>
        )}

        {/* Additional tea utensils */}
        <TeaFilter position={[0.18, 0.556, -0.02]} />
        <WasteBowl position={[-0.42, 0.52, -0.28]} />
        <TeaCloth position={[0.42, 0.515, 0.28]} />
        <TeaPet position={[-0.45, 0.521, 0.25]} />
      </group>
    </Float>
  );
}

function FirstPersonHands({ activeGesture }) {
  const leftGroupRef = useRef(null);
  const rightGroupRef = useRef(null);
  // Finger joint refs for right hand
  const rThumbRef = useRef(null);
  const rIndexRef = useRef(null);
  const rMiddleRef = useRef(null);
  const rRingRef = useRef(null);
  const rPinkyRef = useRef(null);
  // Finger joint refs for left hand
  const lThumbRef = useRef(null);
  const lIndexRef = useRef(null);
  const lMiddleRef = useRef(null);
  const lRingRef = useRef(null);
  const lPinkyRef = useRef(null);

  const entranceRef = useRef(0);
  const rightPosTarget = useRef(new THREE.Vector3(1.82, -0.1, 1.72));
  const rightRotTarget = useRef(new THREE.Euler(0.1, -0.18, -0.12));
  const leftPosTarget = useRef(new THREE.Vector3(-1.85, -0.08, 1.65));
  const leftRotTarget = useRef(new THREE.Euler(0.08, 0.2, 0.1));

  // Finger curl targets per gesture (0 = straight, 1 = fully curled)
  const fingerTargets = useRef({ rT: 0.15, rI: 0.15, rM: 0.15, rR: 0.15, rP: 0.15, lT: 0.15, lI: 0.15, lM: 0.15, lR: 0.15, lP: 0.15 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const showHands = ["pour", "distribute", "flipCup", "smell", "serve", "serveGuest"].includes(activeGesture);

    // Entrance
    if (showHands) {
      entranceRef.current = Math.min(entranceRef.current + delta * 2.5, 1);
    } else {
      entranceRef.current = Math.max(entranceRef.current - delta * 2.0, 0);
    }
    const ease = 1 - Math.pow(1 - entranceRef.current, 3);
    const hiddenY = -0.6;

    // Gesture targets
    const ft = fingerTargets.current;
    switch (activeGesture) {
      case "pour":
        rightPosTarget.current.set(0.78, 0.35, 0.92);
        rightRotTarget.current.set(-0.2, -0.4, -0.3);
        leftPosTarget.current.set(-1.85, -0.08, 1.65);
        leftRotTarget.current.set(0.08, 0.2, 0.1);
        // Thumb on lid, fingers wrapped around handle
        ft.rT = 0.8; ft.rI = 0.7; ft.rM = 0.65; ft.rR = 0.6; ft.rP = 0.55;
        ft.lT = 0.15; ft.lI = 0.15; ft.lM = 0.15; ft.lR = 0.15; ft.lP = 0.15;
        break;
      case "flipCup":
        rightPosTarget.current.set(0.15, 0.18, 1.05);
        rightRotTarget.current.set(0.1, -0.05, -0.1);
        leftPosTarget.current.set(-0.15, 0.18, 1.05);
        leftRotTarget.current.set(0.1, 0.05, 0.1);
        // Three-finger pinch (thumb, index, middle curled, ring/pinky straight)
        ft.rT = 0.9; ft.rI = 0.85; ft.rM = 0.8; ft.rR = 0.1; ft.rP = 0.1;
        ft.lT = 0.9; ft.lI = 0.85; ft.lM = 0.8; ft.lR = 0.1; ft.lP = 0.1;
        break;
      case "distribute":
        rightPosTarget.current.set(-0.05, 0.28, 0.85);
        rightRotTarget.current.set(-0.15, 0.0, -0.15);
        leftPosTarget.current.set(-1.85, -0.08, 1.65);
        leftRotTarget.current.set(0.08, 0.2, 0.1);
        // Holding fairness cup — fingers wrap around
        ft.rT = 0.6; ft.rI = 0.55; ft.rM = 0.5; ft.rR = 0.45; ft.rP = 0.4;
        ft.lT = 0.15; ft.lI = 0.15; ft.lM = 0.15; ft.lR = 0.15; ft.lP = 0.15;
        break;
      case "smell":
        rightPosTarget.current.set(0.0, 0.35, 0.75);
        rightRotTarget.current.set(-0.4, 0.0, 0.0);
        leftPosTarget.current.set(-1.85, -0.08, 1.65);
        leftRotTarget.current.set(0.08, 0.2, 0.1);
        // Cup held near face — gentle hold
        ft.rT = 0.5; ft.rI = 0.45; ft.rM = 0.4; ft.rR = 0.35; ft.rP = 0.3;
        ft.lT = 0.15; ft.lI = 0.15; ft.lM = 0.15; ft.lR = 0.15; ft.lP = 0.15;
        break;
      case "serve":
        rightPosTarget.current.set(0.0, 0.22, 0.9);
        rightRotTarget.current.set(0.05, 0.0, -0.05);
        leftPosTarget.current.set(-1.85, -0.08, 1.65);
        leftRotTarget.current.set(0.08, 0.2, 0.1);
        // Holding cup flat
        ft.rT = 0.45; ft.rI = 0.4; ft.rM = 0.35; ft.rR = 0.3; ft.rP = 0.25;
        ft.lT = 0.15; ft.lI = 0.15; ft.lM = 0.15; ft.lR = 0.15; ft.lP = 0.15;
        break;
      case "serveGuest":
        rightPosTarget.current.set(0.0, 0.28, 0.55);
        rightRotTarget.current.set(-0.25, 0.0, 0.0);
        leftPosTarget.current.set(0.0, 0.25, 0.6);
        leftRotTarget.current.set(-0.2, 0.0, 0.0);
        // Both hands offering — gentle open hold
        ft.rT = 0.4; ft.rI = 0.35; ft.rM = 0.3; ft.rR = 0.25; ft.rP = 0.2;
        ft.lT = 0.4; ft.lI = 0.35; ft.lM = 0.3; ft.lR = 0.25; ft.lP = 0.2;
        break;
      default:
        rightPosTarget.current.set(1.82, -0.1, 1.72);
        rightRotTarget.current.set(0.1, -0.18, -0.12);
        leftPosTarget.current.set(-1.85, -0.08, 1.65);
        leftRotTarget.current.set(0.08, 0.2, 0.1);
        ft.rT = 0.15; ft.rI = 0.15; ft.rM = 0.15; ft.rR = 0.15; ft.rP = 0.15;
        ft.lT = 0.15; ft.lI = 0.15; ft.lM = 0.15; ft.lR = 0.15; ft.lP = 0.15;
    }

    const entranceOffset = (1 - ease) * hiddenY;
    const lerpSpeed = delta * 3.5;

    // Animate right hand position/rotation
    if (rightGroupRef.current) {
      rightGroupRef.current.position.lerp(rightPosTarget.current, lerpSpeed);
      rightGroupRef.current.position.y += entranceOffset;
      rightGroupRef.current.rotation.x += (rightRotTarget.current.x - rightGroupRef.current.rotation.x) * lerpSpeed;
      rightGroupRef.current.rotation.y += (rightRotTarget.current.y - rightGroupRef.current.rotation.y) * lerpSpeed;
      rightGroupRef.current.rotation.z += (rightRotTarget.current.z - rightGroupRef.current.rotation.z) * lerpSpeed;
      rightGroupRef.current.position.x += Math.sin(t * 0.9 + 0.5) * 0.006;
      rightGroupRef.current.position.y += Math.cos(t * 1.2 + 0.3) * 0.004;
    }

    // Animate left hand position/rotation
    if (leftGroupRef.current) {
      leftGroupRef.current.position.lerp(leftPosTarget.current, lerpSpeed);
      leftGroupRef.current.position.y += entranceOffset;
      leftGroupRef.current.rotation.x += (leftRotTarget.current.x - leftGroupRef.current.rotation.x) * lerpSpeed;
      leftGroupRef.current.rotation.y += (leftRotTarget.current.y - leftGroupRef.current.rotation.y) * lerpSpeed;
      leftGroupRef.current.rotation.z += (leftRotTarget.current.z - leftGroupRef.current.rotation.z) * lerpSpeed;
      leftGroupRef.current.position.x += Math.sin(t * 0.8) * 0.006;
      leftGroupRef.current.position.y += Math.cos(t * 1.1) * 0.004;
    }

    // Animate finger curls (lerp toward target)
    const fLerp = delta * 5;
    const animateFinger = (ref, target) => {
      if (ref.current) ref.current.rotation.x += (target - ref.current.rotation.x) * fLerp;
    };
    animateFinger(rThumbRef, ft.rT);
    animateFinger(rIndexRef, ft.rI);
    animateFinger(rMiddleRef, ft.rM);
    animateFinger(rRingRef, ft.rR);
    animateFinger(rPinkyRef, ft.rP);
    animateFinger(lThumbRef, ft.lT);
    animateFinger(lIndexRef, ft.lI);
    animateFinger(lMiddleRef, ft.lM);
    animateFinger(lRingRef, ft.lR);
    animateFinger(lPinkyRef, ft.lP);
  });

  const skin = "#d4b08a";
  const skinDark = "#c49a78";
  const nail = "#e8c8b0";

  // Helper: renders a hand with 5 fingers
  const renderHand = (thumbRef, indexRef, middleRef, ringRef, pinkyRef, mirror) => {
    const m = mirror ? -1 : 1;
    return (
      <>
        {/* Palm */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.075, 0.035, 0.09]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>
        {/* Wrist */}
        <mesh position={[0, 0, 0.065]}>
          <capsuleGeometry args={[0.022, 0.04, 6, 12]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>
        {/* Thumb — offset to side, 2 joints */}
        <group ref={thumbRef} position={[m * 0.042, 0.005, 0.01]}>
          <mesh position={[m * 0.02, -0.005, 0]} rotation={[0, 0, m * 0.3]}>
            <capsuleGeometry args={[0.011, 0.032, 4, 8]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
          <group position={[m * 0.038, -0.015, 0]} rotation={[0, 0, m * 0.5]}>
            <mesh>
              <capsuleGeometry args={[0.009, 0.025, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.55} />
            </mesh>
            {/* Fingernail */}
            <mesh position={[0, -0.02, 0.003]}>
              <boxGeometry args={[0.012, 0.008, 0.004]} />
              <meshStandardMaterial color={nail} roughness={0.3} />
            </mesh>
          </group>
        </group>
        {/* Index finger — 3 joints */}
        <group ref={indexRef} position={[m * 0.022, 0.012, -0.045]}>
          <mesh position={[0, 0, -0.022]}>
            <capsuleGeometry args={[0.008, 0.035, 4, 8]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
          <group position={[0, 0, -0.048]}>
            <mesh position={[0, 0, -0.016]}>
              <capsuleGeometry args={[0.007, 0.025, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.55} />
            </mesh>
            <group position={[0, 0, -0.035]}>
              <mesh>
                <capsuleGeometry args={[0.006, 0.018, 4, 8]} />
                <meshStandardMaterial color={skin} roughness={0.55} />
              </mesh>
              <mesh position={[0, 0.003, -0.012]}>
                <boxGeometry args={[0.01, 0.007, 0.004]} />
                <meshStandardMaterial color={nail} roughness={0.3} />
              </mesh>
            </group>
          </group>
        </group>
        {/* Middle finger — slightly longer */}
        <group ref={middleRef} position={[m * 0.006, 0.014, -0.045]}>
          <mesh position={[0, 0, -0.024]}>
            <capsuleGeometry args={[0.008, 0.038, 4, 8]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
          <group position={[0, 0, -0.052]}>
            <mesh position={[0, 0, -0.018]}>
              <capsuleGeometry args={[0.007, 0.028, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.55} />
            </mesh>
            <group position={[0, 0, -0.038]}>
              <mesh>
                <capsuleGeometry args={[0.006, 0.02, 4, 8]} />
                <meshStandardMaterial color={skin} roughness={0.55} />
              </mesh>
              <mesh position={[0, 0.003, -0.013]}>
                <boxGeometry args={[0.01, 0.007, 0.004]} />
                <meshStandardMaterial color={nail} roughness={0.3} />
              </mesh>
            </group>
          </group>
        </group>
        {/* Ring finger */}
        <group ref={ringRef} position={[m * -0.008, 0.012, -0.043]}>
          <mesh position={[0, 0, -0.02]}>
            <capsuleGeometry args={[0.007, 0.032, 4, 8]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
          <group position={[0, 0, -0.044]}>
            <mesh position={[0, 0, -0.014]}>
              <capsuleGeometry args={[0.006, 0.022, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.55} />
            </mesh>
            <group position={[0, 0, -0.03]}>
              <mesh>
                <capsuleGeometry args={[0.0055, 0.016, 4, 8]} />
                <meshStandardMaterial color={skin} roughness={0.55} />
              </mesh>
              <mesh position={[0, 0.003, -0.01]}>
                <boxGeometry args={[0.009, 0.006, 0.004]} />
                <meshStandardMaterial color={nail} roughness={0.3} />
              </mesh>
            </group>
          </group>
        </group>
        {/* Pinky — shortest */}
        <group ref={pinkyRef} position={[m * -0.022, 0.01, -0.04]}>
          <mesh position={[0, 0, -0.016]}>
            <capsuleGeometry args={[0.006, 0.025, 4, 8]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
          <group position={[0, 0, -0.034]}>
            <mesh>
              <capsuleGeometry args={[0.005, 0.018, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.002, -0.01]}>
              <boxGeometry args={[0.008, 0.005, 0.003]} />
              <meshStandardMaterial color={nail} roughness={0.3} />
            </mesh>
          </group>
        </group>
      </>
    );
  };

  return (
    <group>
      <group ref={rightGroupRef} position={[1.82, -0.1, 1.72]}>
        {renderHand(rThumbRef, rIndexRef, rMiddleRef, rRingRef, rPinkyRef, false)}
      </group>
      <group ref={leftGroupRef} position={[-1.85, -0.08, 1.65]}>
        {renderHand(lThumbRef, lIndexRef, lMiddleRef, lRingRef, lPinkyRef, true)}
      </group>
    </group>
  );
}

function FirstPersonCup() {
  return (
    <group position={[0.05, 0.16, 1.18]}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.18, 24]} />
        <meshStandardMaterial color="#f8f2ea" roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.14, 0.15, 0.03, 24]} />
        <meshStandardMaterial color="#c89868" roughness={0.75} />
      </mesh>
      <mesh position={[0.18, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.02, 12, 18]} />
        <meshStandardMaterial color="#f0e8de" roughness={0.25} />
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
        <meshStandardMaterial color="#7e5840" roughness={0.82} />
      </mesh>
      <mesh position={[0, tableY + 0.1, 1.45]}>
        <cylinderGeometry args={[0.18, 0.21, 0.22, 24]} />
        <meshStandardMaterial color="#f8f2ea" roughness={0.18} />
      </mesh>
      <mesh position={[0.42, tableY + 0.08, 1.55]}>
        <cylinderGeometry args={[0.08, 0.09, 0.13, 20]} />
        <meshStandardMaterial color="#f8f2ea" roughness={0.18} />
      </mesh>
      <mesh position={[-0.42, tableY + 0.08, 1.55]}>
        <cylinderGeometry args={[0.08, 0.09, 0.13, 20]} />
        <meshStandardMaterial color="#f8f2ea" roughness={0.18} />
      </mesh>
      <mesh position={[0, tableY + 0.17, 1.7]} rotation={[0, 0, active ? 0.12 : 0]}>
        <torusGeometry args={[0.22, 0.02, 12, 24]} />
        <meshStandardMaterial color="#e0d4c8" roughness={0.3} />
      </mesh>
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

const SILHOUETTE_LAYOUT = {
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

const GUEST_STYLES = [
  { color: "#2a2018", scale: 1.0 },   // warm dark brown
  { color: "#1e2228", scale: 0.95 },  // deep blue-gray
  { color: "#2c1a1a", scale: 1.05 },  // dark maroon
];

function SilhouetteGuests({ perspective, sceneId, occupancy }) {
  if (perspective === "firstPerson") return null;

  const seats = SILHOUETTE_LAYOUT[sceneId] ?? SILHOUETTE_LAYOUT.lakeside;
  const count = occupancy === "solo" ? 1 : occupancy === "duo" ? 2 : 3;

  const GUEST_STYLES = [
    { body: "#2a2018", scale: 1.0 },
    { body: "#1e2228", scale: 0.95 },
    { body: "#2c1a1a", scale: 1.05 },
  ];

  return (
    <group>
      {seats.slice(0, count).map((position, index) => {
        const style = GUEST_STYLES[index % GUEST_STYLES.length];
        const s = style.scale;
        return (
          <group key={index} position={position} scale={[s, s, s]}>
            {/* Head */}
            <mesh position={[0, 0.68, 0]}>
              <sphereGeometry args={[0.14, 16, 14]} />
              <meshStandardMaterial color={style.body} transparent opacity={0.72} />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.24, 0.38, 0.16]} />
              <meshStandardMaterial color={style.body} transparent opacity={0.72} />
            </mesh>
            {/* Left upper arm */}
            <mesh position={[-0.17, 0.48, 0]} rotation={[0, 0, 0.2]}>
              <capsuleGeometry args={[0.035, 0.16, 4, 8]} />
              <meshStandardMaterial color={style.body} transparent opacity={0.72} />
            </mesh>
            {/* Right upper arm */}
            <mesh position={[0.17, 0.48, 0]} rotation={[0, 0, -0.2]}>
              <capsuleGeometry args={[0.035, 0.16, 4, 8]} />
              <meshStandardMaterial color={style.body} transparent opacity={0.72} />
            </mesh>
            {/* Left forearm — resting on table */}
            <mesh position={[-0.22, 0.32, 0.12]} rotation={[0.8, 0, 0.1]}>
              <capsuleGeometry args={[0.03, 0.14, 4, 8]} />
              <meshStandardMaterial color={style.body} transparent opacity={0.72} />
            </mesh>
            {/* Right forearm — resting on table */}
            <mesh position={[0.22, 0.32, 0.12]} rotation={[0.8, 0, -0.1]}>
              <capsuleGeometry args={[0.03, 0.14, 4, 8]} />
              <meshStandardMaterial color={style.body} transparent opacity={0.72} />
            </mesh>
            {/* Left leg */}
            <mesh position={[-0.07, 0.08, 0.04]}>
              <boxGeometry args={[0.09, 0.22, 0.1]} />
              <meshStandardMaterial color={style.body} transparent opacity={0.65} />
            </mesh>
            {/* Right leg */}
            <mesh position={[0.07, 0.08, 0.04]}>
              <boxGeometry args={[0.09, 0.22, 0.1]} />
              <meshStandardMaterial color={style.body} transparent opacity={0.65} />
            </mesh>
          </group>
        );
      })}
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
  }, []);

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
  }, []);

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

function TeaPourParticles({ position = [0, 0.6, 0], active = false, count = 30, direction = [0, -1, 0] }) {
  const pointsRef = useRef(null);
  const posArray = useMemo(() => new Float32Array(count * 3), [count]);
  const velArray = useMemo(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Stagger start positions along the arc
      const t = Math.random();
      posArray[i * 3]     = direction[0] * t * 0.3;
      posArray[i * 3 + 1] = 0.08 * t * (1 - t) * 4;
      posArray[i * 3 + 2] = direction[2] * t * 0.3;
      v[i * 3]     = direction[0] * 1.5 + (Math.random() - 0.5) * 0.01;
      v[i * 3 + 1] = direction[1] * 1.5;
      v[i * 3 + 2] = direction[2] * 1.5 + (Math.random() - 0.5) * 0.01;
    }
    return v;
  }, [count, direction[0], direction[1], direction[2]]);

  const gravity = -1.0;

  useFrame((state, delta) => {
    if (!pointsRef.current || !active) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      const b = i * 3;
      // Gravity
      velArray[b + 1] += gravity * dt;
      // Integrate position
      posArray[b]     += velArray[b] * dt;
      posArray[b + 1] += velArray[b + 1] * dt;
      posArray[b + 2] += velArray[b + 2] * dt;
      // Write to GPU buffer
      pos.array[b]     = posArray[b];
      pos.array[b + 1] = posArray[b + 1];
      pos.array[b + 2] = posArray[b + 2];
      // Reset when reached target height or overshot horizontally
      if (posArray[b + 1] < -0.15 || Math.abs(posArray[b]) > Math.abs(direction[0]) * 1.2) {
        posArray[b]     = (Math.random() - 0.5) * 0.015;
        posArray[b + 1] = 0;
        posArray[b + 2] = (Math.random() - 0.5) * 0.015;
        velArray[b]     = direction[0] * 1.5 + (Math.random() - 0.5) * 0.01;
        velArray[b + 1] = direction[1] * 1.5;
        velArray[b + 2] = direction[2] * 1.5 + (Math.random() - 0.5) * 0.01;
      }
    }
    pos.needsUpdate = true;
  });

  if (!active) return null;

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
      <pointsMaterial color="#8a6a30" size={0.035} transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function WarmWaterParticles({ active, position = [0, 0, 0], count = 40 }) {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      values[i * 3] = (Math.random() - 0.5) * 0.06;
      values[i * 3 + 1] = Math.random() * 0.15;
      values[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
    }
    return values;
  }, [count]);

  useFrame(() => {
    if (!ref.current || !active) return;
    const posArr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += 0.004;
      if (posArr[i * 3 + 1] > 0.2) {
        posArr[i * 3] = (Math.random() - 0.5) * 0.06;
        posArr[i * 3 + 1] = Math.random() * 0.02;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#f0e8d8" size={0.012} transparent opacity={0.45} />
    </points>
  );
}

function LeafDropParticles({ active, position = [0, 0, 0], count = 15 }) {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      values[i * 3] = (Math.random() - 0.5) * 0.04;
      values[i * 3 + 1] = 0.15 + Math.random() * 0.1;
      values[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    return values;
  }, [count]);

  useFrame(() => {
    if (!ref.current || !active) return;
    const posArr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] -= 0.003;
      posArr[i * 3] += (Math.random() - 0.5) * 0.001;
      if (posArr[i * 3 + 1] < 0) {
        posArr[i * 3] = (Math.random() - 0.5) * 0.04;
        posArr[i * 3 + 1] = 0.15 + Math.random() * 0.1;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#5a4a32" size={0.008} transparent opacity={0.6} />
    </points>
  );
}

function TeaDistributeParticles({ position = [0, 0.14, 0], active = false, count = 25 }) {
  const pointsRef = useRef(null);
  const posArray = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 0.04;
      values[i * 3 + 1] = -Math.random() * 0.35;
      values[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    return values;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !active) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < count; i += 1) {
      pos.array[i * 3 + 1] -= delta * 0.5;
      pos.array[i * 3] += Math.sin(state.clock.elapsedTime * 2.5 + i) * 0.001;
      pos.array[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 2 + i * 0.8) * 0.0006;
      if (pos.array[i * 3 + 1] < -0.4) {
        pos.array[i * 3] = (Math.random() - 0.5) * 0.04;
        pos.array[i * 3 + 1] = 0;
        pos.array[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
      }
    }
    pos.needsUpdate = true;
  });

  if (!active) return null;

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
      <pointsMaterial color="#8a6a30" size={0.016} transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function AromaParticles({ position = [0, 0, 0], active = false, count = 20 }) {
  const pointsRef = useRef(null);
  const posArray = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 0.12;
      values[i * 3 + 1] = Math.random() * 0.25;
      values[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    return values;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !active) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < count; i += 1) {
      pos.array[i * 3 + 1] += delta * 0.12;
      pos.array[i * 3] += Math.sin(state.clock.elapsedTime * 1.5 + i * 0.7) * 0.0006;
      if (pos.array[i * 3 + 1] > 0.5) {
        pos.array[i * 3] = (Math.random() - 0.5) * 0.12;
        pos.array[i * 3 + 1] = 0;
        pos.array[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
      }
    }
    pos.needsUpdate = true;
  });

  if (!active) return null;

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
      <pointsMaterial color="#f0e8d8" size={0.025} transparent opacity={0.35} depthWrite={false} />
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
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.05} />
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
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(1.5, 2.4, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      if (y < 1.1) {
        const noise = Math.sin(x * 5 + z * 3) * 0.12 + Math.sin(x * 11 + z * 7) * 0.06;
        pos.setX(i, x + noise);
        pos.setZ(i, z + noise * 0.7);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh position={position} scale={scale} geometry={geometry}>
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
        <meshStandardMaterial color="#6a5040" />
      </mesh>
      <mesh position={[0, 2.2, -1.35]} rotation={[0, 0, 0.03]}>
        <boxGeometry args={[5.5, 0.16, 3.9]} />
        <meshStandardMaterial color="#846650" />
      </mesh>
      {[
        [-2.15, 0.82, 0.1],
        [2.15, 0.82, 0.1],
        [-2.15, 0.82, -2.8],
        [2.15, 0.82, -2.8],
      ].map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.18, 1.68, 0.18]} />
          <meshStandardMaterial color="#7a5e48" />
        </mesh>
      ))}
      <mesh position={[0, 0.2, -1.25]}>
        <boxGeometry args={[5.4, 0.1, 4.5]} />
        <meshStandardMaterial color="#947a65" />
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
  const wall = "#7a5e42";

  return (
    <group>
      {/* Back wall sections (around window opening) — widened to cover FOV edges */}
      {[
        { position: [0, 3.76, -3.05], size: [12, 0.5, 0.24] },
        { position: [0, 0.18, -3.05], size: [12, 0.72, 0.24] },
        { position: [-3.76, 1.96, -3.05], size: [0.88, 3.28, 0.24] },
        { position: [3.76, 1.96, -3.05], size: [0.88, 3.28, 0.24] },
      ].map((part, index) => (
        <mesh key={index} position={part.position} receiveShadow>
          <boxGeometry args={part.size} />
          <meshStandardMaterial color={wall} roughness={0.88} />
        </mesh>
      ))}
      {/* Floor — extended wider and shifted toward camera */}
      <mesh position={[0, -0.36, 0.2]} receiveShadow>
        <boxGeometry args={[12, 0.12, 7.2]} />
        <meshStandardMaterial color="#8c6548" roughness={0.88} />
      </mesh>
      {/* Ceiling — extended wider and shifted toward camera */}
      <mesh position={[0, 4, 0.2]} receiveShadow>
        <boxGeometry args={[12.2, 0.18, 7.4]} />
        <meshStandardMaterial color="#523826" roughness={0.86} />
      </mesh>
      {/* Left side wall — moved outward to x=-5.5, extended toward camera */}
      <mesh position={[-5.5, 1.78, 0.2]} receiveShadow>
        <boxGeometry args={[0.18, 4.1, 7.1]} />
        <meshStandardMaterial color="#6a4d38" roughness={0.86} />
      </mesh>
      {/* Right side wall — moved outward to x=5.5, extended toward camera */}
      <mesh position={[5.5, 1.78, 0.2]} receiveShadow>
        <boxGeometry args={[0.18, 4.1, 7.1]} />
        <meshStandardMaterial color="#6a4d38" roughness={0.86} />
      </mesh>
      {/* Invisible blocking planes at outer edges as a safety net */}
      <mesh position={[-6, 1.78, 0.2]} visible={false}>
        <boxGeometry args={[0.1, 5, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[6, 1.78, 0.2]} visible={false}>
        <boxGeometry args={[0.1, 5, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <WindowFrame3D />
    </group>
  );
}

function WindowFrame3D() {
  const wood = "#c8a882";
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
        <meshStandardMaterial color="#d8cbb4" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.38, -2.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.65, 0.9]} />
        <meshStandardMaterial color="#b89870" roughness={0.9} />
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
  const rail = "#c8a882";

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
        <meshPhysicalMaterial color="#a9beb9" roughness={0.4} transmission={0.1} transparent opacity={0.14} />
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

function SkyGradient({ color }) {
  return (
    <mesh position={[0, 2, -7]}>
      <planeGeometry args={[30, 10]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

function PuffyCloud({ position, scale = 1, speed = 0.05 }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
  });
  return (
    <group ref={ref} position={position} scale={[scale, scale * 0.6, scale]}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 12]} />
        <meshStandardMaterial color="#f0f0f0" roughness={1} />
      </mesh>
      <mesh position={[0.6, -0.1, 0]}>
        <sphereGeometry args={[0.6, 14, 10]} />
        <meshStandardMaterial color="#e8e8e8" roughness={1} />
      </mesh>
      <mesh position={[-0.5, -0.15, 0.1]}>
        <sphereGeometry args={[0.55, 14, 10]} />
        <meshStandardMaterial color="#e8e8e8" roughness={1} />
      </mesh>
      <mesh position={[0.2, 0.25, 0]}>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color="#f8f8f8" roughness={1} />
      </mesh>
    </group>
  );
}

function CloudLayer({ weather }) {
  if (weather === "rain" || weather === "overcast") return null;
  return (
    <group>
      <PuffyCloud position={[-3, 3.2, -6]} scale={1.2} speed={0.04} />
      <PuffyCloud position={[4, 3.5, -7]} scale={0.9} speed={0.03} />
      <PuffyCloud position={[0.5, 3.8, -8]} scale={0.7} speed={0.05} />
    </group>
  );
}

function SunMoon({ timeSlot }) {
  const sunRef = useRef(null);
  const moonRef = useRef(null);

  const sunConfig = {
    dawn:  { color: "#f8a848", emissive: "#f09020", intensity: 0.6 },
    day:   { color: "#fff4d0", emissive: "#f0e0a0", intensity: 0.7 },
    dusk:  { color: "#f07030", emissive: "#d05018", intensity: 0.5 },
    night: { color: "#f8a848", emissive: "#f09020", intensity: 0.6 },
  };
  const moonConfig = {
    dawn:  { color: "#d0d8e8", emissive: "#8090a8", intensity: 0.15 },
    day:   { color: "#d0d8e8", emissive: "#8090a8", intensity: 0.15 },
    dusk:  { color: "#d0d8e8", emissive: "#8090a8", intensity: 0.15 },
    night: { color: "#e8f0ff", emissive: "#a0b8d0", intensity: 0.25 },
  };

  const arcPositions = {
    dawn:  { sun: [-4, 2.0, -6], moon: [3, 3.5, -7] },
    day:   { sun: [0, 4.0, -7], moon: [-3, 3.0, -7] },
    dusk:  { sun: [4, 1.8, -6], moon: [-1, 3.8, -7] },
    night: { sun: [4, 1.8, -6], moon: [2, 4.0, -7] },
  };

  const sc = sunConfig[timeSlot] || sunConfig.day;
  const mc = moonConfig[timeSlot] || moonConfig.night;
  const arc = arcPositions[timeSlot] || arcPositions.day;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sunRef.current) {
      sunRef.current.position.x = arc.sun[0] + Math.sin(t * 0.08) * 0.3;
      sunRef.current.position.y = arc.sun[1] + Math.sin(t * 0.12) * 0.15;
    }
    if (moonRef.current) {
      moonRef.current.position.x = arc.moon[0] + Math.sin(t * 0.06 + 1) * 0.2;
      moonRef.current.position.y = arc.moon[1] + Math.sin(t * 0.1 + 1) * 0.1;
    }
  });

  const showSun = timeSlot !== "night";
  const showMoon = timeSlot === "night" || timeSlot === "dusk";

  return (
    <group>
      {showSun && (
        <group ref={sunRef} position={arc.sun}>
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial color={sc.color} emissive={sc.emissive} emissiveIntensity={sc.intensity} />
          </mesh>
        </group>
      )}
      {showMoon && (
        <group ref={moonRef} position={arc.moon}>
          <mesh>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color={mc.color} emissive={mc.emissive} emissiveIntensity={mc.intensity} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function MountainShape({ x, y, z, width, height, depth, color, seed = 0, renderOrder = 0 }) {
  const geometry = useMemo(() => {
    const segments = 48;
    const vertices = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const px = (t - 0.5) * width;
      const hillShape = Math.exp(-Math.pow((t - 0.5) * 3.5, 2));
      const noise = Math.sin(t * 12 + seed) * 0.08 + Math.sin(t * 7.3 + seed * 2.1) * 0.12 + Math.sin(t * 23.7 + seed * 0.7) * 0.04;
      const peakY = height * (hillShape + noise * 0.3);
      vertices.push(px, 0, 0);
      vertices.push(px, peakY, 0);
    }
    for (let i = 0; i < segments; i++) {
      const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
      indices.push(a, c, b, b, c, d);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [width, height, seed]);

  return (
    <mesh position={[x, y, z]} geometry={geometry} renderOrder={renderOrder}>
      <meshStandardMaterial color={color} roughness={1} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function LayeredMountains({ timeSlot, weather }) {
  const far = weather === "rain" ? "#6a9a90" : "#50a898";
  const mid = weather === "rain" ? "#4a8068" : "#3d8a70";
  const near = weather === "rain" ? "#3a6850" : "#2d7a5a";

  return (
    <group>
      {[
        // Far layer — lowest renderOrder (drawn first, behind everything)
        { x: -4.5, y: 0.3, z: -7.0, width: 5.5, height: 3.2, color: far, seed: 1.2, renderOrder: 0 },
        { x: 2, y: 0.2, z: -7.5, width: 6.5, height: 3.8, color: far, seed: 3.7, renderOrder: 0 },
        { x: 6, y: 0.3, z: -6.8, width: 4.8, height: 2.8, color: far, seed: 5.1, renderOrder: 0 },
        // Mid layer — offset further from far layer
        { x: -3, y: 0.2, z: -5.5, width: 5.2, height: 2.6, color: mid, seed: 2.4, renderOrder: 1 },
        { x: 4, y: 0.15, z: -5.2, width: 4.8, height: 2.2, color: mid, seed: 6.3, renderOrder: 1 },
        // Near layer — closest to viewer, drawn last
        { x: -5.5, y: 0.1, z: -3.8, width: 4.2, height: 1.6, color: near, seed: 0.8, renderOrder: 2 },
        { x: 5.5, y: 0.1, z: -3.5, width: 3.8, height: 1.3, color: near, seed: 7.5, renderOrder: 2 },
      ].map((m, i) => (
        <MountainShape key={i} {...m} />
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

  const canopyGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.55, 24, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
      const noise = Math.sin(vx * 8 + x) * 0.06 + Math.sin(vy * 6 + x * 1.3) * 0.04 + Math.sin(vz * 10 + x * 0.7) * 0.05;
      pos.setXYZ(i, vx + vx * noise, vy + vy * noise * 0.5, vz + vz * noise);
    }
    geo.computeVertexNormals();
    return geo;
  }, [x]);

  return (
    <group ref={ref} position={[x, 0, z]} scale={[mirrored ? -1 : 1, 1, 1]}>
      <mesh position={[0.03, 1.2, 0]} rotation={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.05, 0.08, 2.4, 12]} />
        <meshStandardMaterial color="#6a4a30" roughness={0.9} />
      </mesh>
      {[0, 0.4, 0.75].map((y, i) => (
        <mesh key={i} position={[0, 1.85 + y, 0]} geometry={canopyGeo} scale={[1 - i * 0.15, 0.95 - i * 0.08, 1 - i * 0.12]}>
          <meshStandardMaterial color={i === 0 ? "#3a9860" : i === 1 ? "#40a068" : "#45a870"} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function DriftingMist({ weather }) {
  const ref = useRef(null);
  const density = weather === "rain" ? 1.8 : weather === "overcast" ? 1.3 : 1;

  const mistGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, 24, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const edgeFade = 1 - Math.pow(Math.abs(x), 2.5);
      pos.setY(i, y * edgeFade * 0.2);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.x = Math.sin(t * 0.1) * 1.2;
    ref.current.children.forEach((child, i) => {
      if (child.material) {
        child.material.opacity = (0.12 - i * 0.02) * density * (0.85 + Math.sin(t * 0.35 + i * 2) * 0.15);
      }
    });
  });

  return (
    <group ref={ref} position={[0, 0.6, -3.5]}>
      {[
        { y: 0, s: 16, z: 0 },
        { y: 0.5, s: 13, z: -0.8 },
      ].map((layer, i) => (
        <mesh key={i} position={[0, layer.y, layer.z]} geometry={mistGeo} scale={[layer.s, 1, 1]}>
          <meshBasicMaterial color="#dce8e0" transparent opacity={0.12 - i * 0.02} side={THREE.DoubleSide} depthWrite={false} />
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
    });
  });

  return (
    <group position={[0, 0.12, -1.5]}>
      {[
        { x: -1.8, r: 0.3, w: 0.04 },
        { x: -0.9, r: 0.35, w: 0.035 },
        { x: -0.1, r: 0.28, w: 0.03 },
        { x: 0.7, r: 0.32, w: 0.038 },
        { x: 1.5, r: 0.25, w: 0.032 },
        { x: 2.2, r: 0.3, w: 0.036 },
      ].map((rip, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={[rip.x, 0.02, -i * 0.25]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[rip.r, rip.r + rip.w, 64]} />
          <meshBasicMaterial color="#e0f0f0" />
        </mesh>
      ))}
    </group>
  );
}

function FlyingBirds({ weather }) {
  const ref = useRef(null);
  const targetsRef = useRef([
    new THREE.Vector3(-2, 2.2, -3.5),
    new THREE.Vector3(1, 2.5, -3),
    new THREE.Vector3(3, 2.0, -4),
  ]);
  const speedRef = useRef([0.025, 0.02, 0.03]);

  const wingGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.08, 0.04, 0.22, 0.01);
    shape.quadraticCurveTo(0.12, -0.01, 0, 0);
    return new THREE.ShapeGeometry(shape);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((bird, i) => {
      const pos = bird.position;
      const target = targetsRef.current[i];
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dz = target.z - pos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 0.3) {
        target.set(
          (Math.random() - 0.5) * 8,
          1.5 + Math.random() * 1.5,
          -2.5 - Math.random() * 3
        );
      }

      const spd = speedRef.current[i];
      pos.x += dx * spd;
      pos.y += dy * spd;
      pos.z += dz * spd;
      pos.y += Math.sin(t * 2 + i * 1.7) * 0.003;

      bird.rotation.y = Math.atan2(dx, dz);

      bird.children.forEach((wing) => {
        wing.rotation.z = Math.sin(t * 3 + i * 2.1) * 0.5;
      });
    });
  });

  if (weather === "rain") return null;

  return (
    <group ref={ref}>
      {[-2, 0.5, 3].map((x, i) => (
        <group key={i} position={[x, 2 + i * 0.3, -3]}>
          <mesh position={[-0.05, 0, 0]} geometry={wingGeo} scale={[-1, 1, 1]}>
            <meshBasicMaterial color="#1a2828" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.05, 0, 0]} geometry={wingGeo}>
            <meshBasicMaterial color="#1a2828" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ShorelineReeds({ weather }) {
  const groupRef = useRef(null);
  const reeds = [
    { x: -3.2, h: 1.1, lean: 0.03 },
    { x: -2.8, h: 1.3, lean: -0.02 },
    { x: -2.5, h: 1.0, lean: 0.04 },
    { x: -2.2, h: 1.2, lean: 0.01 },
    { x: 2.3, h: 1.15, lean: -0.03 },
    { x: 2.6, h: 1.25, lean: 0.02 },
    { x: 2.9, h: 1.05, lean: -0.04 },
    { x: 3.2, h: 1.3, lean: 0.01 },
    { x: 3.5, h: 1.1, lean: 0.03 },
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(t * 0.7 + i * 0.8) * 0.12;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.35, -2]}>
      {reeds.map((r, i) => (
        <group key={i} position={[r.x, 0, 0]} rotation={[0, 0, r.lean]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.03, r.h, 12]} />
            <meshStandardMaterial color="#3a5045" roughness={0.95} />
          </mesh>
          <mesh position={[0, r.h * 0.5, 0]}>
            <capsuleGeometry args={[0.04, 0.16, 6, 12]} />
            <meshStandardMaterial color="#8a7a50" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WindowLandscape({ weather, timeSlot }) {
  const skyColors = {
    dawn:  "#f8b888",
    day:   "#5ac8e8",
    dusk:  "#f09868",
    night: "#1a2840",
  };
  const skyColor = weather === "rain"
    ? (timeSlot === "night" ? "#142030" : "#6a8898")
    : weather === "overcast"
    ? (timeSlot === "night" ? "#1a2535" : "#8898a8")
    : skyColors[timeSlot] || skyColors.day;

  return (
    <group position={[0, 0, -4.95]}>
      <fog attach="fog" args={[skyColor, 2.5, 14]} />
      <SkyGradient color={skyColor} />
      <CloudLayer weather={weather} />
      <SunMoon timeSlot={timeSlot} />
      <AnimatedWater color={weather === "rain" ? "#4a98a8" : "#50b8d0"} position={[0, 0.08, -0.12]} size={[24, 12]} amplitude={0.06} speed={0.55} />
      <ExteriorWrap color={weather === "rain" ? "#2a3a40" : "#5a7a78"} />
      <mesh position={[0, 0.34, -0.98]}>
        <boxGeometry args={[16, 0.16, 0.42]} />
        <meshStandardMaterial color="#3a5a4a" roughness={0.96} />
      </mesh>
      <ShorelineReeds weather={weather} />
      <LayeredMountains timeSlot={timeSlot} weather={weather} />
      <group position={[-1.35, 0.3, -2.2]} scale={[0.42, 0.42, 0.42]}>
        <Pavilion />
      </group>
      <AnimatedTrees x={-5} z={-1.8} />
      <AnimatedTrees x={5.2} z={-1.6} mirrored />
      <WaveRipples weather={weather} />
      <FlyingBirds weather={weather} />
    </group>
  );
}

function ExteriorWrap({ color }) {
  const bushes = [
    { x: -3.4, y: 0.45, z: -0.3, r: 0.28 },
    { x: -3.7, y: 0.38, z: 0.1, r: 0.22 },
    { x: -4.0, y: 0.32, z: -0.15, r: 0.18 },
    { x: 3.4, y: 0.44, z: -0.25, r: 0.26 },
    { x: 3.75, y: 0.36, z: 0.15, r: 0.2 },
    { x: 4.0, y: 0.3, z: 0.0, r: 0.16 },
  ];

  const stones = [
    { x: -3.55, y: 0.06, z: 0.3, s: 0.1 },
    { x: -3.85, y: 0.05, z: -0.1, s: 0.08 },
    { x: 3.5, y: 0.06, z: 0.25, s: 0.09 },
    { x: 3.9, y: 0.05, z: -0.05, s: 0.07 },
  ];

  return (
    <group>
      {bushes.map((b, i) => (
        <mesh key={`bush-${i}`} position={[b.x, b.y, b.z]}>
          <sphereGeometry args={[b.r, 14, 12]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      ))}
      {stones.map((s, i) => (
        <mesh key={`stone-${i}`} position={[s.x, s.y, s.z]} rotation={[0.1, i * 1.2, 0.15]}>
          <dodecahedronGeometry args={[s.s, 0]} />
          <meshStandardMaterial color="#8a8a88" roughness={0.92} />
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
          <meshStandardMaterial color="#7e5638" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.49, -0.18]} castShadow receiveShadow>
          <boxGeometry args={[2.46, 0.1, 0.96]} />
          <meshStandardMaterial color="#c89868" roughness={0.68} />
        </mesh>
        <mesh position={[0, 0.57, -0.18]} castShadow receiveShadow>
          <boxGeometry args={[2.16, 0.035, 0.72]} />
          <meshStandardMaterial color="#4a3024" roughness={0.75} />
        </mesh>
        {[[-1.92, -0.08, -0.58], [1.92, -0.08, -0.58], [-1.92, -0.08, 0.58], [1.92, -0.08, 0.58]].map((position, index) => (
          <mesh key={index} position={position} castShadow>
            <boxGeometry args={[0.18, 0.76, 0.18]} />
            <meshStandardMaterial color="#5c3d26" roughness={0.8} />
          </mesh>
        ))}
        <TeaSetOnTray activeGesture={activeGesture} tableStyle={tableStyle} />
      </group>
    </Float>
  );
}

function TeaSetOnTray({ activeGesture, tableStyle }) {
  const isPouring = activeGesture === "pour";
  const isBrewing = activeGesture === "brew";
  const teapotGroupRef = useRef(null);
  const fairnessCupRef = useRef(null);
  const cup0Ref = useRef(null);
  const cup1Ref = useRef(null);
  const cup2Ref = useRef(null);
  const cup3Ref = useRef(null);
  const smellRef = useRef(0);
  const serveGuestRef = useRef(0);
  const pourRef = useRef(0);
  const serveRef = useRef(0);
  const fairnessCupLiquidRef = useRef(null);
  const fairnessCupSurfaceRef = useRef(null);
  const pourFillRef = useRef(0);

  // Cup flip state
  const flipProgress = useRef(0);
  const flippedPersisted = useRef(false); // persists flip after gesture changes
  const cupRefsAll = useRef([cup0Ref, cup1Ref, cup2Ref, cup3Ref]);
  const flippedState = useRef([false, false, false, false]);
  const filledState = useRef([false, false, false, false]);
  const liquidRefs = useRef([null, null, null, null]);

  // Distribute state
  const distributeTarget = useRef(-1);
  const distributeProgress = useRef(0);

  useFrame((state, delta) => {
    try {
      if (teapotGroupRef.current) {
        if (isPouring) {
          pourRef.current = Math.min(pourRef.current + delta * 0.7, 1);
        } else {
          pourRef.current = Math.max(pourRef.current - delta * 0.6, 0);
        }
        if (isBrewing) {
          teapotGroupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.8) * 0.06;
          teapotGroupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 1.26) * 0.035;
          teapotGroupRef.current.position.y = 0.23;
        } else if (pourRef.current > 0) {
          // Lift teapot up and tilt toward fairness cup
          const ease = 1 - Math.pow(1 - pourRef.current, 3);
          teapotGroupRef.current.position.y = 0.23 + ease * 0.22;
          teapotGroupRef.current.rotation.z = ease * 0.52;
          teapotGroupRef.current.rotation.x = ease * -0.12;
        } else {
          teapotGroupRef.current.rotation.z *= 0.92;
          teapotGroupRef.current.rotation.x *= 0.92;
          teapotGroupRef.current.position.y += (0.23 - teapotGroupRef.current.position.y) * 0.12;
          if (Math.abs(teapotGroupRef.current.rotation.z) < 0.005) teapotGroupRef.current.rotation.z = 0;
          if (Math.abs(teapotGroupRef.current.rotation.x) < 0.005) teapotGroupRef.current.rotation.x = 0;
        }
      }

      // Fairness cup fill — liquid rises from bottom, persists after pouring
      if (isPouring) {
        pourFillRef.current = Math.min(pourFillRef.current + delta * 0.25, 1);
      }
      // NOTE: no decay — once tea is poured, it stays in the cup
      if (fairnessCupLiquidRef.current) {
        const fill = pourFillRef.current;
        // Liquid body fills from bottom up (scale.y grows, position.y rises)
        fairnessCupLiquidRef.current.scale.y = 0.01 + fill * 0.9;
        fairnessCupLiquidRef.current.position.y = -0.13 + fill * 0.12;
        // Opacity and color
        fairnessCupLiquidRef.current.material.opacity = fill > 0.01 ? 0.78 : 0;
        fairnessCupLiquidRef.current.material.color.setHex(0xa07828);
      }
      // Liquid surface disc — fades in with the fill
      if (fairnessCupSurfaceRef.current) {
        const fill = pourFillRef.current;
        fairnessCupSurfaceRef.current.material.opacity = fill > 0.02 ? 0.65 : 0;
      }

      if (activeGesture === "smell") {
        smellRef.current = Math.min(smellRef.current + delta * 0.7, 1);
      } else {
        smellRef.current = Math.max(smellRef.current - delta * 0.6, 0);
      }

      if (activeGesture === "serveGuest") {
        serveGuestRef.current = Math.min(serveGuestRef.current + delta * 0.6, 1);
      } else {
        serveGuestRef.current = Math.max(serveGuestRef.current - delta * 0.5, 0);
      }

      if (activeGesture === "serve") {
        serveRef.current = Math.min(serveRef.current + delta * 0.7, 1);
      } else {
        serveRef.current = Math.max(serveRef.current - delta * 0.6, 0);
      }

      if (cup0Ref.current) {
        const easeSmell = 1 - Math.pow(1 - smellRef.current, 3);
        const easeServeGuest = 1 - Math.pow(1 - serveGuestRef.current, 3);
        const easeServe = 1 - Math.pow(1 - serveRef.current, 3);
        cup0Ref.current.position.y = 0.08 + easeSmell * 0.3;
        cup0Ref.current.position.z = 0.2 + easeServe * 0.15;
        const floatVal = serveGuestRef.current * Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
        cup0Ref.current.position.y += easeServeGuest * 0.45 + floatVal;
        cup0Ref.current.position.z += easeServeGuest * 0.4;
      }

      // Cup flip animation — toggle on flipCup, persist state when gesture changes
      if (activeGesture === "flipCup") {
        if (!flippedPersisted.current) {
          flipProgress.current = Math.min(flipProgress.current + delta * 0.8, 1);
          if (flipProgress.current >= 0.98) flippedPersisted.current = true;
        } else {
          flipProgress.current = Math.max(flipProgress.current - delta * 0.8, 0);
          if (flipProgress.current <= 0.02) flippedPersisted.current = false;
        }
      }

      // Apply flip rotation to all cups
      const easeFlip = 1 - Math.pow(1 - flipProgress.current, 3);
      const cupCount = tableStyle === "full" ? 4 : 2;
      for (let i = 0; i < cupCount; i++) {
        const ref = cupRefsAll.current[i];
        if (ref.current) {
          ref.current.rotation.x = Math.PI * (1 - easeFlip);
        }
        if (flipProgress.current >= 0.98 && !flippedState.current[i]) {
          flippedState.current[i] = true;
        } else if (flipProgress.current < 0.02 && flippedState.current[i]) {
          flippedState.current[i] = false;
        }
      }

      // Liquid level opacity animation
      for (let i = 0; i < cupCount; i++) {
        const liquidMesh = liquidRefs.current[i];
        if (liquidMesh) {
          const targetOpacity = flippedState.current[i] && filledState.current[i] ? 0.85 : 0;
          liquidMesh.material.opacity += (targetOpacity - liquidMesh.material.opacity) * delta * 3;
        }
      }

      // Fairness cup tilt for distribute
      if (fairnessCupRef.current) {
        if (distributeTarget.current >= 0) {
          distributeProgress.current = Math.min(distributeProgress.current + delta * 0.55, 1);
          const tiltEase = 1 - Math.pow(1 - distributeProgress.current, 2);
          fairnessCupRef.current.rotation.z = tiltEase * 0.28;

          if (distributeProgress.current >= 1) {
            filledState.current[distributeTarget.current] = true;
            distributeTarget.current = -1;
            distributeProgress.current = 0;
          }
        } else if (fairnessCupRef.current.rotation.z > 0.001) {
          fairnessCupRef.current.rotation.z *= 0.92;
          if (fairnessCupRef.current.rotation.z < 0.001) fairnessCupRef.current.rotation.z = 0;
        }
      }
    } catch (e) {
      // Prevent animation errors from crashing the render loop
    }
  });

  const handleCupClick = (cupIndex) => {
    if (activeGesture !== "distribute") return;
    if (!flippedState.current[cupIndex] || filledState.current[cupIndex] || distributeTarget.current >= 0) return;
    distributeTarget.current = cupIndex;
    distributeProgress.current = 0;
  };

  const spoutCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.21, 0.02, 0),
      new THREE.Vector3(-0.30, 0.06, 0),
      new THREE.Vector3(-0.38, 0.12, 0),
      new THREE.Vector3(-0.44, 0.20, 0),
    ]);
  }, []);

  return (
    <group position={[0, 0.58, -0.08]}>
      <group ref={teapotGroupRef} position={[0.78, 0.23, -0.08]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 24, 16]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.08, 24]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.38} />
        </mesh>
        <mesh position={[0.3, 0.02, -0.01]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.15, 0.025, 10, 24]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.38} />
        </mesh>
        <mesh castShadow>
          <tubeGeometry args={[spoutCurve, 20, 0.038, 10, false]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.38} />
        </mesh>
        <SteamParticles position={[0, 0.28, 0]} count={isBrewing ? 55 : 30} spread={0.1} riseSpeed={isBrewing ? 0.16 : 0.1} size={isBrewing ? 0.06 : 0.05} opacity={isBrewing ? 0.3 : 0.18} />
        <WarmWaterParticles active={activeGesture === 'brew' || activeGesture === 'rinseTea'} position={[0, 0.18, 0]} />
        <LeafDropParticles active={activeGesture === 'appreciateTea'} position={[0, 0.2, 0]} />
      </group>

      {/* Pour stream — tray level, spout tip position when teapot is fully tilted */}
      <TeaPourParticles position={[0.30, 0.39, -0.08]} active={isPouring} count={40} direction={[-0.35, 0.1, 0.02]} />

      {/* Fairness cup (公道杯) - separate ref for tilt animation */}
      <group ref={fairnessCupRef} position={[-0.05, 0.15, -0.06]}>
        {/* Cup body - glass transparent */}
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.08, 0.28, 24]} />
          <meshPhysicalMaterial
            color="#e8e4dc"
            transparent
            opacity={0.25}
            roughness={0.05}
            metalness={0.0}
            transmission={0.85}
            thickness={0.5}
            ior={1.5}
            envMapIntensity={0.6}
          />
        </mesh>
        {/* Tea liquid body — fills from bottom, persists after pouring */}
        <mesh ref={fairnessCupLiquidRef} position={[0, -0.13, 0]}>
          <cylinderGeometry args={[0.125, 0.065, 0.26, 20]} />
          <meshStandardMaterial color="#a07828" transparent opacity={0} roughness={0.12} />
        </mesh>
        {/* Liquid surface disc — visible fill line at the top of the liquid */}
        <mesh ref={fairnessCupSurfaceRef} position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.125, 20]} />
          <meshStandardMaterial color="#b88830" transparent opacity={0} roughness={0.08} side={THREE.DoubleSide} />
        </mesh>
        {/* Cup rim - thin torus at the top */}
        <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.012, 10, 24]} />
          <meshStandardMaterial color="#f0e8dc" roughness={0.15} />
        </mesh>
        {/* Spout - small protrusion on one side */}
        <mesh position={[0.15, 0.12, 0]} rotation={[0, 0, -0.3]}>
          <sphereGeometry args={[0.03, 10, 8]} />
          <meshStandardMaterial color="#f8f2ea" roughness={0.18} />
        </mesh>
        <SteamParticles position={[0, 0.22, 0]} count={isBrewing ? 38 : 20} spread={0.08} riseSpeed={isBrewing ? 0.13 : 0.08} size={isBrewing ? 0.05 : 0.04} opacity={isBrewing ? 0.26 : 0.14} />
        {/* Distribute particles */}
        <TeaDistributeParticles position={[-0.12, 0.1, 0]} active={distributeTarget.current >= 0} count={28} />
      </group>

      {/* 品茗杯 - inverted cups */}
      {[[-0.72, 0.08, 0.2], [-0.34, 0.08, 0.28], [0.27, 0.08, 0.27], [0.55, 0.08, 0.22]].slice(0, tableStyle === "full" ? 4 : 2).map((position, index) => (
        <group
          key={index}
          ref={cupRefsAll.current[index]}
          position={position}
        >
          <mesh
            castShadow
            rotation={[Math.PI, 0, 0]}
            onClick={(e) => { e.stopPropagation(); handleCupClick(index); }}
          >
            <cylinderGeometry args={[0.105, 0.13, 0.14, 24]} />
            <meshStandardMaterial color="#f8f2ea" roughness={0.2} />
          </mesh>
          {/* Cup rim — visible color band so flip is noticeable */}
          <mesh position={[0, -0.065, 0]} rotation={[Math.PI, 0, 0]}>
            <torusGeometry args={[0.105, 0.008, 8, 24]} />
            <meshStandardMaterial color="#c89868" roughness={0.3} />
          </mesh>
          {/* Saucer */}
          <mesh position={[0, 0.08, 0]} rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.088, 0.094, 0.015, 24]} />
            <meshStandardMaterial color="#c89868" emissive="#a07040" emissiveIntensity={0.08} roughness={0.35} />
          </mesh>
          {/* Tea liquid level */}
          <mesh ref={(el) => { liquidRefs.current[index] = el; }} position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.03, 20]} />
            <meshStandardMaterial color="#8a6a30" transparent opacity={0} roughness={0.15} />
          </mesh>
          <SteamParticles position={[0, 0.1, 0]} count={12} spread={0.05} riseSpeed={0.06} size={0.03} opacity={0.1} />
          <GestureGlowRing active={activeGesture === "distribute" && !flippedState.current[index] && !filledState.current[index]} position={[0, 0.02, 0]} />
          {index === 0 && (
            <>
              <GestureGlowRing active={activeGesture === "serve" || activeGesture === "smell" || activeGesture === "serveGuest"} position={[0, 0.02, 0]} />
              <AromaParticles position={[0, 0.12, 0]} active={activeGesture === "smell"} count={18} />
            </>
          )}
        </group>
      ))}

      {/* Additional tea utensils */}
      <TeaFilter position={[0.45, 0.05, -0.08]} />
      <WasteBowl position={[-1.0, 0.01, -0.38]} />
      <TeaCloth position={[0.85, 0.005, 0.35]} />
      <TeaPet position={[-0.9, 0.01, 0.35]} />
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
  const skyColor = weather === "rain" ? "#6a8898" : "#5ac8e8";
  return (
    <>
      <SharedLighting mood={mood} intensity={1.6} />
      {/* Background landscape */}
      <SkyGradient color={skyColor} />
      <LayeredMountains timeSlot="day" weather={weather} />
      {/* Ground and water */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.42, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#6a7b72" roughness={0.9} />
      </mesh>
      <AnimatedWater color={weather === "rain" ? "#6e8d97" : "#86a9b7"} />
      {/* Mid-ground mountains */}
      <Mountain position={[-5.4, 1.1, -7.8]} scale={[2.3, 2.5, 2.3]} color="#6e827f" />
      <Mountain position={[0.8, 1.35, -8.2]} scale={[2.8, 3.2, 2.7]} color="#778d8c" />
      <Mountain position={[5.7, 1, -7.5]} scale={[2.2, 2.4, 2.2]} color="#69807d" />
      <Pavilion />
      <TeaTable3D activeGesture={activeGesture} tableStyle={tableStyle} />
      <SilhouetteGuests perspective={perspective} sceneId="lakeside" occupancy={occupancy} />
      {perspective === "firstPerson" && (
        <>
          <FirstPersonTeaFocus active sceneId="lakeside" />
          <FirstPersonHands activeGesture={activeGesture} />
          <FirstPersonCup />
        </>
      )}
      <RainParticles visible={weather === "rain"} />
      <FloatingMotes color="#f9f4ea" count={140} area={[11, 3.4, 10]} speed={0.08} size={0.05} />
    </>
  );
}

function CourtyardScene({ mood, weather, perspective, activeGesture, tableStyle, occupancy }) {
  const skyColor = weather === "rain" ? "#6a8898" : "#78c8e0";
  return (
    <>
      <SharedLighting mood={mood} intensity={1.25} spotColor="#e7dccf" />
      {/* Background landscape */}
      <SkyGradient color={skyColor} />
      <LayeredMountains timeSlot="day" weather={weather} />
      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.36, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#556058" roughness={1} />
      </mesh>
      <CourtyardShelter />
      <StonePath />
      <BambooCluster x={-4.1} z={-1.7} />
      <BambooCluster x={4.2} z={-2.2} />
      {/* Mid-ground mountains */}
      <Mountain position={[-6.2, 1.4, -7.5]} scale={[2.8, 3.4, 2.8]} color="#58685e" />
      <Mountain position={[0.2, 1.8, -8.4]} scale={[3.4, 4.2, 3.4]} color="#65766b" />
      <Mountain position={[6.1, 1.2, -7.1]} scale={[2.4, 3, 2.4]} color="#536157" />
      {/* Distant bamboo */}
      <BambooCluster x={-6} z={-5.5} />
      <BambooCluster x={6.5} z={-5} />
      <TeaTable3D position={[0, 0.18, 0.6]} wood="#826450" tray="#c09068" activeGesture={activeGesture} tableStyle={tableStyle} />
      <SilhouetteGuests perspective={perspective} sceneId="courtyard" occupancy={occupancy} />
      {perspective === "firstPerson" && (
        <>
          <FirstPersonTeaFocus active sceneId="courtyard" />
          <FirstPersonHands activeGesture={activeGesture} />
          <FirstPersonCup />
        </>
      )}
      <RainParticles visible={weather === "rain"} area={[11, 7.5, 11]} />
      <FloatingMotes color="#dfe8dd" count={120} area={[9, 4, 9]} speed={0.11} size={0.04} />
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
      {perspective === "firstPerson" && <FirstPersonHands activeGesture={activeGesture} />}
      <RainParticles visible={weather === "rain"} area={[6.5, 4.6, 3.2]} size={0.026} opacity={0.34} />
      <FloatingMotes color="#f4e2cb" count={180} area={[7.2, 3.2, 4.5]} speed={0.1} size={0.038} />
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

export function TeaSceneCanvas({ scene, weather, perspective, mood, activeGesture, tableStyle, occupancy, timeSlot, onSceneLoaded }) {
  const [fov] = useState(() => {
    if (typeof window === "undefined") return 42;
    return window.innerWidth < 720 ? 62 : window.innerWidth < 1100 ? 52 : 42;
  });

  const handleCreated = useMemo(() => {
    return () => { if (onSceneLoaded) onSceneLoaded(); };
  }, [onSceneLoaded]);

  return (
    <div className="tea-scene-canvas">
      <Canvas shadows gl={{ antialias: true, alpha: false }} camera={{ position: [0, 1.25, 5.6], fov }} onCreated={handleCreated}>
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
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.45}
          minPolarAngle={Math.PI / 4.5}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={2.5}
          maxDistance={9}
        />
      </Canvas>
    </div>
  );
}
