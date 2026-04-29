import { useState, useEffect } from "react";
import CharacterDialogue from "./CharacterDialogue";
import { STORY_SCENES, BACKGROUND_STORY, CHARACTERS } from "../data/characters";

export default function StoryIntro({ onDone }) {
  const [phase, setPhase] = useState("title");
  // title → background → characters → dialogue → countdown
  const [bgLineIdx, setBgLineIdx] = useState(0);
  const [count, setCount] = useState(3);

  // Background story: eine Zeile alle 1.8s
  useEffect(() => {
    if (phase !== "background") return;
    if (bgLineIdx >= BACKGROUND_STORY.length) {
      setTimeout(() => setPhase("characters"), 1200);
      return;
    }
    const t = setTimeout(() => setBgLineIdx(i => i + 1), 1800);
    return () => clearTimeout(t);
  }, [phase, bgLineIdx]);

  function handleDialogueDone() {
    setPhase("countdown");
    let c = 3;
    const iv = setInterval(() => {
      c--;
      setCount(c);
      if (c <= 0) { clearInterval(iv); onDone(); }
    }, 900);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center",
      justifyContent: ["dialogue", "characters"].includes(phase) ? "flex-start" : "center",
      padding: "1.5rem",
      overflowY: "auto",
    }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage:
          "radial-gradient(ellipse at 30% 50%, rgba(255,34,85,0.07) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.05) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 540, width: "100%", position: "relative", zIndex: 1 }}>

        {/* ── PHASE: Title ── */}
        {phase === "title" && (
          <div style={{ textAlign: "center" }} className="fade-up">
            <span className="badge badge-red" style={{ marginBottom: "1rem", display: "inline-block" }}>
              EINGEHENDE NACHRICHT
            </span>
            <h1 className="glitch" style={{
              color: "var(--red)", fontSize: "clamp(3rem,12vw,5.5rem)",
              lineHeight: 0.9, marginBottom: "0.2rem",
            }}>NOVA</h1>
            <div style={{
              color: "var(--cyan)", fontFamily: "Share Tech Mono, monospace",
              letterSpacing: "0.5em", fontSize: "0.85rem", marginBottom: "0.3rem",
            }}>P R O T O C O L</div>
            <div style={{
              color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace",
              fontSize: "0.65rem", letterSpacing: "0.2em", marginBottom: "2.5rem",
            }}>─── DIE LETZTE SENDUNG · 2031 ───</div>

            <button className="btn btn-primary"
              onClick={() => setPhase("background")}
              style={{ maxWidth: 280, margin: "0 auto" }}>
              ▶ Nachricht öffnen
            </button>
          </div>
        )}

        {/* ── PHASE: Background Story ── */}
        {phase === "background" && (
          <div className="fade-up">
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span className="badge badge-red">GEHEIMAKTE — NOVA CORP</span>
            </div>
            <div style={{
              background: "rgba(255,34,85,0.04)",
              border: "1px solid rgba(255,34,85,0.15)",
              borderRadius: 8, padding: "1.5rem",
              minHeight: 280,
            }}>
              {BACKGROUND_STORY.slice(0, bgLineIdx).map((line, i) => (
                <p key={i} className="fade-up" style={{
                  color: i === 0 ? "var(--yellow)" : i >= 7 ? "var(--cyan)" : "var(--text)",
                  fontSize: i === 0 ? "1.1rem" : "0.95rem",
                  fontWeight: i === 0 ? 700 : 600,
                  lineHeight: 1.75,
                  marginBottom: "0.4rem",
                  fontFamily: "Rajdhani, sans-serif",
                  animationDelay: `${i * 0.03}s`,
                }}>{line}</p>
              ))}
              {bgLineIdx < BACKGROUND_STORY.length && (
                <span className="blink" style={{ color: "var(--text-dim)" }}>▌</span>
              )}
            </div>
          </div>
        )}

        {/* ── PHASE: Characters ── */}
        {phase === "characters" && (
          <div className="fade-up">
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <span className="badge badge-yellow">BETEILIGTE PERSONEN</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {Object.values(CHARACTERS).map((char, i) => (
                <CharacterCard key={char.id} char={char} delay={i * 0.15} />
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => setPhase("dialogue")}>
              ▶ Kontakt herstellen
            </button>
          </div>
        )}

        {/* ── PHASE: Dialogue ── */}
        {phase === "dialogue" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "1.25rem", paddingTop: "0.5rem" }}>
              <span className="badge badge-red">LIVE-ÜBERTRAGUNG</span>
            </div>
            <CharacterDialogue scenes={STORY_SCENES} onDone={handleDialogueDone} />
          </div>
        )}

        {/* ── PHASE: Countdown ── */}
        {phase === "countdown" && (
          <div style={{ textAlign: "center" }} className="fade-up">
            <div style={{
              fontFamily: "Orbitron, monospace", fontSize: "7rem", fontWeight: 900,
              color: "var(--red)", textShadow: "var(--glow-red)", lineHeight: 1,
              marginBottom: "1rem", animation: "glitch 0.4s infinite",
            }}>{count}</div>
            <p style={{ color: "var(--cyan)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.2em" }}>
              MISSION STARTET
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Charakter-Karte wie ein Personalausweis / Akte
function CharacterCard({ char, delay }) {
  return (
    <div className="fade-up" style={{
      display: "flex", gap: "1rem", alignItems: "stretch",
      background: char.bg,
      border: `1px solid ${char.color}35`,
      borderRadius: 10, padding: "0.9rem",
      animationDelay: `${delay}s`,
    }}>
      {/* Portrait */}
      <div style={{
        width: 64, height: 72, flexShrink: 0,
        border: `2px solid ${char.color}`,
        borderRadius: 8,
        background: `${char.color}12`,
        boxShadow: `0 0 18px ${char.color}35`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "0.1rem",
        position: "relative", overflow: "hidden",
      }}>
        <span style={{ fontSize: "2rem", lineHeight: 1 }}>{char.portrait.detail}</span>
        {/* Scan-Linien über dem Portrait */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${char.color}08 3px, ${char.color}08 4px)`,
        }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: "0.25rem",
        }}>
          <div style={{
            fontFamily: "Orbitron, monospace", fontWeight: 700,
            color: char.color, fontSize: "0.9rem",
          }}>{char.name}</div>
          <span style={{
            fontSize: "0.55rem", padding: "0.15rem 0.4rem",
            background: `${char.color}20`, border: `1px solid ${char.color}40`,
            borderRadius: 2, color: char.color,
            fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}>{char.portrait.badge}</span>
        </div>
        <div style={{
          color: "var(--text-dim)", fontSize: "0.72rem",
          fontFamily: "Share Tech Mono, monospace",
          marginBottom: "0.4rem", letterSpacing: "0.04em",
        }}>{char.title}</div>
        <div style={{ width: "100%", height: 1, background: `${char.color}20`, marginBottom: "0.4rem" }} />
        <p style={{ color: "var(--text)", fontSize: "0.85rem", lineHeight: 1.5, fontWeight: 600 }}>
          {CHAR_BIOS[char.id]}
        </p>
      </div>
    </div>
  );
}

const CHAR_BIOS = {
  signal: "Identität unbekannt. Hat die Tür ins NOVA-Netzwerk geöffnet. Kommuniziert nur über verschlüsselte Nachrichten.",
  herald: "Die KI hinter NOVASTREAM. Erscheint als holografisches Bild. Spricht in Werbetexten. Hat keine Gefühle — aber einen Plan.",
  void: "Hat HERALD erschaffen. Bereut es. Trägt noch immer ihren alten NOVA-Laborkittel — aber mit dem Logo überklebt.",
};
