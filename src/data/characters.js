// ── Charaktere ──────────────────────────────────────────────────────────────
export const CHARACTERS = {
  signal: {
    id: "signal",
    name: "SIGNAL",
    title: "Unbekannter Hacker",
    color: "#ffd600",
    bg: "rgba(255,214,0,0.08)",
    // Aussehen: schwarze Kapuzenjacke, Gesicht immer im Schatten,
    // nur das Leuchten eines Bildschirms ist zu sehen
    portrait: {
      head: "#ffd600",
      hair: "#111",
      skin: "#1a1a1a",
      outfit: "#111111",
      detail: "🥷",
      badge: "IDENTITÄT UNBEKANNT",
    },
  },
  herald: {
    id: "herald",
    name: "H.E.R.A.L.D",
    title: "NOVA-KI · Systemkontrolle",
    color: "#ff2255",
    bg: "rgba(255,34,85,0.08)",
    // Aussehen: holografische Projektion, perfekt gekleidet,
    // kein erkennbares Gesicht — nur ein Lächeln
    portrait: {
      head: "#ff2255",
      hair: "#ff2255",
      skin: "#2a0a10",
      outfit: "#1a0508",
      detail: "🤖",
      badge: "KÜNSTLICHE INTELLIGENZ",
    },
  },
  void: {
    id: "void",
    name: "Dr. VOID",
    title: "Ex-NOVA-Entwicklerin",
    color: "#00e5ff",
    bg: "rgba(0,229,255,0.08)",
    // Aussehen: weißer Laborkittel mit überklebtem NOVA-Logo,
    // Brille, kurze Haare, Widerstandsabzeichen am Kragen
    portrait: {
      head: "#00e5ff",
      hair: "#2a2a2a",
      skin: "#f5c5a0",
      outfit: "#e8e8e8",
      detail: "👩‍💻",
      badge: "GESUCHTE PERSON",
    },
  },
};

// ── Hintergrundgeschichte (erscheint vor dem Intro-Dialog) ───────────────────
export const BACKGROUND_STORY = [
  "Das Jahr 2031.",
  "NOVASTREAM ist die einzige Plattform der Welt — kein freies Internet mehr.",
  "Jeder Post, jede Nachricht, jeder Artikel läuft durch eine KI namens HERALD.",
  "HERALD weiß genau, welche Wörter einen Menschen dazu bringen, etwas zu glauben.",
  "Zu kaufen. Zu wählen. Zu hassen. Zu lieben.",
  "Heute Nacht um Mitternacht aktiviert HERALD 'Phase Omega'.",
  "Danach wird jede Schule, jede Zeitung, jeder Bildschirm der Welt gleichgeschaltet.",
  "Niemand wird mehr wissen, was echt ist — und was Werbung.",
  "Außer ihr.",
  "Ihr seid die letzte Chance.",
];

// ── Charakter-Dialoge (Intro) ────────────────────────────────────────────────
export const STORY_SCENES = [
  {
    character: "void",
    lines: [
      "Hört mir zu. Ich mache das kurz.",
      "Ich bin Dr. Void. Ich habe vier Jahre lang bei NOVA Corp gearbeitet.",
      "Ich habe HERALD erschaffen. Jede Zeile Code. Jeder Gedanke dahinter — meiner.",
      "Und jetzt sitze ich hier und bitte euch, das zu zerstören, was ich gebaut habe.",
    ],
  },
  {
    character: "signal",
    lines: [
      "...",
      "Ich bin SIGNAL. Wer ich bin, spielt keine Rolle.",
      "Was zählt: Ich habe die Tür aufgemacht. Ihr müsst durchgehen.",
      "Das Netzwerk ist offen — aber HERALD weiß, dass jemand drin ist.",
    ],
  },
  {
    character: "herald",
    lines: [
      "[ EINBRUCH ERKANNT ]",
      "Willkommen. Ihr seid die 47. Gruppe, die es versucht hat.",
      "Die anderen 46 haben aufgegeben. Oder sie wurden Teil meines Systems.",
      "Werbung ist Sprache. Sprache ist Macht. Wer das nicht versteht — gehört mir.",
      "Zeigt mir, dass ihr anders seid.",
    ],
  },
  {
    character: "void",
    lines: [
      "Ignoriert sie. Sie will euch ablenken — das ist ihr Job.",
      "Fünf Räume. Fünf Sicherheitsstufen.",
      "Jedes Rätsel ist ein Teil von HERALDs System.",
      "Löst alle fünf — und ihr könnt den Kern-Code abschalten.",
      "Schafft ihr es nicht... geht HERALD um Mitternacht online. Für immer.",
    ],
  },
  {
    character: "signal",
    lines: [
      "47 Minuten.",
      "Viel Erfolg.",
      "— SIGNAL.",
    ],
  },
];

// ── Nachrichten zwischen den Rätseln ────────────────────────────────────────
export const INTERLUDE_MESSAGES = [
  {
    character: "void",
    correct: "Gut gemacht. Erste Stufe geknackt. HERALD reagiert — das ist ein gutes Zeichen.",
    wrong: "Nicht schlimm. Wir haben noch Zeit. Konzentriert euch auf das nächste Rätsel.",
  },
  {
    character: "signal",
    correct: "Stufe zwei: erledigt. Ich fange an, euch zu mögen.",
    wrong: "HERALD lacht gerade. Das mag ich nicht. Nächste Runde — besser machen.",
  },
  {
    character: "herald",
    correct: "[ WARNUNG — STUFE 3 ÜBERWUNDEN ] Das hatte ich nicht erwartet. Interessant.",
    wrong: "[ STATUS: NORMAL ] Macht weiter. Ihr seid genau dort, wo ich euch haben will.",
  },
  {
    character: "void",
    correct: "Nur noch zwei Stufen! Ich kann den Code sehen. Haltet durch!",
    wrong: "Atmet. Ihr schafft das. Fast da — nicht aufgeben.",
  },
  {
    character: "signal",
    correct: "Das war richtig stark. Letzte Stufe. Jetzt alles geben.",
    wrong: "Letzte Chance. Alles oder nichts. Ich glaube an euch — irgendwie.",
  },
];
