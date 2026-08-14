import Phaser from "phaser";
import { P } from "./palette";

export type Mood = "calm" | "alarmed" | "impressed" | "unimpressed";

const MOOD_COLOR: Record<Mood, number> = {
  calm: 0x62b6de,
  alarmed: 0xe07a6a,
  impressed: 0x4fd39a,
  unimpressed: 0x8fa3b8,
};

export class Mentor {
  readonly container: Phaser.GameObjects.Container;
  private face: Phaser.GameObjects.Graphics;
  private bubble: Phaser.GameObjects.Graphics;
  private bubbleText: Phaser.GameObjects.Text;
  private mood: Mood = "calm";
  private scene: Phaser.Scene;
  private bubbleW: number;

  constructor(scene: Phaser.Scene, x: number, y: number, bubbleW = 520) {
    this.scene = scene;
    this.bubbleW = bubbleW;
    this.container = scene.add.container(x, y);
    this.face = scene.add.graphics();
    const name = scene.add
      .text(0, 52, "MoneyMind", {
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        color: "#e2a840",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    this.bubble = scene.add.graphics();
    this.bubbleText = scene.add
      .text(78, -22, "", {
        fontFamily: "Inter, sans-serif",
        fontSize: "15px",
        color: "#dbe6f2",
        wordWrap: { width: bubbleW - 40 },
        lineSpacing: 5,
      })
      .setOrigin(0, 0);
    this.container.add([this.bubble, this.face, name, this.bubbleText]);
    this.setMood("calm");
    this.hide();
  }

  setMood(mood: Mood) {
    this.mood = mood;
    const c = MOOD_COLOR[mood];
    const g = this.face;
    g.clear();
    g.fillStyle(P.panelSoft, 1);
    g.fillCircle(0, 0, 42);
    g.lineStyle(2, c, 0.9);
    g.strokeCircle(0, 0, 42);
    // eyes
    g.fillStyle(c, 1);
    if (mood === "alarmed") {
      g.fillCircle(-13, -6, 6);
      g.fillCircle(13, -6, 6);
    } else if (mood === "unimpressed") {
      g.fillRect(-19, -8, 13, 3);
      g.fillRect(6, -8, 13, 3);
    } else {
      g.fillCircle(-13, -6, 4);
      g.fillCircle(13, -6, 4);
    }
    // mouth
    g.lineStyle(3, c, 1);
    g.beginPath();
    if (mood === "impressed") {
      g.arc(0, 8, 14, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
    } else if (mood === "alarmed") {
      g.arc(0, 24, 12, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340));
    } else if (mood === "unimpressed") {
      g.moveTo(-11, 14);
      g.lineTo(11, 11);
    } else {
      g.moveTo(-11, 12);
      g.lineTo(11, 12);
    }
    g.strokePath();
  }

  say(text: string, mood: Mood = "calm") {
    this.setMood(mood);
    this.container.setVisible(true);
    this.bubbleText.setText(text);
    const h = Math.max(64, this.bubbleText.height + 34);
    const g = this.bubble;
    g.clear();
    g.fillStyle(P.panelSoft, 0.95);
    g.fillRoundedRect(60, -h / 2, this.bubbleW, h, 14);
    g.lineStyle(1, MOOD_COLOR[this.mood], 0.5);
    g.strokeRoundedRect(60, -h / 2, this.bubbleW, h, 14);
    g.fillStyle(P.panelSoft, 0.95);
    g.fillTriangle(60, -8, 60, 12, 44, 2);
    this.bubbleText.setY(-this.bubbleText.height / 2);
    this.container.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 260,
      ease: "Sine.easeOut",
    });
  }

  hide() {
    this.container.setVisible(false);
  }
}