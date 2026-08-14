import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { DialogueLevel } from "@/game/types";
import { MOOD_BG } from "./mood";

export function DialogueScene({
  level,
  onChoose,
}: {
  level: DialogueLevel;
  onChoose: (optionId: string, elapsedMs: number) => void;
}) {
  const [shown, setShown] = useState(1);
  const [locked, setLocked] = useState(false);
  const startedAt = useRef<number | null>(null);

  const allShown = shown >= level.lines.length;

  useEffect(() => {
    setShown(1);
    setLocked(false);
    startedAt.current = null;
  }, [level.id]);

  useEffect(() => {
    if (allShown) return;
    const t = setTimeout(() => setShown((s) => s + 1), 1500);
    return () => clearTimeout(t);
  }, [shown, allShown]);

  useEffect(() => {
    if (allShown && startedAt.current === null) startedAt.current = Date.now();
  }, [allShown]);

  function choose(id: string) {
    if (locked) return;
    setLocked(true);
    onChoose(id, Date.now() - (startedAt.current ?? Date.now()));
  }

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col justify-end gap-6 rounded-2xl border border-border p-6 sm:p-10 ${MOOD_BG[level.mood]}`}
      onClick={() => !allShown && setShown(level.lines.length)}
    >
      <div className="flex items-end gap-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-card text-2xl"
        >
          {level.character.emoji}
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {level.character.name} · {level.character.role}
          </p>
          <div className="mt-2 space-y-2">
            <AnimatePresence initial={false}>
              {level.lines.slice(0, shown).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: i === shown - 1 ? 1 : 0.55, y: 0 }}
                  className="font-serif text-xl leading-snug text-foreground sm:text-2xl"
                >
                  {line}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {allShown && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-2"
          >
            {level.options.map((o) => (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                disabled={locked}
                className="group rounded-xl border border-border bg-card/70 px-4 py-3 text-left text-sm text-card-foreground transition-colors hover:border-primary/60 hover:bg-accent disabled:opacity-50 sm:text-base"
              >
                <span className="mr-2 text-primary">“</span>
                {o.text}
                <span className="ml-1 text-primary">”</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}