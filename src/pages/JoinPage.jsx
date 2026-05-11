import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db } from "../firebase";

function generatePlayerId() {
  return "p_" + Math.random().toString(36).slice(2, 10);
}

export default function JoinPage() {
  const nav = useNavigate();
  const [code, setCode]       = useState("");
  const [name, setName]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // Reconnect state
  const [prevSession, setPrevSession] = useState(null);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    // Sitzung nach 12h automatisch ablaufen lassen
    const savedTime = localStorage.getItem("nova_session_time");
    const isExpired = !savedTime || (Date.now() - parseInt(savedTime)) > 12 * 3600 * 1000;
    if (isExpired) {
      localStorage.removeItem("nova_player_id");
      localStorage.removeItem("nova_player_name");
      localStorage.removeItem("nova_room_code");
      localStorage.removeItem("nova_session_time");
      return;
    }
    const savedId   = localStorage.getItem("nova_player_id");
    const savedName = localStorage.getItem("nova_player_name");
    const savedCode = localStorage.getItem("nova_room_code");
    if (savedId && savedName && savedCode) {
      setPrevSession({ id: savedId, name: savedName, code: savedCode });
    }
  }, []);

  async function handleReconnect() {
    if (!prevSession) return;
    setReconnecting(true);
    setError("");
    try {
      const roomSnap = await get(ref(db, `rooms/${prevSession.code}`));
      if (!roomSnap.exists()) {
        setError("Dein alter Raum existiert nicht mehr.");
        clearSession();
        setReconnecting(false);
        return;
      }
      const room = roomSnap.val();
      if (room.status === "finished") {
        setError("Das Spiel in diesem Raum ist bereits beendet.");
        clearSession();
        setReconnecting(false);
        return;
      }
      const playerSnap = await get(ref(db, `rooms/${prevSession.code}/players/${prevSession.id}`));
      if (!playerSnap.exists()) {
        setError("Dein Spieler-Slot wurde nicht gefunden. Bitte neu beitreten.");
        clearSession();
        setReconnecting(false);
        return;
      }
      // Restore session
      sessionStorage.setItem("nova_player_id",   prevSession.id);
      sessionStorage.setItem("nova_player_name", prevSession.name);
      sessionStorage.setItem("nova_room_code",   prevSession.code);
      nav(room.status === "lobby" ? `/lobby/${prevSession.code}` : `/game/${prevSession.code}`);
    } catch (err) {
      setError("Verbindungsfehler beim Wiederherstellen.");
      console.error(err);
    }
    setReconnecting(false);
  }

  function clearSession() {
    localStorage.removeItem("nova_player_id");
    localStorage.removeItem("nova_player_name");
    localStorage.removeItem("nova_room_code");
    localStorage.removeItem("nova_session_time");
    setPrevSession(null);
  }

  async function handleJoin(e) {
    e.preventDefault();
    setError("");
    const trimCode = code.trim().toUpperCase();
    const trimName = name.trim();
    if (!trimCode || !trimName) return setError("Bitte Code und Name eingeben.");
    if (trimCode.length !== 4) return setError("Raum-Code muss genau 4 Zeichen haben.");
    if (trimName.length < 2) return setError("Name muss mind. 2 Zeichen haben.");

    setLoading(true);
    try {
      const roomSnap = await get(ref(db, `rooms/${trimCode}`));
      if (!roomSnap.exists()) { setError("Raum nicht gefunden. Code nochmal prüfen."); setLoading(false); return; }
      const room = roomSnap.val();
      if (room.status !== "lobby") { setError("Das Spiel hat bereits begonnen."); setLoading(false); return; }

      // Doppelte Namen verhindern: " (2)", " (3)" anhängen
      let finalName = trimName;
      let suffix = 1;
      const existingNames = Object.values(room.players || {}).map(p => p.name);
      while (existingNames.includes(finalName)) {
        suffix++;
        finalName = `${trimName} (${suffix})`;
      }

      const playerId = generatePlayerId();
      // Save to both sessionStorage AND localStorage (for reconnect)
      sessionStorage.setItem("nova_player_id",   playerId);
      sessionStorage.setItem("nova_player_name", finalName);
      sessionStorage.setItem("nova_room_code",   trimCode);
      localStorage.setItem("nova_player_id",     playerId);
      localStorage.setItem("nova_player_name",   finalName);
      localStorage.setItem("nova_room_code",     trimCode);
      localStorage.setItem("nova_session_time",  String(Date.now()));

      await update(ref(db, `rooms/${trimCode}/players/${playerId}`), {
        name: finalName, score: 0, joinedAt: Date.now(), answeredPuzzles: {},
      });
      nav(`/lobby/${trimCode}`);
    } catch (err) {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="page" style={{ position: "relative", overflow: "hidden" }}>
      {/* Glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(0,229,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{
            width: 60, height: 60, borderRadius: 12,
            border: "2px solid var(--cyan)",
            background: "rgba(0,229,255,0.08)",
            boxShadow: "0 0 24px rgba(0,229,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", margin: "0 auto 0.9rem",
          }}>
            🥷
          </div>
          <span className="badge badge-cyan" style={{ marginBottom: "0.6rem", display: "inline-block" }}>
            INFILTRATION
          </span>
          <h2 style={{ marginBottom: "0.25rem" }}>Netzwerk beitreten</h2>
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
            Gib den Code deines Lehrers ein
          </p>
        </div>

        {/* Reconnect Banner */}
        {prevSession && (
          <div style={{
            background: "rgba(0,229,255,0.07)",
            border: "1px solid rgba(0,229,255,0.3)",
            borderLeft: "3px solid var(--cyan)",
            borderRadius: "0 8px 8px 0",
            padding: "0.9rem 1rem",
            marginBottom: "1rem",
            animation: "fadeUp 0.35s ease forwards",
          }}>
            <p style={{ fontSize: "0.65rem", color: "var(--cyan)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
              SITZUNG GEFUNDEN
            </p>
            <p style={{ color: "var(--text)", fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.6rem" }}>
              Weitermachen als <span style={{ color: "var(--cyan)" }}>{prevSession.name}</span>?
              <span style={{ color: "var(--text-dim)", fontWeight: 400, fontSize: "0.78rem", marginLeft: "0.4rem" }}>
                (Raum {prevSession.code})
              </span>
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                onClick={handleReconnect}
                disabled={reconnecting}
              >
                {reconnecting
                  ? <span>Verbinde<span className="blink">...</span></span>
                  : "▶  Weitermachen"}
              </button>
              <button
                className="btn btn-ghost"
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.82rem", width: "auto" }}
                onClick={clearSession}
              >
                ✕ Ignorieren
              </button>
            </div>
          </div>
        )}

        {/* Join Card */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "1.5rem",
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
          }} />

          <form onSubmit={handleJoin}>
            <div className="field">
              <label>Raum-Code</label>
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, ""))}
                placeholder="0000"
                maxLength={6}
                style={{
                  textAlign: "center",
                  fontSize: "clamp(1.8rem, 10vw, 2.4rem)",
                  letterSpacing: "0.5em",
                  fontFamily: "Orbitron, monospace",
                  fontWeight: 900,
                  color: "var(--cyan)",
                  padding: "0.9rem",
                  background: "var(--bg)",
                  textShadow: code ? "0 0 20px rgba(0,229,255,0.4)" : "none",
                  transition: "text-shadow 0.3s",
                }}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label>Dein Deckname</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Agent XY..."
                maxLength={20}
                style={{ fontSize: "1.05rem" }}
                autoComplete="off"
              />
            </div>

            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.65rem 0.9rem",
                background: "rgba(255,34,85,0.08)",
                border: "1px solid rgba(255,34,85,0.3)",
                borderRadius: 6,
                color: "var(--red)",
                fontSize: "0.88rem",
                marginBottom: "1rem",
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !code || !name}
              style={{ fontSize: "1rem", padding: "0.9rem" }}
            >
              {loading
                ? <span>Verbinde<span className="blink">...</span></span>
                : "▶  Infiltrieren"}
            </button>
          </form>
        </div>

        <button className="btn btn-ghost" style={{ marginTop: "0.75rem" }} onClick={() => nav("/")}>
          ← Zurück
        </button>
      </div>
    </div>
  );
}
