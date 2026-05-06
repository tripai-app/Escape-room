import { useState, useEffect, useRef } from "react";
import { playCountdownTick, playMissionStart } from "../utils/sounds";

// puzzleStartedAt = server timestamp (ms) when puzzle actually begins
// Show 3 → 2 → 1 → LOS! based on how far away that timestamp is

export default function CountdownOverlay({ puzzleStartedAt }) {
  const [display, setDisplay] = useState(null); // "3"|"2"|"1"|"LOS!"|null
  const [animKey, setAnimKey] = useState(0);    // re-triggers CSS animation per step
  const prevDisplay = useRef(null);

  useEffect(() => {
    if (!puzzleStartedAt) return;

    const iv = setInterval(() => {
      const msLeft = puzzleStartedAt - Date.now();
      let next;
      if      (msLeft > 3000) next = "3";
      else if (msLeft > 2000) next = "2";
      else if (msLeft > 1000) next = "1";
      else if (msLeft > -400) next = "LOS!";
      else                    next = null;

      if (next !== prevDisplay.current) {
        prevDisplay.current = next;
        setDisplay(next);
        setAnimKey(k => k + 1);
        if (next === "LOS!")        playMissionStart();
        else if (next !== null)     playCountdownTick();
      }
    }, 40);

    return () => clearInterval(iv);
  }, [puzzleStartedAt]);

  if (!display) return null;

  const isLos    = display === "LOS!";
  const color    = isLos ? "var(--green)"  : "var(--red)";
  const glow     = isLos
    ? "0 0 80px rgba(0,255,136,0.7), 0 0 200px rgba(0,255,136,0.3)"
    : "0 0 60px rgba(255,34,85,0.8), 0 0 150px rgba(255,34,85,0.3)";
  const bgGlow   = isLos
    ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,136,0.12) 0%, transparent 70%)"
    : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,34,85,0.14) 0%, transparent 70%)";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 95,
      background: "rgba(6,6,15,0.97)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: bgGlow,
        transition: "background 0.3s",
      }} />

      {/* Scanlines overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
      }} />

      {/* Main number */}
      <div
        key={animKey}
        style={{
          position: "relative", zIndex: 2,
          fontFamily: "Orbitron, monospace",
          fontWeight: 900,
          fontSize: isLos ? "clamp(3rem, 20vw, 7rem)" : "clamp(6rem, 32vw, 14rem)",
          color,
          textShadow: glow,
          animation: isLos ? "cdLos 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" : "cdPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
          letterSpacing: isLos ? "0.05em" : "0",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        {display}
      </div>

      {/* Sub-text */}
      <div style={{
        position: "relative", zIndex: 2,
        marginTop: "1.5rem",
        fontFamily: "Share Tech Mono, monospace",
        fontSize: "0.75rem",
        letterSpacing: "0.25em",
        color: `${color}80`,
        textTransform: "uppercase",
        animation: "fadeUp 0.3s ease forwards",
      }}>
        {isLos ? "INITIIERE SEQUENZ" : "H.E.R.A.L.D. — PHASE OMEGA"}
      </div>

      {/* Glitch lines */}
      {!isLos && (
        <>
          <div style={{
            position: "absolute", left: 0, right: 0, zIndex: 2,
            height: 1,
            top: `${30 + Math.random() * 40}%`,
            background: `${color}30`,
            animation: "cdGlitch 0.4s ease forwards",
          }} />
          <div style={{
            position: "absolute", left: 0, right: 0, zIndex: 2,
            height: 1,
            top: `${30 + Math.random() * 40}%`,
            background: `${color}20`,
            animation: "cdGlitch 0.6s ease 0.1s forwards",
          }} />
        </>
      )}
    </div>
  );
}
