import { useState, useEffect, useRef } from "react";
import { CHARACTERS } from "../data/characters";

export default function CharacterDialogue({ scenes, onDone }) {
  const [sceneIdx,    setSceneIdx]    = useState(0);
  const [lineIdx,     setLineIdx]     = useState(0);
  const [typed,       setTyped]       = useState("");
  const [isTyping,    setIsTyping]    = useState(true);
  const [shownLines,  setShownLines]  = useState([]);
  const intervalRef   = useRef(null);
  const isAdvancing   = useRef(false);   // ← Schutz gegen Doppelklick

  // Bounds-Schutz: sceneIdx niemals außerhalb des Arrays
  const safeSceneIdx  = Math.min(sceneIdx, scenes.length - 1);
  const scene         = scenes[safeSceneIdx];
  const char          = scene ? CHARACTERS[scene.character] : null;
  const safeLineIdx   = scene ? Math.min(lineIdx, scene.lines.length - 1) : 0;
  const currentLine   = scene?.lines[safeLineIdx] ?? "";

  // Typewriter-Effekt für aktuelle Zeile
  useEffect(() => {
    if (!scene || !char) return;
    setTyped("");
    setIsTyping(true);
    let i = 0;
    const speed = scene.character === "herald" ? 35 : 28;
    intervalRef.current = setInterval(() => {
      i++;
      setTyped(currentLine.slice(0, i));
      if (i >= currentLine.length) {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [sceneIdx, lineIdx]);

  function advance() {
    // Schutz gegen Doppelklick / zu schnelles Tippen
    if (isAdvancing.current) return;
    isAdvancing.current = true;
    setTimeout(() => { isAdvancing.current = false; }, 250);

    // Noch am Tippen? → Sofort fertig tippen, dann warten
    if (isTyping) {
      clearInterval(intervalRef.current);
      setTyped(currentLine);
      setIsTyping(false);
      return;
    }

    const newShown = [...shownLines, { char, text: currentLine }];

    if (lineIdx + 1 < scene.lines.length) {
      // Nächste Zeile derselben Szene — captured values (kein funktionaler Updater!)
      setShownLines(newShown);
      setLineIdx(lineIdx + 1);
    } else if (sceneIdx + 1 < scenes.length) {
      // Nächste Szene (nächster Charakter)
      setShownLines([]);
      setSceneIdx(sceneIdx + 1);   // captured value, kein s => s+1
      setLineIdx(0);
    } else {
      // Alles durch → fertig
      onDone();
    }
  }

  // Sicherheitsnetz: falls scene trotzdem undefined ist
  if (!scene || !char) return null;

  return (
    <div
      onClick={advance}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {/* Bisherige Zeilen dieser Szene (blass) */}
      {shownLines.map((l, i) => (
        <div key={i} style={{ marginBottom: "0.6rem", opacity: 0.4 }}>
          <CharLine char={l.char} text={l.text} done />
        </div>
      ))}

      {/* Aktuelle Zeile */}
      <CharLine char={char} text={typed} done={!isTyping} active />

      {/* Weiter-Hinweis */}
      <div style={{
        textAlign: "center",
        marginTop: "1.5rem",
        color: "var(--text-dim)",
        fontSize: "0.72rem",
        fontFamily: "Share Tech Mono, monospace",
        letterSpacing: "0.1em",
      }}>
        {isTyping
          ? <span className="blink">▌</span>
          : <span>[ Tippen zum Weitergehen ]<span className="blink"> _</span></span>
        }
      </div>

      {/* Fortschrittsbalken Szenen */}
      <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginTop: "1rem" }}>
        {scenes.map((_, i) => (
          <div key={i} style={{
            height: 3, flex: 1, maxWidth: 40, borderRadius: 2,
            background: i < sceneIdx ? "var(--cyan)"
              : i === sceneIdx ? "var(--text-dim)"
              : "var(--border)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

function CharLine({ char, text, active }) {
  return (
    <div style={{
      display: "flex",
      gap: "0.9rem",
      alignItems: "flex-start",
      background: active ? char.bg : "transparent",
      border: active ? `1px solid ${char.color}30` : "1px solid transparent",
      borderRadius: 8,
      padding: active ? "0.9rem" : "0.4rem 0.9rem",
      transition: "all 0.2s",
    }}>
      <div style={{
        width: 44, height: 44,
        borderRadius: 10,
        border: `2px solid ${char.color}`,
        background: char.bg,
        boxShadow: active ? `0 0 16px ${char.color}50` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        flexShrink: 0,
        transition: "box-shadow 0.3s",
      }}>
        {char.portrait?.detail}
      </div>

      <div style={{ flex: 1, paddingTop: "0.15rem" }}>
        <div style={{
          fontSize: "0.65rem",
          color: char.color,
          fontFamily: "Share Tech Mono, monospace",
          letterSpacing: "0.1em",
          marginBottom: "0.25rem",
        }}>
          {char.name} &nbsp;·&nbsp;
          <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>{char.title}</span>
        </div>
        <p style={{
          color: active ? "var(--text)" : "var(--text-dim)",
          fontSize: char.id === "herald" ? "0.88rem" : "0.95rem",
          lineHeight: 1.6,
          fontFamily: char.id === "herald" ? "Share Tech Mono, monospace" : "Rajdhani, sans-serif",
          fontWeight: active ? 600 : 400,
        }}>
          {text}
        </p>
      </div>
    </div>
  );
}
