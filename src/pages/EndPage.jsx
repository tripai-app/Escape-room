import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { PUZZLES } from "../data/puzzles";
import ConfettiEffect from "../components/ConfettiEffect";
import { playVictory } from "../utils/sounds";

const MEDALS   = ["🥇", "🥈", "🥉"];
const RANK_CLASS = ["first", "second", "third"];
const PODIUM_COLORS = ["var(--yellow)", "#bbb", "#cd7f32"];

export default function EndPage() {
  const { code } = useParams();
  const nav = useNavigate();
  const [players, setPlayers]   = useState([]);
  const [confetti, setConfetti] = useState(false);
  const [podiumIn, setPodiumIn] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const myId   = sessionStorage.getItem("nova_player_id");
  const isHost = sessionStorage.getItem("nova_host_code") === code;

  useEffect(() => {
    const unsub = onValue(ref(db, `rooms/${code}/players`), (snap) => {
      if (!snap.exists()) return;
      const list = Object.entries(snap.val()).map(([id, p]) => ({ id, ...p }));
      setPlayers(list.sort((a, b) => b.score - a.score));
    });
    return () => unsub();
  }, [code]);

  useEffect(() => {
    if (players.length > 0) {
      setTimeout(() => { setConfetti(true); playVictory(); }, 500);
      setTimeout(() => setPodiumIn(true), 900);
    }
  }, [players.length > 0]);

  function exportCSV() {
    const rows = [
      ["Platz", "Name", "Punkte", "Richtige Antworten", "Falsche Antworten"],
      ...players.map((p, i) => {
        const answers = Object.values(p.answeredPuzzles || {});
        const correct = answers.filter(a => a.correct).length;
        const wrong   = answers.length - correct;
        return [i + 1, p.name, p.score, correct, wrong];
      }),
    ];
    const csv  = rows.map(r => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `nova-protocol-ergebnisse-${code}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function restartGame() {
    if (!isHost) return;
    setRestarting(true);
    try {
      // Reset all player scores + answers
      const updates = {};
      players.forEach(p => {
        updates[`rooms/${code}/players/${p.id}/score`] = 0;
        updates[`rooms/${code}/players/${p.id}/answeredPuzzles`] = {};
        updates[`rooms/${code}/players/${p.id}/streak`] = 0;
        updates[`rooms/${code}/players/${p.id}/readyAt`] = null;
      });
      updates[`rooms/${code}/status`] = "lobby";
      updates[`rooms/${code}/currentPuzzle`] = 0;
      updates[`rooms/${code}/startedAt`] = null;
      updates[`rooms/${code}/puzzleStartedAt`] = null;
      updates[`rooms/${code}/firstCorrect`] = null;
      updates[`rooms/${code}/hint`] = null;
      await update(ref(db), updates);
      nav(`/lobby/${code}`);
    } catch (e) {
      console.error(e);
    }
    setRestarting(false);
  }

  const totalPossible = PUZZLES.reduce((s, p) => s + p.points + 100, 0);
  const myPlayer = players.find(p => p.id === myId);
  const myRank   = players.findIndex(p => p.id === myId) + 1;
  const top3     = players.slice(0, 3);
  const missionSuccess = players.length > 0 && players[0].score > 0;

  // Podium bar heights — 1st tallest, 2nd medium, 3rd short
  const PODIUM_H = [110, 80, 60];

  return (
    <div className="page" style={{ justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <ConfettiEffect trigger={confetti} />

      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem", animation: "scorePop 0.6s ease forwards" }}>
            {missionSuccess ? "⚡" : "💀"}
          </div>
          <h1 style={{
            color: missionSuccess ? "var(--green)" : "var(--red)",
            fontSize: "clamp(1.3rem, 6vw, 2.2rem)",
            marginBottom: "0.4rem",
            textShadow: missionSuccess ? "0 0 40px rgba(0,255,136,0.5)" : "0 0 40px rgba(255,34,85,0.5)",
          }}>
            {missionSuccess ? "HERALD gestoppt!" : "Mission gescheitert."}
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {missionSuccess
              ? "Ihr habt die Sprache der Werbung durchschaut. Die Welt ist frei."
              : "HERALD ist online. Niemand kauft mehr freiwillig."}
          </p>
        </div>

        {/* === PODIUM (Top 3) === */}
        {top3.length >= 2 && (
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "1.25rem 1rem 0",
            marginBottom: "1rem",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, var(--yellow), transparent)",
            }} />

            <p style={{
              textAlign: "center", fontSize: "0.68rem", color: "var(--text-dim)",
              fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.14em",
              marginBottom: "1rem",
            }}>
              PODIUM
            </p>

            {/* Podium display: 2nd left, 1st center, 3rd right */}
            <div style={{
              display: "flex", alignItems: "flex-end",
              justifyContent: "center", gap: "0.6rem",
              height: 160,
            }}>
              {[1, 0, 2].filter(ri => top3[ri]).map(rankIdx => {
                const player = top3[rankIdx];
                const isMe   = player.id === myId;
                const col    = PODIUM_COLORS[rankIdx];
                const h      = PODIUM_H[rankIdx];

                return (
                  <div key={player.id} style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", flex: 1, maxWidth: 130,
                  }}>
                    {/* Player info above bar */}
                    <div style={{
                      textAlign: "center", marginBottom: "0.5rem",
                      opacity: podiumIn ? 1 : 0,
                      transform: podiumIn ? "translateY(0)" : "translateY(16px)",
                      transition: `all 0.55s ease ${rankIdx * 0.12 + 0.1}s`,
                    }}>
                      <div style={{ fontSize: "1.6rem", lineHeight: 1 }}>{MEDALS[rankIdx]}</div>
                      <div style={{
                        fontWeight: 700, fontSize: "0.82rem",
                        color: isMe ? "var(--cyan)" : "var(--text)",
                        marginTop: "0.25rem",
                        maxWidth: 100, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {player.name}
                        {isMe && <span style={{ color: "var(--cyan)", fontSize: "0.65rem" }}> ★</span>}
                      </div>
                      <div style={{
                        fontFamily: "Orbitron, monospace", fontSize: "0.85rem",
                        fontWeight: 700, color: col, marginTop: "0.1rem",
                      }}>
                        {player.score}
                      </div>
                    </div>

                    {/* Animated bar */}
                    <div style={{
                      width: "100%",
                      background: `${col}18`,
                      border: `1px solid ${col}50`,
                      borderBottom: "none",
                      borderRadius: "6px 6px 0 0",
                      height: podiumIn ? h : 4,
                      transition: `height 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${rankIdx * 0.1}s`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: podiumIn ? `0 0 16px ${col}30` : "none",
                    }}>
                      {rankIdx === 0 && podiumIn && (
                        <span style={{ fontSize: "1.4rem", animation: "scorePop 0.5s ease 0.8s both" }}>👑</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mein Ergebnis */}
        {myPlayer && (
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "1.25rem",
            marginBottom: "1rem", textAlign: "center",
            position: "relative",
            animation: "fadeUp 0.4s ease 0.2s both",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, var(--yellow), transparent)",
            }} />
            <p style={{ color: "var(--text-dim)", fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "0.5rem", fontFamily: "Share Tech Mono, monospace" }}>
              DEIN ERGEBNIS
            </p>
            <div className="score-display" style={{ fontSize: "2.8rem", marginBottom: "0.2rem" }}>
              {myPlayer.score}
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
              von max. {totalPossible} Punkten &nbsp;·&nbsp; Platz {myRank} von {players.length}
            </p>
          </div>
        )}

        {/* Bestenliste (alle außer Podium) */}
        {players.length > 3 && (
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "1.1rem", marginBottom: "1rem",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
            }} />
            <h3 style={{ fontSize: "0.78rem", letterSpacing: "0.12em", marginBottom: "0.75rem", color: "var(--text-dim)" }}>
              ALLE AGENTEN
            </h3>
            {players.map((p, i) => (
              <div key={p.id}
                className={`leaderboard-item ${RANK_CLASS[i] || ""}`}
                style={{
                  opacity: 0,
                  animation: `fadeUp 0.4s ease ${i * 0.08}s forwards`,
                  borderRadius: 6,
                  background: p.id === myId ? "rgba(0,229,255,0.05)" : "var(--bg2)",
                }}
              >
                <span className="rank-num" style={{
                  color: i === 0 ? "var(--yellow)" : i === 1 ? "#ccc" : i === 2 ? "#cd7f32" : "var(--text-dim)",
                  fontSize: i < 3 ? "1.1rem" : "0.9rem",
                }}>
                  {i < 3 ? MEDALS[i] : `${i + 1}.`}
                </span>
                <div className="player-avatar">{p.name[0].toUpperCase()}</div>
                <span style={{ flex: 1, fontWeight: 700 }}>
                  {p.name}
                  {p.id === myId && <span style={{ color: "var(--cyan)", fontSize: "0.72rem", marginLeft: "0.4rem" }}>(du)</span>}
                </span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Orbitron, monospace", color: "var(--yellow)", fontWeight: 700 }}>
                    {p.score}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>
                    {Object.values(p.answeredPuzzles || {}).filter(a => a.correct).length}/{PUZZLES.length} ✓
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rätsel-Auswertung (Spieler) */}
        {myPlayer && (
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "1.1rem", marginBottom: "1rem",
          }}>
            <h3 style={{ fontSize: "0.78rem", letterSpacing: "0.12em", marginBottom: "0.75rem", color: "var(--text-dim)" }}>
              MEINE AUSWERTUNG
            </h3>
            {PUZZLES.map((p, i) => {
              const ans = myPlayer?.answeredPuzzles?.[i];
              return (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.5rem 0",
                  borderBottom: i < PUZZLES.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{ color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", fontSize: "0.8rem", width: 20 }}>
                    {i + 1}.
                  </span>
                  <span style={{ flex: 1, color: "var(--text)", fontSize: "0.88rem" }}>{p.room}</span>
                  <span style={{
                    color: ans?.correct ? "var(--green)" : ans ? "var(--red)" : "var(--text-dim)",
                    fontSize: "0.85rem", fontWeight: 700,
                  }}>
                    {ans ? `${ans.correct ? "✓" : "✗"} +${ans.earned}` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", paddingBottom: "2rem" }}>
          {isHost && (
            <>
              <button className="btn btn-secondary" onClick={exportCSV}>
                📥 Ergebnisse als CSV exportieren
              </button>
              <button
                className="btn btn-primary"
                onClick={restartGame}
                disabled={restarting}
                style={{ background: "transparent", color: "var(--green)", border: "1px solid rgba(0,255,136,0.4)", boxShadow: "0 0 16px rgba(0,255,136,0.15)" }}
              >
                {restarting ? <span>Starte neu<span className="blink">...</span></span> : "↺  Raum neu starten"}
              </button>
            </>
          )}
          <button className="btn btn-ghost" onClick={() => nav("/")}>
            ↩ Zum Start
          </button>
        </div>
      </div>
    </div>
  );
}
