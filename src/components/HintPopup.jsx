import { useEffect, useState } from "react";
import { CHARACTERS } from "../data/characters";

export default function HintPopup({ hint, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hint) return;
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 400); }, 8000);
    return () => clearTimeout(t);
  }, [hint?.timestamp]);

  if (!hint || !visible) return null;
  const char = CHARACTERS[hint.character] || CHARACTERS.void;
  const emoji = char.id === "void" ? "👩‍💻" : char.id === "signal" ? "🥷" : "🤖";

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", left: "50%",
      transform: "translateX(-50%)",
      zIndex: 200, width: "calc(100% - 2rem)", maxWidth: 420,
      animation: "fadeUp 0.35s ease both",
    }}>
      <div style={{
        background: char.bg,
        border: `1px solid ${char.color}50`,
        borderRadius: 10, padding: "0.9rem",
        boxShadow: `0 0 30px ${char.color}25`,
        display: "flex", gap: "0.75rem", alignItems: "flex-start",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          border: `2px solid ${char.color}`,
          background: `${char.color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem",
          boxShadow: `0 0 12px ${char.color}40`,
        }}>{emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: "0.62rem", color: char.color,
            fontFamily: "Share Tech Mono, monospace",
            letterSpacing: "0.1em", marginBottom: "0.3rem",
          }}>{char.name} · HINWEIS</div>
          <p style={{ color: "var(--text)", fontSize: "0.92rem", lineHeight: 1.55, fontWeight: 600 }}>
            {hint.text}
          </p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} style={{
          background: "transparent", border: "none", color: "var(--text-dim)",
          fontSize: "1rem", cursor: "pointer", flexShrink: 0,
        }}>✕</button>
      </div>
    </div>
  );
}
