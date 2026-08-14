import type { Track } from "@/game/types";

export function Hud({
  track,
  slot,
  pot,
}: {
  track: Track;
  slot: number;
  pot: number;
}) {
  return (
    <header className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-xs uppercase tracking-widest text-muted-foreground">
          {track.label} · {track.ageRange}
        </p>
        <p className="font-serif text-lg text-foreground">
          €{pot.toLocaleString("de-DE")}{" "}
          <span className="text-xs font-sans text-muted-foreground">
            · {track.horizonYears} years to 67
          </span>
        </p>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-5 rounded-full ${
              i + 1 < slot
                ? "bg-primary"
                : i + 1 === slot
                  ? "bg-primary/60"
                  : "bg-border"
            }`}
          />
        ))}
      </div>
    </header>
  );
}