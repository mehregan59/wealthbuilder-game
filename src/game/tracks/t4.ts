import { buildTrack, type TrackConfig } from "./base";

const cfg: TrackConfig = {
  id: "T4",
  label: "The last stretch",
  ageRange: "47+",
  blurb: "Fewer years to recover, and every decision now has a date attached.",
  monthly: 950,
  startPot: 128000,
  horizonYears: 15,
  l1: {
    chapter: "Rentenversicherung letter",
    mood: "dawn",
    character: { name: "The letter", role: "annual statement", emoji: "✉️" },
    lines: [
      "Projected statutory pension: €1,410 per month.",
      "Your last three payslips averaged €4,180 net.",
    ],
    options: [
      { key: "bold", text: "Then the rest has to grow. Depot, mostly.", insight: "With 15 years left, growth is still possible — a bad final decade is also still possible." },
      { key: "balanced", text: "Split it. Some growth, some protected.", insight: "You started thinking in two pots instead of one number." },
      { key: "safe", text: "Protect what's there. No more risk.", insight: "Locking in at 52 means inflation, not markets, becomes the thing eroding you." },
    ],
    rule: { status: "LAW", text: "Statutory pension level is secured at 48% until 2031 — the gap to your last salary is yours to close." },
  },
  l2: {
    chapter: "The monthly surplus",
    mood: "office",
    prompt: "€950 spare. €128,000 already saved. Fifteen years on the clock.",
    rule: { status: "LAW", text: "Aktivrente: working past the statutory age can earn tax-privileged income alongside the pension." },
  },
  l3: {
    chapter: "The camper van",
    mood: "warm",
    character: { name: "Beate", role: "your sister", emoji: "🚐" },
    lines: [
      "Rolf waited until he retired to buy his. He got eleven months with it.",
      "You've been saying 'later' since you were forty.",
    ],
    options: [
      { key: "now", text: "I'm buying it this year.", insight: "You spent from the pot and bought time you can actually use. That is a real return, just not a financial one." },
      { key: "split", text: "I'll rent one for two summers first.", insight: "You tested the wish before funding it permanently." },
      { key: "later", text: "After 67. It'll still be there.", insight: "'Later' has an expiry date now, and you priced it at zero." },
    ],
    rule: { status: "LAW", text: "Private pension capital is generally accessible from age 62, as a lifelong annuity or a phased payout plan." },
  },
  l4: {
    chapter: "Coffee with old colleagues",
    mood: "warm",
    prompt: "One of them is up 61% this year and wants to know why you're not.",
    rule: { status: "PROPOSAL", text: "Generationenkapital as a funded pillar element remains a proposal." },
  },
  l5: {
    chapter: "Kitchen radio, 8:05",
    mood: "office",
    character: { name: "Push notification", role: "news app", emoji: "📱" },
    lines: [
      "'PENSIONERS FACE REAL-TERMS CUT' — the segment lasts ninety seconds.",
      "Your depot is showing −7.4%.",
    ],
    options: [
      { key: "react", text: "Call the bank this morning.", insight: "Ninety seconds of radio set the agenda for a fifteen-year plan." },
      { key: "watch", text: "Wait for the written statement.", insight: "You made the information come to you instead of chasing it." },
      { key: "ignore", text: "Turn it off.", insight: "At 15 years out, ignoring is riskier than at 45 — there is less time to be wrong in." },
    ],
    rule: { status: "LAW", text: "Pensions are indexed to wages, not to prices — real value can still fall." },
  },
  l6: {
    chapter: "Consolidating old contracts",
    mood: "warm",
    prompt: "Three legacy contracts at 2.3%. One capped product at 1%. Same underlying fund.",
    rule: { status: "EFFECTIVE_2027", text: "The Standarddepot caps total annual cost at 1% p.a.; existing Riester contracts keep their old terms." },
  },
  l7: {
    chapter: "The bad month",
    mood: "storm",
    character: { name: "Beate", role: "your sister", emoji: "🚐" },
    lines: [
      "Down 31%, and you retire in fifteen years, not forty.",
      "Rolf's went down the year before he stopped working. He never got it back.",
    ],
    options: [
      { key: "sell", text: "Move it all to safety now.", insight: "Sequence-of-returns risk is real this close to the date — but selling after the fall locks it in rather than avoiding it." },
      { key: "hold", text: "Hold. Fifteen years is still fifteen years.", insight: "You held with less runway than last time. That takes a different kind of nerve." },
      { key: "buy", text: "Buy more while it's down.", insight: "Buying the dip at 52 is a different bet than at 22, and you didn't pause on the difference." },
    ],
    rule: { status: "LAW", text: "A phased withdrawal plan keeps money invested during payout — and keeps it exposed." },
  },
  l8: {
    chapter: "After the fall",
    mood: "storm",
    prompt: "€950, and a market 31% cheaper. Fifteen years to the payout date.",
    rule: { status: "LAW", text: "EET: the pension is taxed on withdrawal, usually at a lower rate than your working years." },
  },
};

export const t4 = buildTrack(cfg);