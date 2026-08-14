import Phaser from "phaser";
import { P, TONES, type ToneId } from "./palette";
import { drawBox, drawPlot, drawWindows } from "./iso";

const ORDER: ToneId[] = ["spend", "cash", "guarantee", "growth", "hot"];

const TILE_W = 132;
const TILE_H = 66;
const UNIT = 26; // px of height per unit of value

export class District {
  readonly tone: ToneId;
  readonly container: Phaser.GameObjects.Container;
  value = 0;
  /** animated height in px */
  h = 0;
  private g: Phaser.GameObjects.Graphics;
  private labelText: Phaser.GameObjects.Text;
  private subText: Phaser.GameObjects.Text;
  private ring: Phaser.GameObjects.Graphics;
  private seed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, tone: ToneId, seed: number) {
    this.tone = tone;
    this.seed = seed;
    this.container = scene.add.container(x, y);
    this.ring = scene.add.graphics();
    this.g = scene.add.graphics();
    this.labelText = scene.add
      .text(0, TILE_H / 2 + 12, TONES[tone].label, {
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        color: "#9fb3c8",
      })
      .setOrigin(0.5, 0);
    this.subText = scene.add
      .text(0, TILE_H / 2 + 30, "", {
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        color: "#5d7governance",
      })
      .setOrigin(0.5, 0);
    this.container.add([this.ring, this.g, this.labelText, this.subText]);
    this.redraw();
  }

  setLabel(label: string, sub: string) {
    this.labelText.setText(label);
    this.subText.setText(sub);
  }

  resetLabel() {
    this.labelText.setText(TONES[this.tone].label);
    this.subText.setText("");
  }

  setHighlight(on: boolean) {
    this.ring.clear();
    if (!on) return;
    this.ring.lineStyle(2, TONES[this.tone].glow, 0.9);
    this.ring.beginPath();
    this.ring.moveTo(0, -TILE_H / 2 - 6);
    this.ring.lineTo(TILE_W / 2 + 8, 0);
    this.ring.lineTo(0, TILE_H / 2 + 6);
    this.ring.lineTo(-TILE_W / 2 - 8, 0);
    this.ring.closePath();
    this.ring.strokePath();
  }

  redraw() {
    const c = TONES[this.tone];
    this.g.clear();
    drawPlot(this.g, TILE_W, TILE_H, c.glow, this.value > 0 ? 0.22 : 0.12);
    if (this.tone === "spend") {
      // spending never accumulates: draw a scorched lot instead
      drawBox(this.g, TILE_W * 0.55, TILE_H * 0.55, Math.min(this.h, 12), c, 0.7);
      return;
    }
    const width = this.tone === "guarantee" ? TILE_W * 0.78 : TILE_W * 0.6;
    const depth = this.tone === "guarantee" ? TILE_H * 0.78 : TILE_H * 0.6;
    drawBox(this.g, width, depth, this.h, c);
    drawWindows(this.g, width, depth, this.h, 0xfff2c8, this.seed);
  }

  /** target height for the current value */
  targetH() {
    if (this.tone === "spend") return Math.min(this.value * 4, 12);
    if (this.tone === "guarantee") return this.value * UNIT * 0.62;
    return this.value * UNIT;
  }
}

export class City {
  readonly districts: Record<ToneId, District>;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, cx: number, cy: number) {
    this.scene = scene;
    const map = {} as Record<ToneId, District>;
    ORDER.forEach((tone, i) => {
      const x = cx + (i - 2) * 168;
      const y = cy + (i % 2 === 0 ? 0 : 34);
      map[tone] = new District(scene, x, y, tone, 17 + i * 31);
    });
    this.districts = map;
  }

  get(tone: ToneId) {
    return this.districts[tone];
  }

  add(tone: ToneId, units: number) {
    const d = this.districts[tone];
    d.value += units;
    this.animate(d);
  }

  scale(tone: ToneId, factor: number) {
    const d = this.districts[tone];
    d.value = Math.max(0, d.value * factor);
    this.animate(d);
  }

  scaleAll(factor: number) {
    for (const tone of ORDER) {
      if (tone === "spend") continue;
      this.scale(tone, factor);
    }
  }

  private animate(d: District) {
    this.scene.tweens.add({
      targets: d,
      h: d.targetH(),
      duration: 620,
      ease: "Back.easeOut",
      onUpdate: () => d.redraw(),
    });
  }

  totalUnits() {
    return ORDER.filter((t) => t !== "spend").reduce(
      (sum, t) => sum + this.districts[t].value,
      0,
    );
  }

  snapshot(): Record<ToneId, number> {
    return ORDER.reduce(
      (acc, t) => {
        acc[t] = this.districts[t].value;
        return acc;
      },
      {} as Record<ToneId, number>,
    );
  }

  clearHighlights() {
    for (const t of ORDER) this.districts[t].setHighlight(false);
  }

  resetLabels() {
    for (const t of ORDER) this.districts[t].resetLabel();
  }
}

export function skylineBackdrop(scene: Phaser.Scene, w: number, h: number) {
  const g = scene.add.graphics();
  g.fillStyle(P.bgDeep, 1);
  g.fillRect(0, 0, w, h);
  // horizon glow
  for (let i = 0; i < 22; i++) {
    g.fillStyle(P.panel, 0.5 - i * 0.015);
    g.fillRect(0, h * 0.32 + i * 5, w, 5);
  }
  // distant silhouettes
  let s = 4211;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let x = -40; x < w + 40; x += 46) {
    const bh = 40 + rnd() * 120;
    g.fillStyle(0x0a1826, 1);
    g.fillRect(x, h * 0.42 - bh, 38, bh);
  }
  return g;
}