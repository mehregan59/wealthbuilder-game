import { TRACKS } from "@/game/tracks";
import type { TrackId } from "@/game/types";

export function TrackSelect({
  onPick,
}: {
  onPick: (id: TrackId, age: number | null) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col justify-center gap-8 py-10">
      <div>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
          Where are you standing right now?
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          The story changes with the decade you're in. Pick the one you're
          living, not the one you'd like to be.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            onClick={() => onPick(t.id, null)}
            className="rounded-xl border border-border bg-card/60 p-5 text-left transition-colors hover:border-primary/60 hover:bg-accent"
          >
            <p className="text-xs uppercase tracking-widest text-primary">
              {t.ageRange}
            </p>
            <p className="mt-1 font-serif text-xl text-foreground">{t.label}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
          </button>
        ))}
      </div>
    </div>
  );
}