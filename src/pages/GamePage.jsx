import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { PUZZLES } from "../data/puzzles";
import StoryIntro from "../components/StoryIntro";
import PuzzleCard from "../components/PuzzleCard";
import InterludeScreen from "../components/InterludeScreen";

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

  useEffect(() => {
    const unsub = onValue(ref(db, `rooms/${code}`), (snap) => {
      if (!snap.exists()) { nav("/"); return; }
      const data = snap.val();
      setRoom(data);
      setPlayers(data.players || {});

      if (data.status === "intro") {
        setShowIntro(true);
        setShowInterlude(false);
      }
      if (data.status === "finished") nav(`/end/${code}`);

      if (data.status === "playing" && !isHost) {
        const myAnswers = data.players?.[playerId]?.answeredPuzzles || {};
        setAnsweredThis(data.currentPuzzle in myAnswers);
        setScore(data.players?.[playerId]?.score || 0);
      }

      // Show interlude when host sets status to "interlude"
      if (data.status === "interlude") {
        setShowInterlude(true);
      } else if (data.status === "playing") {
        setShowInterlude(false);
      }
    });
    return () => unsub();
  }, [code]);

  async function handleIntroEnd() {
    setShowIntro(false);
    if (isHost) {
      await update(ref(db, `rooms/${code}`), { status: "playing", currentPuzzle: 0 });
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
  }

  async function handleNextPuzzle() {
    if (!isHost) return;
    const next = room.currentPuzzle + 1;
    if (next >= PUZZLES.length) {
      await update(ref(db, `rooms/${code}`), { status: "finished" });
    } else {
      await update(ref(db, `rooms/${code}`), {
        status: "playing",
        currentPuzzle: next,
      });
    }
  }

  async function handleHostInterlude() {
    // Host triggers interlude after puzzle
    await update(ref(db, `rooms/${code}`), { status: "interlude" });
  }

  const puzzle = room ? PUZZLES[room.currentPuzzle] : null;
  const playerList = Object.entries(players).map(([id, p]) => ({ id, ...p }));
  const answeredCount = isHost && puzzle
    ? playerList.filter(p => p.answeredPuzzles?.[room?.currentPuzzle]).length
    : 0;

  if (!room) {
    return (
      <div className="page">
        <p style={{ color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace" }}>
          Verbinde... <span className="blink">_</span>
        </p>
      </div>
    );
  }

  return (
    <div className="page" style={{ justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      {showIntro && <StoryIntro onDone={handleIntroEnd} />}

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

      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontFamily: "Share Tech Mono, monospace", color: "var(--text-dim)", fontSize: "0.75rem" }}>
            NOVA PROTOCOL
          </span>
          {!isHost && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>{playerName}</span>
              <span className="score-display" style={{ fontSize: "1.1rem" }}>{score}</span>
            </div>
          )}
          {isHost && <span className="badge badge-yellow">HOST</span>}
        </div>

        {/* Puzzle */}
        {puzzle && room.status === "playing" && (
          <div className="card">
            <PuzzleCard
              puzzle={puzzle}
              onAnswer={handleAnswer}
              isHost={isHost}
            />

            {/* Player: answered state */}
            {!isHost && answeredThis && (
              <div style={{
                marginTop: "1rem",
                padding: "0.75rem",
                textAlign: "center",
                background: "rgba(0,255,136,0.06)",
                border: "1px solid rgba(0,255,136,0.2)",
                borderRadius: 4,
              }}>
                <p style={{ color: "var(--green)", fontFamily: "Share Tech Mono, monospace", fontSize: "0.85rem" }}>
                  ✓ Antwort gesendet — warte auf nächstes Rätsel
                </p>
              </div>
            )}

            {/* Host controls */}
            {isHost && (
              <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                    Geantwortet: <span style={{ color: "var(--cyan)" }}>{answeredCount}/{playerList.length}</span>
                  </p>
                </div>

                {/* Live scores */}
                <div style={{ maxHeight: 160, overflowY: "auto", marginBottom: "0.75rem" }}>
                  {playerList.sort((a, b) => b.score - a.score).map((p, i) => (
                    <div key={p.id} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.4rem 0.6rem", marginBottom: "0.3rem",
                      background: "var(--bg2)", borderRadius: 2, fontSize: "0.9rem",
                    }}>
                      <div className="player-avatar" style={{ width: 24, height: 24, fontSize: "0.65rem" }}>
                        {p.name[0].toUpperCase()}
                      </div>
                      <span style={{ flex: 1 }}>{p.name}</span>
                      {p.answeredPuzzles?.[room.currentPuzzle] && (
                        <span style={{ color: "var(--green)", fontSize: "0.75rem" }}>✓</span>
                      )}
                      <span style={{ fontFamily: "Orbitron, monospace", color: "var(--yellow)", fontSize: "0.85rem" }}>
                        {p.score}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary" onClick={handleHostInterlude}>
                  📊 Zwischenstand + weiter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
