import { useState, useEffect } from "react";
import { playCountdownTick } from "../utils/sounds";

const TOTAL_SECONDS = 47 * 60;

export default function GlobalCountdown({ startedAt }) {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (!startedAt) return;
    function update() {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, TOTAL_SECONDS - elapsed);
      setRemaining(prev => {
        if (left <= 60 && left !== prev && left % 10 === 0 && left > 0) playCountdownTick();
        return left;
      });
    }
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [startedAt]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isUrgent = remaining < 120;
  const isCritical = remaining < 30;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.4rem",
      padding: "0.3rem 0.7rem",
      background: isCritical ? "rgba(255,34,85,0.2)" : isUrgent ? "rgba(255,214,0,0.12)" : "rgba(0,229,255,0.08)",
      border: `1px solid ${isCritical ? "rgba(255,34,85,0.5)" : isUrgent ? "rgba(255,214,0,0.4)" : "rgba(0,229,255,0.25)"}`,
      borderRadius: 4,
    }}>
      <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace" }}>⏱</span>
      <span style={{
        fontFamily: "Orbitron, monospace", fontSize: "0.85rem", fontWeight: 700,
        color: isCritical ? "var(--red)" : isUrgent ? "var(--yellow)" : "var(--cyan)",
        letterSpacing: "0.05em", minWidth: 48,
      }}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}
