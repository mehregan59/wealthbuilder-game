import type { Track, TrackId } from "../types";
import { t1 } from "./t1";
import { t2 } from "./t2";
import { t3 } from "./t3";
import { t4 } from "./t4";

export const TRACKS: Track[] = [t1, t2, t3, t4];

export function getTrack(id: TrackId): Track {
  return TRACKS.find((t) => t.id === id) ?? t1;
}

export function trackForAge(age: number): Track {
  if (age <= 27) return t1;
  if (age <= 37) return t2;
  if (age <= 47) return t3;
  return t4;
}