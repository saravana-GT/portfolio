import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { portfolioData } from "../data/portfolioData";

export default function OverlayUI({
  currentDistrictIndex,
  unlockedIndex,
  isMoving,
  onNavigate,
  isStarted,
  onStartTour,

  // Custom Controls Props
  themeMode,
  onToggleTheme,
  soundEnabled,
  onToggleSound
}) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showTelegramAlert, setShowTelegramAlert] = useState(false);
  const [telegramSender, setTelegramSender] = useState("");

  const activeDistrict = portfolioData.districts[currentDistrictIndex];
  const totalDistricts = portfolioData.districts.length;
  const isNight = themeMode === "night";
  const isFinalScene = currentDistrictIndex === totalDistricts - 1;

  // Trigger confetti when arriving at the final skyscraper
  useEffect(() => {
    if (currentDistrictIndex === totalDistricts - 1 && !isMoving && isStarted) {
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [currentDistrictIndex, isMoving, isStarted, totalDistricts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setTelegramSender(formData.name);
    setFormSubmitted(true);
    setShowTelegramAlert(true);

    setTimeout(() => {
      setShowTelegramAlert(false);
    }, 5500);

    setFormData({ name: "", email: "", message: "" });
  };

  const handleRestart = () => {
    setFormSubmitted(false);
    onNavigate(0);
  };

  const renderDistrictContent = () => {
    switch (activeDistrict.id) {
      case "skills":
        return (
          <div className="skills-container">
            {/* Interactive CoC Collector Tip */}
            <div 
              style={{
                background: isNight ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0.08)",
                border: "1px dashed rgba(168, 85, 247, 0.3)",
                color: isNight ? "#d8b4fe" : "#7e22ce",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "12.5px",
                fontWeight: "600",
                marginBottom: "12px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              🧪 <span>Touch the purple Elixir Collector to harvest skills!</span>
            </div>

            {activeDistrict.skills.map((cat, idx) => (
              <div key={idx}>
                <h4 className="skill-category-title" style={{ color: isNight ? "#e2e8f0" : "#1e293b" }}>{cat.category}</h4>
                <div className="skill-tags">
                  {cat.items.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="skill-badge"
                      style={{
                        background: isNight ? "rgba(30, 41, 59, 0.9)" : "rgba(241, 245, 249, 0.9)",
                        borderColor: isNight ? "rgba(71, 85, 105, 0.5)" : "rgba(226, 232, 240, 0.8)",
                        color: isNight ? "#f8fafc" : "#1e293b"
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "projects":
        return (
          <div style={{ marginTop: "12px" }}>
            {activeDistrict.projects.map((proj, idx) => (
              <div 
                key={idx} 
                className="project-card"
                style={{
                  background: isNight ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.9)",
                  borderColor: isNight ? "rgba(71, 85, 105, 0.4)" : "rgba(226, 232, 240, 0.8)"
                }}
              >
                <h4 className="project-header" style={{ color: isNight ? "#ffffff" : "#1e293b" }}>{proj.title}</h4>
                <p className="project-desc" style={{ color: isNight ? "#94a3b8" : "#64748b" }}>{proj.description}</p>
                <div className="project-techs">
                  {proj.tech.map((t, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="project-tech"
                      style={{
                        background: isNight ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.08)",
                        color: isNight ? "#38bdf8" : "#0284c7"
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  <a
                    href={proj.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    🚀 Live Demo
                  </a>
                  <a
                    href={proj.codeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    📁 GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        );

      case "contact":
        return (
          <div className="contact-container">
            <div className="contact-info-row" style={{ color: isNight ? "#cbd5e1" : "#64748b" }}>
              📍 <strong>Location:</strong> {portfolioData.personalInfo.location}
            </div>
            <div className="contact-info-row" style={{ color: isNight ? "#cbd5e1" : "#64748b" }}>
              📧 <strong>Email:</strong>{" "}
              <a href={`mailto:${portfolioData.personalInfo.email}`} style={{ color: "inherit" }}>
                {portfolioData.personalInfo.email}
              </a>
            </div>
            <div className="contact-info-row" style={{ color: isNight ? "#cbd5e1" : "#64748b" }}>
              📞 <strong>Phone:</strong> {portfolioData.personalInfo.phone}
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    border: isNight ? "1px solid rgba(71, 85, 105, 0.5)" : "1px solid rgba(226, 232, 240, 0.8)",
                    background: isNight ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    color: isNight ? "#ffffff" : "#1e293b",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    border: isNight ? "1px solid rgba(71, 85, 105, 0.5)" : "1px solid rgba(226, 232, 240, 0.8)",
                    background: isNight ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    color: isNight ? "#ffffff" : "#1e293b",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="3"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    border: isNight ? "1px solid rgba(71, 85, 105, 0.5)" : "1px solid rgba(226, 232, 240, 0.8)",
                    background: isNight ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    color: isNight ? "#ffffff" : "#1e293b",
                    outline: "none",
                    fontSize: "14px",
                    resize: "none"
                  }}
                />
                <button
                  type="submit"
                  className="start-btn"
                  style={{ marginTop: "5px", padding: "12px", width: "100%", border: "none" }}
                >
                  Send Message
                </button>
              </form>
            ) : (
              <div
                style={{
                  padding: "16px",
                  background: "rgba(22, 163, 74, 0.08)",
                  border: "1px solid rgba(22, 163, 74, 0.2)",
                  color: "#16a34a",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textAlign: "center"
                }}
              >
                Thank you! Message submitted successfully.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Welcome Screen Modal */}
      {!isStarted && (
        <div className="intro-modal">
          <div className="glass-panel intro-card interactive">
            <img src="/photo.jpg" alt="Saravana Prabu M R" className="avatar-photo-preview" />
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>
              Saravana Prabu M R
            </h1>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#0ea5e9", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
              B.E. EEE Student & Full Stack Dev
            </p>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", marginBottom: "24px" }}>
              Welcome! Join my animated 3D guide character for a guided walking tour through my portfolio city.
            </p>
            <button className="start-btn" onClick={onStartTour}>
              Start Guided Tour
            </button>
          </div>
        </div>
      )}

      {/* Main HUD overlay */}
      {isStarted && (
        <div className="ui-overlay" style={{ color: isNight ? "#f1f5f9" : "#1e293b" }}>
          
          {/* Header HUD */}
          <div className="hud-header interactive">
            <div className="logo-container">
              <span className={`logo-title ${isNight ? "night" : ""}`}>
                Saravana Prabu M R
              </span>
            </div>

            {/* Top-Right Header Panel (Settings & Progress) */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {/* Settings FABs Dock */}
              <div className="hud-toggles-dock" style={{ marginTop: 0 }}>
                <button 
                  className={`hud-circle-btn ${soundEnabled ? "active" : ""}`} 
                  onClick={onToggleSound} 
                  title="Toggle music"
                >
                  {soundEnabled ? "🔊" : "🔇"}
                </button>
                <button 
                  className="hud-circle-btn theme-toggle" 
                  onClick={onToggleTheme} 
                  title="Toggle Day/Night"
                  style={{ transform: isNight ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  {isNight ? "🌙" : "☀️"}
                </button>
              </div>

              {/* Progress tracker */}
              <div className="journey-progress">
                <span className="progress-text" style={{ color: isNight ? "#94a3b8" : "#64748b" }}>
                  Tour {currentDistrictIndex + 1}/{totalDistricts}
                </span>
                <div className="progress-track" style={{ background: isNight ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((currentDistrictIndex + 1) / totalDistricts) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating content panel on the right side */}
          <div className="content-wrapper">
            <div 
              className="glass-panel" 
              style={{ 
                opacity: isMoving ? 0.6 : 1,
                background: isNight ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.75)",
                borderColor: isNight ? "rgba(51, 65, 85, 0.5)" : "rgba(255, 255, 255, 0.6)",
                boxShadow: isNight ? "0 8px 32px 0 rgba(0, 0, 0, 0.3)" : "0 8px 32px 0 rgba(148, 163, 184, 0.15)"
              }}
            >
              {isMoving ? (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "3px solid rgba(226, 232, 240, 0.3)",
                      borderTopColor: "#0ea5e9",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto 12px auto"
                    }}
                  />
                  <p style={{ fontSize: "14px", fontWeight: "600", color: isNight ? "#94a3b8" : "#64748b" }}>
                    Guiding you to {activeDistrict.name}...
                  </p>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : (
                <>
                  <h2 className="district-title" style={{ color: isNight ? "#ffffff" : "#1e293b" }}>{activeDistrict.title}</h2>
                  <h3 className="district-subtitle">{activeDistrict.subtitle}</h3>
                  {activeDistrict.description && (
                    <p className="district-description" style={{ color: isNight ? "#cbd5e1" : "#64748b" }}>{activeDistrict.description}</p>
                  )}
                  {renderDistrictContent()}

                  {isFinalScene && (
                    <div style={{ marginTop: "20px" }}>
                      <p style={{ fontSize: "13.5px", color: isNight ? "#94a3b8" : "#64748b", fontStyle: "italic", marginBottom: "16px" }}>
                        "Exploring new paradigms in automation, power grids, and web architectures. More projects arriving soon!"
                      </p>
                      <div className="social-links-grid">
                        <a
                          href={portfolioData.personalInfo.github}
                          target="_blank"
                          rel="noreferrer"
                          className="social-btn"
                          style={{
                            background: isNight ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.85)",
                            borderColor: isNight ? "rgba(71, 85, 105, 0.5)" : "rgba(226, 232, 240, 0.8)",
                            color: isNight ? "#f1f5f9" : "#1e293b"
                          }}
                        >
                          📂 GitHub
                        </a>
                        <a
                          href={portfolioData.personalInfo.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="social-btn"
                          style={{
                            background: isNight ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.85)",
                            borderColor: isNight ? "rgba(71, 85, 105, 0.5)" : "rgba(226, 232, 240, 0.8)",
                            color: isNight ? "#f1f5f9" : "#1e293b"
                          }}
                        >
                          💼 LinkedIn
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer HUD */}
          <div className="hud-footer interactive">
            <div className="social-icons-footer">
              <a
                href={portfolioData.personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="footer-icon-link"
                style={{ fontSize: "14px", textDecoration: "none", fontWeight: "600" }}
                title="GitHub"
              >
                github
              </a>
              <a
                href={portfolioData.personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="footer-icon-link"
                style={{ fontSize: "14px", textDecoration: "none", fontWeight: "600" }}
                title="LinkedIn"
              >
                linkedin
              </a>
            </div>

            <div className="nav-controls">
              {isFinalScene && !isMoving ? (
                <button 
                  className="nav-btn" 
                  onClick={handleRestart}
                  style={{
                    background: isNight ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.75)",
                    borderColor: isNight ? "rgba(71, 85, 105, 0.5)" : "rgba(255, 255, 255, 0.6)",
                    color: isNight ? "#ffffff" : "#1e293b"
                  }}
                >
                  🔄 Restart Tour
                </button>
              ) : (
                <>
                  <button
                    className="nav-btn"
                    onClick={() => onNavigate(currentDistrictIndex - 1)}
                    disabled={currentDistrictIndex === 0 || isMoving}
                    style={{
                      background: isNight ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.75)",
                      borderColor: isNight ? "rgba(71, 85, 105, 0.5)" : "rgba(255, 255, 255, 0.6)",
                      color: isNight ? "#ffffff" : "#1e293b"
                    }}
                  >
                    ◀ Prev
                  </button>
                  <button
                    className="nav-btn"
                    onClick={() => onNavigate(currentDistrictIndex + 1)}
                    disabled={isMoving}
                    style={{
                      background: isNight ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.75)",
                      borderColor: isNight ? "rgba(71, 85, 105, 0.5)" : "rgba(255, 255, 255, 0.6)",
                      color: isNight ? "#ffffff" : "#1e293b"
                    }}
                  >
                    {currentDistrictIndex === totalDistricts - 2 ? "Finish Tour 🎉" : "Next ▶"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Telegram Popup Alert */}
          {showTelegramAlert && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                left: "20px",
                zIndex: 9999,
                background: isNight ? "#0f172a" : "#ffffff",
                border: isNight ? "1px solid rgba(71, 85, 105, 0.5)" : "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: "16px",
                padding: "16px",
                width: "320px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                animation: "slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <div
                style={{
                  background: "#e0f2fe",
                  borderRadius: "50%",
                  padding: "8px",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✈️
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0ea5e9", marginBottom: "4px" }}>
                  Telegram Alert Triggered!
                </div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: isNight ? "#f8fafc" : "#1e293b", marginBottom: "2px" }}>
                  Form Notification Automation
                </div>
                <div style={{ fontSize: "12px", color: isNight ? "#94a3b8" : "#64748b" }}>
                  Lead notification message simulation sent to bot. User: <strong>{telegramSender}</strong>
                </div>
              </div>
              <style>{`
                @keyframes slideInLeft {
                  from { transform: translateX(-120%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
              `}</style>
            </div>
          )}
        </div>
      )}
    </>
  );
}
