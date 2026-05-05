import { useState, useEffect } from "react";
import { CHARACTERS, INTERLUDE_MESSAGES } from "../data/characters";

const MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_COLORS = ["var(--yellow)", "#bbb", "#cd7f32"];
const PODIUM_HEIGHTS = [72, 52, 40];

export default function InterludeScreen({ puzzleIndex, players, myId, pointsEarned, wasCorrect, onNext, isHost, puzzle }) {
  const [typed, setTyped]   = useState("");
  const [ready, setReady]   = useState(false);
  const [showPodium, setShowPodium] = useState(false);

  const msg   = INTERLUDE_MESSAGES[puzzleIndex] || INTERLUDE_MESSAGES[0];
  const char  = CHARACTERS[msg.character];
  const text  = wasCorrect ? msg.correct : msg.wrong;
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const top3   = sorted.slice(0, 3);

  useEffect(() => {
    setTyped("");
    setReady(false);
    setShowPodium(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setReady(true);
        setTimeout(() => setShowPodium(true), 400);
      }
    }, 28);
    return () => clearInterval(iv);
  }, [puzzleIndex]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start",
      padding: "1.5rem",
      overflowY: "auto",
    }}>
      <div style={{ maxWidth: 480, width: "100%" }}>

        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <span className="badge badge-yellow">
            ZWISCHENSTAND — RÄTSEL {puzzleIndex + 1} ABGESCHLOSSEN
          </span>
        </div>

        {/* Mein Ergebnis (nur für Spieler) */}
        {!isHost && (
          <div className="score-pop" style={{
            background: wasCorrect ? "rgba(0,255,136,0.07)" : "rgba(255,34,85,0.07)",
            border: `1px solid ${wasCorrect ? "rgba(0,255,136,0.3)" : "rgba(255,34,85,0.3)"}`,
            borderRadius: 8,
            padding: "1rem",
            textAlign: "center",
            marginBottom: "1rem",
          }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.25rem" }}>
              {wasCorrect ? "✅" : "❌"}
            </div>
            <div style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "2rem",
              fontWeight: 700,
              color: wasCorrect ? "var(--green)" : "var(--red)",
              marginBottom: "0.15rem",
              textShadow: wasCorrect ? "0 0 20px rgba(0,255,136,0.5)" : "0 0 20px rgba(255,34,85,0.5)",
            }}>
              +{pointsEarned}
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>
              {wasCorrect ? "Richtig! Weiter so, Agent." : "Nicht ganz — beim nächsten besser!"}
            </div>
          </div>
        )}

        {/* Charakter-Kommentar */}
        <div style={{
          background: char.bg,
          border: `1px solid ${char.color}40`,
          borderRadius: 10,
          padding: "1rem",
          marginBottom: puzzle?.explanation ? "0.75rem" : "1.25rem",
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
          boxShadow: `0 0 24px ${char.color}15`,
        }}>
          {/* Großes Character-Portrait */}
          <div style={{
            width: 64, height: 64,
            borderRadius: 12,
            border: `2px solid ${char.color}`,
            background: `${char.color}10`,
            boxShadow: `0 0 20px ${char.color}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem",
            flexShrink: 0,
            animation: "charPulse 2.5s ease-in-out infinite",
            color: char.color,
          }}>
            {char.portrait.detail}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "0.62rem", color: char.color,
              fontFamily: "Share Tech Mono, monospace",
              marginBottom: "0.2rem", letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              {char.name}
            </div>
            <div style={{ fontSize: "0.6rem", color: `${char.color}80`, fontFamily: "Share Tech Mono, monospace", marginBottom: "0.5rem" }}>
              {char.title}
            </div>
            <p style={{
              color: "var(--text)",
              fontSize: char.id === "herald" ? "0.85rem" : "0.95rem",
              fontFamily: char.id === "herald" ? "Share Tech Mono, monospace" : "Rajdhani, sans-serif",
              lineHeight: 1.65,
              fontWeight: 600,
            }}>
              {typed}
              <span className="blink" style={{ opacity: ready ? 0 : 1 }}>▌</span>
            </p>
          </div>
        </div>

        {/* Rätsel-Erklärung */}
        {puzzle?.explanation && (
          <div style={{
            background: "rgba(0,229,255,0.04)",
            border: "1px solid rgba(0,229,255,0.2)",
            borderLeft: "3px solid var(--cyan)",
            borderRadius: "0 8px 8px 0",
            padding: "0.8rem 1rem",
            marginBottom: "1.25rem",
          }}>
            <p style={{
              fontSize: "0.62rem", color: "var(--cyan)",
              fontFamily: "Share Tech Mono, monospace",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: "0.35rem",
            }}>
              Erklärung
            </p>
            <p style={{ color: "var(--text)", fontSize: "0.88rem", lineHeight: 1.65 }}>
              {puzzle.explanation}
            </p>
          </div>
        )}

        {/* Mini-Podium (Top 3) */}
        {top3.length >= 2 && (
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "1rem 1rem 0",
            marginBottom: "1rem",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, var(--yellow), transparent)",
            }} />
            <p style={{
              fontSize: "0.68rem", color: "var(--text-dim)",
              fontFamily: "Share Tech Mono, monospace",
              letterSpacing: "0.12em", marginBottom: "0.9rem", textAlign: "center",
            }}>
              TOP {top3.length}
            </p>

            {/* Podium bars */}
            <div style={{
              display: "flex", alignItems: "flex-end",
              justifyContent: "center", gap: "0.5rem",
              height: 110,
            }}>
              {/* Podium order: 2nd, 1st, 3rd */}
              {[1, 0, 2].filter(i => top3[i]).map(rankIdx => {
                const player = top3[rankIdx];
                const isMe = player.id === myId;
                const barH = PODIUM_HEIGHTS[rankIdx];
                const col = PODIUM_COLORS[rankIdx];
                return (
                  <div key={player.id} style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", flex: 1, maxWidth: 110,
                  }}>
                    {/* Name + Medal */}
                    <div style={{
                      textAlign: "center", marginBottom: "0.4rem",
                      opacity: showPodium ? 1 : 0,
                      transform: showPodium ? "translateY(0)" : "translateY(10px)",
                      transition: `all 0.5s ease ${rankIdx * 0.15}s`,
                    }}>
                      <div style={{ fontSize: "1.3rem" }}>{MEDALS[rankIdx]}</div>
                      <div style={{
                        fontSize: "0.72rem", fontWeight: 700,
                        color: isMe ? "var(--cyan)" : "var(--text)",
                        maxWidth: 80, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {player.name}
                        {isMe && <span style={{ color: "var(--cyan)", fontSize: "0.6rem" }}> ★</span>}
                      </div>
                      <div style={{
                        fontFamily: "Orbitron, monospace", fontSize: "0.78rem",
                        fontWeight: 700, color: col,
                      }}>
                        {player.score}
                      </div>
                    </div>
                    {/* Bar */}
                    <div style={{
                      width: "100%", background: `${col}20`,
                      border: `1px solid ${col}40`,
                      borderBottom: "none",
                      borderRadius: "4px 4px 0 0",
                      height: showPodium ? barH : 0,
                      transition: `height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${rankIdx * 0.1}s`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "1.1rem" }}>
                        {rankIdx === 0 ? "👑" : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Volle Rangliste */}
        {sorted.length > 3 && (
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "0.85rem",
            marginBottom: "1.25rem",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, var(--yellow), transparent)",
            }} />
            <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.12em", marginBottom: "0.65rem" }}>
              ALLE AGENTEN
            </p>
            {sorted.slice(3).map((p, i) => (
              <div key={p.id || p.name} style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                padding: "0.45rem 0.65rem",
                background: p.id === myId ? "rgba(0,229,255,0.06)" : "var(--bg2)",
                border: `1px solid ${p.id === myId ? "rgba(0,229,255,0.25)" : "var(--border)"}`,
                borderRadius: 5,
                marginBottom: "0.3rem",
                animation: `fadeUp 0.3s ease ${i * 0.07}s both`,
              }}>
                <span style={{ color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", fontSize: "0.72rem", width: 22, flexShrink: 0 }}>
                  {i + 4}.
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--red), var(--cyan))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>
                  {p.name[0].toUpperCase()}
                </div>
                <span style={{ flex: 1, fontWeight: p.id === myId ? 700 : 600, fontSize: "0.9rem" }}>
                  {p.name}
                  {p.id === myId && <span style={{ color: "var(--cyan)", fontSize: "0.7rem", marginLeft: "0.35rem" }}>(du)</span>}
                </span>
                <span style={{
                  fontFamily: "Orbitron, monospace",
                  color: "var(--yellow)",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}>
                  {p.score}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Weiter-Button (nur Host) */}
        {isHost && (
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!ready}
            style={{ fontSize: "1rem", marginBottom: "0.5rem" }}
          >
            {ready ? "▶  Nächstes Rätsel" : <span>Lade<span className="blink">...</span></span>}
          </button>
        )}
        {!isHost && (
          <div style={{
            textAlign: "center", padding: "0.85rem",
            border: "1px solid var(--border)", borderRadius: 6,
            color: "var(--text-dim)", fontSize: "0.82rem",
            fontFamily: "Share Tech Mono, monospace",
            background: "var(--card)",
          }}>
            <span className="blink">_</span>&nbsp; Lehrer startet nächstes Rätsel
          </div>
        )}

        <div style={{ height: "1.5rem" }} />
      </div>
    </div>
  );
}
