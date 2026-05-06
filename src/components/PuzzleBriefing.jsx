import { useState, useEffect, useRef } from "react";
import { CHARACTERS } from "../data/characters";
import { PUZZLES } from "../data/puzzles";

export default function PuzzleBriefing({
  briefing,
  puzzleIndex,
  isHost,
  readyCount,
  totalPlayers,
  onReady,
  onStart,
  isStudentReady,
}) {
  const entries     = Array.isArray(briefing) ? briefing : [briefing];
  const [step,  setStep]  = useState(0);
  const [typed, setTyped] = useState("");
  const [ready, setReady] = useState(false);
  const isAdvancing = useRef(false);

  const safeStep = Math.min(step, entries.length - 1);
  const current  = entries[safeStep];
  const char     = current ? CHARACTERS[current.character] : null;
  const isLast   = safeStep === entries.length - 1;

  // Typewriter
  useEffect(() => {
    if (!current) return;
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

  // Reset on puzzle change
  useEffect(() => {
    setStep(0);
    setTyped("");
    setReady(false);
  }, [puzzleIndex]);

  function handleNext() {
    if (isAdvancing.current) return;
    isAdvancing.current = true;
    setTimeout(() => { isAdvancing.current = false; }, 250);
    if (!isLast) setStep(safeStep + 1);
    // on last step: handled by separate buttons below
  }

  if (!char) return null;

  const isHerald  = char.id === "herald";
  const bgOverlay = isHerald ? "rgba(6,6,15,0.97)" : "rgba(6,6,15,0.96)";
  const readyPct  = totalPlayers > 0 ? Math.round((readyCount / totalPlayers) * 100) : 0;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 85,
      background: bgOverlay,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "max(1.5rem, env(safe-area-inset-top)) max(1.5rem, env(safe-area-inset-right)) max(1.5rem, env(safe-area-inset-bottom)) max(1.5rem, env(safe-area-inset-left))",
      overflowY: "auto",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 55% 40% at 50% 40%, ${char.color}12 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 480, width: "100%", position: "relative", zIndex: 1 }}>

        {/* Room badge */}
        <div style={{ textAlign: "center", marginBottom: "1.1rem" }}>
          <span className="badge badge-red" style={{ marginRight: "0.5rem" }}>
            RAUM {puzzleIndex + 1}/{PUZZLES.length}
          </span>
          <span className="badge" style={{
            background: `${char.color}15`, color: char.color,
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
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${char.color}, transparent)`,
          }} />

          {/* Portrait */}
          <div style={{
            width: 72, height: 72, borderRadius: 14,
            border: `2px solid ${char.color}`,
            background: `${char.color}14`,
            boxShadow: `0 0 28px ${char.color}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.4rem", flexShrink: 0,
            animation: "charPulse 2.5s ease-in-out infinite",
          }}>
            {char.portrait.detail}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "0.58rem", color: char.color,
              fontFamily: "Share Tech Mono, monospace",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.15rem",
            }}>
              {char.portrait.badge}
            </div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: char.color, marginBottom: "0.15rem" }}>
              {char.name}
            </div>
            <div style={{ fontSize: "0.6rem", color: `${char.color}80`, fontFamily: "Share Tech Mono, monospace", marginBottom: "0.55rem" }}>
              {char.title}
            </div>
            <p style={{
              color: "var(--text)",
              fontSize: isHerald ? "0.88rem" : "0.96rem",
              fontFamily: isHerald ? "Share Tech Mono, monospace" : "Rajdhani, sans-serif",
              lineHeight: 1.65, fontWeight: 600,
            }}>
              {typed}
              <span className="blink" style={{ opacity: ready ? 0 : 1 }}>▌</span>
            </p>
          </div>
        </div>

        {/* Step dots */}
        {entries.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginBottom: "0.9rem" }}>
            {entries.map((e, i) => (
              <div key={i} style={{
                width: i === step ? 18 : 6, height: 6, borderRadius: 3,
                background: i === step ? CHARACTERS[e.character].color : "var(--border)",
                transition: "all 0.35s ease",
              }} />
            ))}
          </div>
        )}

        {/* ── Action area ─────────────────────────────────────────────────── */}
        {!isLast ? (
          // Intermediate steps → just "Weiter"
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!ready}
            style={{ fontSize: "1rem", padding: "0.9rem" }}
          >
            {ready ? "Weiter \u2192" : <span>Empfange Signal<span className="blink">...</span></span>}
          </button>

        ) : isHost ? (
          // HOST last step → "Rätsel starten für alle"
          <div>
            {/* Ready bar */}
            {totalPlayers > 0 && (
              <div style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8, padding: "0.85rem",
                marginBottom: "0.85rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", fontFamily: "Share Tech Mono, monospace", color: "var(--text-dim)" }}>
                    AGENTEN BEREIT
                  </span>
                  <span style={{
                    fontFamily: "Orbitron, monospace", fontWeight: 700,
                    color: readyCount === totalPlayers ? "var(--green)" : "var(--yellow)",
                    fontSize: "0.85rem",
                  }}>
                    {readyCount}/{totalPlayers}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "var(--bg2)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${readyPct}%`,
                    background: readyCount === totalPlayers ? "var(--green)" : "var(--yellow)",
                    transition: "width 0.4s ease",
                    boxShadow: readyCount === totalPlayers ? "0 0 12px rgba(0,255,136,0.5)" : "none",
                  }} />
                </div>
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={onStart}
              disabled={!ready}
              style={{ fontSize: "1rem", padding: "0.9rem" }}
            >
              {ready
                ? `▶  Rätsel starten für alle${totalPlayers > 0 ? ` (${readyCount}/${totalPlayers})` : ""}`
                : <span>Empfange Signal<span className="blink">...</span></span>}
            </button>
          </div>

        ) : isStudentReady ? (
          // STUDENT — already clicked ready
          <div style={{
            background: "rgba(0,255,136,0.07)",
            border: "1px solid rgba(0,255,136,0.3)",
            borderRadius: 8, padding: "1rem",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>✅</div>
            <div style={{ fontWeight: 700, color: "var(--green)", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
              Bereit!
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.78rem", fontFamily: "Share Tech Mono, monospace" }}>
              {totalPlayers > 0
                ? `${readyCount}/${totalPlayers} Agenten bereit — warte auf Lehrer...`
                : "Warte auf den Lehrer..."}
            </div>
            {totalPlayers > 0 && (
              <div style={{ marginTop: "0.65rem", height: 4, borderRadius: 2, background: "var(--bg2)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${readyPct}%`,
                  background: "var(--green)",
                  transition: "width 0.4s ease",
                }} />
              </div>
            )}
          </div>

        ) : (
          // STUDENT — not yet ready
          <button
            className="btn btn-primary"
            onClick={onReady}
            disabled={!ready}
            style={{ fontSize: "1rem", padding: "0.9rem", background: "rgba(0,255,136,0.15)", borderColor: "var(--green)", color: "var(--green)" }}
          >
            {ready
              ? "✓  Ich bin bereit!"
              : <span>Empfange Signal<span className="blink">...</span></span>}
          </button>
        )}

        {ready && !isLast && (
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
