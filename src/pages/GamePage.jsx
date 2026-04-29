import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { PUZZLES } from "../data/puzzles";
import { CHARACTERS } from "../data/characters";
import StoryIntro from "../components/StoryIntro";
import PuzzleCard from "../components/PuzzleCard";
import InterludeScreen from "../components/InterludeScreen";
import GlobalCountdown from "../components/GlobalCountdown";
import HintPopup from "../components/HintPopup";
import ConfettiEffect from "../components/ConfettiEffect";
import { playCorrect, playWrong, startAmbient, stopAmbient, toggleMute, isMuted } from "../utils/sounds";

export default function GamePage() {
  const { code } = useParams();
  const nav = useNavigate();
  const isHost = sessionStorage.getItem("nova_host_code") === code;
  const playerId = sessionStorage.getItem("nova_player_id");
  const playerName = sessionStorage.getItem("nova_player_name");

  const [room, setRoom] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [showInterlude, setShowInterlude] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredThis, setAnsweredThis] = useState(false);
  const [lastResult, setLastResult] = useState({ earned: 0, correct: false });
  const [players, setPlayers] = useState({});
  const [flash, setFlash] = useState(null); // "correct" | "wrong"
  const [confetti, setConfetti] = useState(false);
  const [hint, setHint] = useState(null);
  const [muted, setMuted] = useState(false);

  // Host-only states
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [hintChar, setHintChar] = useState("void");
  const [hintText, setHintText] = useState("");
  const [freeTextGrades, setFreeTextGrades] = useState({});
  const [customPoints, setCustomPoints] = useState({});

  useEffect(() => {
    const unsub = onValue(ref(db, `rooms/${code}`), (snap) => {
      if (!snap.exists()) { nav("/"); return; }
      const data = snap.val();
      setRoom(data);
      setPlayers(data.players || {});

      if (data.status === "intro") { setShowIntro(true); setShowInterlude(false); }
      if (data.status === "finished") nav(`/end/${code}`);
      if (data.status === "interlude") setShowInterlude(true);
      if (data.status === "playing") setShowInterlude(false);

      if (data.status === "playing" && !isHost) {
        const myAnswers = data.players?.[playerId]?.answeredPuzzles || {};
        setAnsweredThis(data.currentPuzzle in myAnswers);
        setScore(data.players?.[playerId]?.score || 0);
      }

      // Hint für Spieler
      if (data.hint && data.hint.timestamp !== hint?.timestamp) {
        setHint(data.hint);
      }
    });
    return () => unsub();
  }, [code]);

  // Ambient Musik starten wenn Spiel beginnt
  useEffect(() => {
    if (room?.status === "playing" || room?.status === "interlude") {
      startAmbient();
    }
    return () => stopAmbient();
  }, [room?.status]);

  async function handleIntroEnd() {
    setShowIntro(false);
    if (isHost) {
      await update(ref(db, `rooms/${code}`), {
        status: "playing",
        currentPuzzle: 0,
        startedAt: Date.now(),
      });
    }
  }

  async function handleAnswer(answerId, timeBonus) {
    if (!playerId || answeredThis) return;
    const puzzle = PUZZLES[room.currentPuzzle];
    let correct = false;

    if (puzzle.type === "multiple-choice" || puzzle.type === "error-find") {
      correct = answerId === puzzle.correct;
    } else if (puzzle.type === "sort") {
      correct = answerId === puzzle.correctOrder.join(",");
    } else if (puzzle.type === "build-slogan") {
      correct = true;
    }

    const earned = correct ? puzzle.points + timeBonus : Math.round(puzzle.points * 0.1);
    const newScore = score + earned;

    await update(ref(db, `rooms/${code}/players/${playerId}`), {
      score: newScore,
      [`answeredPuzzles/${room.currentPuzzle}`]: { answer: answerId, correct, earned },
    });

    setScore(newScore);
    setLastResult({ earned, correct });
    setAnsweredThis(true);

    // Sound + Flash
    if (correct) {
      playCorrect();
      setFlash("correct");
      if (room.currentPuzzle === PUZZLES.length - 1) setConfetti(true);
    } else {
      playWrong();
      setFlash("wrong");
    }
    setTimeout(() => setFlash(null), 700);
  }

  async function handleNextPuzzle() {
    if (!isHost) return;
    const next = room.currentPuzzle + 1;
    if (next >= PUZZLES.length) {
      await update(ref(db, `rooms/${code}`), { status: "finished" });
    } else {
      await update(ref(db, `rooms/${code}`), { status: "playing", currentPuzzle: next });
    }
  }

  async function handleSkipPuzzle() {
    if (!isHost) return;
    await handleNextPuzzle();
  }

  async function handleHostInterlude() {
    await update(ref(db, `rooms/${code}`), { status: "interlude" });
  }

  async function sendHint() {
    if (!hintText.trim()) return;
    await update(ref(db, `rooms/${code}`), {
      hint: { character: hintChar, text: hintText.trim(), timestamp: Date.now() },
    });
    setHintText("");
    setShowHintPanel(false);
  }

  async function grantCustomPoints(pid, points) {
    const player = players[pid];
    if (!player) return;
    const newScore = (player.score || 0) + parseInt(points);
    await update(ref(db, `rooms/${code}/players/${pid}`), { score: newScore });
    setFreeTextGrades(prev => ({ ...prev, [pid]: true }));
  }

  const puzzle = room ? PUZZLES[room.currentPuzzle] : null;
  const playerList = Object.entries(players).map(([id, p]) => ({ id, ...p }));
  const answeredCount = isHost && puzzle
    ? playerList.filter(p => p.answeredPuzzles?.[room?.currentPuzzle]).length
    : 0;
  const freeTextAnswers = isHost && puzzle?.type === "build-slogan"
    ? playerList.filter(p => p.answeredPuzzles?.[room?.currentPuzzle])
    : [];

  if (!room) return (
    <div className="page">
      <p style={{ color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace" }}>
        Verbinde... <span className="blink">_</span>
      </p>
    </div>
  );

  return (
    <div className="page" style={{ justifyContent: "flex-start", paddingTop: "1.25rem" }}>
      {/* Flash-Overlays */}
      {flash === "correct" && <div className="green-flash" />}
      {flash === "wrong" && <div className="red-flash" />}

      {/* Konfetti */}
      <ConfettiEffect trigger={confetti} />

      {/* Story Intro */}
      {showIntro && <StoryIntro onDone={handleIntroEnd} />}

      {/* Interlude */}
      {showInterlude && (
        <InterludeScreen
          puzzleIndex={room.currentPuzzle}
          players={playerList}
          myId={playerId}
          pointsEarned={lastResult.earned}
          wasCorrect={lastResult.correct}
          onNext={handleNextPuzzle}
          isHost={isHost}
        />
      )}

      {/* Hinweis-Popup für Spieler */}
      {!isHost && hint && (
        <HintPopup hint={hint} onClose={() => setHint(null)} />
      )}

      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Top-Bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "1rem", gap: "0.5rem",
        }}>
          <span style={{ fontFamily: "Share Tech Mono, monospace", color: "var(--text-dim)", fontSize: "0.72rem" }}>
            NOVA PROTOCOL
          </span>

          {/* Countdown */}
          {room.startedAt && <GlobalCountdown startedAt={room.startedAt} />}

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Mute-Button */}
            <button
              onClick={() => { const m = toggleMute(); setMuted(m); }}
              title={muted ? "Ton ein" : "Ton aus"}
              style={{
                background: "transparent", border: "1px solid var(--border)",
                borderRadius: 4, color: "var(--text-dim)",
                fontSize: "0.85rem", cursor: "pointer", padding: "0.2rem 0.4rem",
              }}
            >
              {muted ? "🔇" : "🔊"}
            </button>

            {!isHost && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ color: "var(--text-dim)", fontSize: "0.78rem" }}>{playerName}</span>
                <span className="score-display" style={{ fontSize: "1rem" }}>{score}</span>
              </div>
            )}
            {isHost && <span className="badge badge-yellow">HOST</span>}
          </div>
        </div>

        {/* Rätsel */}
        {puzzle && room.status === "playing" && (
          <div className="card">
            <PuzzleCard puzzle={puzzle} onAnswer={handleAnswer} isHost={isHost} />

            {/* Spieler: geantwortet */}
            {!isHost && answeredThis && (
              <div style={{
                marginTop: "1rem", padding: "0.75rem", textAlign: "center",
                background: lastResult.correct ? "rgba(0,255,136,0.06)" : "rgba(255,34,85,0.06)",
                border: `1px solid ${lastResult.correct ? "rgba(0,255,136,0.2)" : "rgba(255,34,85,0.2)"}`,
                borderRadius: 6,
              }}>
                <p style={{
                  color: lastResult.correct ? "var(--green)" : "var(--red)",
                  fontFamily: "Share Tech Mono, monospace", fontSize: "0.85rem",
                }}>
                  {lastResult.correct ? `✓ Richtig! +${lastResult.earned} Punkte` : `✗ Falsch — +${lastResult.earned} Punkte`}
                </p>
                <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                  Warte auf nächstes Rätsel...
                </p>
              </div>
            )}

            {/* Host Controls */}
            {isHost && (
              <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>

                {/* Fortschritt */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                    Geantwortet: <span style={{ color: "var(--cyan)", fontWeight: 700 }}>{answeredCount}/{playerList.length}</span>
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {/* Hinweis senden */}
                    <button
                      className="btn btn-ghost"
                      style={{ width: "auto", padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}
                      onClick={() => setShowHintPanel(p => !p)}
                    >
                      💡 Hinweis
                    </button>
                    {/* Überspringen */}
                    <button
                      className="btn btn-ghost"
                      style={{ width: "auto", padding: "0.3rem 0.6rem", fontSize: "0.78rem", color: "var(--yellow)", borderColor: "rgba(255,214,0,0.3)" }}
                      onClick={handleSkipPuzzle}
                    >
                      ⏭ Skip
                    </button>
                  </div>
                </div>

                {/* Hinweis-Panel */}
                {showHintPanel && (
                  <div style={{
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "0.9rem", marginBottom: "0.75rem",
                  }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Hinweis von:
                    </p>
                    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.6rem" }}>
                      {Object.values(CHARACTERS).map(c => (
                        <button key={c.id}
                          onClick={() => setHintChar(c.id)}
                          style={{
                            flex: 1, padding: "0.4rem 0.3rem",
                            background: hintChar === c.id ? `${c.color}20` : "transparent",
                            border: `1px solid ${hintChar === c.id ? c.color : "var(--border)"}`,
                            borderRadius: 6, cursor: "pointer",
                            color: hintChar === c.id ? c.color : "var(--text-dim)",
                            fontSize: "0.75rem", fontFamily: "Share Tech Mono, monospace",
                          }}
                        >
                          {c.id === "void" ? "👩‍💻" : c.id === "signal" ? "🥷" : "🤖"} {c.name}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={hintText}
                      onChange={e => setHintText(e.target.value)}
                      placeholder="Hinweis eingeben..."
                      rows={2}
                      style={{ marginBottom: "0.5rem", resize: "none" }}
                    />
                    <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.55rem" }} onClick={sendHint}>
                      💡 Hinweis senden
                    </button>
                  </div>
                )}

                {/* Freitext-Bewertung für Slogan-Rätsel */}
                {puzzle.type === "build-slogan" && freeTextAnswers.length > 0 && (
                  <div style={{
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "0.9rem", marginBottom: "0.75rem",
                  }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--yellow)", marginBottom: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      ✏️ Slogans bewerten
                    </p>
                    {freeTextAnswers.map(p => (
                      <div key={p.id} style={{
                        display: "flex", gap: "0.5rem", alignItems: "center",
                        marginBottom: "0.5rem", flexWrap: "wrap",
                      }}>
                        <span style={{ color: "var(--cyan)", fontSize: "0.8rem", minWidth: 70 }}>{p.name}:</span>
                        <span style={{ flex: 1, color: "var(--text)", fontSize: "0.82rem", fontStyle: "italic" }}>
                          "{p.answeredPuzzles[room.currentPuzzle]?.answer}"
                        </span>
                        {!freeTextGrades[p.id] ? (
                          <>
                            <input
                              type="number" min={0} max={300}
                              placeholder="Pkt."
                              value={customPoints[p.id] || ""}
                              onChange={e => setCustomPoints(prev => ({ ...prev, [p.id]: e.target.value }))}
                              style={{ width: 55, padding: "0.3rem 0.4rem", fontSize: "0.85rem" }}
                            />
                            <button
                              className="btn btn-primary"
                              style={{ width: "auto", padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}
                              onClick={() => grantCustomPoints(p.id, customPoints[p.id] || 100)}
                            >
                              ✓
                            </button>
                          </>
                        ) : (
                          <span style={{ color: "var(--green)", fontSize: "0.78rem" }}>✓ Bewertet</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Live-Scores */}
                <div style={{ maxHeight: 150, overflowY: "auto", marginBottom: "0.75rem" }}>
                  {playerList.sort((a, b) => b.score - a.score).map((p, i) => (
                    <div key={p.id} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.4rem 0.6rem", marginBottom: "0.25rem",
                      background: "var(--bg2)", borderRadius: 4, fontSize: "0.88rem",
                    }}>
                      <div className="player-avatar" style={{ width: 24, height: 24, fontSize: "0.65rem" }}>
                        {p.name[0].toUpperCase()}
                      </div>
                      <span style={{ flex: 1 }}>{p.name}</span>
                      {p.answeredPuzzles?.[room.currentPuzzle] && (
                        <span style={{ color: "var(--green)", fontSize: "0.75rem" }}>✓</span>
                      )}
                      <span style={{ fontFamily: "Orbitron, monospace", color: "var(--yellow)", fontSize: "0.82rem" }}>
                        {p.score}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary" onClick={handleHostInterlude}>
                  📊 Zwischenstand zeigen
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
