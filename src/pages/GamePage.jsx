import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { PUZZLES } from "../data/puzzles";
import { CHARACTERS } from "../data/characters";
import StoryIntro from "../components/StoryIntro";
import PuzzleCard from "../components/PuzzleCard";
import PuzzleBriefing from "../components/PuzzleBriefing";
import InterludeScreen from "../components/InterludeScreen";
import CountdownOverlay from "../components/CountdownOverlay";
import GlobalCountdown from "../components/GlobalCountdown";
import HintPopup from "../components/HintPopup";
import ConfettiEffect from "../components/ConfettiEffect";
import { playCorrect, playWrong, playAllAnswered, startAmbient, stopAmbient, toggleMute, isMuted } from "../utils/sounds";

export default function GamePage() {
  const { code } = useParams();
  const nav = useNavigate();
  const isHost   = sessionStorage.getItem("nova_host_code") === code;
  const playerId = sessionStorage.getItem("nova_player_id");
  const playerName = sessionStorage.getItem("nova_player_name");

  const [room, setRoom]           = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [showInterlude, setShowInterlude] = useState(false);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [answeredThis, setAnsweredThis] = useState(false);
  const [lastResult, setLastResult] = useState({ earned: 0, correct: false });
  const [players, setPlayers]     = useState({});
  const [flash, setFlash]         = useState(null);  // "correct" | "wrong" | "streak" | "first"
  const [confetti, setConfetti]   = useState(false);
  const [hint, setHint]           = useState(null);
  const [muted, setMuted]         = useState(isMuted());
  const [isFullscreen, setIsFullscreen]  = useState(false);
  const [firstCorrectMap, setFirstCorrectMap] = useState({});

  // Host-only states
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [hintChar, setHintChar]   = useState("void");
  const [hintText, setHintText]   = useState("");
  const [freeTextGrades, setFreeTextGrades] = useState({});
  const [customPoints, setCustomPoints]     = useState({});

  const prevAnsweredCount = useRef(0);
  const ambientStarted    = useRef(false);

  // ── Firebase listener ──────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onValue(ref(db, `rooms/${code}`), (snap) => {
      if (!snap.exists()) { nav("/"); return; }
      const data = snap.val();
      setRoom(data);
      setPlayers(data.players || {});

      if (data.status === "intro")     { setShowIntro(true); setShowInterlude(false); }
      if (data.status === "finished")  nav(`/end/${code}`);
      if (data.status === "interlude") setShowInterlude(true);
      if (data.status === "playing" || data.status === "briefing") setShowInterlude(false);

      // Track firstCorrect map for host display
      if (data.firstCorrect) setFirstCorrectMap(data.firstCorrect);

      if (!isHost) {
        const myData = data.players?.[playerId];
        if (data.status === "playing") {
          const myAnswers = myData?.answeredPuzzles || {};
          const alreadyAnswered = data.currentPuzzle in myAnswers;
          setAnsweredThis(alreadyAnswered);
          setScore(myData?.score || 0);
          setStreak(myData?.streak || 0);

          // Reconnect: restore lastResult from Firebase if we re-joined mid-puzzle
          if (alreadyAnswered && myAnswers[data.currentPuzzle]) {
            const saved = myAnswers[data.currentPuzzle];
            setLastResult({ earned: saved.earned || 0, correct: saved.correct || false });
          }
        }
        if (data.status === "briefing") {
          setAnsweredThis(false);
          setScore(myData?.score || 0);
          setStreak(myData?.streak || 0);
        }
      }

      // Hint für Spieler
      if (data.hint && data.hint.timestamp !== hint?.timestamp) {
        setHint(data.hint);
      }
    });
    return () => unsub();
  }, [code]);

  // ── Ambient: nur einmal starten ─────────────────────────────────────────────
  useEffect(() => {
    const active = ["playing", "interlude", "briefing"];
    if (room?.status && active.includes(room.status) && !ambientStarted.current) {
      startAmbient();
      ambientStarted.current = true;
    }
  }, [room?.status]);

  useEffect(() => () => stopAmbient(), []);

  // ── freeTextGrades zurücksetzen bei neuem Rätsel ───────────────────────────
  useEffect(() => {
    setFreeTextGrades({});
    setCustomPoints({});
  }, [room?.currentPuzzle]);

  // ── Intro → Briefing ───────────────────────────────────────────────────────
  async function handleIntroEnd() {
    setShowIntro(false);
    if (isHost) {
      await update(ref(db, `rooms/${code}`), {
        status: "briefing",
        currentPuzzle: 0,
        startedAt: Date.now(),
      });
    }
  }

  // ── Student bereit ─────────────────────────────────────────────────────────
  async function handlePlayerReady() {
    if (!playerId) return;
    await update(ref(db, `rooms/${code}/players/${playerId}`), {
      readyAt: room.currentPuzzle,
    });
  }

  // ── Host startet Rätsel — mit 3-2-1 Countdown ─────────────────────────────
  async function handleStartPuzzle() {
    if (!isHost) return;
    // puzzleStartedAt liegt 4 Sekunden in der Zukunft → Countdown 3→2→1→LOS!
    await update(ref(db, `rooms/${code}`), {
      status: "playing",
      puzzleStartedAt: Date.now() + 4000,
    });
  }

  // ── Antwort abgeben ────────────────────────────────────────────────────────
  async function handleAnswer(answerId, timeBonus) {
    if (!playerId || answeredThis) return;
    const puzzle   = PUZZLES[room.currentPuzzle];
    const pIdx     = room.currentPuzzle;
    let correct = false;
    let earned  = 0;

    if (puzzle.type === "multiple-choice") {
      correct = answerId === puzzle.correct;
      earned  = correct ? puzzle.points + timeBonus : Math.round(puzzle.points * 0.1);

    } else if (puzzle.type === "sort") {
      correct = answerId === puzzle.correctOrder.join(",");
      earned  = correct ? puzzle.points + timeBonus : Math.round(puzzle.points * 0.1);

    } else if (puzzle.type === "match") {
      try {
        const answers      = JSON.parse(answerId);
        const correctCount = puzzle.pairs.filter(p => answers[p.leftId] === p.rightId).length;
        correct = correctCount === puzzle.pairs.length;
        const ratio = correctCount / puzzle.pairs.length;
        earned  = correct
          ? puzzle.points + timeBonus
          : Math.round(puzzle.points * ratio * 0.8);
      } catch {
        earned = 0;
      }

    } else if (puzzle.type === "brainstorm") {
      correct = true;   // Abgabe zählt als richtig; Punkte kommen vom Lehrer
      earned  = 0;
    } else if (puzzle.type === "build-slogan") {
      correct = false;
      earned  = 0;
    }

    // ── Streak Bonus ─────────────────────────────────────────────────────────
    const prevStreak  = players[playerId]?.streak || 0;
    const newStreak   = correct ? prevStreak + 1 : 0;
    let streakBonus   = 0;
    let isStreakMile  = false;
    if (correct && newStreak > 0 && newStreak % 3 === 0) {
      streakBonus  = 50;
      isStreakMile = true;
      earned      += streakBonus;
    }

    // ── Schnellster-Finger Bonus (nicht für Brainstorm) ───────────────────────
    let firstBlood = false;
    if (correct && puzzle.type !== "brainstorm" && !room.firstCorrect?.[pIdx]) {
      firstBlood  = true;
      earned     += 25;
    }

    const currentScore = players[playerId]?.score || 0;
    const newScore = currentScore + earned;
    const updates  = {
      score: newScore,
      streak: newStreak,
      [`answeredPuzzles/${pIdx}`]: { answer: answerId, correct, earned },
    };
    // Claim fastest-finger slot (race condition acceptable for classroom)
    const firebaseUpdates = { [`rooms/${code}/players/${playerId}`]: updates };
    if (firstBlood) {
      firebaseUpdates[`rooms/${code}/firstCorrect/${pIdx}`] = playerId;
    }
    await update(ref(db), firebaseUpdates);

    setScore(newScore);
    setStreak(newStreak);
    setLastResult({ earned, correct, streakBonus, firstBlood });
    setAnsweredThis(true);

    // Sound + Flash
    if (puzzle.type !== "build-slogan" && puzzle.type !== "brainstorm") {
      if (correct) {
        playCorrect();
        if (isStreakMile)        setFlash("streak");
        else if (firstBlood)     setFlash("first");
        else                     setFlash("correct");
        if (room.currentPuzzle === PUZZLES.length - 1) setConfetti(true);
      } else {
        playWrong();
        setFlash("wrong");
      }
      setTimeout(() => setFlash(null), 1200);
    }
  }

  // ── Zwischenstand anzeigen ─────────────────────────────────────────────────
  async function handleHostInterlude() {
    await update(ref(db, `rooms/${code}`), { status: "interlude" });
  }

  // ── Nächstes Rätsel → Briefing ─────────────────────────────────────────────
  async function handleNextPuzzle() {
    if (!isHost) return;
    const next = room.currentPuzzle + 1;
    if (next >= PUZZLES.length) {
      await update(ref(db, `rooms/${code}`), { status: "finished" });
    } else {
      await update(ref(db, `rooms/${code}`), {
        status: "briefing",
        currentPuzzle: next,
        puzzleStartedAt: null,
        // firstCorrect bleibt pro Puzzle-Index gespeichert — kein Reset nötig
      });
    }
  }

  async function handleSkipPuzzle() {
    if (!isHost) return;
    await handleNextPuzzle();
  }

  // ── Hinweis senden ─────────────────────────────────────────────────────────
  async function sendHint() {
    if (!hintText.trim()) return;
    await update(ref(db, `rooms/${code}`), {
      hint: { character: hintChar, text: hintText.trim(), timestamp: Date.now() },
    });
    setHintText("");
    setShowHintPanel(false);
  }

  // ── Lehrer vergibt Punkte (Freitext) ───────────────────────────────────────
  async function grantCustomPoints(pid, points) {
    const player = players[pid];
    if (!player) return;
    const pts = parseInt(points);
    if (isNaN(pts) || pts < 0) return;
    const newScore = (player.score || 0) + pts;
    const pIdx = room.currentPuzzle;
    const prevEarned = player.answeredPuzzles?.[pIdx]?.earned || 0;
    await update(ref(db, `rooms/${code}/players/${pid}`), {
      score: newScore,
      [`answeredPuzzles/${pIdx}/earned`]: prevEarned + pts,
      [`answeredPuzzles/${pIdx}/correct`]: true,
    });
    setFreeTextGrades(prev => ({ ...prev, [pid]: { awarded: pts } }));
  }

  // ── Fullscreen ─────────────────────────────────────────────────────────────
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }
  useEffect(() => {
    function onFsChange() { setIsFullscreen(!!document.fullscreenElement); }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────
  const puzzle     = room ? PUZZLES[room.currentPuzzle] : null;
  const playerList = Object.entries(players).map(([id, p]) => ({ id, ...p }));
  const answeredCount = puzzle
    ? playerList.filter(p => p.answeredPuzzles?.[room?.currentPuzzle]).length
    : 0;

  // Rang des Spielers basierend auf aktuellem Score
  const myRank = playerList.length > 0
    ? playerList.filter(p => (p.score || 0) > score).length + 1
    : 1;

  // Countdown aktiv wenn puzzleStartedAt in der Zukunft liegt
  const showCountdown = room?.status === "playing"
    && room?.puzzleStartedAt
    && room.puzzleStartedAt > Date.now();

  // Ready count: players who set readyAt === currentPuzzle
  const readyCount = room
    ? Object.values(players).filter(p => p.readyAt === room.currentPuzzle).length
    : 0;
  const totalPlayers = playerList.length;
  const playerReady  = !isHost && room
    ? (players[playerId]?.readyAt === room.currentPuzzle)
    : false;

  // Freitext-Antworten (Slogan + Brainstorm)
  const freeTextAnswers = isHost && (puzzle?.type === "build-slogan" || puzzle?.type === "brainstorm")
    ? playerList.filter(p => p.answeredPuzzles?.[room?.currentPuzzle])
    : [];

  // Bell: ring when all players answered
  useEffect(() => {
    if (!isHost) return;
    if (playerList.length > 0 && answeredCount === playerList.length && answeredCount > prevAnsweredCount.current) {
      playAllAnswered();
    }
    prevAnsweredCount.current = answeredCount;
  }, [answeredCount]);

  // ── Interlude fix: if student reconnects during interlude, show it ─────────
  useEffect(() => {
    if (room?.status === "interlude") setShowInterlude(true);
  }, [room?.status]);

  if (!room) return (
    <div className="page">
      <p style={{ color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace" }}>
        Verbinde... <span className="blink">_</span>
      </p>
    </div>
  );

  const showBriefing = room.status === "briefing";

  return (
    <div className="page" style={{ justifyContent: "flex-start", paddingTop: "1.25rem" }}>
      {/* Flash-Overlays */}
      {flash === "correct" && <div className="green-flash" />}
      {flash === "wrong"   && <div className="red-flash"   />}
      {flash === "streak"  && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 998, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: "Orbitron, monospace", fontWeight: 900,
            fontSize: "clamp(1.8rem, 8vw, 3rem)",
            color: "var(--yellow)", textShadow: "0 0 40px rgba(255,214,0,0.8)",
            animation: "cdLos 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>
            🔥 STREAK x{streak}!
          </div>
        </div>
      )}
      {flash === "first" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 998, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: "Orbitron, monospace", fontWeight: 900,
            fontSize: "clamp(1.5rem, 7vw, 2.5rem)",
            color: "var(--cyan)", textShadow: "0 0 40px rgba(0,229,255,0.8)",
            animation: "cdLos 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>
            ⚡ ERSTER! +25
          </div>
        </div>
      )}

      {/* Konfetti */}
      <ConfettiEffect trigger={confetti} />

      {/* Story Intro */}
      {showIntro && <StoryIntro onDone={handleIntroEnd} />}

      {/* 3-2-1 Countdown Overlay */}
      {showCountdown && <CountdownOverlay puzzleStartedAt={room.puzzleStartedAt} />}

      {/* Puzzle Briefing — driven by room.status === "briefing" */}
      {showBriefing && puzzle?.briefing && (
        <PuzzleBriefing
          briefing={puzzle.briefing}
          puzzleIndex={room.currentPuzzle}
          isHost={isHost}
          readyCount={readyCount}
          totalPlayers={totalPlayers}
          onReady={handlePlayerReady}
          onStart={handleStartPuzzle}
          isStudentReady={playerReady}
        />
      )}

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
          puzzle={PUZZLES[room.currentPuzzle]}
        />
      )}

      {/* Hinweis-Popup für Spieler */}
      {!isHost && hint && (
        <HintPopup hint={hint} onClose={() => setHint(null)} />
      )}

      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* ── Top-Bar ──────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "1rem", gap: "0.5rem",
        }}>
          <span style={{ fontFamily: "Share Tech Mono, monospace", color: "var(--text-dim)", fontSize: "0.72rem" }}>
            NOVA PROTOCOL
          </span>

          {room.startedAt && <GlobalCountdown startedAt={room.startedAt} />}

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Fullscreen (für Projektor) */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Vollbild beenden" : "Vollbild (Projektor)"}
              style={{
                background: "transparent", border: "1px solid var(--border)",
                borderRadius: 4, color: "var(--text-dim)",
                fontSize: "0.85rem", cursor: "pointer", padding: "0.2rem 0.4rem",
              }}
            >
              {isFullscreen ? "⛶" : "⛶"}
            </button>

            {/* Mute */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {/* Streak Indikator */}
                {streak >= 2 && (
                  <span style={{
                    fontSize: "0.68rem", fontFamily: "Share Tech Mono, monospace",
                    color: "var(--yellow)", background: "rgba(255,214,0,0.1)",
                    border: "1px solid rgba(255,214,0,0.3)", borderRadius: 4,
                    padding: "1px 5px",
                  }}>
                    🔥×{streak}
                  </span>
                )}
                {/* Rang */}
                {playerList.length > 1 && (
                  <span style={{
                    fontSize: "0.68rem", fontFamily: "Share Tech Mono, monospace",
                    color: myRank === 1 ? "var(--yellow)" : "var(--text-dim)",
                    background: myRank === 1 ? "rgba(255,214,0,0.08)" : "transparent",
                    border: myRank === 1 ? "1px solid rgba(255,214,0,0.2)" : "none",
                    borderRadius: 4, padding: myRank === 1 ? "1px 5px" : "0",
                  }}>
                    {myRank === 1 ? "👑 #1" : `#${myRank}`}
                  </span>
                )}
                <span style={{ color: "var(--text-dim)", fontSize: "0.78rem" }}>{playerName}</span>
                <span className="score-display" style={{ fontSize: "1rem" }}>{score}</span>
              </div>
            )}
            {isHost && <span className="badge badge-yellow">HOST</span>}
          </div>
        </div>

        {/* ── Rätsel ───────────────────────────────────────────────────────── */}
        {puzzle && room.status === "playing" && (
          <div className="card">
            <PuzzleCard
              puzzle={puzzle}
              onAnswer={handleAnswer}
              isHost={isHost}
              puzzleStartedAt={room.puzzleStartedAt}
            />

            {/* Spieler: geantwortet */}
            {!isHost && answeredThis && (
              <div style={{
                marginTop: "1rem", padding: "0.85rem", textAlign: "center",
                background: lastResult.correct ? "rgba(0,255,136,0.06)" : "rgba(255,34,85,0.06)",
                border: `1px solid ${lastResult.correct ? "rgba(0,255,136,0.2)" : "rgba(255,34,85,0.2)"}`,
                borderRadius: 6,
              }}>
                <p style={{
                  fontFamily: "Orbitron, monospace", fontWeight: 700,
                  fontSize: "1.5rem",
                  color: lastResult.correct ? "var(--green)" : "var(--red)",
                  textShadow: lastResult.correct ? "0 0 20px rgba(0,255,136,0.5)" : "0 0 20px rgba(255,34,85,0.5)",
                  marginBottom: "0.3rem",
                }}>
                  {lastResult.correct ? `+${lastResult.earned}` : `+${lastResult.earned}`}
                </p>
                {/* Bonus-Labels */}
                <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                  {lastResult.correct && <span style={{ fontSize: "0.72rem", color: "var(--green)", fontFamily: "Share Tech Mono, monospace" }}>✓ Richtig</span>}
                  {!lastResult.correct && <span style={{ fontSize: "0.72rem", color: "var(--red)", fontFamily: "Share Tech Mono, monospace" }}>✗ Falsch</span>}
                  {lastResult.firstBlood && (
                    <span style={{ fontSize: "0.72rem", color: "var(--cyan)", fontFamily: "Share Tech Mono, monospace", background: "rgba(0,229,255,0.1)", borderRadius: 4, padding: "1px 6px" }}>
                      ⚡ Erster! +25
                    </span>
                  )}
                  {lastResult.streakBonus > 0 && (
                    <span style={{ fontSize: "0.72rem", color: "var(--yellow)", fontFamily: "Share Tech Mono, monospace", background: "rgba(255,214,0,0.1)", borderRadius: 4, padding: "1px 6px" }}>
                      🔥 Streak +50
                    </span>
                  )}
                </div>
                <p style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
                  Warte auf nächstes Rätsel...
                </p>
              </div>
            )}

            {/* ── Host Controls ─────────────────────────────────────────── */}
            {isHost && (
              <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>

                {/* Fortschritt */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                    {answeredCount === playerList.length && playerList.length > 0
                      ? <span style={{ color: "var(--green)", fontWeight: 700 }}>🔔 Alle haben geantwortet!</span>
                      : <>Geantwortet: <span style={{ color: "var(--cyan)", fontWeight: 700 }}>{answeredCount}/{playerList.length}</span></>}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn btn-ghost"
                      style={{ width: "auto", padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}
                      onClick={() => setShowHintPanel(p => !p)}
                    >
                      💡 Hinweis
                    </button>
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

                {/* Freitext-Bewertung (Slogan + Brainstorm) */}
                {freeTextAnswers.length > 0 && (
                  <div style={{
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "0.9rem", marginBottom: "0.75rem",
                  }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--yellow)", marginBottom: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {puzzle.type === "brainstorm" ? "🧠 Brainstorms bewerten" : "✏️ Slogans bewerten"}
                    </p>
                    {freeTextAnswers.map(p => (
                      <div key={p.id} style={{
                        marginBottom: "0.75rem",
                        padding: "0.6rem", borderRadius: 6,
                        background: "var(--bg)", border: "1px solid var(--border)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                          <span style={{ color: "var(--cyan)", fontSize: "0.8rem", fontWeight: 700 }}>{p.name}</span>
                          {freeTextGrades[p.id] && (
                            <span style={{ color: "var(--green)", fontSize: "0.75rem" }}>
                              ✓ +{freeTextGrades[p.id]?.awarded} Pkt.
                            </span>
                          )}
                        </div>
                        <p style={{
                          color: "var(--text)", fontSize: "0.84rem",
                          fontStyle: "italic", lineHeight: 1.55, marginBottom: "0.5rem",
                          fontFamily: puzzle.type === "brainstorm" ? "Share Tech Mono, monospace" : "inherit",
                          whiteSpace: "pre-wrap",
                        }}>
                          {p.answeredPuzzles[room.currentPuzzle]?.answer}
                        </p>
                        {!freeTextGrades[p.id] && (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                              type="number" min={0} max={puzzle.points + 100}
                              placeholder="Punkte"
                              value={customPoints[p.id] || ""}
                              onChange={e => setCustomPoints(prev => ({ ...prev, [p.id]: e.target.value }))}
                              style={{ width: 70, padding: "0.3rem 0.4rem", fontSize: "0.85rem" }}
                            />
                            <button
                              className="btn btn-primary"
                              style={{ flex: 1, padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}
                              onClick={() => grantCustomPoints(p.id, customPoints[p.id] || 50)}
                            >
                              ✓ Vergeben
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Live-Scores */}
                <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: "0.75rem" }}>
                  {playerList.sort((a, b) => b.score - a.score).map((p) => {
                    const ans = p.answeredPuzzles?.[room.currentPuzzle];
                    const isFirstCorrect = firstCorrectMap[room.currentPuzzle] === p.id;
                    const ansLabel = ans
                      ? puzzle?.type === "sort"       ? "sortiert"
                      : puzzle?.type === "build-slogan" ? "Slogan ✓"
                      : puzzle?.type === "brainstorm"   ? "Liste ✓"
                      : ans.answer?.toUpperCase()
                      : null;
                    return (
                      <div key={p.id} style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        padding: "0.45rem 0.65rem", marginBottom: "0.3rem",
                        background: ans ? (ans.correct ? "rgba(0,255,136,0.05)" : "rgba(255,34,85,0.05)") : "var(--bg2)",
                        border: `1px solid ${ans ? (ans.correct ? "rgba(0,255,136,0.2)" : "rgba(255,34,85,0.15)") : "var(--border)"}`,
                        borderRadius: 5, fontSize: "0.85rem", transition: "all 0.3s",
                      }}>
                        <div className="player-avatar" style={{ width: 24, height: 24, fontSize: "0.62rem" }}>
                          {p.name[0].toUpperCase()}
                        </div>
                        <span style={{ flex: 1, fontWeight: 600 }}>
                          {p.name}
                          {isFirstCorrect && <span style={{ color: "var(--cyan)", fontSize: "0.65rem", marginLeft: "0.3rem" }}>⚡</span>}
                          {(p.streak || 0) >= 3 && <span style={{ color: "var(--yellow)", fontSize: "0.65rem", marginLeft: "0.2rem" }}>🔥</span>}
                        </span>
                        {ans ? (
                          <span style={{
                            color: ans.correct ? "var(--green)" : "var(--red)",
                            fontSize: "0.75rem", fontFamily: "Share Tech Mono, monospace",
                            display: "flex", alignItems: "center", gap: "0.3rem",
                          }}>
                            <span style={{
                              background: ans.correct ? "rgba(0,255,136,0.15)" : "rgba(255,34,85,0.15)",
                              border: `1px solid ${ans.correct ? "rgba(0,255,136,0.4)" : "rgba(255,34,85,0.4)"}`,
                              borderRadius: 3, padding: "1px 5px", fontSize: "0.7rem",
                            }}>
                              {ansLabel}
                            </span>
                            {ans.correct ? "✓" : "✗"}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-dim)", fontSize: "0.7rem", fontFamily: "Share Tech Mono, monospace" }}>
                            <span className="blink">_</span>
                          </span>
                        )}
                        <span style={{ fontFamily: "Orbitron, monospace", color: "var(--yellow)", fontSize: "0.8rem", minWidth: 35, textAlign: "right" }}>
                          {p.score}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button className="btn btn-primary" onClick={handleHostInterlude}>
                  📊 Zwischenstand zeigen
                </button>
              </div>
            )}
          </div>
        )}

        {/* Briefing-Wartezustand für Spieler (während Host noch nicht gestartet hat) */}
        {!isHost && room.status === "briefing" && !puzzle?.briefing && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace" }}>
            <span className="blink">_</span> Warte auf Briefing...
          </div>
        )}
      </div>
    </div>
  );
}
