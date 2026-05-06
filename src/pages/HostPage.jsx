import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { db } from "../firebase";
import { PUZZLES } from "../data/puzzles";

const TYPE_LABELS = {
  "multiple-choice": { label: "Multiple Choice", color: "var(--cyan)"   },
  "sort":            { label: "Sortieren",        color: "var(--green)"  },
  "match":           { label: "Zuordnen",         color: "var(--yellow)" },
  "build-slogan":    { label: "Slogan schreiben", color: "var(--red)"    },
};

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function HostPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPoints = PUZZLES.reduce((s, p) => s + p.points, 0);

  async function createRoom() {
    setLoading(true);
    setError("");
    try {
      const code = generateCode();
      await set(ref(db, `rooms/${code}`), {
        code,
        status: "lobby",
        currentPuzzle: 0,
        totalPuzzles: PUZZLES.length,
        createdAt: Date.now(),
        players: {},
      });
      sessionStorage.setItem("nova_host_code", code);
      nav(`/lobby/${code}`);
    } catch (err) {
      setError("Firebase nicht konfiguriert. Bitte firebase.js anpassen.");
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="page" style={{ position: "relative", overflow: "hidden" }}>
      {/* Glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255,214,0,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: 60, height: 60, borderRadius: 12,
            border: "2px solid var(--yellow)",
            background: "rgba(255,214,0,0.08)",
            boxShadow: "0 0 24px rgba(255,214,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", margin: "0 auto 0.9rem",
          }}>
            🎓
          </div>
          <span className="badge badge-yellow" style={{ marginBottom: "0.6rem", display: "inline-block" }}>
            LEHRER-ZUGANG
          </span>
          <h2 style={{ marginBottom: "0.25rem" }}>Neue Mission starten</h2>
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
            Erstelle einen Raum — Schüler treten mit dem Code bei
          </p>
        </div>

        {/* Mission card */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "1.25rem",
          marginBottom: "1rem",
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, var(--yellow), transparent)",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.1em" }}>
              MISSIONSPROFIL
            </p>
            <span className="badge badge-yellow">{totalPoints} Pkt. gesamt</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {PUZZLES.map((p, i) => {
              const typeInfo = TYPE_LABELS[p.type] || { label: p.type, color: "var(--text-dim)" };
              return (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.6rem 0.75rem",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: "0.88rem",
                }}>
                  <span style={{
                    fontFamily: "Orbitron, monospace", fontSize: "0.7rem",
                    color: "var(--text-dim)", width: 18, flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: "0.1rem" }}>
                      {p.room}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: typeInfo.color, fontFamily: "Share Tech Mono, monospace" }}>
                      {typeInfo.label} · {p.timeLimit}s
                    </div>
                  </div>
                  <span className="badge badge-yellow" style={{ fontSize: "0.65rem" }}>
                    {p.points} Pkt.
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info boxes */}
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
          {[
            { label: "Rätsel", value: PUZZLES.length, color: "var(--cyan)" },
            { label: "Max. Punkte", value: totalPoints + "+", color: "var(--yellow)" },
            { label: "Min. ca.", value: "55 min", color: "var(--green)" },
          ].map(item => (
            <div key={item.label} style={{
              flex: 1, textAlign: "center",
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "0.75rem 0.5rem",
            }}>
              <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, color: item.color, fontSize: "1.1rem" }}>
                {item.value}
              </div>
              <div style={{ fontSize: "0.62rem", color: "var(--text-dim)", marginTop: "0.2rem", fontFamily: "Share Tech Mono, monospace" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            padding: "0.65rem 0.9rem",
            background: "rgba(255,34,85,0.08)",
            border: "1px solid rgba(255,34,85,0.3)",
            borderRadius: 6, color: "var(--red)",
            fontSize: "0.88rem", marginBottom: "1rem",
          }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={createRoom} disabled={loading}
          style={{ fontSize: "1rem", padding: "0.9rem" }}>
          {loading ? <span>Erstelle Raum<span className="blink">...</span></span> : "⊞  Raum erstellen"}
        </button>
        <button className="btn btn-ghost" style={{ marginTop: "0.65rem" }} onClick={() => nav("/")}>
          ← Zurück
        </button>
      </div>
    </div>
  );
}
