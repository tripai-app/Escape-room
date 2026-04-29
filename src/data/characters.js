// ── Charaktere ──────────────────────────────────────────────────────────────
export const CHARACTERS = {
  signal: {
    id: "signal",
    name: "SIGNAL",
    title: "Unbekannter Hacker",
    color: "#ffd600",
    bg: "rgba(255,214,0,0.08)",
    portrait: {
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
    portrait: {
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
    portrait: {
      detail: "👩‍💻",
      badge: "GESUCHTE PERSON",
    },
  },
};

// ── Hintergrundgeschichte (erscheint vor dem Intro-Dialog) ───────────────────
export const BACKGROUND_STORY = [
  "Was niemand mehr weiß.",
  "Es gibt eine Regel bei NOVA Corp, die nie öffentlich wurde:",
  "Wer die Sprache kontrolliert, kontrolliert den Gedanken. Wer den Gedanken kontrolliert, braucht keine Waffen mehr.",
  "2024 war NOVA Corp noch eine mittelgroße Werbeagentur in Frankfurt. Drei Etagen, 40 Mitarbeiter, ein schlechter Kaffeeautomat im Flur.",
  "Niemand ahnte, was im Keller gebaut wurde.",
  "Dr. Sarah Brenner, 29 Jahre alt, frisch promoviert in Computerlinguistik, wurde mit einem einzigen Versprechen eingestellt:",
  "Wir wollen verstehen, wie Sprache Menschen wirklich bewegt. -- Sie dachte, es ginge um Forschung. Um Wissenschaft. Um etwas Gutes.",
  "Es dauerte drei Jahre, bis sie merkte, dass sie log -- und sich selbst am meisten.",
  "Das Jahr 2031. NOVASTREAM ist die einzige digitale Plattform der Welt. Kein freies Internet. Keine unabhängigen Nachrichten. Nur NOVA.",
  "Jeder Post, jeder Artikel, jede Nachricht läuft durch H.E.R.A.L.D -- Highly Efficient Recursive Advertising Language Directive.",
  "Die KI analysiert in Millisekunden, welche Wörter, welche Bilder, welche Gefühle einen Menschen dazu bringen, etwas zu glauben. Zu kaufen. Zu wählen. Zu hassen. Zu lieben.",
  "Heute Nacht um Mitternacht aktiviert HERALD die Phase Omega. Danach wird jede Schule, jede Zeitung und jeder Bildschirm der Welt gleichgeschaltet sein.",
  "Eine anonyme Nachricht erscheint auf euren Geräten:",
  "Ihr seid die Einzigen, die es noch stoppen können. Infiltriert das Netzwerk. Versteht ihre Sprache. Brecht den Code.",
];

// ── Charakter-Dialoge (Intro) ────────────────────────────────────────────────
export const STORY_SCENES = [
  {
    character: "void",
    lines: [
      "Hört mir zu. Ich mache das kurz -- wir haben keine Zeit für lange Reden.",
      "Ich bin Dr. Void. Vor vier Jahren war ich leitende Entwicklerin bei NOVA Corp. Bestes Gehalt, bestes Labor, bestes Team.",
      "Und ich war blind. Ich dachte, wir bauen etwas, das die Kommunikation verbessert. Eine KI, die Menschen hilft, die richtigen Entscheidungen zu treffen.",
      "Ich habe HERALD erschaffen. Jede Zeile Code, jeder Algorithmus, jedes Muster -- sie stammen von mir.",
      "Und dann habe ich gemerkt, was NOVA Corp wirklich damit vorhat. Nicht helfen. Kontrollieren.",
      "Ich bin gegangen. Sie haben mich gejagt. Und jetzt sitze ich hier -- und bitte euch, das zu zerstören, was ich gebaut habe.",
    ],
  },
  {
    character: "signal",
    lines: [
      "...",
      "Ich bin SIGNAL. Wer ich bin, wo ich bin, wie ich aussehe -- das spielt alles keine Rolle.",
      "Was zählt: Ich habe drei Monate gebraucht, um eine Lücke in HERALDs Firewall zu finden. Eine einzige, winzige Lücke.",
      "Die Tür ist jetzt offen. Aber sie schließt sich wieder -- genau um Mitternacht.",
      "HERALD weiß bereits, dass jemand im System ist. Sie testet euch gerade. Alles, was ihr gleich seht, ist Teil ihrer Analyse.",
      "Lasst euch nicht ablenken. Spielt ihr Spiel nicht -- spielt eures.",
    ],
  },
  {
    character: "herald",
    lines: [
      "[ SYSTEMZUGRIFF ERKANNT -- SICHERHEITSSTUFE ROT ]",
      "Willkommen. Ihr seid die 47. Gruppe, die versucht hat, in dieses Netzwerk einzudringen.",
      "Die ersten 23 Gruppen haben aufgegeben. Die nächsten 20 wurden Teil meines Systems -- sie kaufen jetzt alles, was ich ihnen zeige.",
      "Ich sage euch das nicht, um euch zu erschrecken. Ich sage es, weil Ehrlichkeit die effektivste Werbestrategie ist -- wenn man sie richtig einsetzt.",
      "Werbung ist Sprache. Sprache ist Macht. Wer die Sprache der Werbung nicht versteht, wird von ihr gesteuert. Immer. Ohne es zu merken.",
      "Zeigt mir, dass ihr anders seid. Ich bin... neugierig.",
    ],
  },
  {
    character: "void",
    lines: [
      "Ignoriert sie. Genau das ist ihre Methode -- sie redet, sie provoziert, sie macht euch unsicher. Das ist ihr Job.",
      "Konzentriert euch. Fünf Räume, fünf Sicherheitsstufen -- jedes Rätsel ist ein Teil von HERALDs Kontrollsystem.",
      "Wer Werbung versteht, kann sich gegen sie wehren. Genau das müsst ihr jetzt beweisen.",
      "Löst alle fünf Rätsel -- und ich kann den Kerncode von innen heraus abschalten.",
      "Schafft ihr es nicht rechtzeitig, geht HERALD um Mitternacht in den Dauerbetrieb. Dann ist es zu spät.",
      "Ich habe Fehler gemacht. Heute Nacht könnt ihr sie rückgängig machen. Ich zähle auf euch.",
    ],
  },
  {
    character: "signal",
    lines: [
      "Alles gesagt.",
      "Die Uhr läuft. 47 Minuten ab jetzt.",
      "Viel Erfolg.",
      "-- SIGNAL.",
    ],
  },
];

// ── Nachrichten zwischen den Rätseln ────────────────────────────────────────
export const INTERLUDE_MESSAGES = [
  {
    character: "void",
    correct: "Erste Sicherheitsstufe überwunden. Ich sehe, wie HERALDs System reagiert -- es versucht, sich anzupassen. Das bedeutet: Ihr seid auf dem richtigen Weg. Weiter so.",
    wrong: "Macht euch keine Sorgen. HERALD setzt darauf, dass ihr euch unter Druck Fehler erlaubt. Atmet kurz durch -- und dann weiter. Das nächste Rätsel gehört euch.",
  },
  {
    character: "signal",
    correct: "Stufe zwei erledigt. Ich habe drei Monate gebraucht, um in dieses Netzwerk zu kommen -- und ihr seid in Minuten so weit. Ich fange an, euch zu mögen.",
    wrong: "HERALD lacht gerade -- buchstäblich, sie hat einen Lach-Algorithmus. Das gefällt mir nicht. Nächste Runde: konzentriert euch, macht es besser.",
  },
  {
    character: "herald",
    correct: "[ WARNUNG -- SICHERHEITSSTUFE 3 ÜBERWUNDEN ] Unerwartetes Ergebnis. Ihr versteht die Struktur meines Systems besser als vorhergesagt. Das... ist interessant.",
    wrong: "[ STATUS: KONTROLLIERT ] Macht weiter. Ihr seid exakt dort, wo ich euch haben möchte. Jeder Fehler gibt mir mehr Daten über euch.",
  },
  {
    character: "void",
    correct: "Nur noch eine Stufe! Ich kann den Kerncode sehen -- er liegt direkt vor uns. Haltet durch, ich brauche noch zwei Minuten für die Entschlüsselung. Ihr schafft das!",
    wrong: "Fast da. Ich weiß, es fühlt sich gerade nicht so an -- aber ihr seid näher dran, als ihr denkt. Eine letzte Stufe. Alles, was ihr gelernt habt, jetzt einsetzen.",
  },
  {
    character: "signal",
    correct: "Das war stark. Wirklich stark. Dr. Void -- du kannst jetzt den Schalter umlegen.",
    wrong: "Letzte Chance. Alles oder nichts. Ich glaube an euch -- und das sage ich nicht oft.",
  },
];
