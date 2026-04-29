import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { QRCodeSVG } from "qrcode.react";

export default function LobbyPage() {
  const { code } = useParams();
  const nav = useNavigate();
  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState(null);
  const [copied, setCopied] = useState(false);
  const isHost = sessionStorage.getItem("nova_host_code") === code;

  const joinUrl = `${window.location.origin}/join`;

  useEffect(() => {
    const roomRef = ref(db, `rooms/${code}`);
    const unsub = onValue(roomRef, (snap) => {
      if (!snap.exists()) { nav("/"); return; }
      const data = snap.val();
      setRoom(data);
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
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page" style={{ justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <span className="badge badge-green" style={{ marginBottom: "0.6rem", display: "inline-block" }}>
            ● LIVE — WARTERAUM
          </span>
          <h2 style={{ marginBottom: "0.2rem" }}>NOVA PROTOCOL</h2>
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
            {isHost ? "Zeig den Code — warte auf alle Agenten" : "Warte auf Missionsbeginn..."}
          </p>
        </div>

        {/* Join-Info Card (Host only — das ist das Wichtigste!) */}
        {isHost && (
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "1.25rem",
            marginBottom: "1rem",
            textAlign: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
            }} />

            <p style={{ color: "var(--text-dim)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem", fontFamily: "Share Tech Mono, monospace" }}>
              Schüler beitreten lassen
            </p>

            {/* Two-column: QR + Code */}
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>

              {/* QR Code */}
              <div style={{
                background: "#fff",
                padding: "10px",
                borderRadius: 8,
                display: "inline-block",
                flexShrink: 0,
              }}>
                <QRCodeSVG value={joinUrl} size={110} fgColor="#06060f" bgColor="#ffffff" />
              </div>

              {/* Right side */}
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text-dim)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem", fontFamily: "Share Tech Mono, monospace" }}>
                  Raum-Code
                </p>
                <div className="room-code" style={{ fontSize: "clamp(2.5rem, 12vw, 3.5rem)", marginBottom: "0.5rem" }}>
                  {code}
                </div>
                <p style={{ color: "var(--text-dim)", fontSize: "0.72rem", fontFamily: "Share Tech Mono, monospace", marginBottom: "0.6rem" }}>
                  {joinUrl}
                </p>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "0.4rem 0.9rem", fontSize: "0.8rem", width: "auto" }}
                  onClick={copyLink}
                >
                  {copied ? "✓ Kopiert!" : "📋 Link kopieren"}
                </button>
              </div>
            </div>

            <p style={{ color: "var(--text-dim)", fontSize: "0.72rem", marginTop: "0.9rem", fontFamily: "Share Tech Mono, monospace" }}>
              QR scannen &nbsp;·&nbsp; oder Website öffnen &nbsp;·&nbsp; Code eingeben
            </p>
          </div>
        )}

        {/* Player list */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "1.1rem",
          marginBottom: "1rem",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, var(--red), transparent)",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.78rem", letterSpacing: "0.12em", color: "var(--text-dim)" }}>AGENTEN ONLINE</h3>
            <span className="badge badge-cyan">{players.length} / ∞</span>
          </div>

          {players.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                Noch niemand beigetreten...
              </p>
              <span style={{ color: "var(--text-dim)", fontSize: "0.7rem", fontFamily: "Share Tech Mono, monospace" }}>
                <span className="blink">_</span> Warte auf Agenten
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {players.map((p, i) => (
                <div key={p.name + i} className="player-item" style={{
                  borderRadius: 6,
                  animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
                }}>
                  <div className="player-avatar">{p.name[0].toUpperCase()}</div>
                  <span style={{ fontWeight: 700, flex: 1 }}>{p.name}</span>
                  <span style={{ color: "var(--green)", fontSize: "0.72rem", fontFamily: "Share Tech Mono, monospace" }}>
                    ● bereit
                  </span>
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
            style={{ fontSize: "1rem", padding: "0.85rem" }}
          >
            {players.length === 0
              ? "Warte auf Spieler..."
              : `▶  Mission starten  (${players.length} ${players.length === 1 ? "Agent" : "Agenten"})`}
          </button>
        ) : (
          <div style={{
            textAlign: "center", padding: "0.9rem",
            border: "1px solid var(--border)", borderRadius: 6,
            color: "var(--text-dim)", fontSize: "0.85rem",
            fontFamily: "Share Tech Mono, monospace",
            background: "var(--card)",
          }}>
            <span className="blink">_</span>&nbsp; Warte auf Lehrer...
          </div>
        )}

        {/* Student: show code too */}
        {!isHost && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "0.72rem", fontFamily: "Share Tech Mono, monospace", marginBottom: "0.25rem" }}>
              DEIN RAUM-CODE
            </p>
            <div className="room-code" style={{ fontSize: "2rem" }}>{code}</div>
          </div>
        )}
      </div>
    </div>
  );
}
