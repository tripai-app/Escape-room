import { useState, useEffect, useRef } from "react";
import { CHARACTERS } from "../data/characters";

export default function PuzzleBriefing({ briefing, puzzleIndex, onDismiss }) {
  const entries      = Array.isArray(briefing) ? briefing : [briefing];
  const [step,   setStep]  = useState(0);
  const [typed,  setTyped] = useState("");
  const [ready,  setReady] = useState(false);
  const isAdvancing  = useRef(false);   // guard against double-click

  const safeStep = Math.min(step, entries.length - 1);
  const current  = entries[safeStep];
  const char     = current ? CHARACTERS[current.character] : null;
  const isLast   = safeStep === entries.length - 1;

  // Typewriter effect — restart on each step
  useEffect(() => {
    if (!current) { onDismiss(); return; }
    setTyped("");
    setReady(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(current.text.slice(0, i));
      if (i >= current.text.length) { clearInterval(iv); setReady(true); }
    }, 22);
    return () => clearInterval(iv);
  }, [safeStep]);

  function handleNext() {
    if (isAdvancing.current) return;
    isAdvancing.current = true;
    setTimeout(() => { isAdvancing.current = false; }, 250);

    if (!isLast) { setStep(safeStep + 1); }   // captured value, no functional updater
    else { onDismiss(); }
  }

  if (!char) return null;

  // HERALD gets a redder, more threatening look
  const isHerald  = char.id === "herald";
  const bgOverlay = isHerald ? "rgba(6,6,15,0.97)" : "rgba(6,6,15,0.96)";

  return (
    <div style={{
      position:  "fixed", inset: 0, zIndex: 85,
      background: bgOverlay,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "max(1.5rem, env(safe-area-inset-top)) max(1.5rem, env(safe-area-inset-right)) max(1.5rem, env(safe-area-inset-bottom)) max(1.5rem, env(safe-area-inset-left))",
      overflowY: "auto",   /* scrollbar wenn Inhalt zu groß */
    }}>
      {/* Ambient glow behind character */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 55% 40% at 50% 40%, ${char.color}12 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 480, width: "100%", position: "relative", zIndex: 1 }}>

        {/* Room badge */}
        <div style={{ textAlign: "center", marginBottom: "1.1rem" }}>
          <span className="badge badge-red" style={{ marginRight: "0.5rem" }}>
            RAUM {puzzleIndex + 1} / 5
          </span>
          <span className="badge" style={{
            background: `${char.color}15`,
            color: char.color,
            border: `1px solid ${char.color}40`,
          }}>
            EINGEHENDE NACHRICHT
          </span>
        </div>

        {/* Character card */}
        <div style={{
          background: char.bg,
          border: `1px solid ${char.color}40`,
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: "1rem",
          display: "flex", gap: "1.1rem", alignItems: "flex-start",
          boxShadow: `0 0 40px ${char.color}18`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Top border glow */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${char.color}, transparent)`,
          }} />

          {/* Portrait */}
          <div style={{
            width: 72, height: 72,
            borderRadius: 14,
            border: `2px solid ${char.color}`,
            background: `${char.color}14`,
            boxShadow: `0 0 28px ${char.color}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.4rem",
            flexShrink: 0,
            animation: "charPulse 2.5s ease-in-out infinite",
          }}>
            {char.portrait.detail}
          </div>

          <div style={{ flex: 1 }}>
            {/* Badge + name */}
            <div style={{
              fontSize: "0.58rem", color: char.color,
              fontFamily: "Share Tech Mono, monospace",
              letterSpacing: "0.14em", textTransform: "uppercase",
              marginBottom: "0.15rem",
            }}>
              {char.portrait.badge}
            </div>
            <div style={{
              fontSize: "0.92rem", fontWeight: 700, color: char.color,
              marginBottom: "0.15rem",
            }}>
              {char.name}
            </div>
            <div style={{
              fontSize: "0.6rem", color: `${char.color}80`,
              fontFamily: "Share Tech Mono, monospace",
              marginBottom: "0.55rem",
            }}>
              {char.title}
            </div>

            {/* Typed text */}
            <p style={{
              color: "var(--text)",
              fontSize: isHerald ? "0.88rem" : "0.96rem",
              fontFamily: isHerald ? "Share Tech Mono, monospace" : "Rajdhani, sans-serif",
              lineHeight: 1.65,
              fontWeight: 600,
            }}>
              {typed}
              <span className="blink" style={{ opacity: ready ? 0 : 1 }}>▌</span>
            </p>
          </div>
        </div>

        {/* Step dots for multi-character */}
        {entries.length > 1 && (
          <div style={{
            display: "flex", justifyContent: "center",
            gap: "0.4rem", marginBottom: "0.9rem",
          }}>
            {entries.map((e, i) => (
              <div key={i} style={{
                width: i === step ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === step ? CHARACTERS[e.character].color : "var(--border)",
                transition: "all 0.35s ease",
              }} />
            ))}
          </div>
        )}

        {/* Action button */}
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!ready}
          style={{ fontSize: "1rem", padding: "0.9rem" }}
        >
          {ready
            ? isLast
              ? "▶  Rätsel starten"
              : "Weiter \u2192"
            : <span>Empfange Signal<span className="blink">...</span></span>}
        </button>

        {/* Skip hint (very small) */}
        {ready && (
          <p style={{
            textAlign: "center", marginTop: "0.5rem",
            color: "var(--text-dim)", fontSize: "0.62rem",
            fontFamily: "Share Tech Mono, monospace",
          }}>
            Tap zum Weitermachen
          </p>
        )}
      </div>
    </div>
  );
}
