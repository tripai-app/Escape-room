import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiEffect({ trigger }) {
  useEffect(() => {
    if (!trigger) return;

    // Erste Salve
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff2255", "#00e5ff", "#ffd600", "#00ff88", "#ffffff"],
    });

    // Zweite Salve von links
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#ffd600", "#00ff88"],
      });
    }, 250);

    // Dritte Salve von rechts
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#ff2255", "#00e5ff"],
      });
    }, 400);

  }, [trigger]);

  return null;
}
