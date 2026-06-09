import React, { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";

// Child component to manage WebGL lighting and fog transitions
function SceneSettings({ themeMode }) {
  const { scene } = useThree();
  const ambientRef = useRef();
  const hemisphereRef = useRef();
  const dirLightRef = useRef();

  useEffect(() => {
    if (!scene) return;

    const isNight = themeMode === "night";

    // Target light intensities
    const targetAmbient = isNight ? 0.25 : 0.7;
    const targetHemisphere = isNight ? 0.15 : 0.5;
    const targetDir = isNight ? 0.35 : 1.25;

    // Target light colors
    const dirColor = isNight ? "#93c5fd" : "#ffffff"; // Cool blue moon vs warm white sun
    const targetDirColor = new THREE.Color(dirColor);

    // Animate intensities
    gsap.to(ambientRef.current, { intensity: targetAmbient, duration: 1.5, ease: "power2.out" });
    gsap.to(hemisphereRef.current, { intensity: targetHemisphere, duration: 1.5, ease: "power2.out" });
    gsap.to(dirLightRef.current, { intensity: targetDir, duration: 1.5, ease: "power2.out" });

    // Animate sun/moon light color
    gsap.to(dirLightRef.current.color, {
      r: targetDirColor.r,
      g: targetDirColor.g,
      b: targetDirColor.b,
      duration: 1.5,
      ease: "power2.out"
    });

    // Animate background and fog color
    const bgHex = isNight ? "#090d16" : "#e0f2fe";
    const targetBgColor = new THREE.Color(bgHex);

    if (scene.background) {
      gsap.to(scene.background, {
        r: targetBgColor.r,
        g: targetBgColor.g,
        b: targetBgColor.b,
        duration: 1.5,
        ease: "power2.out"
      });
    }

    if (scene.fog) {
      gsap.to(scene.fog.color, {
        r: targetBgColor.r,
        g: targetBgColor.g,
        b: targetBgColor.b,
        duration: 1.5,
        ease: "power2.out"
      });
      // Tighten fog distance slightly at night for mood
      gsap.to(scene.fog, {
        near: isNight ? 12 : 20,
        far: isNight ? 45 : 60,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }, [themeMode, scene]);

  return (
    <>
      {/* 1. Ambient lighting */}
      <ambientLight ref={ambientRef} intensity={0.7} />

      {/* 2. Sky reflections */}
      <hemisphereLight
        ref={hemisphereRef}
        args={["#e0f2fe", "#bbf7d0", 0.5]}
        position={[0, 50, 0]}
      />

      {/* 3. Main Sun / Moon directional light */}
      <directionalLight
        ref={dirLightRef}
        castShadow
        position={[25, 40, 20]}
        intensity={1.25}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={120}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0001}
      />
    </>
  );
}

export default function ThreeCanvas({ children, themeMode }) {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        camera={{ position: [0, 15, 20], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Set initial background and fog */}
        <color attach="background" args={["#e0f2fe"]} />
        <fog attach="fog" args={["#e0f2fe", 20, 60]} />

        {/* Dynamic Light and Sky Controller */}
        <SceneSettings themeMode={themeMode} />

        {/* Auxiliary static fill light */}
        <directionalLight position={[-15, 15, -15]} intensity={0.25} color="#94a3b8" />

        {children}
      </Canvas>
    </div>
  );
}
