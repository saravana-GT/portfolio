import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { soundManager } from "../utils/soundManager";

// 1. Clash of Clans Stylized Pine Tree Component
function CoCTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#5c3f24" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.32, 0.5, 6]} />
        <meshStandardMaterial color="#14532d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <coneGeometry args={[0.26, 0.4, 6]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.88, 0]} castShadow>
        <coneGeometry args={[0.18, 0.3, 6]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>
    </group>
  );
}

// 2. Sailboat
function SailBoat({ position }) {
  const boatRef = useRef();

  useFrame((state) => {
    if (boatRef.current) {
      const time = state.clock.getElapsedTime();
      boatRef.current.position.y = position[1] + Math.sin(time * 1.3) * 0.08;
      boatRef.current.rotation.z = Math.sin(time * 0.9) * 0.05;
      boatRef.current.rotation.y = Math.cos(time * 0.4) * 0.06;
    }
  });

  return (
    <group ref={boatRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.22, 0.5]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.05, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <boxGeometry args={[0.4, 0.22, 0.5]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[-0.7, 0.05, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <boxGeometry args={[0.4, 0.22, 0.5]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.1]} />
        <meshStandardMaterial color="#5c3f24" />
      </mesh>
      <mesh position={[-0.15, 0.68, 0]} castShadow>
        <boxGeometry args={[0.35, 0.7, 0.02]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 3. Wooden Bridge
function WoodenBridge({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.08, 1.8]} />
        <meshStandardMaterial color="#854d0e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.2, -0.85]} castShadow>
        <boxGeometry args={[2.0, 0.05, 0.08]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[-0.8, 0.08, -0.85]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.35]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.8, 0.08, -0.85]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.35]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 0.2, 0.85]} castShadow>
        <boxGeometry args={[2.0, 0.05, 0.08]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[-0.8, 0.08, 0.85]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.35]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.8, 0.08, 0.85]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.35]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  );
}

// 4. Fluffy Cloud Dissolving Fog of War (Megam)
function DistrictCloud({ position, isLocked }) {
  const groupRef = useRef();
  const currentScale = useRef(1);

  useFrame((state, delta) => {
    const targetScale = isLocked ? 1 : 0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 4.0 * delta);

    if (groupRef.current) {
      groupRef.current.scale.set(currentScale.current, currentScale.current, currentScale.current);
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8 + position[0]) * 0.15;
    }
  });

  if (currentScale.current < 0.01 && !isLocked) return null;

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      <mesh castShadow>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.8, -0.15, 0]} castShadow>
        <sphereGeometry args={[0.8, 10, 10]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.8, -0.15, 0]} castShadow>
        <sphereGeometry args={[0.8, 10, 10]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.7, 10, 10]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -0.15, 0.7]} castShadow>
        <sphereGeometry args={[0.65, 8, 8]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -0.15, -0.7]} castShadow>
        <sphereGeometry args={[0.65, 8, 8]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// 5. Interactive Elixir/Skills Collector (Clash of Clans style)
function SkillCollector({ position, soundEnabled }) {
  const [bubbles, setBubbles] = useState([]);
  const collectorRef = useRef();

  useFrame((state) => {
    if (collectorRef.current) {
      // Gentle floating animation of the pump head
      const time = state.clock.getElapsedTime();
      collectorRef.current.position.y = 0.55 + Math.sin(time * 3) * 0.03;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    
    // Play Clash of Clans bubble collect sound
    soundManager.playCollectSFX();

    // Spawn a floating skill bubble
    const skillsList = ["Java", "C", "HTML", "CSS", "MySQL", "Git", "EEE", "VS Code"];
    const randomSkill = skillsList[Math.floor(Math.random() * skillsList.length)];
    const bubbleId = Date.now() + Math.random();

    setBubbles((prev) => [
      ...prev,
      { id: bubbleId, text: `+10 ${randomSkill}`, offset: [0, 1.2, 0] }
    ]);

    // Cleanup bubble after animation ends (1.2 seconds)
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
    }, 1200);
  };

  return (
    <group position={position}>
      {/* Stone Base */}
      <mesh castShadow receiveShadow onClick={handleClick}>
        <boxGeometry args={[0.9, 0.15, 0.9]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Glass Tank Container */}
      <mesh position={[0, 0.28, 0]} castShadow onClick={handleClick}>
        <cylinderGeometry args={[0.3, 0.3, 0.42, 12]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.4} roughness={0.1} />
      </mesh>

      {/* Purple Elixir (Fluid Core) */}
      <mesh position={[0, 0.24, 0]} onClick={handleClick}>
        <cylinderGeometry args={[0.27, 0.27, 0.34, 12]} />
        <meshStandardMaterial 
          color="#d8b4fe" 
          emissive="#a855f7" 
          emissiveIntensity={0.8} 
          roughness={0.2} 
        />
      </mesh>

      {/* Golden Pump Cap (Rigged for animation) */}
      <group ref={collectorRef} position={[0, 0.55, 0]} onClick={handleClick}>
        {/* Cap lid */}
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.08, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Pump handle */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.08, 0.18, 0.08]} />
          <meshStandardMaterial color="#ca8a04" />
        </mesh>
      </group>

      {/* Render Floating HTML Bubbles */}
      {bubbles.map((bubble) => (
        <Html key={bubble.id} position={[0, 1.2, 0]} center>
          <div className="floating-skill-bubble">
            {bubble.text}
          </div>
        </Html>
      ))}
    </group>
  );
}

// 6. Windmill Component
function Windmill({ position }) {
  const bladesRef = useRef();

  useFrame((state, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.08, 2, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1, 0.08]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <group ref={bladesRef} position={[0, 1, 0.12]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.05, 0.8, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.34, -0.2, 0]} rotation={[0, 0, Math.PI * 2 / 3]} castShadow>
          <boxGeometry args={[0.05, 0.8, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.34, -0.2, 0]} rotation={[0, 0, -Math.PI * 2 / 3]} castShadow>
          <boxGeometry args={[0.05, 0.8, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

// 7. District Component
function District({ 
  position, 
  isUnlocked, 
  children, 
  districtIndex,
  currentDistrictIndex
}) {
  const lightRef = useRef();
  const activationRatio = useRef(0);

  useFrame((state, delta) => {
    const targetRatio = isUnlocked ? 1 : 0.1;
    activationRatio.current = THREE.MathUtils.lerp(activationRatio.current, targetRatio, 4 * delta);

    if (lightRef.current) {
      lightRef.current.intensity = activationRatio.current * 1.6;
    }
  });

  return (
    <group position={position}>
      <pointLight 
        ref={lightRef} 
        color="#0ea5e9" 
        distance={12} 
        intensity={0} 
        position={[0, 4, 0]} 
        castShadow
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.8, 2.0, 32]} />
        <meshBasicMaterial 
          color={isUnlocked ? "#0ea5e9" : "#64748b"} 
          transparent 
          opacity={isUnlocked ? 0.9 : 0.2} 
        />
      </mesh>

      <mesh receiveShadow position={[0, -0.05, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.15, 16]} />
        <meshStandardMaterial color={isUnlocked ? "#ffffff" : "#cbd5e1"} roughness={0.7} />
      </mesh>

      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activationRatio: activationRatio.current });
        }
        return child;
      })}
    </group>
  );
}

// Main CityMap Export
export default function CityMap({ unlockedIndex, currentDistrictIndex, themeMode, soundEnabled }) {
  const gradCapRef = useRef();
  const waveRef1 = useRef();
  const waveRef2 = useRef();

  useFrame((state, delta) => {
    if (gradCapRef.current) {
      gradCapRef.current.rotation.y += delta * 0.8;
      gradCapRef.current.position.y = 2.0 + Math.sin(state.clock.getElapsedTime() * 2) * 0.12;
    }

    if (waveRef1.current) {
      waveRef1.current.scale.x += delta * 1.5;
      waveRef1.current.scale.y += delta * 1.5;
      waveRef1.current.material.opacity = Math.max(0, 1 - waveRef1.current.scale.x / 4);
      if (waveRef1.current.scale.x >= 4) {
        waveRef1.current.scale.set(0.1, 0.1, 0.1);
      }
    }
    if (waveRef2.current) {
      waveRef2.current.scale.x += delta * 1.5;
      waveRef2.current.scale.y += delta * 1.5;
      waveRef2.current.material.opacity = Math.max(0, 1 - waveRef2.current.scale.x / 4);
      if (waveRef2.current.scale.x >= 4) {
        waveRef2.current.scale.set(0.1, 0.1, 0.1);
      }
    }
  });

  const borderTrees = [
    [-15, 0, -40], [-13, 0, -35], [-16, 0, -30], [-14, 0, -25], [-17, 0, -20],
    [-15, 0, -15], [-13, 0, -10], [-16, 0, -5],  [-14, 0, 0],   [-17, 0, 5],
    [-15, 0, 10],  [-13, 0, 15],  [-16, 0, 20],  [-14, 0, 25],  [-17, 0, 30],
    [-15, 0, 35],  [-13, 0, 40],
    [75, 0, -40], [77, 0, -35], [74, 0, -30], [76, 0, -25], [73, 0, -20],
    [75, 0, -15], [77, 0, -10], [74, 0, -5],  [76, 0, 0],   [73, 0, 5],
    [75, 0, 10],  [77, 0, 15],  [74, 0, 20],  [76, 0, 25],  [73, 0, 30],
    [75, 0, 35],  [77, 0, 40],
    [-10, 0, -45], [-5, 0, -43], [0, 0, -45],  [5, 0, -42],  [10, 0, -45],
    [20, 0, -44],  [25, 0, -46], [35, 0, -43], [40, 0, -45], [50, 0, -44],
    [55, 0, -46],  [60, 0, -43], [65, 0, -45], [70, 0, -44],
    [-10, 0, 43], [-5, 0, 45], [0, 0, 42],  [5, 0, 45],  [10, 0, 43],
    [20, 0, 44],  [25, 0, 42], [35, 0, 45], [40, 0, 43], [50, 0, 45],
    [55, 0, 42],  [60, 0, 44], [65, 0, 43], [70, 0, 45],
    [5, 0, -20],  [8, 0, -23],  [25, 0, 3],  [22, 0, 30],  [48, 0, 28]
  ];

  const isNight = themeMode === "night";

  return (
    <group>
      {/* 1. Clash of Clans Grass Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, -0.15, 0]} receiveShadow>
        <planeGeometry args={[120, 100]} />
        <meshStandardMaterial color="#16a34a" roughness={0.9} />
      </mesh>

      {/* Earthy Grid Helper overlay */}
      <gridHelper 
        args={[150, 75, "#14532d", "#15803d"]} 
        position={[20, -0.13, 0]} 
      />

      {/* Lush Green Park clearings */}
      <mesh receiveShadow position={[12, -0.14, 15]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
      <mesh receiveShadow position={[42, -0.14, -25]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>

      {/* Forest border pine trees */}
      {borderTrees.map((treePos, idx) => (
        <CoCTree 
          key={idx} 
          position={treePos} 
          scale={0.8 + Math.sin(idx * 0.45) * 0.2}
        />
      ))}

      {/* 2. Water River System */}
      <mesh position={[22, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 100]} />
        <meshStandardMaterial color={isNight ? "#0369a1" : "#0ea5e9"} roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Wooden Bridges at river crossings */}
      <WoodenBridge position={[22.5, -0.08, -15]} rotation={[0, -Math.atan2(-10, 15), 0]} />
      <WoodenBridge position={[27.5, -0.08, 16.5]} rotation={[0, -Math.atan2(-17, -15), 0]} />

      {/* Bobbing Sailboats */}
      <SailBoat position={[22, -0.08, 5]} />
      <SailBoat position={[22, -0.08, -32]} />


      {/* 3. Road Network */}
      <mesh position={[7.5, -0.12, -5]} rotation={[0, -Math.atan2(-10, 15), 0]} receiveShadow>
        <boxGeometry args={[18, 0.02, 1.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      <mesh position={[22.5, -0.12, -15]} rotation={[0, -Math.atan2(-10, 15), 0]} receiveShadow>
        <boxGeometry args={[18, 0.02, 1.2]} />
        <meshStandardMaterial color={unlockedIndex >= 2 ? "#78350f" : "#a16207"} roughness={0.9} />
      </mesh>
      <mesh position={[37.5, -0.12, -15]} rotation={[0, -Math.atan2(10, 15), 0]} receiveShadow>
        <boxGeometry args={[18, 0.02, 1.2]} />
        <meshStandardMaterial color={unlockedIndex >= 3 ? "#78350f" : "#a16207"} roughness={0.9} />
      </mesh>
      <mesh position={[50, -0.12, 0]} rotation={[0, -Math.atan2(20, 10), 0]} receiveShadow>
        <boxGeometry args={[22.3, 0.02, 1.2]} />
        <meshStandardMaterial color={unlockedIndex >= 4 ? "#78350f" : "#a16207"} roughness={0.9} />
      </mesh>
      <mesh position={[45, -0.12, 17.5]} rotation={[0, -Math.atan2(15, -20), 0]} receiveShadow>
        <boxGeometry args={[25, 0.02, 1.2]} />
        <meshStandardMaterial color={unlockedIndex >= 5 ? "#78350f" : "#a16207"} roughness={0.9} />
      </mesh>
      <mesh position={[27.5, -0.12, 16.5]} rotation={[0, -Math.atan2(-17, -15), 0]} receiveShadow>
        <boxGeometry args={[22.6, 0.02, 1.2]} />
        <meshStandardMaterial color={unlockedIndex >= 5 ? "#78350f" : "#a16207"} roughness={0.9} />
      </mesh>

      {/* Glowing pathway markers */}
      <group position={[0, -0.1, 0]}>
        <mesh position={[7.5, 0, -5]} rotation={[0, -Math.atan2(-10, 15), 0]}>
          <boxGeometry args={[18, 0.01, 0.08]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.8} />
        </mesh>
        <mesh position={[22.5, 0, -15]} rotation={[0, -Math.atan2(-10, 15), 0]}>
          <boxGeometry args={[18, 0.01, 0.08]} />
          <meshBasicMaterial 
            color={unlockedIndex >= 2 ? "#0ea5e9" : "#a16207"} 
            transparent 
            opacity={unlockedIndex >= 2 ? 0.8 : 0.2} 
          />
        </mesh>
        <mesh position={[37.5, 0, -15]} rotation={[0, -Math.atan2(10, 15), 0]}>
          <boxGeometry args={[18, 0.01, 0.08]} />
          <meshBasicMaterial 
            color={unlockedIndex >= 3 ? "#0ea5e9" : "#a16207"} 
            transparent 
            opacity={unlockedIndex >= 3 ? 0.8 : 0.2} 
          />
        </mesh>
        <mesh position={[50, 0, 0]} rotation={[0, -Math.atan2(20, 10), 0]}>
          <boxGeometry args={[22.3, 0.01, 0.08]} />
          <meshBasicMaterial 
            color={unlockedIndex >= 4 ? "#0ea5e9" : "#a16207"} 
            transparent 
            opacity={unlockedIndex >= 4 ? 0.8 : 0.2} 
          />
        </mesh>
        <mesh position={[45, 0, 17.5]} rotation={[0, -Math.atan2(15, -20), 0]}>
          <boxGeometry args={[25, 0.01, 0.08]} />
          <meshBasicMaterial 
            color={unlockedIndex >= 5 ? "#0ea5e9" : "#a16207"} 
            transparent 
            opacity={unlockedIndex >= 5 ? 0.8 : 0.2} 
          />
        </mesh>
        <mesh position={[27.5, 0, 16.5]} rotation={[0, -Math.atan2(-17, -15), 0]}>
          <boxGeometry args={[22.6, 0.01, 0.08]} />
          <meshBasicMaterial 
            color={unlockedIndex >= 5 ? "#0ea5e9" : "#a16207"} 
            transparent 
            opacity={unlockedIndex >= 5 ? 0.8 : 0.2} 
          />
        </mesh>
      </group>


      {/* 4. DISTRICTS SETUP */}
      
      {/* 4.0 INTRODUCTION DISTRICT (City Entrance) */}
      <District 
        position={[0, 0, 0]} 
        isUnlocked={true} 
        districtIndex={0}
        currentDistrictIndex={currentDistrictIndex}
      >
        <mesh position={[-1.2, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[1.2, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.85, 0]} castShadow>
          <boxGeometry args={[2.7, 0.2, 0.3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[1.8, 0.5, 0.1]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={isNight ? 0.8 : 0.3} />
        </mesh>
      </District>

      {/* 4.1 ABOUT ME DISTRICT (The Library) */}
      <District 
        position={[15, 0, -10]} 
        isUnlocked={unlockedIndex >= 1} 
        districtIndex={1}
        currentDistrictIndex={currentDistrictIndex}
      >
        <mesh position={[-0.6, 0.6, -0.6]} castShadow>
          <boxGeometry args={[1.4, 1.2, 1.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        {/* Night Windows: Glow when night & unlocked */}
        {isNight && unlockedIndex >= 1 && (
          <group position={[-0.6, 0.6, -0.6]}>
            <mesh position={[0, 0.15, 0.71]}>
              <boxGeometry args={[0.5, 0.3, 0.01]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <mesh position={[0.71, 0.15, 0]}>
              <boxGeometry args={[0.01, 0.3, 0.5]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          </group>
        )}

        <mesh position={[-0.6, 1.35, -0.6]} castShadow>
          <coneGeometry args={[0.9, 0.5, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.75} roughness={0.1} />
        </mesh>
        
        <group position={[0.9, 0, 0.8]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.9} />
          </mesh>
        </group>
        <group position={[1.1, 0, -0.8]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 1.0, 8]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.9} />
          </mesh>
        </group>
      </District>

      {/* 4.2 EDUCATION DISTRICT (MCET Campus Square) */}
      <District 
        position={[30, 0, -20]} 
        isUnlocked={unlockedIndex >= 2} 
        districtIndex={2}
        currentDistrictIndex={currentDistrictIndex}
      >
        <mesh position={[0, 0.8, -0.5]} castShadow>
          <boxGeometry args={[2.2, 1.6, 1.0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        {/* Night Windows */}
        {isNight && unlockedIndex >= 2 && (
          <group>
            <mesh position={[-0.4, 0.9, 0.01]} castShadow={false}>
              <boxGeometry args={[0.22, 0.35, 0.02]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <mesh position={[0.4, 0.9, 0.01]} castShadow={false}>
              <boxGeometry args={[0.22, 0.35, 0.02]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          </group>
        )}

        <mesh position={[-0.8, 1.9, -0.5]} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.5]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
        </mesh>
        <mesh position={[-0.8, 2.5, -0.5]} castShadow>
          <coneGeometry args={[0.15, 0.6, 4]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.1} />
        </mesh>
        <mesh position={[0.4, 0.35, 0.01]} castShadow>
          <boxGeometry args={[0.6, 0.7, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        <group ref={gradCapRef} position={[0.6, 2.0, 0.4]}>
          <mesh position={[0, 0.1, 0]} rotation={[0.1, 0, 0.1]} castShadow>
            <boxGeometry args={[0.5, 0.02, 0.5]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 0.18, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[0.18, 0.06, 0.18]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        </group>
      </District>

      {/* 4.3 SKILLS DISTRICT (The Tech Power Grid - EEE themed + Elixir Collector) */}
      <District 
        position={[45, 0, -10]} 
        isUnlocked={unlockedIndex >= 3} 
        districtIndex={3}
        currentDistrictIndex={currentDistrictIndex}
      >
        <mesh position={[0, 0.4, -0.5]} castShadow>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} />
        </mesh>
        <mesh position={[-0.3, 0.9, -0.5]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 10]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.3, 0.9, -0.5]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 10]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>

        <group position={[-1.2, 0.25, 0.8]} rotation={[0.4, -Math.PI / 4, 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.05, 0.6]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.2, 0]} rotation={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>

        <Windmill position={[1.2, 0.9, 0.6]} />

        {/* Floating Skill Crystals */}
        <group position={[0, 1.8, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.22]} />
            <meshStandardMaterial 
              color="#0ea5e9" 
              emissive="#0284c7" 
              emissiveIntensity={isNight ? 1.0 : 0.2} 
              roughness={0.1} 
            />
          </mesh>
        </group>

        {/* Clash of Clans Elixir Skill Collector (Only active when district is unlocked) */}
        {unlockedIndex >= 3 && (
          <SkillCollector position={[0, 0.1, 0.8]} soundEnabled={soundEnabled} />
        )}
      </District>

      {/* 4.4 PROJECTS DISTRICT (Smart Showcase Center) */}
      <District 
        position={[55, 0, 10]} 
        isUnlocked={unlockedIndex >= 4} 
        districtIndex={4}
        currentDistrictIndex={currentDistrictIndex}
      >
        <mesh position={[0, 0.1, -0.4]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.9, 0.2, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        
        <mesh position={[0, 1.1, -0.6]} castShadow>
          <boxGeometry args={[2.5, 1.5, 0.15]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.7} roughness={0.1} />
        </mesh>
        
        <mesh position={[-0.7, 1.1, -0.5]} rotation={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.9, 0.6, 0.08]} />
          <meshStandardMaterial 
            color="#0284c7" 
            emissive="#0284c7" 
            emissiveIntensity={isNight ? 1.0 : 0.2} 
          />
        </mesh>
        <mesh position={[0.7, 1.1, -0.5]} rotation={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.9, 0.6, 0.08]} />
          <meshStandardMaterial 
            color="#0369a1" 
            emissive="#0369a1" 
            emissiveIntensity={isNight ? 1.0 : 0.2} 
          />
        </mesh>
      </District>

      {/* 4.5 CONTACT DISTRICT (Telecom Tower) */}
      <District 
        position={[35, 0, 25]} 
        isUnlocked={unlockedIndex >= 5} 
        districtIndex={5}
        currentDistrictIndex={currentDistrictIndex}
      >
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.9, 0.8, 0.9]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.25, 1.8, 4]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>

        <mesh position={[0, 2.7, 0]} castShadow>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={isNight ? 1.5 : 0.6} />
        </mesh>

        <mesh ref={waveRef1} position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.24, 32]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={waveRef2} position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.5, 0.5, 0.5]}>
          <ringGeometry args={[0.2, 0.24, 32]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </District>

      {/* 4.6 CENTRAL LANDMARK (Futuristic Sky Tower) */}
      <group position={[20, 0, 8]}>
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[3.2, 3.4, 0.2, 16]} />
          <meshStandardMaterial color={unlockedIndex >= 5 ? "#ffffff" : "#cbd5e1"} roughness={0.5} />
        </mesh>

        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1.2, 5.0, 6]} />
          <meshStandardMaterial 
            color={unlockedIndex >= 5 ? "#ffffff" : "#e2e8f0"} 
            roughness={0.2}
            metalness={0.2}
          />
        </mesh>

        <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 6, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1.22, 4.4, 6]} openEnded />
          <meshStandardMaterial 
            color="#bae6fd" 
            transparent 
            opacity={unlockedIndex >= 5 ? 0.75 : 0.15} 
            roughness={0.05} 
          />
        </mesh>

        <mesh position={[0, 5.6, 0]} castShadow>
          <coneGeometry args={[0.08, 1.2, 6]} />
          <meshStandardMaterial 
            color="#0ea5e9" 
            emissive={unlockedIndex >= 5 ? "#0ea5e9" : "#64748b"} 
            emissiveIntensity={unlockedIndex >= 5 ? 1.0 : 0.1} 
          />
        </mesh>

        {unlockedIndex >= 5 && (
          <pointLight color="#0ea5e9" distance={15} intensity={1.8} position={[0, 6.2, 0]} />
        )}
      </group>


      {/* 5. DISSOLVING CLOUDS (MEGAM FOG OF WAR SYSTEM) */}
      <DistrictCloud position={[15, 3.5, -10]} isLocked={unlockedIndex < 1} />
      <DistrictCloud position={[30, 3.5, -20]} isLocked={unlockedIndex < 2} />
      <DistrictCloud position={[45, 3.5, -10]} isLocked={unlockedIndex < 3} />
      <DistrictCloud position={[55, 3.5, 10]} isLocked={unlockedIndex < 4} />
      <DistrictCloud position={[35, 3.5, 25]} isLocked={unlockedIndex < 5} />
      <DistrictCloud position={[20, 4.0, 8]} isLocked={unlockedIndex < 5} />

    </group>
  );
}
