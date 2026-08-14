import type {
  BucketId,
  DecisionRecord,
  Metric,
  ScoreRule,
  Trait,
} from "../types";
import { TRAITS } from "../types";

const GROWTH_BUCKETS: BucketId[] = ["depot", "cheap", "expensive", "hype"];

export function computeMetrics(
  allocation: Partial<Record<BucketId, number>>,
  opts: { elapsedMs: number; redrags: number; tokens: number },
): Record<Metric, number> {
  const values = Object.values(allocation).filter(
    (v): v is number => typeof v === "number" && v > 0,
  );
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const share = (id: BucketId) => ((allocation[id] ?? 0) / total) * 100;

  const growth = GROWTH_BUCKETS.reduce((sum, id) => sum + share(id), 0);
  const shares = values.map((v) => v / total);
  const hhi = shares.reduce((sum, s) => sum + s * s, 0);
  const spread = Math.max(0, Math.min(100, ((1 - hhi) / 0.75) * 100));

  // Fast + few re-drags = decisive. Slow + many re-drags = deliberating.
  const perToken = opts.elapsedMs / Math.max(1, opts.tokens);
  const speed = Math.max(0, Math.min(100, 100 - (perToken - 600) / 40));
  const redragPenalty = Math.min(60, opts.redrags * 12);
  const decisiveness = Math.max(0, Math.min(100, speed - redragPenalty));

  return {
    growthShare: growth,
    guaranteeShare: share("guarantee"),
    spendShare: share("spend"),
    cashShare: share("cash"),
    hotShare: share("hype") + share("expensive"),
    cheapShare: share("cheap"),
    diversity: spread,
    decisiveness,
  };
}

export function traitsFromScores(
  rules: ScoreRule[],
  metrics: Record<Metric, number>,
): Partial<Record<Trait, number>> {
  const acc: Partial<Record<Trait, { sum: number; w: number }>> = {};
  for (const rule of rules) {
    const raw = metrics[rule.metric] ?? 50;
    const value = rule.invert ? 100 - raw : raw;
    const w = rule.weight ?? 1;
    const cur = acc[rule.trait] ?? { sum: 0, w: 0 };
    cur.sum += value * w;
    cur.w += w;
    acc[rule.trait] = cur;
  }
  const out: Partial<Record<Trait, number>> = {};
  for (const t of Object.keys(acc) as Trait[]) {
    const e = acc[t]!;
    out[t] = Math.round(e.sum / e.w);
  }
  return out;
}

/** Continuously updated profile: later decisions weigh slightly more. */
export function buildProfile(
  decisions: DecisionRecord[],
): Record<Trait, number> {
  const profile = {} as Record<Trait, number>;
  for (const trait of TRAITS) {
    let sum = 0;
    let weight = 0;
    decisions.forEach((d, i) => {
      const v = d.traits[trait];
      if (typeof v !== "number") return;
      const w = 1 + i * 0.12;
      sum += v * w;
      weight += w;
    });
    profile[trait] = weight > 0 ? Math.round(sum / weight) : 50;
  }
  return profile;
}

export type PersonaId =
  | "reactor"
  | "sprinter"
  | "guardian"
  | "challenger"
  | "strategist"
  | "explorer";

export const PERSONAS: Record<
  PersonaId,
  { name: string; line: string; watch: string }
> = {
  reactor: {
    name: "The Reactor",
    line: "You move the moment the world moves. Speed is your instinct, not your plan.",
    watch: "Your costliest decisions were the fastest ones.",
  },
  sprinter: {
    name: "The Sprinter",
    line: "You want the result now. Waiting feels like losing.",
    watch: "The decades you skipped past are where most of the money was.",
  },
  guardian: {
    name: "The Guardian",
    line: "You protect what exists before you grow it.",
    watch: "Safety has a price, and you paid it quietly every year.",
  },
  challenger: {
    name: "The Challenger",
    line: "You lean into risk and you rarely flinch.",
    watch: "You were never tested by a crash that lasted longer than your patience.",
  },
  strategist: {
    name: "The Strategist",
    line: "You decide once, slowly, and then you sit still.",
    watch: "Stillness only works if the first decision was cheap.",
  },
  explorer: {
    name: "The Explorer",
    line: "You are still forming your instincts, and you know it.",
    watch: "Your answers changed with the room you were standing in.",
  },
};

export function assignPersona(p: Record<Trait, number>): PersonaId {
  if (p.reactionToNoise > 70 && p.emotionalResilience < 45) return "reactor";
  if (p.patience < 38 && p.greedFomo > 62) return "sprinter";
  if (p.riskPreference < 38 && p.lossAversion > 62) return "guardian";
  if (p.riskPreference > 68 && p.lossAversion < 45) return "challenger";
  if (p.patience > 63 && p.reactionToNoise < 42 && p.emotionalResilience > 60)
    return "strategist";
  return "explorer";
}

export function label(score: number) {
  if (score >= 80) return "Very high";
  if (score >= 65) return "High";
  if (score >= 45) return "Moderate";
  if (score >= 30) return "Low";
  return "Very low";
}