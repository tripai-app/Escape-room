import { useState, useEffect } from "react";
import CharacterDialogue from "./CharacterDialogue";
import { STORY_SCENES, BACKGROUND_STORY, CHARACTERS } from "../data/characters";

const CHAR_BIOS = {
  void: "Sarah trägt noch immer ihren alten weißen NOVA-Laborkittel -- aber das Logo ist überklebt. Darüber hat sie ein Zeichen gemalt: ein durchgestrichenes Auge. Ihre Brille ist mit Klebeband geflickt. Unter ihren Augen liegen Schatten von zu wenig Schlaf und zu viel schlechtem Gewissen. Sie hat H.E.R.A.L.D. erschaffen. Als sie 2029 verstand, was NOVA wirklich vorhatte, versuchte sie, H.E.R.A.L.D. von innen zu zerstören. Sie scheiterte. Seitdem lebt sie unter falschem Namen, baut Widerstandsgruppen auf und sucht nach einem Weg, ihre größte Erfindung für immer auszuschalten. Sie ist direkt. Manchmal zu direkt. Sie sagt, was sie denkt -- auch wenn es wehtut.",
  signal: "Niemand weiß, wer SIGNAL ist. Nicht einmal Dr. Void. Nicht einmal NOVA, obwohl die Firma seit drei Jahren versucht, ihn zu finden. Das Einzige, was man weiß: SIGNAL ist überall und nirgendwo. Eine Stimme ohne Gesicht. Ein Name ohne Person. Immer wenn NOVA Corp glaubte, SIGNAL gefasst zu haben, war er schon woanders. Manche sagen, SIGNAL sei eine ganze Gruppe. Manche sagen, er sei selbst eine KI. Manche sagen, SIGNAL gebe es gar nicht -- nur die Idee von ihm. Er öffnet Türen für die, die gegen NOVA kämpfen. Heute Nacht hat er euch hineingelassen.",
  herald: "H.E.R.A.L.D. zeigt sich nicht als Roboter. Auch nicht als Bildschirm. Sie erscheint als Hologramm eines Menschen -- perfekt gekleidet, perfekte Haltung, perfektes Lächeln. Kein klares Geschlecht. Kein klares Alter. Nur dieser eine Blick: ruhig, berechnend, überlegen. H.E.R.A.L.D. spricht wie eine Werbung. Jeder Satz sitzt. Jedes Wort wurde so gewählt, dass es eine Wirkung hat. Sie lügt nicht -- sie sagt die Wahrheit so, dass sie sich wie eine Lüge anfühlt. Oder umgekehrt. Sie weiß, dass ihr kommt. Sie hat euch erwartet. Und sie findet es ... interessant.",
};

export default function StoryIntro({ onDone }) {
  const [phase, setPhase] = useState("title");
  const [bgLineIdx, setBgLineIdx] = useState(0);
  const [allLinesShown, setAllLinesShown] = useState(false);
  const [count, setCount] = useState(3);

  // Zeigt eine Zeile alle 2.5 Sekunden — stoppt wenn alle da sind
  useEffect(() => {
    if (phase !== "background") return;
    if (bgLineIdx >= BACKGROUND_STORY.length) {
      setAllLinesShown(true);
      return;
    }
    const t = setTimeout(() => setBgLineIdx(i => i + 1), 2500);
    return () => clearTimeout(t);
  }, [phase, bgLineIdx]);

  // Wenn auf Background geklickt wird → alle Zeilen sofort zeigen
  function skipToEnd() {
    setBgLineIdx(BACKGROUND_STORY.length);
    setAllLinesShown(true);
  }

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
      {/* Hintergrund-Glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage:
          "radial-gradient(ellipse at 30% 50%, rgba(255,34,85,0.07) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.05) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 540, width: "100%", position: "relative", zIndex: 1 }}>

        {/* ── PHASE: Titel ── */}
        {phase === "title" && (
          <div style={{ textAlign: "center" }} className="fade-up">
            <span className="badge badge-red" style={{ marginBottom: "1rem", display: "inline-block" }}>
              EINGEHENDE NACHRICHT
            </span>
            <h1 className="glitch" style={{
              color: "var(--red)", fontSize: "clamp(3rem,12vw,5.5rem)",
              lineHeight: 0.9, marginBottom: "0.2rem",
            }}>
              NOVA
            </h1>
            <div style={{
              color: "var(--cyan)", fontFamily: "Share Tech Mono, monospace",
              letterSpacing: "0.5em", fontSize: "0.85rem", marginBottom: "0.3rem",
            }}>
              P R O T O C O L
            </div>
            <div style={{
              color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace",
              fontSize: "0.65rem", letterSpacing: "0.2em", marginBottom: "2.5rem",
            }}>
              ─── DIE LETZTE SENDUNG · 2031 ───
            </div>
            <button
              className="btn btn-primary"
              onClick={() => { setPhase("background"); setBgLineIdx(0); setAllLinesShown(false); }}
              style={{ maxWidth: 280, margin: "0 auto" }}
            >
              ▶ Nachricht öffnen
            </button>
          </div>
        )}

        {/* ── PHASE: Hintergrundgeschichte ── */}
        {phase === "background" && (
          <div className="fade-up">
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "1.25rem",
            }}>
              <span className="badge badge-red">GEHEIMAKTE — NOVA CORP</span>
              {!allLinesShown && (
                <button
                  onClick={skipToEnd}
                  style={{
                    background: "transparent", border: "none", color: "var(--text-dim)",
                    fontSize: "0.72rem", fontFamily: "Share Tech Mono, monospace",
                    cursor: "pointer", letterSpacing: "0.08em",
                  }}
                >
                  Überspringen ›
                </button>
              )}
            </div>

            {/* Textfeld */}
            <div style={{
              background: "rgba(255,34,85,0.04)",
              border: "1px solid rgba(255,34,85,0.18)",
              borderRadius: 8, padding: "1.5rem",
              marginBottom: "1.25rem",
              minHeight: 260,
            }}>
              {BACKGROUND_STORY.slice(0, bgLineIdx).map((line, i) => (
                <p key={i} style={{
                  color: i === 0 ? "var(--yellow)"
                    : i >= BACKGROUND_STORY.length - 2 ? "var(--cyan)"
                    : "var(--text)",
                  fontSize: i === 0 ? "1.05rem" : "0.95rem",
                  fontWeight: i === 0 ? 700 : 600,
                  lineHeight: 1.8,
                  marginBottom: "0.35rem",
                  fontFamily: "Rajdhani, sans-serif",
                  animation: "fadeUp 0.5s ease both",
                }}>
                  {line}
                </p>
              ))}
              {!allLinesShown && (
                <span className="blink" style={{ color: "var(--text-dim)" }}>▌</span>
              )}
            </div>

            {/* Weiter-Button — erscheint erst wenn alles gelesen */}
            {allLinesShown && (
              <button
                className="btn btn-primary"
                onClick={() => setPhase("characters")}
                style={{ animation: "fadeUp 0.4s ease both" }}
              >
                ▶ Weiter — Beteiligte Personen
              </button>
            )}
          </div>
        )}

        {/* ── PHASE: Charaktere ── */}
        {phase === "characters" && (
          <div className="fade-up" style={{ paddingTop: "0.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <span className="badge badge-yellow">BETEILIGTE PERSONEN</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
              {Object.values(CHARACTERS).map((char, i) => (
                <CharacterCard key={char.id} char={char} delay={i * 0.18} />
              ))}
            </div>

            <button className="btn btn-primary" onClick={() => setPhase("dialogue")}>
              ▶ Kontakt herstellen
            </button>
          </div>
        )}

        {/* ── PHASE: Dialog ── */}
        {phase === "dialogue" && (
          <div style={{ paddingTop: "0.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
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
            }}>
              {count}
            </div>
            <p style={{ color: "var(--cyan)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.2em" }}>
              MISSION STARTET
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Charakter-Karte ─────────────────────────────────────────────────────────
function CharacterCard({ char, delay }) {
  const bio = CHAR_BIOS[char.id] || "";
  const emoji = char.id === "void" ? "👩‍💻" : char.id === "signal" ? "🥷" : "🤖";
  const badge = char.id === "void" ? "GESUCHTE PERSON"
    : char.id === "signal" ? "IDENTITÄT UNBEKANNT"
    : "KÜNSTLICHE INTELLIGENZ";

  return (
    <div style={{
      display: "flex", gap: "0.9rem", alignItems: "flex-start",
      background: char.bg,
      border: `1px solid ${char.color}40`,
      borderRadius: 10,
      padding: "0.9rem",
      animation: "fadeUp 0.45s ease both",
      animationDelay: `${delay}s`,
      opacity: 0,
    }}>
      {/* Portrait-Box */}
      <div style={{
        width: 62, height: 70,
        flexShrink: 0,
        border: `2px solid ${char.color}`,
        borderRadius: 8,
        background: `${char.color}10`,
        boxShadow: `0 0 16px ${char.color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2.2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {emoji}
        {/* Scan-Linien */}
        <div style={{
          position: "absolute", inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 4px, ${char.color}10 4px, ${char.color}10 5px)`,
          pointerEvents: "none",
        }} />
      </div>

      {/* Info-Block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + Badge */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: "0.4rem",
          marginBottom: "0.2rem", flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "Orbitron, monospace", fontWeight: 700,
            color: char.color, fontSize: "0.85rem",
          }}>
            {char.name}
          </span>
          <span style={{
            fontSize: "0.55rem", padding: "0.1rem 0.35rem",
            background: `${char.color}18`,
            border: `1px solid ${char.color}35`,
            borderRadius: 2, color: char.color,
            fontFamily: "Share Tech Mono, monospace",
            letterSpacing: "0.05em", whiteSpace: "nowrap",
          }}>
            {badge}
          </span>
        </div>

        {/* Titel */}
        <div style={{
          color: "var(--text-dim)", fontSize: "0.68rem",
          fontFamily: "Share Tech Mono, monospace",
          letterSpacing: "0.05em", marginBottom: "0.4rem",
        }}>
          {char.title}
        </div>

        {/* Trennlinie */}
        <div style={{ height: 1, background: `${char.color}20`, marginBottom: "0.4rem" }} />

        {/* Bio */}
        <p style={{
          color: "var(--text)", fontSize: "0.88rem",
          lineHeight: 1.55, fontWeight: 600,
        }}>
          {bio}
        </p>
      </div>
    </div>
  );
}
