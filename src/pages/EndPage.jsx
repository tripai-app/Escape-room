import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { PUZZLES } from "../data/puzzles";
import ConfettiEffect from "../components/ConfettiEffect";
import { playVictory } from "../utils/sounds";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_CLASS = ["first", "second", "third"];

export default function EndPage() {
  const { code } = useParams();
  const nav = useNavigate();
  const [players, setPlayers] = useState([]);
  const [confetti, setConfetti] = useState(false);
  const myId = sessionStorage.getItem("nova_player_id");
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
      setTimeout(() => { setConfetti(true); playVictory(); }, 600);
    }
  }, [players.length > 0]);

  function exportCSV() {
    const rows = [
      ["Platz", "Name", "Punkte", "Richtige Antworten", "Falsche Antworten"],
      ...players.map((p, i) => {
        const answers = Object.values(p.answeredPuzzles || {});
        const correct = answers.filter(a => a.correct).length;
        const wrong = answers.length - correct;
        return [i + 1, p.name, p.score, correct, wrong];
      }),
    ];
    const csv = rows.map(r => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nova-protocol-ergebnisse-${code}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPossible = PUZZLES.reduce((s, p) => s + p.points + 50, 0);
  const myPlayer = players.find(p => p.id === myId);
  const myRank = players.findIndex(p => p.id === myId) + 1;
  const missionSuccess = players.length > 0 && players[0].score > 0;

  return (
    <div className="page" style={{ justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <ConfettiEffect trigger={confetti} />

      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Ergebnis-Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>
            {missionSuccess ? "⚡" : "💀"}
          </div>
          <h1 style={{
            color: missionSuccess ? "var(--green)" : "var(--red)",
            fontSize: "clamp(1.3rem, 6vw, 2.2rem)",
            marginBottom: "0.4rem",
            textShadow: missionSuccess ? "0 0 30px rgba(0,255,136,0.4)" : "0 0 30px rgba(255,34,85,0.4)",
          }}>
            {missionSuccess ? "HERALD gestoppt!" : "Mission gescheitert."}
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {missionSuccess
              ? "Ihr habt die Sprache der Werbung durchschaut. Die Welt ist frei."
              : "HERALD ist online. Niemand kauft mehr freiwillig."}
          </p>
        </div>

        {/* Mein Ergebnis */}
        {myPlayer && (
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "1.25rem",
            marginBottom: "1rem", textAlign: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, var(--yellow), transparent)",
            }} />
            <p style={{ color: "var(--text-dim)", fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
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

        {/* Bestenliste */}
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
            BESTENLISTE
          </h3>
          {players.map((p, i) => (
            <div key={p.id}
              className={`leaderboard-item ${RANK_CLASS[i] || ""}`}
              style={{
                opacity: 0, animation: `fadeUp 0.4s ease ${i * 0.1}s forwards`,
                borderRadius: 6,
                background: p.id === myId ? "rgba(0,229,255,0.05)" : "var(--bg2)",
              }}
            >
              <span className="rank-num" style={{
                color: i === 0 ? "var(--yellow)" : i === 1 ? "#ccc" : i === 2 ? "#cd7f32" : "var(--text-dim)",
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

        {/* Rätsel-Auswertung */}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {isHost && (
            <button className="btn btn-secondary" onClick={exportCSV}>
              📥 Ergebnisse als CSV exportieren
            </button>
          )}
          <button className="btn btn-ghost" onClick={() => nav("/")}>
            ↩ Zum Start
          </button>
        </div>
      </div>
    </div>
  );
}
