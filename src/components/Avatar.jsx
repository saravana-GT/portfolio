import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Avatar({ 
  targetPosition = [0, 0, 0], 
  isPresenting = false, 
  onArrived,
  themeMode = "day",
  outfit = "traditional" // 'traditional', 'eee', or 'hoodie'
}) {
  const avatarRef = useRef();
  
  // Bone / joint references
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftFootRef = useRef();
  const rightFootRef = useRef();
  const headRef = useRef();
  const bodyRef = useRef();
  const dhotiRef = useRef();

  // Animation states
  const [isWalking, setIsWalking] = useState(false);
  const walkTime = useRef(0);
  const idleTime = useRef(0);
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetPosVec = useRef(new THREE.Vector3(...targetPosition));

  // Update target vector when prop changes
  useEffect(() => {
    targetPosVec.current.set(...targetPosition);
  }, [targetPosition]);

  useFrame((state, delta) => {
    if (!avatarRef.current) return;

    const lerpSpeed = 2.5; // Walking speed
    const rotationSpeed = 6;
    const pos = avatarRef.current.position;
    
    // Calculate distance to target
    const dist = pos.distanceTo(targetPosVec.current);

    if (dist > 0.1) {
      // 1. Walking State
      if (!isWalking) {
        setIsWalking(true);
      }

      pos.lerp(targetPosVec.current, lerpSpeed * delta);
      currentPos.current.copy(pos);

      // Rotate towards movement direction
      const dir = new THREE.Vector3()
        .copy(targetPosVec.current)
        .sub(pos)
        .normalize();
      
      const targetAngle = Math.atan2(dir.x, dir.z);
      let diff = targetAngle - avatarRef.current.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      avatarRef.current.rotation.y += diff * rotationSpeed * delta;

      walkTime.current += delta * 10;
      
      // Arm swing (If night and holding torch in right arm, we hold right arm forward slightly!)
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(walkTime.current) * 0.6;
        leftArmRef.current.rotation.z = Math.abs(Math.sin(walkTime.current)) * 0.1 + 0.1;
      }
      if (rightArmRef.current) {
        if (themeMode === "night") {
          // Keep right arm raised holding the torch forward
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 3, 5 * delta);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 5 * delta);
        } else {
          // Standard walk swing
          rightArmRef.current.rotation.x = -Math.sin(walkTime.current) * 0.6;
          rightArmRef.current.rotation.z = -Math.abs(Math.sin(walkTime.current)) * 0.1 - 0.1;
        }
      }

      // Foot swing
      if (leftFootRef.current) {
        leftFootRef.current.rotation.x = -Math.sin(walkTime.current) * 0.5;
        leftFootRef.current.position.y = -1.1 + Math.max(0, Math.sin(walkTime.current)) * 0.15;
      }
      if (rightFootRef.current) {
        rightFootRef.current.rotation.x = Math.sin(walkTime.current) * 0.5;
        rightFootRef.current.position.y = -1.1 + Math.max(0, -Math.sin(walkTime.current)) * 0.15;
      }

      // Bobbing body
      if (bodyRef.current) {
        bodyRef.current.position.y = Math.abs(Math.sin(walkTime.current * 2)) * 0.08;
      }
      if (dhotiRef.current) {
        dhotiRef.current.rotation.z = Math.sin(walkTime.current) * 0.03;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(walkTime.current * 0.5) * 0.05;
      }
    } else {
      // 2. Arrived / Idle / Presenting State
      if (isWalking) {
        setIsWalking(false);
        if (onArrived) onArrived();
      }

      // Smoothly rotate to face the viewer
      const targetAngle = 0.3;
      let diff = targetAngle - avatarRef.current.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      avatarRef.current.rotation.y += diff * rotationSpeed * delta;

      idleTime.current += delta;

      // Reset foot walking positions
      if (leftFootRef.current) {
        leftFootRef.current.rotation.x = THREE.MathUtils.lerp(leftFootRef.current.rotation.x, 0, 8 * delta);
        leftFootRef.current.position.y = THREE.MathUtils.lerp(leftFootRef.current.position.y, -1.1, 8 * delta);
      }
      if (rightFootRef.current) {
        rightFootRef.current.rotation.x = THREE.MathUtils.lerp(rightFootRef.current.rotation.x, 0, 8 * delta);
        rightFootRef.current.position.y = THREE.MathUtils.lerp(rightFootRef.current.position.y, -1.1, 8 * delta);
      }
      if (bodyRef.current) {
        bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 0, 8 * delta);
      }
      if (dhotiRef.current) {
        dhotiRef.current.rotation.z = THREE.MathUtils.lerp(dhotiRef.current.rotation.z, 0, 8 * delta);
      }

      if (isPresenting) {
        // Presentation Animation: point right arm outwards towards the district
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 2.5, 5 * delta);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -Math.PI / 4, 5 * delta);
          rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, Math.PI / 6, 5 * delta);
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0.2, 5 * delta);
          leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.15, 5 * delta);
        }
        if (headRef.current) {
          headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, -0.3, 5 * delta);
          headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0.05, 5 * delta);
        }
      } else {
        // Standard Idle: breathing and slight head movements
        const breathe = Math.sin(idleTime.current * 2) * 0.02;
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -breathe, 5 * delta);
          leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.1, 5 * delta);
        }
        if (rightArmRef.current) {
          if (themeMode === "night") {
            // Raised right hand holding torch
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 2.8, 5 * delta);
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.15, 5 * delta);
            rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, 0, 5 * delta);
          } else {
            // standard arm rest
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, breathe, 5 * delta);
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.1, 5 * delta);
          }
        }
        if (headRef.current) {
          headRef.current.rotation.y = THREE.MathUtils.lerp(
            headRef.current.rotation.y, 
            Math.sin(idleTime.current * 0.5) * 0.1, 
            3 * delta
          );
          headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 5 * delta);
        }
      }
    }
  });

  return (
    <group ref={avatarRef} position={[0, 1.1, 0]} castShadow receiveShadow>
      <group ref={bodyRef}>
        
        {/* 1. TORSO (Changes colors / clothing overlay according to outfit selection) */}
        {outfit === "hoodie" ? (
          // Coder Hoodie Torso (Dark Grey/Slate)
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.62, 0.8, 0.38]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
        ) : (
          // Traditional Red Shirt Torso
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.8, 0.35]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.5} />
          </mesh>
        )}

        {/* EEE Safety Vest Overlay (If EEE outfit) */}
        {outfit === "eee" && (
          <group position={[0, 0, 0]}>
            {/* Main orange vest structure */}
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[0.62, 0.76, 0.36]} />
              <meshStandardMaterial color="#f97316" roughness={0.4} /> {/* Bright Orange Safety Vest */}
            </mesh>
            {/* Reflective silver stripes */}
            <mesh position={[0.16, 0, 0.19]}>
              <boxGeometry args={[0.08, 0.7, 0.01]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.1} />
            </mesh>
            <mesh position={[-0.16, 0, 0.19]}>
              <boxGeometry args={[0.08, 0.7, 0.01]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.15, 0.19]}>
              <boxGeometry args={[0.45, 0.06, 0.01]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.1} />
            </mesh>
          </group>
        )}

        {/* Red Shirt Collar Details (Traditional/EEE only) */}
        {outfit !== "hoodie" && (
          <group>
            <mesh position={[-0.15, 0.42, 0.18]} rotation={[0.2, 0, 0.3]} castShadow>
              <boxGeometry args={[0.15, 0.08, 0.06]} />
              <meshStandardMaterial color="#991b1b" />
            </mesh>
            <mesh position={[0.15, 0.42, 0.18]} rotation={[0.2, 0, -0.3]} castShadow>
              <boxGeometry args={[0.15, 0.08, 0.06]} />
              <meshStandardMaterial color="#991b1b" />
            </mesh>
          </group>
        )}

        {/* 2. HEAD JOINT */}
        <group ref={headRef} position={[0, 0.65, 0]}>
          {/* Neck */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
            <meshStandardMaterial color="#cca385" roughness={0.6} />
          </mesh>

          {/* Face */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <boxGeometry args={[0.42, 0.45, 0.38]} />
            <meshStandardMaterial color="#cca385" roughness={0.6} />
          </mesh>

          {/* Tilak / Vibhuti (Forehead symbol) */}
          <group position={[0, 0.2, 0.195]}>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.12, 0.02, 0.005]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.14, 0.02, 0.005]} />
              <meshBasicMaterial color="#facc15" />
            </mesh>
            <mesh position={[0, 0, 0.002]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          </group>

          {/* Hair (Dark Curly Volume) */}
          <mesh position={[0, 0.3, -0.02]} castShadow>
            <boxGeometry args={[0.46, 0.18, 0.42]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.38, 0.05]} castShadow>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>
          <mesh position={[-0.15, 0.28, 0.1]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>
          <mesh position={[0.15, 0.28, 0.1]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>

          {/* Beard */}
          <mesh position={[0, -0.15, 0.03]} castShadow>
            <boxGeometry args={[0.43, 0.15, 0.39]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.08, 0.19]} castShadow>
            <boxGeometry args={[0.2, 0.04, 0.02]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[-0.1, 0.1, 0.195]}>
            <boxGeometry args={[0.05, 0.03, 0.01]} />
            <meshBasicMaterial color="#111827" />
          </mesh>
          <mesh position={[0.1, 0.1, 0.195]}>
            <boxGeometry args={[0.05, 0.03, 0.01]} />
            <meshBasicMaterial color="#111827" />
          </mesh>

          {/* Safety Helmet (If EEE outfit) */}
          {outfit === "eee" && (
            <group position={[0, 0.32, 0.02]}>
              {/* Helmet Dome */}
              <mesh castShadow>
                <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#facc15" roughness={0.3} /> {/* Safety Yellow */}
              </mesh>
              {/* Helmet Brim / Visor */}
              <mesh position={[0, 0.01, 0.06]} castShadow>
                <boxGeometry args={[0.48, 0.04, 0.48]} />
                <meshStandardMaterial color="#facc15" roughness={0.3} />
              </mesh>
            </group>
          )}

          {/* Hoodie Hood Mesh (If hoodie outfit, rendered behind the head) */}
          {outfit === "hoodie" && (
            <mesh position={[0, 0.05, -0.16]} castShadow>
              <sphereGeometry args={[0.28, 12, 12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
          )}
        </group>

        {/* 3. LEFT SHOULDER & ARM */}
        <group ref={leftArmRef} position={[-0.38, 0.3, 0]}>
          {/* Sleeve */}
          <mesh position={[0, -0.1, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.25, 8]} />
            <meshStandardMaterial color={outfit === "hoodie" ? "#334155" : "#b91c1c"} roughness={0.5} />
          </mesh>
          {/* Lower Arm */}
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.3, 8]} />
            <meshStandardMaterial color={outfit === "hoodie" ? "#334155" : "#cca385"} roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.48, 0]} castShadow>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#cca385" roughness={0.6} />
          </mesh>
        </group>

        {/* 4. RIGHT SHOULDER & ARM */}
        <group ref={rightArmRef} position={[0.38, 0.3, 0]}>
          {/* Sleeve */}
          <mesh position={[0, -0.1, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.25, 8]} />
            <meshStandardMaterial color={outfit === "hoodie" ? "#334155" : "#b91c1c"} roughness={0.5} />
          </mesh>
          {/* Lower Arm */}
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.3, 8]} />
            <meshStandardMaterial color={outfit === "hoodie" ? "#334155" : "#cca385"} roughness={0.6} />
          </mesh>
          
          {/* Hand Group (Optionally renders night torch inside right hand) */}
          <group position={[0, -0.48, 0]}>
            {/* Hand sphere */}
            <mesh castShadow>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#cca385" roughness={0.6} />
            </mesh>

            {/* Glowing Torch (Only rendered at night) */}
            {themeMode === "night" && (
              <group position={[0, 0.1, 0.1]} rotation={[0.4, 0, 0]}>
                {/* Wood handle */}
                <mesh castShadow>
                  <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                  <meshStandardMaterial color="#78350f" roughness={0.9} />
                </mesh>
                {/* Glowing fire flame */}
                <mesh position={[0, 0.34, 0]}>
                  <coneGeometry args={[0.08, 0.22, 8]} />
                  <meshStandardMaterial 
                    color="#f59e0b" 
                    emissive="#ef4444" 
                    emissiveIntensity={1.5} 
                  />
                </mesh>
                {/* Active fire light source casting shadows */}
                <pointLight 
                  color="#f59e0b" 
                  distance={6} 
                  intensity={2.2} 
                  position={[0, 0.4, 0]} 
                  castShadow
                  shadow-bias={-0.002}
                />
              </group>
            )}
          </group>
        </group>

        {/* 5. LOWER BODY (Dhoti/Veshti or Denim Pants depending on Outfit) */}
        {outfit === "hoodie" ? (
          // Denim Blue Pants (Hoodie Coder Look)
          <group ref={dhotiRef} position={[0, -0.7, 0]}>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.32, 0.35, 0.8, 12]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.7} /> {/* Blue denim jeans */}
            </mesh>
          </group>
        ) : (
          // Traditional White Veshti / Dhoti (Veshti Coder / EEE Gear)
          <group ref={dhotiRef} position={[0, -0.7, 0]}>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.32, 0.38, 0.8, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.7} />
            </mesh>
            {/* Red Zari Border */}
            <mesh position={[0, -0.36, 0]}>
              <cylinderGeometry args={[0.375, 0.382, 0.05, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.6} />
            </mesh>
          </group>
        )}
      </group>

      {/* Feet/Sandals (Rigged for walking) */}
      <group ref={leftFootRef} position={[-0.14, -1.1, 0]}>
        <mesh position={[0, -0.05, 0.05]} castShadow>
          <boxGeometry args={[0.09, 0.08, 0.2]} />
          <meshStandardMaterial color="#854d0e" roughness={0.8} />
        </mesh>
      </group>

      <group ref={rightFootRef} position={[0.14, -1.1, 0]}>
        <mesh position={[0, -0.05, 0.05]} castShadow>
          <boxGeometry args={[0.09, 0.08, 0.2]} />
          <meshStandardMaterial color="#854d0e" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
