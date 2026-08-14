import Phaser from "phaser";
import { P } from "./palette";
import type { RuleNote } from "@/game/types";

const RULE_STYLE: Record<
  RuleNote["status"],
  { label: string; color: number; hex: string }
> = {
  LAW: { label: "LAW", color: 0x4fd39a, hex: "#4fd39a" },
  EFFECTIVE_2027: { label: "EFFECTIVE 2027", color: 0x62b6de, hex: "#62b6de" },
  PROPOSAL: { label: "PROPOSAL", color: 0xe2a840, hex: "#e2a840" },
};

export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  opts: { width?: number; primary?: boolean } = {},
) {
  const w = opts.width ?? 240;
  const h = 48;
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  const draw = (hover: boolean) => {
    g.clear();
    if (opts.primary !== false) {
      g.fillStyle(hover ? 0xf0bc5c : P.gold, 1);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    } else {
      g.fillStyle(hover ? P.panelSoft : P.panel, 1);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      g.lineStyle(1, P.dim, 0.8);
      g.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    }
  };
  draw(false);
  const t = scene.add
    .text(0, 0, label, {
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      color: opts.primary === false ? "#dbe6f2" : "#0a1622",
      fontStyle: "bold",
    })
    .setOrigin(0.5);
  c.add([g, t]);
  c.setSize(w, h);
  c.setInteractive({ useHandCursor: true });
  c.on("pointerover", () => draw(true));
  c.on("pointerout", () => draw(false));
  c.on("pointerdown", () => onClick());
  return c;
}

/** A street sign carrying the LAW / 2027 / PROPOSAL badge and its note. */
export function makeRuleSign(
  scene: Phaser.Scene,
  x: number,
  y: number,
  rule: RuleNote,
  width = 420,
) {
  const style = RULE_STYLE[rule.status];
  const c = scene.add.container(x, y);
  const text = scene.add
    .text(16, 30, rule.text, {
      fontFamily: "Inter, sans-serif",
      fontSize: "12px",
      color: "#9fb3c8",
      wordWrap: { width: width - 32 },
      lineSpacing: 3,
    })
    .setOrigin(0, 0);
  const h = text.height + 48;
  const g = scene.add.graphics();
  g.fillStyle(P.panel, 0.94);
  g.fillRoundedRect(0, 0, width, h, 8);
  g.lineStyle(1, style.color, 0.45);
  g.strokeRoundedRect(0, 0, width, h, 8);
  g.fillStyle(style.color, 0.16);
  g.fillRoundedRect(12, 10, style.label.length * 7.4 + 18, 18, 5);
  // sign post
  g.fillStyle(0x1c3247, 1);
  g.fillRect(width / 2 - 3, h, 6, 22);
  const badge = scene.add.text(21, 13, style.label, {
    fontFamily: "Inter, sans-serif",
    fontSize: "10px",
    color: style.hex,
    fontStyle: "bold",
  });
  c.add([g, badge, text]);
  return c;
}

export function panel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  alpha = 0.92,
) {
  const g = scene.add.graphics();
  g.fillStyle(P.panel, alpha);
  g.fillRoundedRect(x, y, w, h, 14);
  g.lineStyle(1, 0x1c3247, 1);
  g.strokeRoundedRect(x, y, w, h, 14);
  return g;
}

export function fadeIn(scene: Phaser.Scene, obj: Phaser.GameObjects.Container, delay = 0) {
  obj.setAlpha(0);
  scene.tweens.add({ targets: obj, alpha: 1, duration: 300, delay, ease: "Sine.easeOut" });
}