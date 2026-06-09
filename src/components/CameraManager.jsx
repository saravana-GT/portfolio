import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";

// Custom cinematic camera positions and lookAt targets for each district index
const CAMERA_ANGLES = [
  {
    // Intro
    pos: [0, 4, 10],
    lookAt: [0, 1, 0]
  },
  {
    // About Me
    pos: [15 - 5, 3.5, -10 + 7],
    lookAt: [15, 1, -10]
  },
  {
    // Education
    pos: [30 - 6, 4.5, -20 + 8],
    lookAt: [30, 1.6, -20]
  },
  {
    // Skills
    pos: [45 - 2, 6.0, -10 + 9],
    lookAt: [45, 1.2, -10]
  },
  {
    // Projects
    pos: [55 - 4, 4.2, 10 + 8],
    lookAt: [55, 1.3, 10]
  },
  {
    // Contact
    pos: [35 - 5, 5.0, 25 + 7],
    lookAt: [35, 1.8, 25]
  },
  {
    // Central Skyscraper (Final View Initial Setup)
    pos: [20 - 10, 8.0, 8 + 12],
    lookAt: [20, 2.0, 8]
  }
];

export default function CameraManager({ activeIndex, isCompleted }) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(...CAMERA_ANGLES[0].lookAt));
  const flyoverAngle = useRef(0);

  useEffect(() => {
    // Determine active setup
    const index = Math.min(activeIndex, CAMERA_ANGLES.length - 1);
    const targetConfig = CAMERA_ANGLES[index];

    if (!targetConfig) return;

    // Use GSAP to animate camera position smoothly
    gsap.to(camera.position, {
      x: targetConfig.pos[0],
      y: targetConfig.pos[1],
      z: targetConfig.pos[2],
      duration: 2.8,
      ease: "power2.inOut"
    });

    // Use GSAP to animate lookAt target point smoothly
    gsap.to(lookAtTarget.current, {
      x: targetConfig.lookAt[0],
      y: targetConfig.lookAt[1],
      z: targetConfig.lookAt[2],
      duration: 2.8,
      ease: "power2.inOut"
    });
  }, [activeIndex, camera]);

  useFrame((state, delta) => {
    if (isCompleted && activeIndex >= 6) {
      // Sweeping circular flyover around Central Landmark [20, 0, 8]
      flyoverAngle.current += delta * 0.15; // Slow rotation speed

      const radius = 16;
      const targetX = 20 + Math.sin(flyoverAngle.current) * radius;
      const targetZ = 8 + Math.cos(flyoverAngle.current) * radius;
      const targetY = 6.5 + Math.sin(flyoverAngle.current * 0.5) * 2.0;

      // Smoothly lerp camera position during flyover
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 2 * delta);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 2 * delta);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 2 * delta);

      // Lock lookAt target to the central tower
      lookAtTarget.current.set(20, 2.5, 8);
    }

    // Force camera to look at the animated lookAt target vector
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
