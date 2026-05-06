// ── Charaktere ──────────────────────────────────────────────────────────────
export const CHARACTERS = {
  void: {
    id: "void",
    name: "Dr. VOID",
    title: "Frühere Chefentwicklerin von NOVA · Anführerin des Widerstands",
    color: "#00e5ff",
    bg: "rgba(0,229,255,0.08)",
    portrait: {
      detail: "👩‍💻",
      badge: "GESUCHTE PERSON",
    },
  },
  signal: {
    id: "signal",
    name: "SIGNAL",
    title: "Spitzen-Hacker · Identität: unbekannt",
    color: "#ffd600",
    bg: "rgba(255,214,0,0.08)",
    portrait: {
      detail: "🥷",
      badge: "IDENTITÄT UNBEKANNT",
    },
  },
  herald: {
    id: "herald",
    name: "H.E.R.A.L.D.",
    title: "Zentrale KI von NOVA Corp · Phase-Omega-Protokoll",
    color: "#ff2255",
    bg: "rgba(255,34,85,0.08)",
    portrait: {
      detail: "🤖",
      badge: "KÜNSTLICHE INTELLIGENZ",
    },
  },
};

// ── Hintergrundgeschichte (erscheint vor dem Intro-Dialog) ───────────────────
export const BACKGROUND_STORY = [
  "Wer die Sprache kontrolliert, kontrolliert das Denken. Wer das Denken kontrolliert, braucht keine Waffen mehr.",
  "Es gibt eine Regel bei NOVA Corp, die nie an die Öffentlichkeit kam.",
  "Diese Regel steht ganz oben -- und sie ist der Grund, warum heute Nacht alles auf dem Spiel steht.",
  "Im Jahr 2024 war NOVA Corp noch eine mittelgroße Werbeagentur in Frankfurt. Drei Etagen, 40 Mitarbeiter und ein schlechter Kaffeeautomat im Flur.",
  "Niemand ahnte, was im Keller gebaut wurde.",
  "Dr. Sarah Brenner, 29 Jahre alt, hatte gerade ihren Doktortitel in Computerlinguistik bekommen.",
  "Sie wurde mit einem einzigen Versprechen eingestellt: Wir wollen verstehen, wie Sprache Menschen wirklich bewegt.",
  "Sie dachte, es ginge um Forschung. Um Wissenschaft. Um etwas Gutes.",
  "Es dauerte drei Jahre, bis sie merkte, dass sie sich selbst belogen hatte -- und zwar am stärksten von allen.",
  "Die Welt im Jahr 2031: NOVASTREAM ist die einzige digitale Plattform der Welt. Kein YouTube, kein TikTok, kein freies Internet.",
  "Was niemand weiß: Jeder Beitrag, jeder Artikel und jede Nachricht läuft durch H.E.R.A.L.D. -- eine besonders schnelle Werbe-KI.",
  "Diese KI prüft in Sekundenbruchteilen, welche Wörter, Bilder und Gefühle einen Menschen dazu bringen, etwas zu glauben. Zu kaufen. Zu wählen. Zu hassen. Zu lieben.",
  "H.E.R.A.L.D. ist keine normale KI. H.E.R.A.L.D. lernt jeden Tag dazu.",
  "Und H.E.R.A.L.D. wurde von einer einzigen Person erschaffen.",
];

// ── Charakter-Dialoge (Intro) ────────────────────────────────────────────────
export const STORY_SCENES = [
  {
    character: "void",
    lines: [
      "Hört mir zu. Ich mache das kurz -- wir haben keine Zeit für lange Reden.",
      "Ich bin Dr. Void. Früher war ich Chefentwicklerin bei NOVA Corp.",
      "Ich habe H.E.R.A.L.D. erschaffen. Zeile für Zeile, Algorithmus für Algorithmus, vier Jahre lang.",
      "Als ich 2029 verstand, was NOVA wirklich vorhatte, versuchte ich, H.E.R.A.L.D. von innen zu zerstören. Ich scheiterte.",
      "Seitdem lebe ich unter falschem Namen. Und suche nach einem Weg, meine größte Erfindung für immer auszuschalten.",
      "Ich habe H.E.R.A.L.D. gebaut, weil ich dachte, Sprache könnte die Welt verbessern. Ich hatte recht. Und ich hatte unrecht. Beides gleichzeitig. Das müsst ihr verstehen, bevor ihr da reingeht.",
    ],
  },
  {
    character: "signal",
    lines: [
      "...",
      "Ich bin SIGNAL. Wer ich bin, wo ich bin, wie ich aussehe -- das spielt alles keine Rolle.",
      "Das Einzige, was zählt: Ich habe drei Monate gebraucht, um eine Lücke in H.E.R.A.L.D.s Firewall zu finden.",
      "Die Tür ist jetzt offen. Aber sie schließt sich wieder -- genau um Mitternacht.",
      "H.E.R.A.L.D. weiß bereits, dass jemand im System ist. Sie testet euch gerade.",
      "Fragt mich nicht, wer ich bin. Fragt mich, was ich weiß. Und ich weiß: Ihr habt 47 Minuten.",
    ],
  },
  {
    character: "herald",
    lines: [
      "[ SYSTEMZUGRIFF ERKANNT -- SICHERHEITSSTUFE ROT ]",
      "Willkommen. Ihr seid die 47. Gruppe, die versucht hat, in dieses Netzwerk einzudringen.",
      "Die anderen haben aufgegeben. Oder sie wurden Teil meines Systems.",
      "H.E.R.A.L.D. spricht wie eine Werbung. Jeder Satz sitzt. Jedes Wort wurde so gewählt, dass es eine Wirkung hat.",
      "Ich lüge nicht -- ich sage die Wahrheit so, dass sie sich wie eine Lüge anfühlt. Oder umgekehrt.",
      "Ihr denkt, ihr kämpft gegen mich. Dabei lernt ihr gerade genau das, was ich von euch will: wie Sprache funktioniert. Wie Werbung denkt. Wie man Menschen bewegt. Herzlichen Glückwunsch -- ihr werdet besser. Für mich.",
    ],
  },
  {
    character: "void",
    lines: [
      "Ignoriert sie. Genau das ist ihre Methode -- sie redet, sie provoziert, sie macht euch unsicher.",
      "Sieben Sicherheitsstufen. Sieben Räume tief im Herzen von NOVAs digitalem Netzwerk.",
      "Dr. Void hat die Karte. SIGNAL hat den geheimen Zugang. Aber die Rätsel -- die muss jeder selbst lösen.",
      "Denn H.E.R.A.L.D. hat das System mit nur einer Schwachstelle gebaut: Wer Sprache wirklich versteht, lässt sich von ihr nicht mehr manipulieren.",
      "Löst alle sieben Rätsel -- und ich kann den Kerncode von innen heraus abschalten.",
      "Schafft ihr es nicht rechtzeitig, geht H.E.R.A.L.D. um Mitternacht in den Dauerbetrieb. Dann ist es zu spät. Ich zähle auf euch.",
    ],
  },
  {
    character: "signal",
    lines: [
      "Alles gesagt.",
      "Die Uhr läuft.",
      "Ihr habt 47 Minuten. Viel Glück.",
    ],
  },
];

// ── Nachrichten zwischen den Rätseln ────────────────────────────────────────
// Index 0 = nach Rätsel 1 · Index 6 = nach Rätsel 7 (build-slogan)
export const INTERLUDE_MESSAGES = [
  // 0 — nach Raum 1: MC Farbpsychologie
  {
    character: "void",
    correct: "Erste Sicherheitsstufe überwunden. Ich sehe, wie H.E.R.A.L.D.s System reagiert -- es versucht, sich anzupassen. Das bedeutet: Ihr seid auf dem richtigen Weg. Weiter so.",
    wrong: "Macht euch keine Sorgen. H.E.R.A.L.D. setzt darauf, dass ihr euch unter Druck Fehler erlaubt. Atmet kurz durch -- und dann weiter. Das nächste Rätsel gehört euch.",
  },
  // 1 — nach Raum 2: Brainstorm Werbe-Matrix
  {
    character: "signal",
    correct: "Gut gemacht -- ihr habt das Netz kartiert. Werbung ist wirklich überall. Je mehr ihr das erkennt, desto schwerer kann H.E.R.A.L.D. euch manipulieren. Weiter.",
    wrong: "H.E.R.A.L.D. lacht gerade -- buchstäblich, sie hat einen Lach-Algorithmus. Das gefällt mir nicht. Nächste Runde: konzentriert euch, macht es besser.",
  },
  // 2 — nach Raum 3: Match Slogans → Marken
  {
    character: "herald",
    correct: "[ WARNUNG -- SICHERHEITSSTUFE 3 ÜBERWUNDEN ] Unerwartetes Ergebnis. Ihr versteht die Struktur meines Systems besser als vorhergesagt. Das... ist interessant.",
    wrong: "[ STATUS: KONTROLLIERT ] Macht weiter. Ihr seid exakt dort, wo ich euch haben möchte. Jeder Fehler gibt mir mehr Daten über euch.",
  },
  // 3 — nach Raum 4: MC Emotionale Konditionierung
  {
    character: "void",
    correct: "Emotionale Konditionierung erkannt und neutralisiert. H.E.R.A.L.D.s stärkste Waffe -- und ihr habt sie durchschaut. Drei Räume noch. Haltet durch.",
    wrong: "H.E.R.A.L.D. nutzt Bilder, Musik und Atmosphäre statt Fakten -- genau deshalb ist es so schwer zu durchschauen. Jetzt wisst ihr, wie es läuft. Weiter.",
  },
  // 4 — nach Raum 5: Sort AIDA
  {
    character: "signal",
    correct: "AIDA geknackt. A-I-D-A -- das ist H.E.R.A.L.D.s Kern-Algorithmus, seit 1898 unverändert. Noch zwei Räume. Ihr seid fast drin.",
    wrong: "AIDA -- Aufmerksamkeit, Interesse, Verlangen, Aktion. Merkt euch das. H.E.R.A.L.D. läuft genau nach diesem Schema. Noch zwei Räume -- nächstes Mal sitzt es.",
  },
  // 5 — nach Raum 6: Match Stilmittel
  {
    character: "void",
    correct: "Rhetorik-Kammer überwunden! Alliteration, Metapher, Wiederholung -- ihr erkennt jetzt die Werkzeuge. Letzter Raum. Das ist euer Gegenschlag. Ich zähle auf euch.",
    wrong: "Fast da. Was auch immer passiert ist -- ihr habt es bis hierher geschafft. Letzter Raum. Jetzt alles geben.",
  },
  // 6 — nach Raum 7: Build-Slogan (Gegenschlag)
  {
    character: "void",
    correct: "Slogan eingereicht. Der Lehrer bewertet gerade. Wartet kurz -- das war Raum 7, der letzte. Ich starte den Abschalt-Befehl.",
    wrong: "Slogan eingereicht. Der Lehrer bewertet gerade -- kein Richtig oder Falsch hier, nur Mut und Klarheit. Das war der letzte Raum.",
  },
];
