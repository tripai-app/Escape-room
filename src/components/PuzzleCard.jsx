import { useState, useEffect, useRef } from "react";

export default function PuzzleCard({ puzzle, onAnswer, isHost }) {
  const [selected, setSelected]   = useState(null);
  const [revealed, setRevealed]   = useState(false);
  const [timeLeft, setTimeLeft]   = useState(puzzle.timeLimit);
  const [sortOrder, setSortOrder] = useState(puzzle.items ? [...puzzle.items] : []);
  const [freeText, setFreeText]   = useState("");
  const [dragIdx, setDragIdx]     = useState(null);
  const [touchOver, setTouchOver] = useState(null);
  const touchStart = useRef(null);

  useEffect(() => {
    setSelected(null); setRevealed(false);
    setTimeLeft(puzzle.timeLimit);
    setSortOrder(puzzle.items ? [...puzzle.items] : []);
    setFreeText("");
  }, [puzzle.id]);

  useEffect(() => {
    if (revealed || isHost) return;
    if (timeLeft <= 0) { handleSubmit(selected || "timeout", 0); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, revealed]);

  function handleSubmit(answerId, bonus) {
    if (revealed) return;
    setRevealed(true);
    const timeBonus = bonus !== undefined ? bonus : Math.round((timeLeft / puzzle.timeLimit) * 50);
    onAnswer(answerId, timeBonus);
  }

  function pickOption(id) {
    if (revealed || isHost) return;
    setSelected(id);
    handleSubmit(id, Math.round((timeLeft / puzzle.timeLimit) * 50));
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

  // ── Error-Text Highlighting ─────────────────────────────────────────────
  function renderErrorHighlight(text, errors) {
    if (!errors?.length) return <span>{text}</span>;
    let segments = [{ text, isError: false }];
    errors.forEach(err => {
      const out = [];
      segments.forEach(seg => {
        if (seg.isError) { out.push(seg); return; }
        const parts = seg.text.split(err.wrong);
        parts.forEach((part, i) => {
          if (part) out.push({ text: part, isError: false });
          if (i < parts.length - 1) out.push({ text: err.wrong, isError: true, correct: err.correct });
        });
      });
      segments = out;
    });
    return (
      <>
        {segments.map((s, i) =>
          s.isError
            ? <span key={i} title={"Richtig: " + s.correct} style={{
                background: "rgba(255,34,85,0.22)", color: "var(--red)",
                borderBottom: "2px solid var(--red)", borderRadius: 2,
                padding: "0 2px", cursor: "help",
              }}>{s.text}</span>
            : <span key={i}>{s.text}</span>
        )}
      </>
    );
  }

  const timerPct  = (timeLeft / puzzle.timeLimit) * 100;
  const timerColor = timerPct > 50 ? "var(--green)" : timerPct > 25 ? "var(--yellow)" : "var(--red)";
  const isCritical = timeLeft <= 10 && !revealed && !isHost;

  return (
    <div className="fade-up">

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem", gap: "0.5rem" }}>
        <div>
          <span className="badge badge-red" style={{ marginBottom: "0.2rem", display: "inline-block" }}>
            RAUM {puzzle.id + 1}/5
          </span>
          <div style={{ color: "var(--text-dim)", fontSize: "0.72rem", fontFamily: "Share Tech Mono, monospace" }}>
            {puzzle.roomSubtitle}
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
        <span className="badge badge-yellow" style={{ fontSize: "0.68rem" }}>bis {puzzle.points + 50} Pkt.</span>
      </div>

      {/* Question */}
      <p style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "1.25rem", color: "var(--text)" }}>
        {renderText(puzzle.question)}
      </p>

      {/* Error-find: Text */}
      {puzzle.type === "error-find" && (
        <div style={{
          background: "var(--bg2)",
          border: "1px solid rgba(255,214,0,0.2)",
          borderLeft: "3px solid var(--yellow)",
          borderRadius: "0 6px 6px 0",
          padding: "1rem 1.1rem",
          marginBottom: "1.25rem",
          fontSize: "0.92rem", lineHeight: 1.85,
          fontFamily: "Share Tech Mono, monospace",
          color: "var(--text)",
        }}>
          {revealed
            ? renderErrorHighlight(puzzle.text, puzzle.errors)
            : puzzle.text}
        </div>
      )}

      {/* Multiple choice */}
      {(puzzle.type === "multiple-choice" || puzzle.type === "error-find") && puzzle.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {puzzle.options.map(opt => {
            const isCorrect = opt.id === puzzle.correct || opt.text === puzzle.correct + " Fehler";
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

      {/* Sort puzzle — Desktop drag + Mobile touch + Pfeile */}
      {puzzle.type === "sort" && (
        <div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginBottom: "0.75rem", fontFamily: "Share Tech Mono, monospace" }}>
            {isHost ? "Richtige Reihenfolge:" : "Sortiere per Drag & Drop oder Pfeile:"}
          </p>
          <div onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            {sortOrder.map((item, idx) => {
              const isRight = revealed && puzzle.correctOrder[idx] === item.id;
              const isWrong = revealed && puzzle.correctOrder[idx] !== item.id;
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

      {/* Build slogan */}
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

      {/* Erklärung */}
      {revealed && puzzle.explanation && (
        <div style={{
          marginTop: "1.1rem", padding: "0.85rem 1rem",
          background: "rgba(0,229,255,0.05)",
          border: "1px solid rgba(0,229,255,0.2)",
          borderLeft: "3px solid var(--cyan)",
          borderRadius: "0 6px 6px 0",
        }}>
          <p style={{ fontSize: "0.65rem", color: "var(--cyan)", marginBottom: "0.3rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Share Tech Mono, monospace" }}>
            Erklärung
          </p>
          <p style={{ color: "var(--text)", fontSize: "0.88rem", lineHeight: 1.65 }}>{puzzle.explanation}</p>
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
