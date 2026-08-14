import { motion } from "motion/react";
import { TRAITS, TRAIT_LABELS, type Trait } from "@/game/types";
import { PERSONAS, assignPersona, label } from "@/game/engine/telemetry";

export function ProfileSummary({
  profile,
  pot,
  horizonYears,
  onRestart,
}: {
  profile: Record<Trait, number>;
  pot: number;
  horizonYears: number;
  onRestart: () => void;
}) {
  const persona = PERSONAS[assignPersona(profile)];
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-10">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">
          Your profile after eight decisions
        </p>
        <h1 className="mt-2 font-serif text-4xl text-foreground">
          {persona.name}
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          {persona.line}
        </p>
        <p className="mt-2 max-w-xl text-sm text-foreground/80">
          {persona.watch}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TRAITS.map((t, i) => (
          <div key={t} className="rounded-lg border border-border bg-card/60 p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-foreground">{TRAIT_LABELS[t]}</span>
              <span className="text-xs text-muted-foreground">
                {label(profile[t])}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile[t]}%` }}
                transition={{ delay: i * 0.06, type: "spring", damping: 22 }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-5">
        <p className="text-sm text-muted-foreground">
          You finished with{" "}
          <span className="font-serif text-lg text-foreground">
            €{pot.toLocaleString("de-DE")}
          </span>{" "}
          and {horizonYears} years still to run. This profile keeps updating as
          you play — it is a description, not a verdict, and it is never advice
          about a specific product.
        </p>
      </div>

      <div>
        <button
          onClick={onRestart}
          className="rounded-lg border border-border px-5 py-2.5 text-sm text-foreground hover:bg-accent"
        >
          Play another decade
        </button>
      </div>
    </div>
  );
}