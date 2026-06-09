import React, { useState } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import CityMap from "./components/CityMap";
import Avatar from "./components/Avatar";
import CameraManager from "./components/CameraManager";
import OverlayUI from "./components/OverlayUI";
import { portfolioData } from "./data/portfolioData";
import { soundManager } from "./utils/soundManager";

export default function App() {
  const [currentDistrictIndex, setCurrentDistrictIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isStarted, setIsStarted] = useState(true);

  // States
  const [themeMode, setThemeMode] = useState("day"); // 'day' or 'night'
  const [soundEnabled, setSoundEnabled] = useState(false);

  const districts = portfolioData.districts;
  const activeDistrict = districts[currentDistrictIndex];
  
  // Coordinates of the active district target
  const targetPosition = activeDistrict.coordinates;

  const handleNavigate = (index) => {
    if (index < 0 || index >= districts.length) return;
    if (soundEnabled) {
      soundManager.playClickSFX();
    }
    setIsMoving(true);
    setCurrentDistrictIndex(index);
    if (index > unlockedIndex) {
      setUnlockedIndex(index);
    }
  };

  const handleStartTour = () => {
    setIsStarted(true);
  };

  const handleAvatarArrived = () => {
    setIsMoving(false);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      soundManager.startBGM();
      soundManager.playClickSFX();
    } else {
      soundManager.stopBGM();
    }
  };

  const toggleTheme = () => {
    if (soundEnabled) soundManager.playClickSFX();
    setThemeMode((prev) => (prev === "day" ? "night" : "day"));
  };

  // Is completed when reaching the central landmark (final district)
  const isCompleted = currentDistrictIndex === districts.length - 1;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 3D Scene Layer */}
      <ThreeCanvas themeMode={themeMode}>
        {/* Centralised city map, roads, and themed districts */}
        <CityMap 
          unlockedIndex={unlockedIndex} 
          currentDistrictIndex={currentDistrictIndex}
          themeMode={themeMode}
          soundEnabled={soundEnabled}
        />

        {/* Dynamic guide avatar wearing EEE safety gear */}
        <Avatar 
          targetPosition={targetPosition}
          isPresenting={!isMoving && currentDistrictIndex > 0}
          onArrived={handleAvatarArrived}
          themeMode={themeMode}
          outfit="eee" // Always EEE safety gear
        />

        {/* Cinematic camera controller */}
        <CameraManager 
          activeIndex={currentDistrictIndex}
          isCompleted={isCompleted}
        />
      </ThreeCanvas>

      {/* 2D HUD Overlays & Glassmorphic Content Panels */}
      <OverlayUI
        currentDistrictIndex={currentDistrictIndex}
        unlockedIndex={unlockedIndex}
        isMoving={isMoving}
        onNavigate={handleNavigate}
        isStarted={isStarted}
        onStartTour={handleStartTour}
        
        // Custom Controls Props
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    </div>
  );
}
