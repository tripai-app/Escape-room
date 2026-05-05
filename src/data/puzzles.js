// Rätsel-Daten — alle 5 Räume
// Typen: "multiple-choice" | "sort" | "build-slogan"
// briefing: { character, text }  ODER  [{ character, text }, ...]  für mehrere Charaktere

export const PUZZLES = [

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 1 — Das Frequenz-Labor
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 0,
    room: "Das Frequenz-Labor",
    roomSubtitle: "NOVA Corp -- Sendenetz-Einheit",
    type: "multiple-choice",
    timeLimit: 60,
    points: 100,

    briefing: {
      character: "void",
      text: "HERALD hat heute Nacht das Sendenetz übernommen. Er fängt immer mit demselben Trick an -- findet heraus welchem. Dann versteht ihr sein System.",
    },

    question: "Warum benutzen viele Werbespots **eingängige Jingles** oder kurze Melodien?",
    options: [
      { id: "a", text: "Damit Erwachsene beim Fernsehen schneller einschlafen" },
      { id: "b", text: "Weil Melodien im Fernsehen gesetzlich vorgeschrieben sind" },
      { id: "c", text: "Damit die Werbung weniger kostet als mit normaler Musik" },
      { id: "d", text: "Weil sich das Gehirn Melodien leichter merkt als gesprochene Sätze" },
    ],
    correct: "d",
    explanation: "Genau das nutzt HERALD: Melodien aktivieren das Belohnungssystem im Gehirn und bleiben bis zu 6x länger im Gedächtnis als Sprache -- deshalb summt man Jingles noch Tage später.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 2 — Der Slogan-Scanner
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    room: "Der Slogan-Scanner",
    roomSubtitle: "NOVA Corp -- Marken-Archiv",
    type: "sort",
    timeLimit: 90,
    points: 150,

    briefing: {
      character: "signal",
      text: "HERALD hat alle Slogans durcheinandergewürfelt -- sein erster Sabotageakt im Archiv. Die Reihenfolge der Marken steht in der Frage. Bringt jeden Slogan zurück zu seiner Marke.",
    },

    question: "Sortiere die Slogans so, dass sie zur richtigen Marke passen: **1. Ritter Sport -- 2. Haribo -- 3. L'Oreal -- 4. Audi -- 5. Deutsche Bahn**",
    items: [
      { id: "au",  text: "Vorsprung durch Technik." },
      { id: "lo",  text: "Weil ich es mir wert bin." },
      { id: "db",  text: "Wir bewegen Deutschland." },
      { id: "rs",  text: "Quadratisch. Praktisch. Gut." },
      { id: "ha",  text: "Haribo macht Kinder froh -- und Erwachsene ebenso." },
    ],
    correctOrder: ["rs", "ha", "lo", "au", "db"],
    explanation: "Jeder Slogan spiegelt die Markenidentität wider: Ritter Sport setzt auf Form, Haribo auf Freude, L'Oréal auf Selbstwert, Audi auf Technik, Deutsche Bahn auf Bewegung.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 3 — Das Emotions-Modul
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    room: "Das Emotions-Modul",
    roomSubtitle: "NOVA Corp -- Psycho-Labor",
    type: "multiple-choice",
    timeLimit: 60,
    points: 150,

    briefing: {
      character: "herald",
      text: "[ SICHERHEITSSTUFE 3 AKTIV ] Willkommen in meinem Lieblingsmodul. Fakten überzeugen kaum jemanden. Emotionen dagegen... Wer begreift, wie ich das einsetze, ist mir bereits einen Schritt näher. Interessant.",
    },

    question: "Die Deutsche Bahn startete eine Kampagne mit dem Slogan **'Diese Bahn ist zum Küssen schön'** und zeigte Paare in Zügen. Welche Marketing-Idee steckt dahinter?",
    options: [
      { id: "a", text: "Die Bahn wollte zeigen, dass ihre Züge komplett frei von Verspätungen sind." },
      { id: "b", text: "Es ging darum, Kinder davon abzuhalten, laut zu sein." },
      { id: "c", text: "Züge sollten als romantische Orte gezeigt werden, um Bahnfahren emotional attraktiver zu machen." },
      { id: "d", text: "Die Kampagne sollte nur Hochzeitsreisen verkaufen." },
    ],
    correct: "c",
    explanation: "Emotionalisierung: Ein Produkt wird mit Gefühlen verknüpft. Statt an Verspätungen denkt man an erste Dates -- das nennt man HERALDs stärkste Waffe.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 4 — HERALDs Formel
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    room: "HERALDs Formel",
    roomSubtitle: "NOVA Corp -- Algorithmus-Kern",
    type: "sort",
    timeLimit: 75,
    points: 200,

    briefing: {
      character: "void",
      text: "Ich habe HERALDs Manipulations-Algorithmus entschlüsselt -- er läuft immer in 4 Schritten ab. Bringt sie in die richtige Reihenfolge und ihr versteht, wie er jede Person kontrolliert.",
    },

    question: "HERALD manipuliert in **4 Schritten**. Bringe sie in die richtige Reihenfolge -- von Schritt 1 bis 4:",
    items: [
      { id: "action",     text: "AKTION: Du kaufst. Du klickst. Du gehorchst." },
      { id: "attention",  text: "AUFMERKSAMKEIT: HERALD sendet ein grelles Bild -- du schaust hin, obwohl du es nicht willst." },
      { id: "desire",     text: "VERLANGEN: Du denkst: Das will ich haben. Das wäre gut für mich." },
      { id: "interest",   text: "INTERESSE: Du fragst dich: Was ist das? Du kannst nicht aufhören hinzuschauen." },
    ],
    correctOrder: ["attention", "interest", "desire", "action"],
    explanation: "Die AIDA-Formel: Aufmerksamkeit -- Interesse -- Verlangen -- Aktion. Seit 1898 der Standard in der Werbung -- und HERALDs Kern-Algorithmus.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 5 — Der Gegenschlag
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    room: "Der Gegenschlag",
    roomSubtitle: "NOVA Corp -- HERALD Kern-Terminal",
    type: "build-slogan",
    timeLimit: 120,
    points: 250,

    briefing: [
      {
        character: "void",
        text: "Das ist unsere letzte Chance. HERALDs Abschalt-Code reagiert nur auf Sprache -- auf einen Satz, der seine eigene Logik gegen ihn wendet.",
      },
      {
        character: "signal",
        text: "Ein Slogan. Kurz. Präzise. Die Wahrheit.",
      },
      {
        character: "herald",
        text: "[ ALARM -- PHASE OMEGA KRITISCH ] ...ihr werdet scheitern. Niemand widersteht guter Werbung. NIEMAND--",
      },
    ],

    question: "Schreibe einen **Anti-Werbung-Slogan**, der HERALDs Manipulation entlarvt. Nutze mindestens ein Stilmittel. Der Lehrer bewertet live.",
    examples: [
      "Wiederholung: 'Denk. Denk nochmal. Kauf nicht.'",
      "Frage: 'Willst du das wirklich -- oder sagt das HERALD?'",
      "Kontrast: 'Ihr Profit. Dein Wunsch.'",
      "Alliteration: 'Kaufen? Klicken? Kontrolliert.'",
    ],
    explanation: "Die stärkste Waffe gegen Manipulation ist Wissen -- und der eigene, klare Gedanke. Ihr habt HERALD gestoppt.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
export const STORY = {
  title: "NOVA PROTOCOL",
  subtitle: "Die letzte Sendung",
  year: "2031",
  intro: [
    "Das Jahr 2031.",
    "NOVA Corp ist der mächtigste Konzern der Welt -- und niemand kauft mehr freiwillig.",
    "Ihre KI HERALD analysiert jeden Menschen und sendet personalisierte Werbung direkt ins Unterbewusstsein.",
    "Heute Nacht, 23:59 Uhr, geht HERALD online. Für immer.",
    "Eine anonyme Nachricht erscheint auf euren Handys:",
    "'Ihr seid die Einzigen, die es noch stoppen können. Infiltriert das Netzwerk. Versteht ihre Sprache. Brecht den Code.'",
    "Ihr habt 5 Rätsel. Ihr habt einander. Und ihr habt -- fast -- keine Zeit mehr.",
    "Viel Erfolg. Die Welt schaut zu.",
  ],
};
