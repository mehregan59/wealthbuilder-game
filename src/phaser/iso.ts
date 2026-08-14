import Phaser from "phaser";
import type { ToneColors } from "./palette";

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