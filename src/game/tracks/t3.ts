import { buildTrack, type TrackConfig } from "./base";

const cfg: TrackConfig = {
  id: "T3",
  label: "Peak earnings",
  ageRange: "38–47",
  blurb: "Your best income years, spent almost entirely on other people.",
  monthly: 840,
  startPot: 41000,
  horizonYears: 25,
  l1: {
    chapter: "Works council room",
    mood: "office",
    character: { name: "Ute", role: "works council", emoji: "📋" },
    lines: [
      "The company will match up to 4% of gross into the occupational scheme.",
      "Half the department never signed the form. It's been on the intranet for six years.",
    ],
    options: [
      { key: "bold", text: "Max it, and put my own top-up in the depot.", insight: "You took the match and the market in the same breath." },
      { key: "balanced", text: "Take the match, nothing beyond it.", insight: "You collected the free part and stopped at the part that required conviction." },
      { key: "safe", text: "Leave it. I want the money in my account.", insight: "You declined employer money to keep a number visible in your banking app." },
    ],
    rule: { status: "LAW", text: "Employers must pass on 15% savings as a contribution to salary-conversion occupational pensions." },
  },
  l2: {
    chapter: "After the bills",
    mood: "office",
    prompt: "€840 survives the month. Two kids, one mortgage, 25 years left.",
    rule: { status: "EFFECTIVE_2027", text: "Child premiums increase the state top-up per contributing parent." },
  },
  l3: {
    chapter: "Parents' evening",
    mood: "warm",
    character: { name: "Herr Adler", role: "class teacher", emoji: "🏫" },
    lines: [
      "The exchange year in Canada is €9,400. Payment in March.",
      "Some families take it out of savings. Some don't send the child.",
    ],
    options: [
      { key: "now", text: "Take it from the pension pot. She goes.", insight: "You moved 25 years of compounding into one year of her life. That may be right — it was not free." },
      { key: "split", text: "Half from savings, she works for the rest.", insight: "You made the cost visible to the person receiving it." },
      { key: "later", text: "Not this year.", insight: "You protected the pot and paid in a currency that doesn't show up in it." },
    ],
    rule: { status: "LAW", text: "Mütterrente credits child-raising years as Entgeltpunkte in the statutory pension." },
  },
  l4: {
    chapter: "Golf club, Saturday",
    mood: "warm",
    prompt: "Two people at your table are up 61% this year. They're not quiet about it.",
    rule: { status: "PROPOSAL", text: "Raising the retirement age from 67 to 67.5 has been recommended, not enacted." },
  },
  l5: {
    chapter: "Office, 8:05",
    mood: "office",
    character: { name: "Push notification", role: "news app", emoji: "📱" },
    lines: [
      "'CONTRIBUTION RATE TO HIT 22.3% BY 2035' — analysts split.",
      "Your depot is showing −7.4%.",
    ],
    options: [
      { key: "react", text: "Restructure everything this week.", insight: "A forecast about 2035 rearranged your Tuesday." },
      { key: "watch", text: "Find out what the number actually means first.", insight: "You separated the projection from the decision." },
      { key: "ignore", text: "Not reading pension news again.", insight: "Avoidance is comfortable and it compounds too." },
    ],
    rule: { status: "LAW", text: "Old-age dependency ratio rises sharply through the 2030s as the boomer cohort retires." },
  },
  l6: {
    chapter: "The annual review",
    mood: "warm",
    prompt: "Your existing product charges 2.3%. The capped one charges 1%. Same fund.",
    rule: { status: "EFFECTIVE_2027", text: "The Standarddepot caps total annual cost at 1% p.a." },
  },
  l7: {
    chapter: "The bad month",
    mood: "storm",
    character: { name: "Ute", role: "works council", emoji: "📋" },
    lines: [
      "Down 31%. People are stopping their contributions across the whole floor.",
      "You've got twenty-five years. They've got the same. Nobody's doing that maths right now.",
    ],
    options: [
      { key: "sell", text: "Stop mine too. I can't watch this.", insight: "You joined the floor. The floor was not doing maths." },
      { key: "hold", text: "Keep the contribution running.", insight: "You kept buying while it was cheap, which felt like nothing at all." },
      { key: "buy", text: "Increase it while prices are down.", insight: "You leaned in. With 25 years left that is defensible — with 5 it would not be." },
    ],
    rule: { status: "LAW", text: "Private pension capital is generally locked until age 62." },
  },
  l8: {
    chapter: "After the fall",
    mood: "storm",
    prompt: "This month's €840, into a market 31% cheaper than in January.",
    rule: { status: "LAW", text: "EET: contributions and growth untaxed, the pension taxed on withdrawal." },
  },
};

export const t3 = buildTrack(cfg);