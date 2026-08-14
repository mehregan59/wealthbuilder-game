import Phaser from "phaser";
import { P, TONES, type ToneId } from "../palette";
import { skylineBackdrop } from "../city";
import { drawBox, drawPlot } from "../iso";
import { makeButton } from "../ui";
import {
  PERSONAS,
  assignPersona,
  buildProfile,
  label as scoreLabel,
} from "@/game/engine/telemetry";
import { TRAITS, TRAIT_LABELS } from "@/game/types";
import type { DecisionRecord, TrackId } from "@/game/types";

interface VerdictData {
  decisions: DecisionRecord[];
  track: TrackId;
  pot: number;
  city: Record<ToneId, number>;
}

export class VerdictScene extends Phaser.Scene {
  private result!: VerdictData;

  constructor() {
    super("Verdict");
  }

  init(data: VerdictData) {
    this.result = data;
  }

  create() {
    const { width, height } = this.scale;
    skylineBackdrop(this, width, height);

    const profile = buildProfile(this.result.decisions);
    const persona = PERSONAS[assignPersona(profile)];

    // the finished skyline, pulled back and small
    const order: ToneId[] = ["spend", "cash", "guarantee", "growth", "hot"];
    const city = this.add.container(width / 2, 250);
    order.forEach((tone, i) => {
      const g = this.add.graphics();
      g.setPosition((i - 2) * 118, i % 2 === 0 ? 0 : 22);
      drawPlot(g, 96, 48, TONES[tone].glow, 0.16);
      const units = this.result.city[tone] ?? 0;
      const h = tone === "spend" ? Math.min(units * 3, 10) : units * 18;
      drawBox(g, 44, 22, h, TONES[tone]);
      city.add(g);
      const t = this.add
        .text((i - 2) * 118, (i % 2 === 0 ? 0 : 22) + 34, TONES[tone].label, {
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          color: "#5d7a94",
        })
        .setOrigin(0.5, 0);
      city.add(t);
    });
    city.setScale(1.25).setAlpha(0);
    this.tweens.add({ targets: city, scale: 1, alpha: 1, duration: 1200, ease: "Sine.easeOut" });

    this.add
      .text(width / 2, 330, persona.name, {
        fontFamily: "Playfair Display, serif",
        fontSize: "40px",
        color: "#e2a840",
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, 378, persona.line, {
        fontFamily: "Inter, sans-serif",
        fontSize: "17px",
        color: "#e8eef5",
        align: "center",
        wordWrap: { width: 720 },
      })
      .setOrigin(0.5, 0);
    this.add
      .text(width / 2, 418, persona.watch, {
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        color: "#7f94ab",
        align: "center",
        wordWrap: { width: 720 },
      })
      .setOrigin(0.5, 0);

    // trait bars, two columns
    TRAITS.forEach((trait, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = width / 2 - 380 + col * 400;
      const y = 470 + row * 44;
      const value = profile[trait];
      this.add.text(x, y, TRAIT_LABELS[trait], {
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        color: "#9fb3c8",
      });
      this.add
        .text(x + 360, y, scoreLabel(value), {
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          color: "#5d7a94",
        })
        .setOrigin(1, 0);
      const g = this.add.graphics();
      g.fillStyle(0x1c3247, 1);
      g.fillRoundedRect(x, y + 20, 360, 6, 3);
      g.fillStyle(P.gold, 0.9);
      g.fillRoundedRect(x, y + 20, (360 * value) / 100, 6, 3);
    });

    this.add
      .text(width / 2, height - 118, `Simulated pot after eight decisions: €${this.result.pot.toLocaleString("de-DE")}`, {
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        color: "#5d7a94",
      })
      .setOrigin(0.5);

    makeButton(this, width / 2 - 130, height - 66, "Play another decade", () =>
      this.scene.start("TrackSelect"),
    );
    makeButton(
      this,
      width / 2 + 130,
      height - 66,
      "Replay this decade",
      () => this.scene.start("World", { trackId: this.result.track }),
      { primary: false },
    );
  }
}