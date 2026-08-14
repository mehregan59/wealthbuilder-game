export type Trait =
  | "riskPreference"
  | "lossAversion"
  | "diversification"
  | "patience"
  | "greedFomo"
  | "learningAdaptability"
  | "reactionToNoise"
  | "emotionalResilience";

export const TRAITS: Trait[] = [
  "riskPreference",
  "lossAversion",
  "diversification",
  "patience",
  "greedFomo",
  "learningAdaptability",
  "reactionToNoise",
  "emotionalResilience",
];

export const TRAIT_LABELS: Record<Trait, string> = {
  riskPreference: "Risk appetite",
  lossAversion: "Loss aversion",
  diversification: "Spreading",
  patience: "Patience",
  greedFomo: "Chasing",
  learningAdaptability: "Adapting",
  reactionToNoise: "Noise reaction",
  emotionalResilience: "Resilience",
};

export type TrackId = "T1" | "T2" | "T3" | "T4";

export type RuleStatus = "LAW" | "EFFECTIVE_2027" | "PROPOSAL";

export interface RuleNote {
  status: RuleStatus;
  text: string;
}

export type BucketId =
  | "spend"
  | "cash"
  | "guarantee"
  | "depot"
  | "hype"
  | "cheap"
  | "expensive";

export interface BucketDef {
  id: BucketId;
  label: string;
  sub: string;
  tone: "spend" | "cash" | "guarantee" | "growth" | "hot";
}

/** Derived metrics from an allocation, all 0-100. */
export type Metric =
  | "growthShare"
  | "guaranteeShare"
  | "spendShare"
  | "cashShare"
  | "hotShare"
  | "cheapShare"
  | "diversity"
  | "decisiveness";

export interface ScoreRule {
  trait: Trait;
  metric: Metric;
  invert?: boolean;
  weight?: number;
}

export interface DialogueOption {
  id: string;
  text: string;
  traits: Partial<Record<Trait, number>>;
  /** multiplier applied to the pot, e.g. 0.97 */
  potFactor?: number;
  /** shown after the choice, one psychological line */
  insight: string;
}

export interface DialogueLevel {
  kind: "dialogue";
  id: string;
  slot: number;
  chapter: string;
  mood: "dawn" | "office" | "night" | "storm" | "warm";
  character: { name: string; role: string; emoji: string };
  lines: string[];
  options: DialogueOption[];
  rule: RuleNote;
}

export interface AllocateLevel {
  kind: "allocate";
  id: string;
  slot: number;
  chapter: string;
  mood: "dawn" | "office" | "night" | "storm" | "warm";
  prompt: string;
  tokens: number;
  tokenValue: number;
  buckets: BucketDef[];
  scores: ScoreRule[];
  rule: RuleNote;
  insight: (m: Record<Metric, number>) => string;
}

export type LevelDef = DialogueLevel | AllocateLevel;

export interface Track {
  id: TrackId;
  label: string;
  ageRange: string;
  blurb: string;
  monthly: number;
  startPot: number;
  horizonYears: number;
  levels: LevelDef[];
}

export interface DecisionRecord {
  levelId: string;
  slot: number;
  kind: "dialogue" | "allocate";
  optionId?: string;
  allocation?: Partial<Record<BucketId, number>>;
  metrics?: Record<Metric, number>;
  traits: Partial<Record<Trait, number>>;
  elapsedMs: number;
  redrags?: number;
}