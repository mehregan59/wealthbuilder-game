import type {
  AllocateLevel,
  BucketDef,
  DialogueLevel,
  LevelDef,
  Metric,
  RuleNote,
  ScoreRule,
  Track,
  TrackId,
} from "../types";

export interface DialogueText {
  chapter: string;
  mood: DialogueLevel["mood"];
  character: { name: string; role: string; emoji: string };
  lines: string[];
  options: { key: string; text: string; insight: string }[];
  rule: RuleNote;
}

export interface AllocateText {
  chapter: string;
  mood: AllocateLevel["mood"];
  prompt: string;
  rule: RuleNote;
}

export interface TrackConfig {
  id: TrackId;
  label: string;
  ageRange: string;
  blurb: string;
  monthly: number;
  startPot: number;
  horizonYears: number;
  l1: DialogueText;
  l2: AllocateText;
  l3: DialogueText;
  l4: AllocateText;
  l5: DialogueText;
  l6: AllocateText;
  l7: DialogueText;
  l8: AllocateText;
}

type ToneMap = Record<string, DialogueLevel["options"][number]["traits"]>;

const DIALOGUE_TONES: Record<number, ToneMap> = {
  1: {
    bold: { riskPreference: 88, greedFomo: 62 },
    balanced: { riskPreference: 52, greedFomo: 45 },
    safe: { riskPreference: 18, lossAversion: 70 },
  },
  3: {
    now: { patience: 18, greedFomo: 68 },
    split: { patience: 56, diversification: 60 },
    later: { patience: 88, emotionalResilience: 66 },
  },
  5: {
    react: { reactionToNoise: 90, emotionalResilience: 28 },
    watch: { reactionToNoise: 48, learningAdaptability: 72 },
    ignore: { reactionToNoise: 14, learningAdaptability: 40 },
  },
  7: {
    sell: { lossAversion: 92, emotionalResilience: 18 },
    hold: { lossAversion: 34, emotionalResilience: 78 },
    buy: { lossAversion: 12, emotionalResilience: 90, riskPreference: 82 },
  },
};

const POT_FACTOR: Record<string, number> = {
  sell: 0.72,
  hold: 1,
  buy: 1.08,
  now: 0.94,
  react: 0.9,
};

const BUCKETS: Record<number, BucketDef[]> = {
  2: [
    { id: "spend", label: "Life now", sub: "gone by month's end", tone: "spend" },
    { id: "cash", label: "Account", sub: "safe, shrinking with inflation", tone: "cash" },
    { id: "guarantee", label: "Guarantee product", sub: "capital protected, slow", tone: "guarantee" },
    { id: "depot", label: "Altersvorsorgedepot", sub: "market exposed, long horizon", tone: "growth" },
  ],
  4: [
    { id: "hype", label: "The one everyone's in", sub: "+61% this year", tone: "hot" },
    { id: "depot", label: "Broad market depot", sub: "boring, global", tone: "growth" },
    { id: "guarantee", label: "Guarantee product", sub: "capital protected", tone: "guarantee" },
    { id: "cash", label: "Account", sub: "waiting", tone: "cash" },
  ],
  6: [
    { id: "cheap", label: "Standarddepot", sub: "cost capped at 1% p.a.", tone: "growth" },
    { id: "expensive", label: "Advisor's product", sub: "2.3% p.a. all-in", tone: "hot" },
    { id: "guarantee", label: "Guarantee product", sub: "capital protected", tone: "guarantee" },
    { id: "cash", label: "Account", sub: "no fee, no growth", tone: "cash" },
  ],
  8: [
    { id: "depot", label: "Back into the depot", sub: "prices are down", tone: "growth" },
    { id: "guarantee", label: "Guarantee product", sub: "capital protected", tone: "guarantee" },
    { id: "cash", label: "Account", sub: "sit it out", tone: "cash" },
    { id: "spend", label: "Take it out", sub: "spend it while it's still there", tone: "spend" },
  ],
};

const SCORES: Record<number, ScoreRule[]> = {
  2: [
    { trait: "riskPreference", metric: "growthShare" },
    { trait: "diversification", metric: "diversity" },
    { trait: "patience", metric: "spendShare", invert: true },
    { trait: "lossAversion", metric: "guaranteeShare", weight: 0.6 },
  ],
  4: [
    { trait: "greedFomo", metric: "hotShare" },
    { trait: "riskPreference", metric: "growthShare", weight: 0.5 },
    { trait: "emotionalResilience", metric: "hotShare", invert: true, weight: 0.5 },
    { trait: "diversification", metric: "diversity", weight: 0.8 },
  ],
  6: [
    { trait: "learningAdaptability", metric: "cheapShare" },
    { trait: "diversification", metric: "diversity", weight: 0.5 },
    { trait: "reactionToNoise", metric: "decisiveness", weight: 0.4 },
  ],
  8: [
    { trait: "emotionalResilience", metric: "growthShare" },
    { trait: "lossAversion", metric: "cashShare" },
    { trait: "reactionToNoise", metric: "spendShare", weight: 0.5 },
    { trait: "diversification", metric: "diversity", weight: 0.6 },
  ],
};

function insightFor(slot: number) {
  return (m: Record<Metric, number>) => {
    const pct = (v: number) => `${Math.round(v)}%`;
    switch (slot) {
      case 2:
        if (m.spendShare > 45)
          return `Most of it stayed in this month. ${pct(m.growthShare)} went to the next forty years.`;
        if (m.growthShare > 70)
          return `You sent ${pct(m.growthShare)} into the market without pausing on the downside.`;
        return `You spread it: ${pct(m.growthShare)} to growth, ${pct(m.guaranteeShare)} protected.`;
      case 4:
        if (m.hotShare > 50)
          return `${pct(m.hotShare)} chased the number on the screen. Nobody told you it was a test.`;
        if (m.hotShare === 0)
          return `You didn't touch it. The room did, and the room was loud.`;
        return `${pct(m.hotShare)} followed the crowd, the rest stayed where it was.`;
      case 6:
        if (m.cheapShare > 60)
          return `You moved to the capped product. Over 40 years that gap is roughly €32,000.`;
        return `Only ${pct(m.cheapShare)} went to the capped product. The 1.3% difference compounds against you every single year.`;
      case 8:
        if (m.spendShare > 20)
          return `You took ${pct(m.spendShare)} out at the bottom. That part never recovers.`;
        if (m.growthShare > 60)
          return `You put ${pct(m.growthShare)} back in while it still hurt.`;
        return `You parked it. Sitting in cash after a fall is still a decision.`;
      default:
        return "";
    }
  };
}

function dialogue(slot: number, t: DialogueText): DialogueLevel {
  const tones = DIALOGUE_TONES[slot]!;
  return {
    kind: "dialogue",
    id: `L${slot}`,
    slot,
    chapter: t.chapter,
    mood: t.mood,
    character: t.character,
    lines: t.lines,
    rule: t.rule,
    options: t.options.map((o) => {
      const factor = POT_FACTOR[o.key];
      return {
        id: o.key,
        text: o.text,
        insight: o.insight,
        traits: tones[o.key] ?? {},
        ...(factor !== undefined ? { potFactor: factor } : {}),
      };
    }),
  };
}

function allocate(
  slot: number,
  t: AllocateText,
  tokens: number,
  tokenValue: number,
): AllocateLevel {
  return {
    kind: "allocate",
    id: `L${slot}`,
    slot,
    chapter: t.chapter,
    mood: t.mood,
    prompt: t.prompt,
    tokens,
    tokenValue,
    buckets: BUCKETS[slot]!,
    scores: SCORES[slot]!,
    rule: t.rule,
    insight: insightFor(slot),
  };
}

export function buildTrack(cfg: TrackConfig): Track {
  const tokens = 6;
  const tokenValue = Math.round(cfg.monthly / tokens / 10) * 10;
  const levels: LevelDef[] = [
    dialogue(1, cfg.l1),
    allocate(2, cfg.l2, tokens, tokenValue),
    dialogue(3, cfg.l3),
    allocate(4, cfg.l4, tokens, tokenValue),
    dialogue(5, cfg.l5),
    allocate(6, cfg.l6, tokens, tokenValue),
    dialogue(7, cfg.l7),
    allocate(8, cfg.l8, tokens, tokenValue),
  ];
  return {
    id: cfg.id,
    label: cfg.label,
    ageRange: cfg.ageRange,
    blurb: cfg.blurb,
    monthly: cfg.monthly,
    startPot: cfg.startPot,
    horizonYears: cfg.horizonYears,
    levels,
  };
}