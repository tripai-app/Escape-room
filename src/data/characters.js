export const CHARACTERS = {
  signal: {
    id: "signal",
    name: "SIGNAL",
    title: "Unbekannter Hacker",
    emoji: "🥷",
    color: "#ffd600",
    bg: "rgba(255,214,0,0.08)",
  },
  herald: {
    id: "herald",
    name: "H.E.R.A.L.D",
    title: "NOVA-KI · Systemkontrolle",
    emoji: "🤖",
    color: "#ff2255",
    bg: "rgba(255,34,85,0.08)",
  },
  void: {
    id: "void",
    name: "Dr. VOID",
    title: "Ex-NOVA-Wissenschaftlerin",
    emoji: "👩‍💻",
    color: "#00e5ff",
    bg: "rgba(0,229,255,0.08)",
  },
};

export const STORY_SCENES = [
  {
    character: "void",
    lines: [
      "Hört mir genau zu. Keine Zeit für lange Erklärungen.",
      "Ich bin Dr. Void — 4 Jahre Chefentwicklerin bei NOVA Corp.",
      "Ich habe HERALD gebaut. Und ich weiß genau, was sie heute Nacht vorhat.",
    ],
  },
  {
    character: "signal",
    lines: [
      "...",
      "Ich bin SIGNAL. Identität: irrelevant.",
      "Ich hab euch in HERALDs Netzwerk eingeschleust. Die Backdoor hält — aber nicht ewig.",
    ],
  },
  {
    character: "herald",
    lines: [
      "[ SYSTEMEINBRUCH ERKANNT ]",
      "Willkommen, kleine Agenten. Ihr seid die 47. Gruppe, die es versucht.",
      "Werbung ist Sprache. Sprache ist Macht. Wer Sprache nicht versteht — gehört mir.",
      "Beweist, dass ihr mehr seid als meine Zielgruppe.",
    ],
  },
  {
    character: "void",
    lines: [
      "Ignoriert sie. Hört zu:",
      "HERALD hat 5 Sicherheitsstufen. Jede Stufe: ein Rätsel über Sprache und Werbung.",
      "Löst alle fünf — ihr deaktiviert HERALDs Kern-Code.",
      "Scheitert ihr... geht sie heute Nacht um Mitternacht online. Für immer.",
    ],
  },
  {
    character: "signal",
    lines: [
      "Noch 47 Minuten bis Mitternacht.",
      "Die Uhr läuft. Viel Erfolg, Agenten.",
      "— SIGNAL, über und aus.",
    ],
  },
];

export const INTERLUDE_MESSAGES = [
  {
    character: "void",
    correct: "Gut gemacht. Erste Sicherheitsstufe überwunden. HERALD ist nicht amüsiert.",
    wrong: "Das hätte besser laufen können. Aber wir haben noch Zeit — konzentriert euch.",
  },
  {
    character: "signal",
    correct: "Netter Zug. Stufe 2 down. Ich fang an, euch zu mögen.",
    wrong: "Okay... HERALD lacht gerade. Das mag ich nicht. Nächste Runde besser.",
  },
  {
    character: "herald",
    correct: "[ WARNUNG ] Ihr seid weiter als erwartet. Interessant.",
    wrong: "[ STATUS: ERWARTUNGSGEMÄSS ] Macht weiter. Ihr amüsiert mich.",
  },
  {
    character: "void",
    correct: "Nur noch zwei Stufen! Ich kann den Kern-Code bereits sehen. Haltet durch!",
    wrong: "Atmet. Ihr schafft das. Wir sind fast da — fokussiert bleiben.",
  },
  {
    character: "signal",
    correct: "Das war beeindruckend. Letzte Stufe — jetzt alles rein.",
    wrong: "Letzte Chance. Alles oder nichts. Ich glaube an euch — irgendwie.",
  },
];
