export const P = {
  bg: 0x061019,
  bgDeep: 0x040b12,
  panel: 0x0d1b2a,
  panelSoft: 0x122536,
  line: 0x1e3450,
  gold: 0xe2a840,
  goldDim: 0x8a6a2c,
  text: 0xe8eef5,
  muted: 0x7f94ab,
  dim: 0x4a6080,
} as const;

export type ToneId = "spend" | "cash" | "guarantee" | "growth" | "hot";

export interface ToneColors {
  top: number;
  left: number;
  right: number;
  glow: number;
  label: string;
}

export const TONES: Record<ToneId, ToneColors> = {
  growth: { top: 0x4fd39a, left: 0x2f9e6a, right: 0x1d6a48, glow: 0x4fd39a, label: "Growth" },
  guarantee: { top: 0x62b6de, left: 0x2f83ab, right: 0x1d5673, glow: 0x62b6de, label: "Guarantee" },
  cash: { top: 0x8fa3b8, left: 0x5b6f85, right: 0x3b4a5b, glow: 0x8fa3b8, label: "Cash" },
  spend: { top: 0xe07a6a, left: 0xb04a4a, right: 0x7a3030, glow: 0xe07a6a, label: "Spent" },
  hot: { top: 0xf0a martial, left: 0xd06a2c, right: 0x8f461a, glow: 0xf0a45c, label: "Hype" },
};