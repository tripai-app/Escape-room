import { useState, useEffect, useRef } from "react";
import { PUZZLES } from "../data/puzzles";
import { playMatchConnect, playCountdownTick, playAllAnswered } from "../utils/sounds";

export default function PuzzleCard({ puzzle, onAnswer, isHost, puzzleStartedAt }) {
  const [selected, setSelected]         = useState(null);
  const [revealed, setRevealed]         = useState(false);
  const [timeLeft, setTimeLeft]         = useState(puzzle.timeLimit);
  const [sortOrder, setSortOrder]       = useState(puzzle.items ? [...puzzle.items] : []);
  const [freeText, setFreeText]         = useState("");
  const [dragIdx, setDragIdx]           = useState(null);
  const [touchOver, setTouchOver]       = useState(null);
  // ── Brainstorm-State ───────────────────────────────────────────────────────
  const [brainstormItems, setBrainstormItems] = useState([""]);
  // ── Match-Puzzle-State ─────────────────────────────────────────────────────
  const [selectedLeft,  setSelectedLeft]  = useState(null);
  const [userMatches,   setUserMatches]   = useState({});
  const [shuffledRight, setShuffledRight] = useState(
    () => puzzle.pairs ? [...puzzle.pairs].sort(() => Math.random() - 0.5) : []
  );
  const touchStart    = useRef(null);
  const tickPlayed    = useRef(false);
  const allMatchedRef = useRef(false);

  // ── Timer initialisieren: server-sync wenn puzzleStartedAt vorhanden ──────
  useEffect(() => {
    setSelected(null); setRevealed(false);
    setSortOrder(puzzle.items ? [...puzzle.items] : []);
    setFreeText("");
    setBrainstormItems([""]);
    setSelectedLeft(null);
    setUserMatches({});
    setShuffledRight(puzzle.pairs ? [...puzzle.pairs].sort(() => Math.random() - 0.5) : []);
    tickPlayed.current    = false;
    allMatchedRef.current = false;

    if (puzzleStartedAt) {
      const elapsed = Math.floor((Date.now() - puzzleStartedAt) / 1000);
      setTimeLeft(Math.max(0, puzzle.timeLimit - elapsed));
    } else {
      setTimeLeft(puzzle.timeLimit);
    }
  }, [puzzle.id, puzzleStartedAt]);

  // ── Timer-Tick ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (revealed || isHost) return;
    if (timeLeft <= 0) {
      if (puzzle.type === "match") {
        handleSubmit(JSON.stringify(userMatches), 0);
      } else if (puzzle.type === "brainstorm") {
        handleSubmit(filledItems.length > 0 ? filledItems.join("\n") : "timeout", 0);
      } else {
        handleSubmit(selected || "timeout", 0);
      }
      return;
    }
    if (timeLeft <= 10 && !tickPlayed.current) {
      tickPlayed.current = true;
    }
    if (timeLeft <= 10) {
      playCountdownTick();
    }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, revealed]);

  function handleSubmit(answerId, bonus) {
    if (revealed) return;
    setRevealed(true);
    const timeBonus = bonus !== undefined ? bonus : Math.round((timeLeft / puzzle.timeLimit) * 100);
    onAnswer(answerId, timeBonus);
  }

  function pickOption(id) {
    if (revealed || isHost) return;
    setSelected(id);
    handleSubmit(id, Math.round((timeLeft / puzzle.timeLimit) * 100));
  }

  // ── Match-Puzzle-Interaktion ───────────────────────────────────────────────
  function handleMatchLeft(leftId) {
    if (revealed || isHost) return;
    setSelectedLeft(prev => prev === leftId ? null : leftId);
  }

  function handleMatchRight(rightId) {
    if (revealed || isHost || !selectedLeft) return;
    let nextMatches;
    setUserMatches(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (next[k] === rightId) delete next[k]; });
      next[selectedLeft] = rightId;
      nextMatches = next;
      return next;
    });
    playMatchConnect();
    setSelectedLeft(null);
    // Auto-submit when all pairs matched
    setTimeout(() => {
      setUserMatches(current => {
        if (!allMatchedRef.current && Object.keys(current).length === puzzle.pairs.length) {
          allMatchedRef.current = true;
          playAllAnswered();
          setTimeout(() => {
            handleSubmit(JSON.stringify(current), Math.round((timeLeft / puzzle.timeLimit) * 100));
          }, 600);
        }
        return current;
      });
    }, 50);
  }

  function moveItem(from, to) {
    if (to < 0 || to >= sortOrder.length || from === to) return;
    const next = [...sortOrder];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSortOrder(next);
  }

  // ── Touch-Drag ──────────────────────────────────────────────────────────
  function onTouchStart(e, idx) {
    touchStart.current = idx;
  }
  function onTouchMove(e) {
    if (touchStart.current === null) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const sortEl = el?.closest("[data-sortidx]");
    if (sortEl) setTouchOver(parseInt(sortEl.dataset.sortidx));
  }
  function onTouchEnd() {
    if (touchStart.current !== null && touchOver !== null) {
      moveItem(touchStart.current, touchOver);
    }
    touchStart.current = null;
    setTouchOver(null);
  }

  // ── Brainstorm helpers ─────────────────────────────────────────────────────
  const minItems = puzzle.minItems || 3;
  const filledItems = brainstormItems.filter(s => s.trim().length > 0);
  const canSubmitBrainstorm = filledItems.length >= minItems;

  function updateBrainstormItem(idx, val) {
    setBrainstormItems(prev => prev.map((s, i) => i === idx ? val : s));
  }
  function addBrainstormItem() {
    setBrainstormItems(prev => [...prev, ""]);
  }
  function removeBrainstormItem(idx) {
    if (brainstormItems.length <= 1) return;
    setBrainstormItems(prev => prev.filter((_, i) => i !== idx));
  }
  function submitBrainstorm() {
    handleSubmit(filledItems.join("\n"), Math.round((timeLeft / puzzle.timeLimit) * 100));
  }

  const timerPct   = (timeLeft / puzzle.timeLimit) * 100;
  const timerColor = timerPct > 50 ? "var(--green)" : timerPct > 25 ? "var(--yellow)" : "var(--red)";
  const isCritical = timeLeft <= 10 && !revealed && !isHost;

  return (
    <div className="fade-up">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Große Raum-Nummer */}
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            border: "2px solid var(--cyan)",
            background: "rgba(0,229,255,0.08)",
            boxShadow: "0 0 16px rgba(0,229,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.1rem", color: "var(--cyan)" }}>
              {puzzle.id + 1}
            </span>
          </div>
          <div>
            <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, color: "var(--cyan)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              RAUM {puzzle.id + 1}/{PUZZLES.length}
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.68rem", fontFamily: "Share Tech Mono, monospace" }}>
              {puzzle.roomSubtitle}
            </div>
          </div>
        </div>

        {!isHost && (
          <div style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.3rem 0.7rem",
            background: isCritical ? "rgba(255,34,85,0.15)" : "rgba(0,0,0,0.2)",
            border: `1px solid ${isCritical ? "rgba(255,34,85,0.6)" : "var(--border)"}`,
            borderRadius: 6, flexShrink: 0,
            animation: isCritical ? "pulse-red 0.8s ease infinite" : "none",
          }}>
            <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>⏱</span>
            <span style={{ fontFamily: "Orbitron, monospace", color: timerColor, fontSize: "1rem", fontWeight: 700, minWidth: 30 }}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Timer bar */}
      {!isHost && (
        <div className="timer-bar" style={{ marginBottom: "1rem" }}>
          <div className="timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
        </div>
      )}

      {/* Title + points */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" }}>
        <h3 style={{ color: "var(--cyan)", fontSize: "1.05rem" }}>{puzzle.room}</h3>
        <span className="badge badge-yellow" style={{ fontSize: "0.68rem" }}>bis {puzzle.points + 100} Pkt.</span>
      </div>

      {/* Question */}
      <p style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "1.25rem", color: "var(--text)" }}>
        {renderText(puzzle.question)}
      </p>

      {/* ── Multiple choice ─────────────────────────────────────────────────── */}
      {puzzle.type === "multiple-choice" && puzzle.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {puzzle.options.map(opt => {
            const isCorrect = opt.id === puzzle.correct;
            let cls = "option-btn";
            if (revealed) {
              if (isCorrect) cls += " correct";
              else if (opt.id === selected) cls += " wrong";
            } else if (opt.id === selected) cls += " selected";

            return (
              <button key={opt.id} className={cls}
                onClick={() => pickOption(opt.id)}
                disabled={revealed || isHost}
                style={{
                  animation: revealed && isCorrect ? "correctGlow 0.8s ease forwards"
                    : revealed && opt.id === selected && !isCorrect ? "wrongShake 0.55s ease forwards"
                    : "none",
                }}
              >
                <span className="option-letter">{opt.id.toUpperCase()}</span>
                <span style={{ flex: 1 }}>{opt.text}</span>
                {revealed && isCorrect && <span style={{ color: "var(--green)", fontSize: "1rem" }}>✓</span>}
                {revealed && opt.id === selected && !isCorrect && <span style={{ color: "var(--red)", fontSize: "1rem" }}>✗</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Sort puzzle ─────────────────────────────────────────────────────── */}
      {puzzle.type === "sort" && (
        <div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginBottom: "0.75rem", fontFamily: "Share Tech Mono, monospace" }}>
            {isHost ? "Richtige Reihenfolge:" : "Sortiere per Drag & Drop oder Pfeile:"}
          </p>
          <div onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            {sortOrder.map((item, idx) => {
              const isRight   = revealed && puzzle.correctOrder[idx] === item.id;
              const isWrong   = revealed && puzzle.correctOrder[idx] !== item.id;
              const isHovered = touchOver === idx && touchStart.current !== null;
              return (
                <div
                  key={item.id}
                  data-sortidx={idx}
                  draggable={!revealed && !isHost}
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => { if (dragIdx !== null) { moveItem(dragIdx, idx); setDragIdx(null); } }}
                  onTouchStart={e => !revealed && !isHost && onTouchStart(e, idx)}
                  style={{
                    padding: "0.7rem 0.9rem",
                    background: isRight ? "rgba(0,255,136,0.08)" : isWrong ? "rgba(255,34,85,0.06)" : isHovered ? "rgba(0,229,255,0.08)" : "var(--bg2)",
                    border: `1px solid ${isRight ? "var(--green)" : isWrong ? "var(--red)" : isHovered ? "var(--cyan)" : "var(--border)"}`,
                    borderRadius: 6, marginBottom: "0.4rem",
                    cursor: revealed || isHost ? "default" : "grab",
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    fontSize: "0.92rem", fontWeight: 600,
                    color: isRight ? "var(--green)" : isWrong ? "var(--red)" : "var(--text)",
                    transition: "all 0.15s", userSelect: "none",
                    touchAction: !revealed && !isHost ? "none" : "auto",
                  }}
                >
                  <span style={{ color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", width: 18, flexShrink: 0 }}>
                    {idx + 1}.
                  </span>
                  <span style={{ flex: 1 }}>{item.text}</span>
                  {!revealed && !isHost && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                      {[[-1, "▲"], [1, "▼"]].map(([dir, arrow]) => (
                        <button key={dir}
                          onClick={e => { e.stopPropagation(); moveItem(idx, idx + dir); }}
                          disabled={dir === -1 ? idx === 0 : idx === sortOrder.length - 1}
                          style={{
                            background: "transparent", border: "1px solid var(--border)",
                            borderRadius: 3, color: "var(--text-dim)", fontSize: "0.6rem",
                            cursor: "pointer", padding: "1px 4px", lineHeight: 1,
                            opacity: (dir === -1 ? idx === 0 : idx === sortOrder.length - 1) ? 0.25 : 0.8,
                          }}
                        >{arrow}</button>
                      ))}
                    </div>
                  )}
                  {revealed && (isRight ? <span>✓</span> : <span>✗</span>)}
                </div>
              );
            })}
          </div>
          {!revealed && !isHost && (
            <button className="btn btn-primary" style={{ marginTop: "1rem" }}
              onClick={() => handleSubmit(sortOrder.map(i => i.id).join(","))}>
              ✓ Reihenfolge bestätigen
            </button>
          )}
        </div>
      )}

      {/* ── Match-Puzzle (Zuordnen) ──────────────────────────────────────────── */}
      {puzzle.type === "match" && (
        <div>
          <p style={{
            color: selectedLeft ? "var(--cyan)" : "var(--text-dim)",
            fontSize: "0.78rem", marginBottom: "0.75rem",
            fontFamily: "Share Tech Mono, monospace",
            transition: "color 0.2s",
          }}>
            {isHost
              ? "Richtige Zuordnung:"
              : selectedLeft
                ? "→ Jetzt rechts das passende Beispiel anklicken:"
                : "① Links eine Kategorie wählen  ②  Rechts das Beispiel zuordnen"}
          </p>

          {!revealed && !isHost && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              marginBottom: "0.6rem",
            }}>
              <div style={{
                flex: 1, height: 4, borderRadius: 2,
                background: "var(--bg2)", border: "1px solid var(--border)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${(Object.keys(userMatches).length / puzzle.pairs.length) * 100}%`,
                  background: Object.keys(userMatches).length === puzzle.pairs.length ? "var(--green)" : "var(--cyan)",
                  transition: "width 0.3s ease",
                }} />
              </div>
              <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.68rem", color: "var(--text-dim)", flexShrink: 0 }}>
                {Object.keys(userMatches).length}/{puzzle.pairs.length}
              </span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 0.7rem" }}>

            {/* Linke Spalte */}
            <div>
              <div style={{ fontSize: "0.58rem", color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.1em", textAlign: "center", marginBottom: "0.4rem" }}>
                KATEGORIE
              </div>
              {puzzle.pairs.map(pair => {
                const matched     = userMatches[pair.leftId];
                const isSelected  = selectedLeft === pair.leftId;
                const isCorrect   = revealed && matched === pair.rightId;
                const isWrong     = revealed && matched && matched !== pair.rightId;
                const isUnmatched = revealed && !matched;
                return (
                  <button key={pair.leftId}
                    onClick={() => handleMatchLeft(pair.leftId)}
                    disabled={revealed || isHost}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      width: "100%", padding: "0.65rem 0.7rem", marginBottom: "0.4rem",
                      background: isCorrect  ? "rgba(0,255,136,0.1)"
                        : isWrong            ? "rgba(255,34,85,0.08)"
                        : isSelected         ? "rgba(0,229,255,0.15)"
                        : matched            ? "rgba(255,214,0,0.08)"
                        : "var(--bg2)",
                      border: `2px solid ${isCorrect ? "var(--green)" : isWrong ? "var(--red)" : isSelected ? "var(--cyan)" : matched ? "rgba(255,214,0,0.5)" : "var(--border)"}`,
                      borderRadius: 6,
                      color: isCorrect ? "var(--green)" : isWrong ? "var(--red)" : isSelected ? "var(--cyan)" : matched ? "var(--yellow)" : isUnmatched ? "rgba(221,225,255,0.4)" : "var(--text)",
                      fontSize: "0.82rem", fontWeight: 700,
                      cursor: revealed || isHost ? "default" : "pointer",
                      transition: "all 0.15s",
                      transform: isSelected ? "scale(1.02)" : "none",
                      textAlign: "left",
                      animation: isCorrect ? "matchPop 0.35s cubic-bezier(0.34,1.56,0.64,1)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "0.62rem", flexShrink: 0, opacity: isSelected ? 1 : 0 }}>▶</span>
                    {!isSelected && matched && !revealed && <span style={{ fontSize: "0.62rem", color: "var(--yellow)", flexShrink: 0 }}>✓</span>}
                    <span style={{ flex: 1 }}>{pair.leftText}</span>
                    {revealed && (isCorrect ? <span style={{ flexShrink: 0 }}>✓</span> : isWrong ? <span style={{ flexShrink: 0 }}>✗</span> : null)}
                  </button>
                );
              })}
            </div>

            {/* Rechte Spalte */}
            <div>
              <div style={{ fontSize: "0.58rem", color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.1em", textAlign: "center", marginBottom: "0.4rem" }}>
                BEISPIEL
              </div>
              {shuffledRight.map(pair => {
                const matchedByLeft = Object.entries(userMatches).find(([, r]) => r === pair.rightId)?.[0];
                const origPair      = puzzle.pairs.find(p => p.rightId === pair.rightId);
                const isCorrect     = revealed && matchedByLeft === origPair?.leftId;
                const isWrong       = revealed && matchedByLeft && !isCorrect;
                const isUnmatched   = revealed && !matchedByLeft;
                const isActivatable = !revealed && !isHost && selectedLeft !== null;
                return (
                  <button key={pair.rightId}
                    onClick={() => handleMatchRight(pair.rightId)}
                    disabled={revealed || isHost || !selectedLeft}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      width: "100%", padding: "0.6rem 0.7rem", marginBottom: "0.4rem",
                      background: isCorrect  ? "rgba(0,255,136,0.08)"
                        : isWrong            ? "rgba(255,34,85,0.06)"
                        : matchedByLeft      ? "rgba(255,214,0,0.06)"
                        : "var(--bg2)",
                      border: `2px ${isActivatable ? "dashed" : "solid"} ${isCorrect ? "var(--green)" : isWrong ? "var(--red)" : matchedByLeft ? "rgba(255,214,0,0.45)" : isActivatable ? "rgba(0,229,255,0.4)" : "var(--border)"}`,
                      borderRadius: 6,
                      color: isCorrect ? "var(--green)" : isWrong ? "var(--red)" : matchedByLeft ? "var(--yellow)" : isUnmatched ? "rgba(221,225,255,0.4)" : "var(--text)",
                      fontSize: "0.76rem", fontWeight: matchedByLeft ? 700 : 500,
                      cursor: revealed || isHost ? "default" : (selectedLeft ? "pointer" : "not-allowed"),
                      transition: "all 0.15s",
                      textAlign: "left",
                      opacity: !revealed && !isHost && !selectedLeft && !matchedByLeft ? 0.65 : 1,
                      animation: isCorrect ? "matchPop 0.35s cubic-bezier(0.34,1.56,0.64,1)" : "none",
                    }}
                  >
                    {matchedByLeft && !revealed && <span style={{ fontSize: "0.6rem", flexShrink: 0, color: "var(--yellow)" }}>←</span>}
                    <span style={{ flex: 1 }}>{pair.rightText}</span>
                    {revealed && (isCorrect ? <span style={{ flexShrink: 0 }}>✓</span> : isWrong ? <span style={{ flexShrink: 0 }}>✗</span> : null)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Host-Ansicht: korrekte Lösung */}
          {isHost && (
            <div style={{ marginTop: "0.65rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {puzzle.pairs.map(pair => (
                <div key={pair.leftId} style={{
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  fontSize: "0.8rem", color: "var(--text-dim)",
                }}>
                  <span style={{ color: "var(--cyan)", fontWeight: 700, minWidth: 100 }}>{pair.leftText}</span>
                  <span>→</span>
                  <span style={{ color: "var(--text)" }}>{pair.rightText}</span>
                </div>
              ))}
            </div>
          )}

          {/* Timeout-Hinweis */}
          {!revealed && !isHost && (
            <p style={{ fontSize: "0.68rem", color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", textAlign: "center", marginTop: "0.6rem", opacity: 0.7 }}>
              Bei Zeitablauf: Teilpunkte für bereits zugeordnete Paare
            </p>
          )}
        </div>
      )}

      {/* ── Brainstorm ──────────────────────────────────────────────────────── */}
      {puzzle.type === "brainstorm" && (
        <div>
          {puzzle.examples && (
            <div style={{
              background: "var(--bg2)",
              border: "1px solid rgba(0,229,255,0.15)",
              borderLeft: "3px solid var(--cyan)",
              borderRadius: "0 6px 6px 0",
              padding: "0.75rem 1rem", marginBottom: "1rem",
            }}>
              <p style={{ color: "var(--text-dim)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.45rem", fontFamily: "Share Tech Mono, monospace" }}>
                Beispiele:
              </p>
              {puzzle.examples.map((ex, i) => (
                <p key={i} style={{ color: "var(--cyan)", fontSize: "0.8rem", fontFamily: "Share Tech Mono, monospace", lineHeight: 1.55, margin: "0.15rem 0" }}>
                  › {ex}
                </p>
              ))}
            </div>
          )}

          {!isHost ? (
            <>
              <div style={{ marginBottom: "0.75rem" }}>
                {brainstormItems.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", alignItems: "center" }}>
                    <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.72rem", color: "var(--text-dim)", width: 20, flexShrink: 0, textAlign: "right" }}>
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={e => updateBrainstormItem(idx, e.target.value)}
                      placeholder={puzzle.placeholder || "Dein Beispiel..."}
                      disabled={revealed}
                      style={{ flex: 1, fontSize: "0.95rem" }}
                      onKeyDown={e => {
                        if (e.key === "Enter" && idx === brainstormItems.length - 1 && item.trim()) {
                          addBrainstormItem();
                        }
                      }}
                    />
                    {brainstormItems.length > 1 && !revealed && (
                      <button
                        onClick={() => removeBrainstormItem(idx)}
                        style={{
                          background: "transparent", border: "1px solid var(--border)",
                          borderRadius: 4, color: "var(--text-dim)", cursor: "pointer",
                          fontSize: "0.75rem", padding: "0.2rem 0.45rem", lineHeight: 1, flexShrink: 0,
                        }}
                      >✕</button>
                    )}
                  </div>
                ))}

                {!revealed && (
                  <button
                    onClick={addBrainstormItem}
                    style={{
                      background: "transparent",
                      border: "1px dashed rgba(0,229,255,0.3)",
                      borderRadius: 6, color: "var(--cyan)",
                      cursor: "pointer", fontSize: "0.82rem",
                      padding: "0.45rem 1rem", width: "100%",
                      marginTop: "0.2rem", fontFamily: "Share Tech Mono, monospace",
                      transition: "all 0.15s",
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(0,229,255,0.05)"}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                  >
                    + Weiteres Beispiel hinzufügen
                  </button>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.72rem", fontFamily: "Share Tech Mono, monospace", color: canSubmitBrainstorm ? "var(--green)" : "var(--text-dim)" }}>
                  {filledItems.length}/{minItems} Mindestanzahl {canSubmitBrainstorm ? "✓" : ""}
                </span>
              </div>

              <button
                className="btn btn-primary"
                onClick={submitBrainstorm}
                disabled={revealed || !canSubmitBrainstorm}
              >
                {canSubmitBrainstorm ? `✓ ${filledItems.length} Beispiele abschicken` : `Mindestens ${minItems} Beispiele nötig`}
              </button>
            </>
          ) : (
            <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", fontFamily: "Share Tech Mono, monospace", textAlign: "center", padding: "1rem" }}>
              Schüler sammeln Beispiele...
            </p>
          )}
        </div>
      )}

      {/* ── Build slogan ────────────────────────────────────────────────────── */}
      {puzzle.type === "build-slogan" && (
        <div>
          <div style={{
            background: "var(--bg2)",
            border: "1px solid rgba(0,229,255,0.15)",
            borderLeft: "3px solid var(--cyan)",
            borderRadius: "0 6px 6px 0",
            padding: "0.9rem 1rem", marginBottom: "1rem",
          }}>
            <p style={{ color: "var(--text-dim)", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem", fontFamily: "Share Tech Mono, monospace" }}>
              Stilmittel-Beispiele:
            </p>
            {puzzle.examples.map((ex, i) => (
              <p key={i} style={{ color: "var(--cyan)", fontSize: "0.82rem", fontFamily: "Share Tech Mono, monospace", lineHeight: 1.6 }}>
                › {ex}
              </p>
            ))}
          </div>
          {!isHost ? (
            <>
              <textarea value={freeText} onChange={e => setFreeText(e.target.value)}
                placeholder="Dein Slogan..." rows={3} disabled={revealed}
                style={{ marginBottom: "0.75rem", resize: "vertical", fontSize: "1rem" }} />
              <button className="btn btn-primary"
                onClick={() => handleSubmit(freeText || "(leer)")}
                disabled={revealed || !freeText.trim()}>
                ✓ Slogan abschicken
              </button>
            </>
          ) : (
            <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", fontFamily: "Share Tech Mono, monospace", textAlign: "center" }}>
              Schüler schreiben ihre Slogans...
            </p>
          )}
        </div>
      )}

      {/* ── Erklärung (LERNMOMENT) ──────────────────────────────────────────── */}
      {revealed && puzzle.explanation && (
        <div style={{
          marginTop: "1.25rem", padding: "1rem 1.1rem",
          background: "rgba(0,229,255,0.05)",
          border: "1px solid rgba(0,229,255,0.25)",
          borderLeft: "4px solid var(--cyan)",
          borderRadius: "0 8px 8px 0",
          boxShadow: "0 4px 20px rgba(0,229,255,0.06)",
        }}>
          <p style={{ fontSize: "0.6rem", color: "var(--cyan)", marginBottom: "0.4rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Share Tech Mono, monospace", fontWeight: 700 }}>
            ◈ LERNMOMENT
          </p>
          <p style={{ color: "var(--text)", fontSize: "0.88rem", lineHeight: 1.7 }}>{puzzle.explanation}</p>
        </div>
      )}
    </div>
  );
}

function renderText(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: "var(--yellow)", fontWeight: 700 }}>{part}</strong> : part
  );
}
