import Phaser from "phaser";
import { P, TONES } from "../palette";
import { skylineBackdrop } from "../city";
import { drawBox, drawPlot } from "../iso";
import { TRACKS } from "@/game/tracks";
import type { Track } from "@/game/types";

export class TrackSelectScene extends Phaser.Scene {
  constructor() {
    super("TrackSelect");
  }

  create() {
    const { width, height } = this.scale;
    skylineBackdrop(this, width, height);

    this.add
      .text(width / 2, 78, "Which decade are you standing in?", {
        fontFamily: "Playfair Display, serif",
        fontSize: "38px",
        color: "#e8eef5",
      })
      .setOrigin(0.5);
    this.add
      .text(
        width / 2,
        124,
        "Eight decisions. No quiz, no right answer — the city reacts to what you do.",
        { fontFamily: "Inter, sans-serif", fontSize: "16px", color: "#7f94ab" },
      )
      .setOrigin(0.5);

    TRACKS.forEach((track, i) => {
      this.card(track, 190 + i * 232, 400, i);
    });
  }

  private card(track: Track, x: number, y: number, index: number) {
    const w = 212;
    const h = 320;
    const c = this.add.container(x, y);
    const g = this.add.graphics();
    const draw = (hover: boolean) => {
      g.clear();
      g.fillStyle(hover ? P.panelSoft : P.panel, 0.96);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
      g.lineStyle(hover ? 2 : 1, hover ? P.gold : 0x1c3247, 1);
      g.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
    };
    draw(false);

    // a small skyline that differs per decade
    const sky = this.add.graphics();
    sky.setPosition(0, -40);
    const tones = ["growth", "guarantee", "cash"] as const;
    for (let i = 0; i < 3; i++) {
      const bx = -52 + i * 52;
      const bh = [70, 52, 34, 22][index]! * (1 - i * 0.22) + i * 6;
      sky.setPosition(0, -40);
      const gg = this.add.graphics();
      gg.setPosition(bx, -30);
      drawPlot(gg, 60, 30, TONES[tones[i]].glow, 0.18);
      drawBox(gg, 34, 17, bh, TONES[tones[i]]);
      c.add(gg);
    }

    const title = this.add
      .text(0, 40, track.ageRange, {
        fontFamily: "Playfair Display, serif",
        fontSize: "30px",
        color: "#e2a840",
      })
      .setOrigin(0.5);
    const label = this.add
      .text(0, 76, track.label, {
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        color: "#e8eef5",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    const blurb = this.add
      .text(0, 104, track.blurb, {
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        color: "#7f94ab",
        align: "center",
        wordWrap: { width: w - 40 },
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0);

    c.add([g, title, label, blurb]);
    c.sendToBack(g);
    c.setSize(w, h);
    c.setInteractive({ useHandCursor: true });
    c.on("pointerover", () => draw(true));
    c.on("pointerout", () => draw(false));
    c.on("pointerdown", () => this.scene.start("World", { trackId: track.id }));
  }
}