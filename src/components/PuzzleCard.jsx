import { useState, useEffect } from "react";

// Renders any puzzle type and calls onAnswer(answerId, timeBonus) when done
export default function PuzzleCard({ puzzle, onAnswer, isHost }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(puzzle.timeLimit);
  const [sortOrder, setSortOrder] = useState(puzzle.items ? [...puzzle.items] : []);
  const [freeText, setFreeText] = useState("");
  const [dragIdx, setDragIdx] = useState(null);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setTimeLeft(puzzle.timeLimit);
    setSortOrder(puzzle.items ? [...puzzle.items] : []);
    setFreeText("");
  }, [puzzle.id]);

  // Timer
  useEffect(() => {
    if (revealed || isHost) return;
    if (timeLeft <= 0) {
      handleSubmit(selected || "timeout", 0);
      return;
    }
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
    if (revealed) return;
    setSelected(id);
    handleSubmit(id, Math.round((timeLeft / puzzle.timeLimit) * 50));
  }

  const timerPct = (timeLeft / puzzle.timeLimit) * 100;
  const timerColor = timerPct > 50 ? "var(--green)" : timerPct > 25 ? "var(--yellow)" : "var(--red)";

  return (
    <div className="fade-up">
      {/* Room label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <span className="badge badge-red" style={{ marginRight: "0.5rem" }}>
            RAUM {puzzle.id + 1}/{5}
          </span>
          <span style={{ color: "var(--text-dim)", fontSize: "0.8rem", fontFamily: "Share Tech Mono, monospace" }}>
            {puzzle.roomSubtitle}
          </span>
        </div>
        {!isHost && (
          <span style={{
            fontFamily: "Orbitron, monospace",
            color: timerColor,
            fontSize: "1.1rem",
            fontWeight: 700,
          }}>
            {timeLeft}s
          </span>
        )}
      </div>

      {/* Timer bar */}
      {!isHost && (
        <div className="timer-bar">
          <div className="timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
        </div>
      )}

      {/* Points */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h3 style={{ color: "var(--cyan)" }}>{puzzle.room}</h3>
        <span className="badge badge-yellow">{puzzle.points} Pkt.</span>
      </div>

      {/* Question */}
      <p style={{
        fontSize: "1.05rem",
        lineHeight: 1.7,
        marginBottom: "1.25rem",
        color: "var(--text)",
      }}>
        {renderText(puzzle.question)}
      </p>

      {/* Error find: show text */}
      {puzzle.type === "error-find" && (
        <div style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: "1rem",
          marginBottom: "1.25rem",
          fontSize: "0.95rem",
          lineHeight: 1.8,
          fontFamily: "Share Tech Mono, monospace",
          color: "var(--text)",
        }}>
          {puzzle.text}
        </div>
      )}

      {/* Multiple choice options */}
      {(puzzle.type === "multiple-choice" || puzzle.type === "error-find") && puzzle.options && (
        <div>
          {puzzle.options.map(opt => {
            let cls = "option-btn";
            if (revealed) {
              if (opt.id === puzzle.correct || opt.text === puzzle.correct + " Fehler") cls += " correct";
              else if (opt.id === selected) cls += " wrong";
            } else if (opt.id === selected) {
              cls += " selected";
            }
            return (
              <button
                key={opt.id}
                className={cls}
                onClick={() => pickOption(opt.id)}
                disabled={revealed || isHost}
              >
                <span className="option-letter">{opt.id.toUpperCase()}</span>
                {opt.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Sort puzzle */}
      {puzzle.type === "sort" && (
        <div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
            Ziehe die Elemente in die richtige Reihenfolge:
          </p>
          {sortOrder.map((item, idx) => (
            <div
              key={item.id}
              draggable={!revealed && !isHost}
              onDragStart={() => setDragIdx(idx)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => {
                if (dragIdx === null) return;
                const next = [...sortOrder];
                const [moved] = next.splice(dragIdx, 1);
                next.splice(idx, 0, moved);
                setSortOrder(next);
                setDragIdx(null);
              }}
              style={{
                padding: "0.75rem 1rem",
                background: "var(--bg2)",
                border: `1px solid ${revealed
                  ? puzzle.correctOrder[idx] === item.id ? "var(--green)" : "var(--red)"
                  : "var(--border)"}`,
                borderRadius: 2,
                marginBottom: "0.4rem",
                cursor: revealed || isHost ? "default" : "grab",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: revealed
                  ? puzzle.correctOrder[idx] === item.id ? "var(--green)" : "var(--red)"
                  : "var(--text)",
              }}
            >
              <span style={{ color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", fontSize: "0.8rem" }}>
                {idx + 1}
              </span>
              {item.text}
            </div>
          ))}
          {!revealed && !isHost && (
            <button
              className="btn btn-primary"
              style={{ marginTop: "0.75rem" }}
              onClick={() => handleSubmit(sortOrder.map(i => i.id).join(","))}
            >
              ✓ Reihenfolge bestätigen
            </button>
          )}
        </div>
      )}

      {/* Build slogan (free text) */}
      {puzzle.type === "build-slogan" && (
        <div>
          <div style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "1rem",
            marginBottom: "1rem",
          }}>
            <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>Beispiele:</p>
            {puzzle.examples.map((ex, i) => (
              <p key={i} style={{ color: "var(--cyan)", fontSize: "0.85rem", fontFamily: "Share Tech Mono, monospace", marginBottom: "0.25rem" }}>
                {ex}
              </p>
            ))}
          </div>
          {!isHost && (
            <>
              <textarea
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                placeholder="Dein Slogan..."
                rows={3}
                disabled={revealed}
                style={{ marginBottom: "0.75rem", resize: "vertical" }}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleSubmit(freeText || "(leer)")}
                disabled={revealed || !freeText.trim()}
              >
                ✓ Slogan abschicken
              </button>
            </>
          )}
        </div>
      )}

      {/* Explanation after reveal */}
      {revealed && puzzle.explanation && (
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          background: "rgba(0,229,255,0.06)",
          border: "1px solid rgba(0,229,255,0.25)",
          borderRadius: 4,
        }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: "0.25rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Erklärung
          </p>
          <p style={{ color: "var(--cyan)", fontSize: "0.9rem", lineHeight: 1.6 }}>{puzzle.explanation}</p>
        </div>
      )}
    </div>
  );
}

function renderText(text) {
  // Handle **bold** markdown
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: "var(--yellow)" }}>{part}</strong>
      : part
  );
}
