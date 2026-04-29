import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { PUZZLES } from "../data/puzzles";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_CLASS = ["first", "second", "third"];

export default function EndPage() {
  const { code } = useParams();
  const nav = useNavigate();
  const [players, setPlayers] = useState([]);
  const myId = sessionStorage.getItem("nova_player_id");

  useEffect(() => {
    const unsub = onValue(ref(db, `rooms/${code}/players`), (snap) => {
      if (!snap.exists()) return;
      const list = Object.entries(snap.val()).map(([id, p]) => ({ id, ...p }));
      setPlayers(list.sort((a, b) => b.score - a.score));
    });
    return () => unsub();
  }, [code]);

  const totalPossible = PUZZLES.reduce((s, p) => s + p.points + 50, 0);
  const myPlayer = players.find(p => p.id === myId);
  const myRank = players.findIndex(p => p.id === myId) + 1;
  const heralStopped = players.length > 0 && players[0].score > 0;

  return (
    <div className="page" style={{ justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Victory / defeat */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            fontSize: "3rem",
            marginBottom: "0.5rem",
            filter: "drop-shadow(0 0 20px rgba(0,255,136,0.5))",
          }}>
            {heralStopped ? "⚡" : "💀"}
          </div>
          <h1 style={{
            color: heralStopped ? "var(--green)" : "var(--red)",
            fontSize: "clamp(1.2rem, 5vw, 2rem)",
            marginBottom: "0.5rem",
          }}>
            {heralStopped ? "HERALD gestoppt!" : "Mission gescheitert."}
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
            {heralStopped
              ? "Ihr habt die Sprache der Werbung durchschaut. Die Welt ist frei."
              : "HERALD ist online. Niemand kauft mehr freiwillig."}
          </p>
        </div>

        {/* My result */}
        {myPlayer && (
          <div className="card" style={{ marginBottom: "1rem", textAlign: "center" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
              DEIN ERGEBNIS
            </p>
            <div className="score-display" style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>
              {myPlayer.score}
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
              von max. {totalPossible} Punkten · Platz {myRank} von {players.length}
            </p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            BESTENLISTE
          </h3>
          {players.map((p, i) => (
            <div
              key={p.id}
              className={`leaderboard-item ${RANK_CLASS[i] || ""}`}
              style={{ opacity: 0, animation: `fadeUp 0.4s ease ${i * 0.1}s forwards` }}
            >
              <span className="rank-num" style={{ color: i < 3 ? ["var(--yellow)", "#ccc", "#cd7f32"][i] : "var(--text-dim)" }}>
                {i < 3 ? MEDALS[i] : `${i + 1}.`}
              </span>
              <div className="player-avatar">{p.name[0].toUpperCase()}</div>
              <span style={{ flex: 1, fontWeight: 700 }}>{p.name}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Orbitron, monospace", color: "var(--yellow)", fontWeight: 700 }}>
                  {p.score}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                  {Object.values(p.answeredPuzzles || {}).filter(a => a.correct).length}/{PUZZLES.length} richtig
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Per-puzzle breakdown */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            RÄTSEL-AUSWERTUNG
          </h3>
          {PUZZLES.map((p, i) => {
            const myAnswer = myPlayer?.answeredPuzzles?.[i];
            return (
              <div key={p.id} style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 0",
                borderBottom: i < PUZZLES.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: "0.9rem",
              }}>
                <span style={{ color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", width: 20 }}>
                  {i + 1}.
                </span>
                <span style={{ flex: 1, color: "var(--text-dim)" }}>{p.room}</span>
                {myAnswer ? (
                  <span style={{ color: myAnswer.correct ? "var(--green)" : "var(--red)" }}>
                    {myAnswer.correct ? `+${myAnswer.earned}` : `+${myAnswer.earned}`}
                  </span>
                ) : (
                  <span style={{ color: "var(--text-dim)" }}>—</span>
                )}
              </div>
            );
          })}
        </div>

        <button className="btn btn-secondary" onClick={() => nav("/")}>
          ↩ Zum Start
        </button>
      </div>
    </div>
  );
}
