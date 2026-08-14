import { buildTrack, type TrackConfig } from "./base";

const cfg: TrackConfig = {
  id: "T1",
  label: "First salary",
  ageRange: "18–27",
  blurb: "A shared flat, a first payslip, and 45 years you cannot picture yet.",
  monthly: 320,
  startPot: 0,
  horizonYears: 45,
  l1: {
    chapter: "Kitchen table, 7:40",
    mood: "dawn",
    character: { name: "Jonas", role: "flatmate", emoji: "🧑‍🍳" },
    lines: [
      "Your contract came through. HR needs the pension form back today.",
      "My brother put everything in shares at your age. My mum still hasn't forgiven hers for touching them.",
    ],
    options: [
      { key: "bold", text: "I've got forty years. Put it all in the market.", insight: "You reached for the longest horizon in the room without checking what a bad decade feels like." },
      { key: "balanced", text: "Half market, half something that can't fall.", insight: "You split the difference before you had felt either side." },
      { key: "safe", text: "Nothing that can lose. I need to see the number hold.", insight: "Protecting a small number cost you the years that were doing the work." },
    ],
    rule: { status: "EFFECTIVE_2027", text: "From 2027 the Altersvorsorgedepot lets you hold market-exposed funds inside the subsidised private pillar." },
  },
  l2: {
    chapter: "First payslip",
    mood: "office",
    prompt: "€320 landed. Put it somewhere before Friday.",
    rule: { status: "EFFECTIVE_2027", text: "Berufseinsteiger-Bonus: an extra state top-up in the first years of contributing." },
  },
  l3: {
    chapter: "Thursday, 22:10",
    mood: "night",
    character: { name: "Lea", role: "friend", emoji: "🎧" },
    lines: [
      "Festival tickets go on sale in nine minutes. Four hundred each.",
      "You said you were saving. You also said that last summer.",
    ],
    options: [
      { key: "now", text: "Send me the link.", insight: "€400 today is roughly €4,300 at 67. You didn't weigh that; you weighed the group chat." },
      { key: "split", text: "I'll come for one day only.", insight: "You bought half the experience and kept half the compounding." },
      { key: "later", text: "Not this year.", insight: "You held. Notice that nobody clapped — that's the part that makes it hard." },
    ],
    rule: { status: "LAW", text: "Contributions to the statutory pension (Pillar I) buy Entgeltpunkte; private saving sits on top, it does not replace them." },
  },
  l4: {
    chapter: "The group chat",
    mood: "night",
    prompt: "Everyone you know is up 61% this year. Your money is in your hand.",
    rule: { status: "PROPOSAL", text: "Frühstart-Rente (state-funded children's depot) is announced, not enacted." },
  },
  l5: {
    chapter: "Commute, 8:05",
    mood: "office",
    character: { name: "Push notification", role: "news app", emoji: "📱" },
    lines: [
      "MARKETS SLIDE FOR THIRD DAY — 'worse to come', analysts warn.",
      "Your depot is showing −7.4%.",
    ],
    options: [
      { key: "react", text: "Move it out now, before the stop.", insight: "You acted on a headline written to be acted on." },
      { key: "watch", text: "Check what actually caused it first.", insight: "You slowed down enough for the information to change shape." },
      { key: "ignore", text: "Close the app.", insight: "Ignoring noise and ignoring information look identical from the outside." },
    ],
    rule: { status: "LAW", text: "Statutory pension level is legally secured at 48% until 2031 — private saving is the top-up, not the base." },
  },
  l6: {
    chapter: "Bank branch, Tuesday",
    mood: "warm",
    prompt: "Two products. Same fund inside. One costs 1%, one costs 2.3%.",
    rule: { status: "EFFECTIVE_2027", text: "The Standarddepot caps total annual cost at 1% p.a." },
  },
  l7: {
    chapter: "The bad month",
    mood: "storm",
    character: { name: "Jonas", role: "flatmate", emoji: "🧑‍🍳" },
    lines: [
      "It's down 31%. My cousin pulled everything out yesterday.",
      "How much have you lost?",
    ],
    options: [
      { key: "sell", text: "Enough. I'm out.", insight: "You turned a paper number into a permanent one." },
      { key: "hold", text: "Nothing yet. I haven't sold anything.", insight: "You separated a falling price from an actual loss." },
      { key: "buy", text: "It's cheaper than last month. I'm buying.", insight: "You bought into fear. That works — until the fall lasts longer than your income does." },
    ],
    rule: { status: "LAW", text: "Private pension capital is generally locked until age 62 — the restriction is the design, not a penalty." },
  },
  l8: {
    chapter: "After the fall",
    mood: "storm",
    prompt: "What's left is in your hand. Prices are 31% lower than last month.",
    rule: { status: "LAW", text: "EET: contributions and growth are untaxed; the pension itself is taxed on withdrawal." },
  },
};

export const t1 = buildTrack(cfg);