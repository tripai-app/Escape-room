// Rätsel-Daten — alle 6 Räume
// Typen: "multiple-choice" | "sort" | "match" | "build-slogan"
// match-Typ: pairs: [{ leftId, leftText, rightId, rightText }]
// briefing: { character, text }  ODER  [{ character, text }, ...]

export const PUZZLES = [

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 1 — Das Frequenz-Labor   (Multiple Choice)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 0,
    room: "Das Frequenz-Labor",
    roomSubtitle: "NOVA Corp -- Sendenetz-Einheit",
    type: "multiple-choice",
    timeLimit: 70,
    points: 100,

    briefing: {
      character: "void",
      text: "HERALD hat heute Nacht das Sendenetz übernommen. Er arbeitet mit Farben, Tönen und Gefühlen -- immer nach demselben System. Wer es versteht, kann es brechen.",
    },

    question: "HERALD steuert bewusst **Farben** in Werbeanzeigen. Welche Aussage über Farbpsychologie in der Werbung stimmt?",
    options: [
      { id: "a", text: "Blau wirkt appetitanregend -- deshalb nutzen Fast-Food-Ketten es für ihre Logos" },
      { id: "b", text: "Grün signalisiert 'Günstigpreis' und steht deshalb auf Rabattschildern" },
      { id: "c", text: "Rot erhöht den Puls und erzeugt Dringlichkeit -- deshalb steht es auf 'SALE'- und 'JETZT!'-Schildern" },
      { id: "d", text: "Gelb symbolisiert Trauer und wird in der Werbung kaum verwendet" },
    ],
    correct: "c",
    explanation: "Rot aktiviert das Nervensystem -- erhöhter Herzschlag, gesteigerte Aufmerksamkeit. Fast-Food kombiniert Rot (Dringlichkeit) und Gelb (Energie). Blau steht für Vertrauen -- deshalb nutzen Banken und Tech-Firmen es.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 2 — Der Slogan-Scanner   (Match: Slogans → Marken)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    room: "Der Slogan-Scanner",
    roomSubtitle: "NOVA Corp -- Marken-Archiv",
    type: "match",
    timeLimit: 90,
    points: 150,

    briefing: {
      character: "signal",
      text: "HERALD hat das Marken-Archiv sabotiert -- alle Slogans wurden von ihren Marken getrennt. Verbinde jeden Slogan mit der richtigen Marke. Klick zuerst links, dann rechts.",
    },

    question: "**Welcher Slogan** gehört zu welcher Marke? Klicke zuerst eine Marke an, dann den passenden Slogan.",
    pairs: [
      { leftId: "rs", leftText: "Ritter Sport",  rightId: "rs_s", rightText: "Quadratisch. Praktisch. Gut." },
      { leftId: "ha", leftText: "Haribo",         rightId: "ha_s", rightText: "Haribo macht Kinder froh -- und Erwachsene ebenso." },
      { leftId: "lo", leftText: "L'Oréal",        rightId: "lo_s", rightText: "Weil ich es mir wert bin." },
      { leftId: "au", leftText: "Audi",           rightId: "au_s", rightText: "Vorsprung durch Technik." },
      { leftId: "db", leftText: "Deutsche Bahn",  rightId: "db_s", rightText: "Wir bewegen Deutschland." },
    ],
    explanation: "Jeder Slogan spiegelt die Markenidentität in einem Satz: Ritter Sport = Form, Haribo = Freude, L'Oréal = Selbstwert, Audi = Innovation, Deutsche Bahn = Bewegung.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 3 — Das Emotions-Modul   (Multiple Choice, schwerer)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    room: "Das Emotions-Modul",
    roomSubtitle: "NOVA Corp -- Psycho-Labor",
    type: "multiple-choice",
    timeLimit: 75,
    points: 175,

    briefing: {
      character: "herald",
      text: "[ SICHERHEITSSTUFE 3 AKTIV ] Fakten überzeugen kaum jemanden. Bilder, Musik, Atmosphäre -- das ist meine stärkste Waffe. Schaut genau hin. Wenn ihr es erkennt, könnt ihr euch vielleicht schützen. Vielleicht.",
    },

    question: "Ein Werbespot zeigt **Eisberge, kristallklare Bergbäche und ein lächelndes Model in weißer Kleidung**. Kein Preis, keine Fakten. Welche Strategie steckt dahinter?",
    options: [
      { id: "a", text: "Die Qualität des Produkts wird durch wissenschaftliche Studien bewiesen" },
      { id: "b", text: "Der Spot richtet sich gezielt an Kinder unter 12 Jahren" },
      { id: "c", text: "Das Produkt wird emotional aufgeladen -- durch Bilder mit Reinheit, Natur und Freiheit verknüpft" },
      { id: "d", text: "Es handelt sich um Vergleichswerbung gegen ein Konkurrenzprodukt" },
    ],
    correct: "c",
    explanation: "Emotionale Konditionierung: Kein Faktennachweis -- stattdessen Bilder, Musik, Atmosphäre. Das Gehirn verknüpft automatisch: Eisberg = Reinheit, Weiß = Klarheit, Model = Schönheit. Das Produkt bekommt diese Eigenschaften, ohne sie zu beweisen.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 4 — HERALDs Formel   (Sort: AIDA)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    room: "HERALDs Formel",
    roomSubtitle: "NOVA Corp -- Algorithmus-Kern",
    type: "sort",
    timeLimit: 80,
    points: 200,

    briefing: {
      character: "void",
      text: "Ich habe HERALDs Kern-Algorithmus entschlüsselt -- er läuft in genau 4 Schritten ab. Immer. Bei jedem Menschen. Bringt sie in die richtige Reihenfolge und ihr versteht, wie er euch kontrolliert.",
    },

    question: "Die **AIDA-Formel** ist HERALDs Manipulations-Algorithmus. Sortiere die 4 Schritte in der richtigen Reihenfolge -- von Schritt 1 bis 4:",
    items: [
      { id: "action",    text: "AKTION -- Du kaufst. Du klickst. Du gehorchst." },
      { id: "attention", text: "AUFMERKSAMKEIT -- Ein grelles Bild. Eine Melodie. Du schaust hin, obwohl du es nicht wolltest." },
      { id: "desire",    text: "VERLANGEN -- Das will ich haben. Das wäre gut für mich. Ich brauche das." },
      { id: "interest",  text: "INTERESSE -- Was ist das? Du kannst nicht aufhören hinzuschauen." },
    ],
    correctOrder: ["attention", "interest", "desire", "action"],
    explanation: "AIDA (seit 1898): Aufmerksamkeit → Interesse → Verlangen → Aktion. Der älteste Werbetrick der Welt -- und HERALDs effektivster Algorithmus.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 5 — Die Rhetorik-Kammer   (Match: Stilmittel → Beispiele) [NEU]
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    room: "Die Rhetorik-Kammer",
    roomSubtitle: "NOVA Corp -- Sprachlabor",
    type: "match",
    timeLimit: 100,
    points: 225,

    briefing: {
      character: "signal",
      text: "HERALD manipuliert nicht nur mit Gefühlen -- er benutzt Sprache wie eine Waffe. Jedes Stilmittel zielt auf eine andere Schwäche im Gehirn. Verbinde jedes Stilmittel mit dem richtigen Werbeslogan. Schnell.",
    },

    question: "Welches **Stilmittel** steckt in welchem Werbeslogan? Verbinde sie richtig.",
    pairs: [
      { leftId: "met", leftText: "Metapher",          rightId: "met_e", rightText: "Red Bull verleiht Flügel." },
      { leftId: "all", leftText: "Alliteration",       rightId: "all_e", rightText: "Milch macht müde Männer munter." },
      { leftId: "wdh", leftText: "Wiederholung",       rightId: "wdh_e", rightText: "Immer. Immer wieder. Immer wieder Jacobs Krönung." },
      { leftId: "per", leftText: "Personifikation",    rightId: "per_e", rightText: "Weil dein Auto mehr verdient." },
      { leftId: "irn", leftText: "Ironie",             rightId: "irn_e", rightText: "Geiz ist geil. (Saturn)" },
    ],
    explanation: "Stilmittel machen Werbung einprägsamer: Alliteration klingt gut → bleibt im Ohr. Wiederholung setzt sich fest. Metaphern erzeugen Bilder. Personifikation schafft Nähe zum Produkt. Ironie überrascht -- und provoziert.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 6 — Der Gegenschlag   (Build-Slogan, bewertet durch Lehrer)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    room: "Der Gegenschlag",
    roomSubtitle: "NOVA Corp -- HERALD Kern-Terminal",
    type: "build-slogan",
    timeLimit: 150,
    points: 300,

    briefing: [
      {
        character: "void",
        text: "HERALDs Abschalt-Code reagiert nur auf Sprache -- auf einen Satz, der seine eigene Logik gegen ihn wendet. Ihr müsst jetzt selbst eine Botschaft schreiben. Eine, die aufklärt statt zu manipulieren.",
      },
      {
        character: "signal",
        text: "Produkt: MemWash 3000. NOVAs neue App, die angeblich schlechte Erinnerungen löscht. In Wirklichkeit sammelt sie Daten und verkauft Gedanken. Schreibt einen Slogan, der warnt.",
      },
      {
        character: "herald",
        text: "[ ALARM -- PHASE OMEGA KRITISCH ] ...Das ist einfach dumm. Niemand schreibt bessere Werbung als ich. NIEMAND. Versucht es. Ich warte. Ich lache bereits--",
      },
    ],

    question: "NOVA Corp bewirbt **MemWash 3000** -- eine App, die angeblich schlechte Erinnerungen löscht. Schreibe einen **Aufklärungs-Slogan**, der Menschen warnt. Nutze mindestens ein Stilmittel. Der Lehrer bewertet deinen Slogan.",
    examples: [
      "Metapher: 'MemWash 3000 -- das Messer, das dein Denken schneidet.'",
      "Alliteration: 'Klick. Kauf. Kontrolliert. -- Stopp.'",
      "Wiederholung: 'Deine Daten. Deine Daten. Ihre Millionen.'",
      "Ironie: 'Vergiss deine Erinnerungen -- NOVA merkt sie sich für dich.'",
    ],
    explanation: "Die stärkste Antwort auf Manipulation ist kritisches Denken -- ausgedrückt in klarer, wirkungsvoller Sprache. Ihr habt HERALDs System von innen kennengelernt. Jetzt könnt ihr es erkennen -- und benennen.",
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
    "Ihr habt 6 Rätsel. Ihr habt einander. Und ihr habt -- fast -- keine Zeit mehr.",
    "Viel Erfolg. Die Welt schaut zu.",
  ],
};
