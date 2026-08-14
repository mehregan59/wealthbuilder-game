import { useCallback, useEffect, useState } from "react";
import type {
  BucketId,
  DecisionRecord,
  Metric,
  TrackId,
  Trait,
} from "../types";
import { buildProfile, computeMetrics, traitsFromScores } from "./telemetry";
import { getTrack } from "../tracks";
import type { AllocateLevel, DialogueLevel } from "../types";

const KEY = "wealthsim.act1.v1";

export interface Act1State {
  trackId: TrackId | null;
  age: number | null;
  index: number; // 0..7 level pointer
  pot: number;
  decisions: DecisionRecord[];
  finished: boolean;
}

const EMPTY: Act1State = {
  trackId: null,
  age: null,
  index: 0,
  pot: 0,
  decisions: [],
  finished: false,
};

function load(): Act1State {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Act1State) };
  } catch {
    return EMPTY;
  }
}

export function useAct1() {
  const [state, setState] = useState<Act1State>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const track = state.trackId ? getTrack(state.trackId) : null;
  const level = track ? track.levels[state.index] : undefined;
  const profile: Record<Trait, number> = buildProfile(state.decisions);

  const start = useCallback((trackId: TrackId, age: number | null) => {
    const t = getTrack(trackId);
    setState({
      trackId,
      age,
      index: 0,
      pot: t.startPot,
      decisions: [],
      finished: false,
    });
  }, []);

  const reset = useCallback(() => setState(EMPTY), []);

  const advance = useCallback(() => {
    setState((s) => {
      const t = s.trackId ? getTrack(s.trackId) : null;
      const last = !t || s.index >= t.levels.length - 1;
      return last
        ? { ...s, finished: true }
        : { ...s, index: s.index + 1 };
    });
  }, []);

  const recordDialogue = useCallback(
    (lvl: DialogueLevel, optionId: string, elapsedMs: number) => {
      const opt = lvl.options.find((o) => o.id === optionId);
      if (!opt) return;
      setState((s) => ({
        ...s,
        pot: Math.round(s.pot * (opt.potFactor ?? 1)),
        decisions: [
          ...s.decisions,
          {
            levelId: lvl.id,
            slot: lvl.slot,
            kind: "dialogue",
            optionId,
            traits: opt.traits,
            elapsedMs,
          },
        ],
      }));
    },
    [],
  );

  const recordAllocation = useCallback(
    (
      lvl: AllocateLevel,
      allocation: Partial<Record<BucketId, number>>,
      elapsedMs: number,
      redrags: number,
    ): Record<Metric, number> => {
      const metrics = computeMetrics(allocation, {
        elapsedMs,
        redrags,
        tokens: lvl.tokens,
      });
      const traits = traitsFromScores(lvl.scores, metrics);
      const invested =
        ((allocation["depot"] ?? 0) +
          (allocation["cheap"] ?? 0) +
          (allocation["expensive"] ?? 0) +
          (allocation["hype"] ?? 0) +
          (allocation["guarantee"] ?? 0)) *
        lvl.tokenValue;
      setState((s) => ({
        ...s,
        pot: s.pot + invested,
        decisions: [
          ...s.decisions,
          {
            levelId: lvl.id,
            slot: lvl.slot,
            kind: "allocate",
            allocation,
            metrics,
            traits,
            elapsedMs,
            redrags,
          },
        ],
      }));
      return metrics;
    },
    [],
  );

  return {
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
  };
}