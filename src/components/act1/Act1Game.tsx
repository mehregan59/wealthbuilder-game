import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAct1 } from "@/game/engine/store";
import type { BucketId, TrackId } from "@/game/types";
import { AllocateScene } from "./AllocateScene";
import { DialogueScene } from "./DialogueScene";
import { Debrief } from "./Debrief";
import { Hud } from "./Hud";
import { ProfileSummary } from "./ProfileSummary";
import { TrackSelect } from "./TrackSelect";

interface DebriefState {
  insight: string;
  potBefore: number;
}

export default function Act1Game() {
  const {
    state,
    hydrated,
    track,
    level,
    profile,
    start,
    reset,
    advance,
    recordDialogue,
    recordAllocation,
  } = useAct1();
  const [debrief, setDebrief] = useState<DebriefState | null>(null);

  if (!hydrated) {
    return <div className="h-dvh bg-background" />;
  }

  function pick(id: TrackId, age: number | null) {
    setDebrief(null);
    start(id, age);
  }

  if (!track) {
    return (
      <Shell>
        <TrackSelect onPick={pick} />
      </Shell>
    );
  }

  if (state.finished) {
    return (
      <Shell>
        <ProfileSummary
          profile={profile}
          pot={state.pot}
          horizonYears={track.horizonYears}
          onRestart={() => {
            setDebrief(null);
            reset();
          }}
        />
      </Shell>
    );
  }

  if (!level) return null;
  const lastLevel = state.index === track.levels.length - 1;

  function onDialogue(optionId: string, elapsedMs: number) {
    if (!level || level.kind !== "dialogue") return;
    const opt = level.options.find((o) => o.id === optionId);
    recordDialogue(level, optionId, elapsedMs);
    setDebrief({ insight: opt?.insight ?? "", potBefore: state.pot });
  }

  function onAllocate(
    allocation: Partial<Record<BucketId, number>>,
    elapsedMs: number,
    redrags: number,
  ) {
    if (!level || level.kind !== "allocate") return;
    const metrics = recordAllocation(level, allocation, elapsedMs, redrags);
    setDebrief({ insight: level.insight(metrics), potBefore: state.pot });
  }

  return (
    <Shell>
      <div className="flex min-h-0 flex-1 flex-col">
        <Hud track={track} slot={level.slot} pot={state.pot} />
        <p className="pb-3 text-xs uppercase tracking-widest text-muted-foreground">
          Chapter {level.slot} · {level.chapter}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${level.id}-${debrief ? "debrief" : "scene"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            {debrief ? (
              <Debrief
                insight={debrief.insight}
                rule={level.rule}
                potBefore={debrief.potBefore}
                potAfter={state.pot}
                lastLevel={lastLevel}
                onNext={() => {
                  setDebrief(null);
                  advance();
                }}
              />
            ) : level.kind === "dialogue" ? (
              <DialogueScene level={level} onChoose={onDialogue} />
            ) : (
              <AllocateScene level={level} onConfirm={onAllocate} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col bg-background px-4 pb-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        {children}
      </div>
    </main>
  );
}