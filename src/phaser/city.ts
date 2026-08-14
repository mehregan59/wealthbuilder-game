import Phaser from "phaser";
import { ENV, P, TONES, type ToneId } from "./palette";
import { drawCar, drawLamp, drawShadow, drawSlab, drawTree } from "./iso";

const ORDER: ToneId[] = ["spend", "cash", "guarantee", "growth", "hot"];

const TILE_W = 150;
const TILE_H = 76;
const UNIT = 24; // px of height per unit of value

function rndFactory(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function shade(color: number, amount: number) {
  const c = Phaser.Display.Color.ValueToColor(color);
  return amount >= 0 ? c.lighten(amount).color : c.darken(-amount).color;
}

/** A single low-poly building block standing on the plot. */
function drawBlock(
  g: Phaser.GameObjects.Graphics,
  ox: number,
  oy: number,
  w: number,
  d: number,
  height: number,
  tone: ToneId,
  roof: number,
  seedRnd: () => number,
) {
  if (height < 2) return;
  const c = TONES[tone];
  const hw = w / 2;
  const hh = d / 2;
  const base = shade(c.top, 26);

  // right face
  g.fillStyle(shade(base, -22), 1);
  g.beginPath();
  g.moveTo(ox, oy + hh - height);
  g.lineTo(ox + hw, oy - height);
  g.lineTo(ox + hw, oy);
  g.lineTo(ox, oy + hh);
  g.closePath();
  g.fillPath();

  // left face
  g.fillStyle(shade(base, -8), 1);
  g.beginPath();
  g.moveTo(ox, oy + hh - height);
  g.lineTo(ox - hw, oy - height);
  g.lineTo(ox - hw, oy);
  g.lineTo(ox, oy + hh);
  g.closePath();
  g.fillPath();

  // roof
  g.fillStyle(roof, 1);
  g.beginPath();
  g.moveTo(ox, oy - hh - height);
  g.lineTo(ox + hw, oy - height);
  g.lineTo(ox, oy + hh - height);
  g.lineTo(ox - hw, oy - height);
  g.closePath();
  g.fillPath();

  // roof rim
  g.lineStyle(1, shade(roof, -25), 0.9);
  g.strokePath();

  // windows on both faces
  const floors = Math.max(0, Math.floor((height - 12) / 18));
  for (let f = 0; f < floors; f++) {
    const y = oy - height + 16 + f * 18;
    for (let i = 0; i < 2; i++) {
      const lit = seedRnd() > 0.62;
      const col = lit ? ENV.glassLit : ENV.glass;
      // left face windows
      const lx = ox - hw * (0.62 - i * 0.34);
      g.fillStyle(col, 0.92);
      g.fillRect(lx, y + (hh * (0.62 - i * 0.34)) * 0.5, 7, 8);
      // right face windows
      const rx = ox + hw * (0.28 + i * 0.34);
      g.fillStyle(col, lit ? 0.85 : 0.6);
      g.fillRect(rx - 6, y + (hh * (0.72 - i * 0.34)) * 0.5, 7, 8);
    }
  }
}

export class District {
  readonly tone: ToneId;
  readonly container: Phaser.GameObjects.Container;
  value = 0;
  /** animated height in px */
  h = 0;
  private g: Phaser.GameObjects.Graphics;
  private labelText: Phaser.GameObjects.Text;
  private subText: Phaser.GameObjects.Text;
  private chip: Phaser.GameObjects.Graphics;
  private ring: Phaser.GameObjects.Graphics;
  private seed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, tone: ToneId, seed: number) {
    this.tone = tone;
    this.seed = seed;
    this.container = scene.add.container(x, y);
    this.ring = scene.add.graphics();
    this.g = scene.add.graphics();
    this.chip = scene.add.graphics();
    this.labelText = scene.add
      .text(0, TILE_H / 2 + 20, TONES[tone].label, {
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        color: "#f2f7fb",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    this.subText = scene.add
      .text(0, TILE_H / 2 + 38, "", {
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        color: "#cfe0ee",
      })
      .setOrigin(0.5, 0);
    this.container.add([this.ring, this.g, this.chip, this.labelText, this.subText]);
    this.redraw();
    this.paintChip();
  }

  private paintChip() {
    const w = Math.max(this.labelText.width, this.subText.width) + 24;
    const hasSub = this.subText.text.length > 0;
    const h = hasSub ? 44 : 26;
    this.chip.clear();
    this.chip.fillStyle(P.panel, 0.82);
    this.chip.fillRoundedRect(-w / 2, TILE_H / 2 + 15, w, h, 8);
    this.chip.lineStyle(1, TONES[this.tone].glow, 0.45);
    this.chip.strokeRoundedRect(-w / 2, TILE_H / 2 + 15, w, h, 8);
  }

  setLabel(label: string, sub: string) {
    this.labelText.setText(label);
    this.subText.setText(sub);
    this.paintChip();
  }

  resetLabel() {
    this.labelText.setText(TONES[this.tone].label);
    this.subText.setText("");
    this.paintChip();
  }

  setActive(on: boolean) {
    this.container.setAlpha(on ? 1 : 0.32);
  }

  setHighlight(on: boolean) {
    this.ring.clear();
    if (!on) return;
    this.ring.lineStyle(3, TONES[this.tone].glow, 0.95);
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
    const rnd = rndFactory(this.seed);
    const g = this.g;
    g.clear();

    // ground shadow + grass slab
    drawShadow(g, TILE_W + 16, TILE_H + 10, 0.13);
    drawSlab(
      g,
      TILE_W,
      TILE_H,
      14,
      this.tone === "spend" ? shade(ENV.grassTop, -14) : ENV.grassTop,
      ENV.grassLeft,
      ENV.grassRight,
    );

    // street running through the block + a paved forecourt
    drawSlab(g, TILE_W * 0.9, TILE_H * 0.22, 2, ENV.asphaltTop, ENV.asphaltLeft, ENV.asphaltRight);
    g.fillStyle(ENV.roadLine, 0.7);
    for (let i = -2; i <= 2; i++) g.fillRect(i * 24 - 6, 0, 11, 2);
    drawSlab(g, TILE_W * 0.44, TILE_H * 0.44, 2, ENV.sidewalk, ENV.sidewalkSide, ENV.sidewalkSide);

    // permanent scenery so the plot always feels like a neighbourhood
    drawBlock(g, -TILE_W * 0.26, -TILE_H * 0.2, TILE_W * 0.26, TILE_H * 0.26, 30, this.tone, ENV.roofRed, rndFactory(this.seed + 7));
    drawBlock(g, TILE_W * 0.27, -TILE_H * 0.16, TILE_W * 0.22, TILE_H * 0.22, 24, this.tone, ENV.roofGrey, rndFactory(this.seed + 11));
    drawBlock(g, -TILE_W * 0.3, TILE_H * 0.2, TILE_W * 0.2, TILE_H * 0.2, 18, this.tone, ENV.concrete, rndFactory(this.seed + 13));

    // props on the plot
    drawTree(g, -TILE_W * 0.44, -TILE_H * 0.02, 0.55);
    drawTree(g, TILE_W * 0.42, TILE_H * 0.06, 0.5);
    drawTree(g, TILE_W * 0.1, TILE_H * 0.32, 0.45);
    drawLamp(g, -TILE_W * 0.1, TILE_H * 0.22, 0.7);

    if (this.tone === "spend") {
      // spending never accumulates: a small kiosk, litter and a departing car
      drawBlock(g, 0, 0, TILE_W * 0.34, TILE_H * 0.34, Math.min(this.h, 16), "spend", ENV.roofRed, rnd);
      drawCar(g, TILE_W * 0.2, TILE_H * 0.1, 0xd8624f, 0.75);
      return;
    }

    const big = this.tone === "guarantee";
    const mainW = big ? TILE_W * 0.44 : TILE_W * 0.34;
    const mainD = big ? TILE_H * 0.44 : TILE_H * 0.34;
    const roof = this.tone === "hot" ? ENV.roofRed : big ? ENV.roofGrey : ENV.concrete;

    // annex blocks grow first, tower grows after
    const annexH = Math.min(this.h, 34);
    drawBlock(g, -TILE_W * 0.2, TILE_H * 0.1, TILE_W * 0.2, TILE_H * 0.2, annexH * 0.7, this.tone, ENV.roofGrey, rnd);
    drawBlock(g, TILE_W * 0.19, TILE_H * 0.12, TILE_W * 0.22, TILE_H * 0.22, annexH, this.tone, ENV.roofRed, rnd);
    drawBlock(g, 0, -TILE_H * 0.04, mainW, mainD, this.h, this.tone, roof, rnd);

    drawCar(g, TILE_W * 0.22, TILE_H * 0.14, this.tone === "growth" ? 0x3f7fc4 : 0xe4e7ea, 0.7);
    drawCar(g, -TILE_W * 0.16, TILE_H * 0.02, 0xf0c05a, 0.62);
  }

  /** target height for the current value */
  targetH() {
    if (this.tone === "spend") return Math.min(this.value * 4, 16);
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

  /** dim every district that is not playable this chapter */
  setActiveTones(tones: ToneId[]) {
    for (const t of ORDER) this.districts[t].setActive(tones.includes(t));
  }

  activateAll() {
    for (const t of ORDER) this.districts[t].setActive(true);
  }
}

/** Bright low-poly diorama: sky, hills, grass plate and a street running through town. */
export function skylineBackdrop(scene: Phaser.Scene, w: number, h: number) {
  const g = scene.add.graphics();
  const rnd = rndFactory(4211);

  // sky gradient bands
  const bands = 42;
  for (let i = 0; i < bands; i++) {
    const t = i / bands;
    const col = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(ENV.skyTop),
      Phaser.Display.Color.ValueToColor(t > 0.6 ? ENV.skyWarm : ENV.skyMid),
      100,
      Math.round(t * 100),
    );
    g.fillStyle(Phaser.Display.Color.GetColor(col.r, col.g, col.b), 1);
    g.fillRect(0, (h * 0.42 * i) / bands, w, h * 0.42 / bands + 1);
  }

  // sun
  g.fillStyle(0xfff3d0, 0.85);
  g.fillCircle(w * 0.78, h * 0.1, 34);
  g.fillStyle(0xfff3d0, 0.25);
  g.fillCircle(w * 0.78, h * 0.1, 58);

  // clouds
  for (let i = 0; i < 5; i++) {
    const cx = 80 + rnd() * (w - 160);
    const cy = 40 + rnd() * (h * 0.2);
    g.fillStyle(0xffffff, 0.75);
    g.fillEllipse(cx, cy, 90 + rnd() * 70, 26);
    g.fillEllipse(cx + 30, cy - 10, 60, 22);
  }

  // distant hills
  g.fillStyle(ENV.hillFar, 1);
  for (let x = -60; x < w + 60; x += 150) {
    g.fillEllipse(x + rnd() * 60, h * 0.42, 320, 150);
  }
  g.fillStyle(ENV.hillNear, 1);
  for (let x = -80; x < w + 80; x += 190) {
    g.fillEllipse(x + rnd() * 70, h * 0.45, 300, 120);
  }

  // ground plate
  g.fillStyle(ENV.grassAlt, 1);
  g.fillRect(0, h * 0.42, w, h - h * 0.42);
  g.fillStyle(ENV.grassTop, 0.5);
  g.fillRect(0, h * 0.42, w, 26);

  // main street across the diorama (iso band)
  const roadY = h * 0.6;
  g.fillStyle(ENV.asphaltTop, 1);
  g.beginPath();
  g.moveTo(-40, roadY + 40);
  g.lineTo(w + 40, roadY - 40);
  g.lineTo(w + 40, roadY + 26);
  g.lineTo(-40, roadY + 106);
  g.closePath();
  g.fillPath();
  g.fillStyle(ENV.asphaltLeft, 1);
  g.beginPath();
  g.moveTo(-40, roadY + 106);
  g.lineTo(w + 40, roadY + 26);
  g.lineTo(w + 40, roadY + 34);
  g.lineTo(-40, roadY + 114);
  g.closePath();
  g.fillPath();

  // dashed centre line
  for (let x = -20; x < w + 20; x += 62) {
    const t = (x + 40) / (w + 80);
    const y = roadY + 40 - 80 * t + 33;
    g.fillStyle(ENV.roadLine, 0.85);
    g.fillRect(x, y, 26, 3);
  }

  // roadside trees
  for (let x = 30; x < w; x += 118) {
    const t = (x + 40) / (w + 80);
    const y = roadY + 40 - 80 * t - 8;
    drawTree(g, x + rnd() * 20, y, 0.7 + rnd() * 0.3);
  }

  // background town silhouettes on the horizon
  for (let x = -20; x < w + 40; x += 54) {
    const bh = 26 + rnd() * 54;
    g.fillStyle(0xc4d6e0, 0.55);
    g.fillRect(x, h * 0.42 - bh, 32, bh);
    g.fillStyle(0xb2c7d4, 0.55);
    g.fillRect(x + 24, h * 0.42 - bh * 0.7, 13, bh * 0.7);
  }

  return g;
}
