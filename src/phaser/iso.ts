import Phaser from "phaser";
import type { ToneColors } from "./palette";
import { ENV } from "./palette";

/** Draw an isometric ground plot (rhombus) centred on (0,0) of the graphics. */
export function drawPlot(
  g: Phaser.GameObjects.Graphics,
  w: number,
  h: number,
  color: number,
  alpha = 0.25,
) {
  g.fillStyle(color, alpha);
  g.beginPath();
  g.moveTo(0, -h / 2);
  g.lineTo(w / 2, 0);
  g.lineTo(0, h / 2);
  g.lineTo(-w / 2, 0);
  g.closePath();
  g.fillPath();
  g.lineStyle(1.5, color, 0.6);
  g.strokePath();
}

/**
 * Draw an isometric box standing on the plot centre (0,0).
 * Height grows upward in screen pixels.
 */
export function drawBox(
  g: Phaser.GameObjects.Graphics,
  w: number,
  h: number,
  height: number,
  c: ToneColors,
  alpha = 1,
) {
  if (height <= 0.5) return;
  const hw = w / 2;
  const hh = h / 2;

  // right face
  g.fillStyle(c.right, alpha);
  g.beginPath();
  g.moveTo(0, hh - height);
  g.lineTo(hw, -height);
  g.lineTo(hw, 0);
  g.lineTo(0, hh);
  g.closePath();
  g.fillPath();

  // left face
  g.fillStyle(c.left, alpha);
  g.beginPath();
  g.moveTo(0, hh - height);
  g.lineTo(-hw, -height);
  g.lineTo(-hw, 0);
  g.lineTo(0, hh);
  g.closePath();
  g.fillPath();

  // top face
  g.fillStyle(c.top, alpha);
  g.beginPath();
  g.moveTo(0, -hh - height);
  g.lineTo(hw, -height);
  g.lineTo(0, hh - height);
  g.lineTo(-hw, -height);
  g.closePath();
  g.fillPath();
}

/** Lit windows on the faces of a box of the given height. */
export function drawWindows(
  g: Phaser.GameObjects.Graphics,
  w: number,
  h: number,
  height: number,
  color: number,
  seed: number,
) {
  if (height < 30) return;
  const rows = Math.floor(height / 22);
  const hw = w / 2;
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let r = 0; r < rows; r++) {
    for (let cIdx = 0; cIdx < 3; cIdx++) {
      if (rnd() > 0.55) continue;
      const y = -height + 16 + r * 22;
      const fx = -hw * 0.7 + cIdx * (hw * 0.45);
      g.fillStyle(color, 0.55);
      g.fillRect(fx, y + h / 4, 7, 8);
    }
  }
}

/* ---------------- low-poly diorama helpers ---------------- */

/** A thick ground slab (rhombus top + two side faces) centred on (0,0). */
export function drawSlab(
  g: Phaser.GameObjects.Graphics,
  w: number,
  h: number,
  thickness: number,
  top: number,
  left: number,
  right: number,
  alpha = 1,
) {
  const hw = w / 2;
  const hh = h / 2;
  g.fillStyle(left, alpha);
  g.beginPath();
  g.moveTo(-hw, 0);
  g.lineTo(0, hh);
  g.lineTo(0, hh + thickness);
  g.lineTo(-hw, thickness);
  g.closePath();
  g.fillPath();
  g.fillStyle(right, alpha);
  g.beginPath();
  g.moveTo(hw, 0);
  g.lineTo(0, hh);
  g.lineTo(0, hh + thickness);
  g.lineTo(hw, thickness);
  g.closePath();
  g.fillPath();
  g.fillStyle(top, alpha);
  g.beginPath();
  g.moveTo(0, -hh);
  g.lineTo(hw, 0);
  g.lineTo(0, hh);
  g.lineTo(-hw, 0);
  g.closePath();
  g.fillPath();
}

/** Soft contact shadow under an object. */
export function drawShadow(
  g: Phaser.GameObjects.Graphics,
  w: number,
  h: number,
  alpha = 0.16,
) {
  g.fillStyle(ENV.shadow, alpha);
  g.beginPath();
  g.moveTo(6, -h / 2 + 2);
  g.lineTo(w / 2 + 6, 2);
  g.lineTo(6, h / 2 + 2);
  g.lineTo(-w / 2 + 6, 2);
  g.closePath();
  g.fillPath();
}

/** Low-poly tree: trunk + two stacked leaf cones. */
export function drawTree(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  s = 1,
) {
  g.fillStyle(ENV.shadow, 0.14);
  g.fillEllipse(x + 3, y + 2, 20 * s, 9 * s);
  g.fillStyle(ENV.trunk, 1);
  g.fillRect(x - 2 * s, y - 14 * s, 4 * s, 14 * s);
  const leaf = (cy: number, rw: number, rh: number, c1: number, c2: number) => {
    g.fillStyle(c1, 1);
    g.beginPath();
    g.moveTo(x, cy - rh);
    g.lineTo(x + rw, cy);
    g.lineTo(x, cy + rh * 0.5);
    g.lineTo(x - rw, cy);
    g.closePath();
    g.fillPath();
    g.fillStyle(c2, 1);
    g.beginPath();
    g.moveTo(x, cy - rh);
    g.lineTo(x - rw, cy);
    g.lineTo(x, cy + rh * 0.5);
    g.closePath();
    g.fillPath();
  };
  leaf(y - 18 * s, 13 * s, 15 * s, ENV.treeMid, ENV.treeDark);
  leaf(y - 30 * s, 9 * s, 12 * s, ENV.treeTop, ENV.treeMid);
}

/** Tiny isometric car. */
export function drawCar(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  body: number,
  s = 1,
) {
  const w = 22 * s;
  const h = 11 * s;
  const t = 7 * s;
  g.fillStyle(ENV.shadow, 0.16);
  g.fillEllipse(x + 2, y + 3, w * 1.1, h * 0.9);
  g.fillStyle(Phaser.Display.Color.ValueToColor(body).darken(28).color, 1);
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + w / 2, y - h / 2);
  g.lineTo(x + w / 2, y - h / 2 - t);
  g.lineTo(x, y - t);
  g.closePath();
  g.fillPath();
  g.fillStyle(Phaser.Display.Color.ValueToColor(body).darken(14).color, 1);
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x - w / 2, y - h / 2);
  g.lineTo(x - w / 2, y - h / 2 - t);
  g.lineTo(x, y - t);
  g.closePath();
  g.fillPath();
  g.fillStyle(body, 1);
  g.beginPath();
  g.moveTo(x, y - t);
  g.lineTo(x + w / 2, y - h / 2 - t);
  g.lineTo(x, y - h - t);
  g.lineTo(x - w / 2, y - h / 2 - t);
  g.closePath();
  g.fillPath();
  g.fillStyle(ENV.glass, 0.9);
  g.fillEllipse(x, y - h / 2 - t - 1, w * 0.42, h * 0.34);
}

/** Street lamp. */
export function drawLamp(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  s = 1,
) {
  g.fillStyle(0x8b949c, 1);
  g.fillRect(x - 1, y - 22 * s, 2, 22 * s);
  g.fillRect(x - 1, y - 23 * s, 8 * s, 2);
  g.fillStyle(ENV.glassLit, 0.95);
  g.fillCircle(x + 7 * s, y - 22 * s, 2.2 * s);
}