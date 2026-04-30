import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { QRCodeSVG } from "qrcode.react";

export default function LobbyPage() {
  const { code } = useParams();
  const nav = useNavigate();
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const isHost = sessionStorage.getItem("nova_host_code") === code;
  const joinUrl = `${window.location.origin}/join`;

  useEffect(() => {
    const unsub = onValue(ref(db, `rooms/${code}`), (snap) => {
      if (!snap.exists()) { nav("/"); return; }
      const data = snap.val();
      setPlayers(Object.values(data.players || {}));
      if (data.status === "intro" || data.status === "playing") nav(`/game/${code}`);
    });
    return () => unsub();
  }, [code]);

  async function startGame() {
    await update(ref(db, `rooms/${code}`), { status: "intro" });
  }

  function copyLink() {
    navigator.clipboard?.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="page" style={{ justifyContent: "flex-start", paddingTop: "1.5rem", position: "relative" }}>
      {/* Glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,255,136,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.3rem 0.8rem",
            background: "rgba(0,255,136,0.08)",
            border: "1px solid rgba(0,255,136,0.25)",
            borderRadius: 20, marginBottom: "0.75rem",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "inline-block", boxShadow: "0 0 8px var(--green)", animation: "blink 1.4s step-end infinite" }} />
            <span style={{ color: "var(--green)", fontSize: "0.65rem", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.1em" }}>
              LIVE — WARTERAUM
            </span>
          </div>
          <h2 style={{ marginBottom: "0.25rem" }}>NOVA PROTOCOL</h2>
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
            {isHost ? "Zeig den Code — warte auf alle Agenten" : "Warte auf Missionsbeginn..."}
          </p>
        </div>

        {/* Host: Join-Info */}
        {isHost && (
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "1.25rem", marginBottom: "1rem",
            position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
            }} />

            <p style={{ color: "var(--text-dim)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", fontFamily: "Share Tech Mono, monospace", textAlign: "center" }}>
              Schüler beitreten lassen
            </p>

            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              {/* QR */}
              <div style={{
                background: "#fff", padding: 10, borderRadius: 8,
                boxShadow: "0 0 0 1px rgba(0,229,255,0.3)", flexShrink: 0,
              }}>
                <QRCodeSVG value={joinUrl} size={108} fgColor="#06060f" bgColor="#ffffff" />
              </div>

              {/* Code + URL */}
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text-dim)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.3rem", fontFamily: "Share Tech Mono, monospace" }}>
                  Raum-Code
                </p>
                <div className="room-code" style={{ fontSize: "clamp(2.2rem, 10vw, 3rem)", marginBottom: "0.4rem", textShadow: "0 0 30px rgba(0,229,255,0.5)" }}>
                  {code}
                </div>
                <p style={{ color: "var(--text-dim)", fontSize: "0.68rem", fontFamily: "Share Tech Mono, monospace", marginBottom: "0.6rem" }}>
                  {joinUrl}
                </p>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem", width: "auto" }}
                  onClick={copyLink}
                >
                  {copied ? "✓ Kopiert!" : "📋 Link kopieren"}
                </button>
              </div>
            </div>

            <p style={{ color: "var(--text-dim)", fontSize: "0.65rem", marginTop: "0.9rem", fontFamily: "Share Tech Mono, monospace", textAlign: "center" }}>
              QR scannen &nbsp;·&nbsp; oder Website öffnen &nbsp;·&nbsp; Code eingeben
            </p>
          </div>
        )}

        {/* Player list */}
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "1.1rem", marginBottom: "1rem",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, var(--green), transparent)",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
            <h3 style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--text-dim)" }}>AGENTEN ONLINE</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span className="badge badge-green">{players.length}</span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.68rem", fontFamily: "Share Tech Mono, monospace" }}>bereit</span>
            </div>
          </div>

          {players.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.75rem 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.4 }}>🥷</div>
              <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Noch niemand beigetreten...
              </p>
              <span style={{ color: "var(--text-dim)", fontSize: "0.68rem", fontFamily: "Share Tech Mono, monospace" }}>
                <span className="blink">_</span> Warte auf Agenten
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {players.map((p, i) => (
                <div key={p.name + i} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.6rem 0.8rem",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
                }}>
                  <div className="player-avatar">{p.name[0].toUpperCase()}</div>
                  <span style={{ fontWeight: 700, flex: 1, fontSize: "0.95rem" }}>{p.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", boxShadow: "0 0 6px var(--green)" }} />
                    <span style={{ color: "var(--green)", fontSize: "0.68rem", fontFamily: "Share Tech Mono, monospace" }}>bereit</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start / Warten */}
        {isHost ? (
          <button
            className="btn btn-primary"
            onClick={startGame}
            disabled={players.length === 0}
            style={{ fontSize: "1rem", padding: "0.9rem" }}
          >
            {players.length === 0
              ? <span><span className="blink">_</span> Warte auf Spieler...</span>
              : `▶  Mission starten  (${players.length} ${players.length === 1 ? "Agent" : "Agenten"})`}
          </button>
        ) : (
          <div style={{
            textAlign: "center", padding: "1rem",
            border: "1px solid var(--border)", borderRadius: 8,
            color: "var(--text-dim)", fontSize: "0.85rem",
            fontFamily: "Share Tech Mono, monospace",
            background: "var(--card)",
          }}>
            <span className="blink">_</span>&nbsp; Warte auf Lehrer...
          </div>
        )}

        {/* Student: zeige Code */}
        {!isHost && (
          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "0.65rem", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.12em", marginBottom: "0.3rem" }}>
              DEIN RAUM-CODE
            </p>
            <div className="room-code" style={{ fontSize: "2.2rem" }}>{code}</div>
          </div>
        )}
      </div>
    </div>
  );
}
