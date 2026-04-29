import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { db } from "../firebase";
import { PUZZLES } from "../data/puzzles";

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function HostPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="page">
      <div className="card fade-up">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span className="badge badge-yellow" style={{ marginBottom: "0.75rem", display: "inline-block" }}>
            LEHRER-ZUGANG
          </span>
          <h2>Neue Mission starten</h2>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            Erstellt einen Raum — Schüler treten mit dem Code bei
          </p>
        </div>

        <div style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: "1rem",
          marginBottom: "1.5rem",
        }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "0.5rem", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.05em" }}>
            MISSIONSPROFIL
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {PUZZLES.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--cyan)", fontFamily: "Share Tech Mono, monospace", width: 20 }}>
                  {i + 1}.
                </span>
                <span style={{ color: "var(--text-dim)" }}>{p.room}</span>
                <span style={{ marginLeft: "auto" }} className="badge badge-yellow">{p.points} Pkt.</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            padding: "0.6rem 0.8rem",
            background: "rgba(255,34,85,0.1)",
            border: "1px solid rgba(255,34,85,0.3)",
            borderRadius: 2,
            color: "var(--red)",
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={createRoom} disabled={loading}>
          {loading ? "Erstelle Raum..." : "⊞ Raum erstellen"}
        </button>
        <button className="btn btn-ghost" style={{ marginTop: "0.75rem" }} onClick={() => nav("/")}>
          ← Zurück
        </button>
      </div>
    </div>
  );
}
