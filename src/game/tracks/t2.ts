import { buildTrack, type TrackConfig } from "./base";

const cfg: TrackConfig = {
  id: "T2",
  label: "The salary jump",
  ageRange: "28–37",
  blurb: "More money than last year, and someone else's plans in the same sentence.",
  monthly: 620,
  startPot: 9800,
  horizonYears: 35,
  l1: {
    chapter: "Sunday, kitchen",
    mood: "warm",
    character: { name: "Marek", role: "partner", emoji: "🧑" },
    lines: [
      "The raise starts next month. That's €400 more, every month.",
      "My parents keep saying property. Everyone at work says fund depot.",
    ],
    options: [
      { key: "bold", text: "All of it into the depot. We have decades.", insight: "You committed the whole raise to the market before either of you named a worst case." },
      { key: "balanced", text: "Half invested, half where it can't move.", insight: "You hedged against a scenario you hadn't described yet." },
      { key: "safe", text: "Into the account until we've decided.", insight: "The undecided money is still making a decision — it's losing to inflation." },
    ],
    rule: { status: "EFFECTIVE_2027", text: "From 2027, subsidised private provision can be held either as a market depot or as a guarantee product." },
  },
  l2: {
    chapter: "The new payslip",
    mood: "office",
    prompt: "€620 free this month. Nothing is decided yet.",
    rule: { status: "LAW", text: "Occupational pension (Pillar II) contributions come out of gross pay and are employer co-funded." },
  },
  l3: {
    chapter: "Estate agent, 18:30",
    mood: "office",
    character: { name: "Frau Bergmann", role: "estate agent", emoji: "🔑" },
    lines: [
      "There's a second viewing tomorrow. Two other couples.",
      "If you want it you decide tonight, not next week.",
    ],
    options: [
      { key: "now", text: "We'll take it. Draft the offer.", insight: "Scarcity moved you faster than the numbers did." },
      { key: "split", text: "We'll bid, but under asking.", insight: "You stayed in the game without letting the clock set your price." },
      { key: "later", text: "We'll wait for the next one.", insight: "You let a good option go to avoid a rushed one. That trade is invisible for years." },
    ],
    rule: { status: "LAW", text: "Property equity does not count as retirement provision until it is either sold or rent-free." },
  },
  l4: {
    chapter: "Team drinks",
    mood: "night",
    prompt: "Three colleagues are up 61% this year. They keep mentioning it.",
    rule: { status: "PROPOSAL", text: "A 70% target replacement rate has been discussed by the pension commission; it is not law." },
  },
  l5: {
    chapter: "Monday, 8:05",
    mood: "office",
    character: { name: "Push notification", role: "news app", emoji: "📱" },
    lines: [
      "'PENSION SYSTEM AT BREAKING POINT' — front page, again.",
      "Your depot is showing −7.4%.",
    ],
    options: [
      { key: "react", text: "Move it somewhere safe today.", insight: "A headline you didn't finish reading moved real money." },
      { key: "watch", text: "Read past the headline first.", insight: "You paused. That pause is the whole difference between the two outcomes." },
      { key: "ignore", text: "Delete the app.", insight: "You removed the noise and the signal together." },
    ],
    rule: { status: "LAW", text: "The statutory system is pay-as-you-go (Umlageverfahren) — today's contributions pay today's pensions." },
  },
  l6: {
    chapter: "Advisor's office",
    mood: "warm",
    prompt: "Same fund, two wrappers: 1% capped, or 2.3% with 'personal service'.",
    rule: { status: "EFFECTIVE_2027", text: "The Standarddepot caps total annual cost at 1% p.a." },
  },
  l7: {
    chapter: "The bad month",
    mood: "storm",
    character: { name: "Marek", role: "partner", emoji: "🧑" },
    lines: [
      "It's down 31%. That's the deposit we were building.",
      "Tell me we're not just watching this.",
    ],
    options: [
      { key: "sell", text: "You're right. Take it out.", insight: "You bought calm at the exact worst price." },
      { key: "hold", text: "We haven't lost anything until we sell.", insight: "You held a position and a conversation at the same time. The second one was harder." },
      { key: "buy", text: "We add this month instead.", insight: "Adding into a fall is mathematically strong and emotionally expensive." },
    ],
    rule: { status: "LAW", text: "Private pension capital is generally locked until age 62." },
  },
  l8: {
    chapter: "After the fall",
    mood: "storm",
    prompt: "This month's money, and a market 31% cheaper than in January.",
    rule: { status: "LAW", text: "EET: contributions and growth untaxed, the pension taxed on withdrawal." },
  },
};

export const t2 = buildTrack(cfg);