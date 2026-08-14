import { motion } from "motion/react";
import type { RuleNote } from "@/game/types";
import { RuleBadge } from "./RuleBadge";

export function Debrief({
  insight,
  rule,
  potBefore,
  potAfter,
  onNext,
  lastLevel,
}: {
  insight: string;
  rule: RuleNote;
  potBefore: number;
  potAfter: number;
  onNext: () => void;
  lastLevel: boolean;
}) {
  const delta = potAfter - potBefore;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-0 flex-1 flex-col justify-center gap-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-10"
    >
      <p className="font-serif text-2xl leading-snug text-foreground sm:text-3xl">
        {insight}
      </p>
      {delta !== 0 && (
        <p
          className={`text-sm ${delta > 0 ? "text-tone-growth" : "text-destructive"}`}
        >
          {delta > 0 ? "+" : "−"}€
          {Math.abs(delta).toLocaleString("de-DE")} to your pot
        </p>
      )}
      <RuleBadge rule={rule} />
      <div>
        <button
          onClick={onNext}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          {lastLevel ? "See what this says about you" : "Keep going"}
        </button>
      </div>
    </motion.div>
  );
}