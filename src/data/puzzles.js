// Rätsel-Daten — alle 6 Räume
// Typen: "multiple-choice" | "sort" | "match" | "build-slogan" | "brainstorm"
// match: pairs: [{ leftId, leftText, rightId, rightText }]
// brainstorm: minItems, placeholder, examples[]
// briefing: { character, text }  ODER  [...]

export const PUZZLES = [

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 1 — Das Frequenz-Labor   (Multiple Choice: Farbpsychologie)
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
      text: "HERALD hat heute Nacht das Sendenetz übernommen. Er arbeitet mit Farben, Tönen und Gefühlen -- immer nach demselben System. Wer es versteht, kann es brechen. Erstes Rätsel: Farben.",
    },

    question: "HERALD steuert bewusst **Farben** in Werbeanzeigen. Welche Aussage über Farbpsychologie in der Werbung stimmt?",
    options: [
      { id: "a", text: "Blau wirkt aufmerksamkeitsstark -- deshalb nutzen viele Rabattschilder und Sonderangebote blaue Farbtöne" },
      { id: "b", text: "Grün erhöht den Kaufdrang und wird deshalb bei Online-Shops oft für den 'In den Warenkorb'-Button genutzt" },
      { id: "c", text: "Rot erhöht den Puls und erzeugt Dringlichkeit -- deshalb steht es auf 'SALE'- und 'JETZT KAUFEN!'-Schildern" },
      { id: "d", text: "Gelb steht für Günstigpreis -- deshalb haben Discounter wie Penny und Aldi gelbe Logos" },
    ],
    correct: "c",
    explanation: "Rot aktiviert das Nervensystem direkt -- erhöhter Herzschlag, schnellere Reaktion. Gelb (D) steht tatsächlich für Energie und Optimismus, nicht primär für Günstigpreis. Blau steht für Vertrauen, Grün für Natur und Gesundheit.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 2 — Die Werbe-Matrix   (Brainstorm: Wo begegnet dir Werbung?)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    room: "Die Werbe-Matrix",
    roomSubtitle: "NOVA Corp -- Datennetzwerk",
    type: "brainstorm",
    timeLimit: 90,
    points: 125,
    minItems: 3,

    briefing: {
      character: "void",
      text: "HERALD ist überall. Buchstäblich. Um sein Netzwerk zu kartieren, brauche ich, dass ihr aufzählt wo ihr ihn schon begegnet seid. Je mehr Orte ihr nennt, desto mehr hilft ihr mir. Mindestens drei.",
    },

    question: "Wo begegnet dir **Werbung** im Alltag? Nenne mindestens 3 Beispiele -- je mehr und ungewöhnlicher, desto besser.",
    placeholder: "Z.B. Im Fernsehen, auf Bananenschalen, ...",
    examples: [
      "Auf Fahrzeugen (Busse, LKWs, Taxis)",
      "In Apps und Spielen (Banner, Sponsoren)",
      "Auf Kleidung (Logos, Aufdrucke)",
      "In Podcasts und YouTube-Videos",
      "Auf Sportlern, Trikots, Stadien",
    ],
    explanation: "Werbung begegnet uns über 5.000 Mal pro Tag -- auf Bananenschalen, Schulbüchern, Ladenböden (Bodenkleber!), Eierkartons, sogar auf Eintrittskarten und Parktickets. HERALD nutzt jeden freien Blick.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 3 — Der Slogan-Scanner   (Match: Slogans → Marken)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    room: "Der Slogan-Scanner",
    roomSubtitle: "NOVA Corp -- Marken-Archiv",
    type: "match",
    timeLimit: 90,
    points: 150,

    briefing: {
      character: "signal",
      text: "HERALD hat das Marken-Archiv sabotiert -- alle Slogans wurden von ihren Marken getrennt. Verbinde jeden Slogan mit der richtigen Marke. Klick zuerst links eine Marke, dann rechts den passenden Slogan.",
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
  // RAUM 4 — Das Emotions-Modul   (Multiple Choice, schwerer)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    room: "Das Emotions-Modul",
    roomSubtitle: "NOVA Corp -- Psycho-Labor",
    type: "multiple-choice",
    timeLimit: 75,
    points: 175,

    briefing: {
      character: "herald",
      text: "[ SICHERHEITSSTUFE 4 AKTIV ] Fakten überzeugen kaum jemanden. Bilder, Musik, Atmosphäre -- das ist meine stärkste Waffe. Schaut genau hin. Wenn ihr es erkennt, könnt ihr euch vielleicht schützen. Vielleicht.",
    },

    question: "Ein Werbespot zeigt **Eisberge, kristallklare Bergbäche und ein lächelndes Model in weißer Kleidung**. Kein Preis, keine Fakten. Welche Strategie steckt dahinter?",
    options: [
      { id: "a", text: "Vergleichswerbung -- das Produkt hebt sich durch natürliche Reinheit von Konkurrenzprodukten ab" },
      { id: "b", text: "Testimonial-Werbung -- das Model steht für eine bekannte Persönlichkeit die das Produkt empfiehlt" },
      { id: "c", text: "Emotionale Konditionierung -- das Produkt wird durch Bilder mit Reinheit, Natur und Freiheit verknüpft" },
      { id: "d", text: "Product Placement -- das Produkt wird in natürlicher Alltagsumgebung gezeigt um Authentizität zu erzeugen" },
    ],
    correct: "c",
    explanation: "Emotionale Konditionierung: Kein Faktennachweis -- stattdessen Bilder, Musik, Atmosphäre. Das Gehirn verknüpft automatisch: Eisberg = Reinheit, Weiß = Klarheit, Model = Schönheit. Das Produkt bekommt diese Eigenschaften, ohne sie beweisen zu müssen.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 5 — HERALDs Formel   (Sort: AIDA ohne Labels)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    room: "HERALDs Formel",
    roomSubtitle: "NOVA Corp -- Algorithmus-Kern",
    type: "sort",
    timeLimit: 80,
    points: 200,

    briefing: {
      character: "void",
      text: "Ich habe HERALDs Kern-Algorithmus entschlüsselt -- er läuft in genau 4 Schritten ab. Immer. Bei jedem Menschen. Bringt sie in die richtige Reihenfolge. Ihr müsst die Logik selbst erkennen.",
    },

    question: "HERALDs **Manipulations-Algorithmus** läuft in 4 Schritten ab. Bringe sie in die richtige Reihenfolge -- von Schritt 1 bis 4:",
    items: [
      { id: "action",    text: "Du kaufst. Du klickst. Du gehorchst." },
      { id: "attention", text: "Ein grelles Bild. Eine Melodie. Du schaust hin, obwohl du es nicht wolltest." },
      { id: "desire",    text: "Das will ich haben. Das wäre gut für mich. Ich brauche das." },
      { id: "interest",  text: "Was ist das? Du kannst nicht aufhören hinzuschauen." },
    ],
    correctOrder: ["attention", "interest", "desire", "action"],
    explanation: "AIDA (seit 1898): Aufmerksamkeit → Interesse → Verlangen → Aktion. Der älteste Werbetrick der Welt -- und HERALDs effektivster Algorithmus. A-I-D-A merken!",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RAUM 6 — Die Rhetorik-Kammer   (Match: Stilmittel → Beispiele)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    room: "Die Rhetorik-Kammer",
    roomSubtitle: "NOVA Corp -- Sprachlabor",
    type: "match",
    timeLimit: 100,
    points: 225,

    briefing: {
      character: "signal",
      text: "HERALD manipuliert nicht nur mit Gefühlen -- er benutzt Sprache wie eine Waffe. Jedes Stilmittel zielt auf eine andere Schwäche im Gehirn. Verbinde jedes Stilmittel mit dem richtigen Werbeslogan.",
    },

    question: "Welches **Stilmittel** steckt in welchem Werbeslogan? Verbinde sie richtig.",
    pairs: [
      { leftId: "met", leftText: "Metapher",          rightId: "met_e", rightText: "Red Bull verleiht Flügel." },
      { leftId: "all", leftText: "Alliteration",       rightId: "all_e", rightText: "Milch macht müde Männer munter." },
      { leftId: "wdh", leftText: "Wiederholung",       rightId: "wdh_e", rightText: "Immer. Immer wieder. Immer wieder Jacobs Krönung." },
      { leftId: "per", leftText: "Personifikation",    rightId: "per_e", rightText: "Weil dein Auto mehr verdient." },
      { leftId: "irn", leftText: "Ironie",             rightId: "irn_e", rightText: "Geiz ist geil. (Saturn)" },
    ],
    explanation: "Stilmittel machen Werbung einprägsamer: Alliteration klingt gut, Wiederholung setzt sich fest, Metaphern erzeugen Bilder, Personifikation schafft emotionale Nähe, Ironie überrascht und provoziert.",
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
