import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AllocateLevel, BucketId } from "@/game/types";
import { MOOD_BG, TONE_BG, TONE_BORDER, TONE_TEXT } from "./mood";

interface Drag {
  token: number;
  x: number;
  y: number;
}

export function AllocateScene({
  level,
  onConfirm,
}: {
  level: AllocateLevel;
  onConfirm: (
    allocation: Partial<Record<BucketId, number>>,
    elapsedMs: number,
    redrags: number,
  ) => void;
}) {
  const [assigned, setAssigned] = useState<Record<number, BucketId | null>>({});
  const [drag, setDrag] = useState<Drag | null>(null);
  const [redrags, setRedrags] = useState(0);
  const [hover, setHover] = useState<BucketId | null>(null);
  const startedAt = useRef(Date.now());
  const zones = useRef<Partial<Record<BucketId, HTMLDivElement | null>>>({});

  useEffect(() => {
    setAssigned({});
    setRedrags(0);
    setDrag(null);
    startedAt.current = Date.now();
  }, [level.id]);

  const tokens = useMemo(
    () => Array.from({ length: level.tokens }, (_, i) => i),
    [level.tokens],
  );
  const placed = tokens.filter((t) => assigned[t]);
  const remaining = tokens.filter((t) => !assigned[t]);
  const done = remaining.length === 0;

  function countIn(bucket: BucketId) {
    return tokens.filter((t) => assigned[t] === bucket).length;
  }

  function assign(token: number, bucket: BucketId) {
    setAssigned((a) => {
      if (a[token] && a[token] !== bucket) setRedrags((r) => r + 1);
      return { ...a, [token]: bucket };
    });
  }

  function hitTest(x: number, y: number): BucketId | null {
    for (const b of level.buckets) {
      const el = zones.current[b.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return b.id;
    }
    return null;
  }

  useEffect(() => {
    if (!drag) return;
    function move(e: PointerEvent) {
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
      setHover(hitTest(e.clientX, e.clientY));
    }
    function up(e: PointerEvent) {
      const target = hitTest(e.clientX, e.clientY);
      setDrag((d) => {
        if (d && target) assign(d.token, target);
        return null;
      });
      setHover(null);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag?.token]);

  function tapBucket(bucket: BucketId) {
    const next = remaining[0];
    if (next !== undefined) assign(next, bucket);
  }

  function confirm() {
    const allocation: Partial<Record<BucketId, number>> = {};
    for (const b of level.buckets) {
      const c = countIn(b.id);
      if (c > 0) allocation[b.id] = c;
    }
    onConfirm(allocation, Date.now() - startedAt.current, redrags);
  }

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col gap-5 rounded-2xl border border-border p-5 sm:p-8 ${MOOD_BG[level.mood]}`}
    >
      <p className="font-serif text-xl leading-snug text-foreground sm:text-2xl">
        {level.prompt}
      </p>

      <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
        {level.buckets.map((b) => {
          const c = countIn(b.id);
          const pct = (c / level.tokens) * 100;
          return (
            <div
              key={b.id}
              ref={(el) => {
                zones.current[b.id] = el;
              }}
              onClick={() => tapBucket(b.id)}
              className={`relative flex min-h-36 cursor-pointer flex-col justify-end overflow-hidden rounded-xl border bg-card/50 p-3 transition-colors ${
                hover === b.id ? "border-primary" : TONE_BORDER[b.tone]
              }`}
            >
              <motion.div
                animate={{ height: `${pct}%` }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                className={`absolute inset-x-0 bottom-0 opacity-25 ${TONE_BG[b.tone]}`}
              />
              <div className="relative">
                <p className={`text-sm font-medium ${TONE_TEXT[b.tone]}`}>
                  {b.label}
                </p>
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {b.sub}
                </p>
                <p className="mt-2 font-serif text-lg text-foreground">
                  €{(c * level.tokenValue).toLocaleString("de-DE")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {remaining.map((t) => (
            <button
              key={t}
              onPointerDown={(e) => {
                e.preventDefault();
                setDrag({ token: t, x: e.clientX, y: e.clientY });
              }}
              className="size-10 touch-none rounded-full border border-primary/50 bg-primary/20 text-[11px] font-semibold text-primary"
            >
              €{level.tokenValue}
            </button>
          ))}
          {done && (
            <span className="text-xs text-muted-foreground">
              {placed.length} of {level.tokens} placed · tap a column to move
              money again
            </span>
          )}
        </div>
        <button
          onClick={confirm}
          disabled={!done}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-30"
        >
          Lock it in
        </button>
      </div>

      {drag && (
        <div
          className="pointer-events-none fixed z-50 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary bg-primary/40 text-[11px] font-semibold text-primary-foreground"
          style={{ left: drag.x, top: drag.y }}
        >
          €{level.tokenValue}
        </div>
      )}
    </div>
  );
}