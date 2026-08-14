import type { RuleNote } from "@/game/types";

const MAP = {
  LAW: { label: "LAW", cls: "text-status-law border-status-law/40 bg-status-law/10" },
  EFFECTIVE_2027: {
    label: "EFFECTIVE 2027",
    cls: "text-status-2027 border-status-2027/40 bg-status-2027/10",
  },
  PROPOSAL: {
    label: "PROPOSAL",
    cls: "text-status-proposal border-status-proposal/40 bg-status-proposal/10",
  },
} as const;

export function RuleBadge({ rule }: { rule: RuleNote }) {
  const m = MAP[rule.status];
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card/60 p-3">
      <span
        className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold tracking-widest ${m.cls}`}
      >
        {m.label}
      </span>
      <p className="text-xs leading-relaxed text-muted-foreground">{rule.text}</p>
    </div>
  );
}