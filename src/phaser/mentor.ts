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
  private character: Phaser.GameObjects.Graphics;
  private bubble: Phaser.GameObjects.Graphics;
  private bubbleText: Phaser.GameObjects.Text;
  private mood: Mood = "calm";
  private scene: Phaser.Scene;
  private bubbleW: number;
  private homeX: number;
  private homeY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, bubbleW = 520) {
    this.scene = scene;
    this.bubbleW = bubbleW;
    this.homeX = x;
    this.homeY = y;
    this.container = scene.add.container(x, y);
    this.character = scene.add.graphics();
    const name = scene.add
      .text(0, 48, "MoneyMind", {
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
    this.container.add([this.bubble, this.character, name, this.bubbleText]);
    this.setMood("calm");
    this.hide();
  }

  setMood(mood: Mood) {
    this.mood = mood;
    const c = MOOD_COLOR[mood];
    const g = this.character;
    g.clear();
    // A small on-scene guide rather than a floating avatar.
    g.lineStyle(5, P.goldDim, 1);
    g.lineBetween(-6, 27, -12, 43);
    g.lineBetween(6, 27, 12, 43);
    g.lineStyle(5, c, 1);
    g.lineBetween(-12, 4, -22, 19);
    g.lineBetween(12, 4, 22, 19);
    g.fillStyle(P.panelSoft, 1);
    g.fillRoundedRect(-15, -3, 30, 33, 8);
    g.lineStyle(2, c, 0.9);
    g.strokeRoundedRect(-15, -3, 30, 33, 8);
    g.fillStyle(0xc68a62, 1);
    g.fillCircle(0, -22, 16);
    g.fillStyle(P.panel, 1);
    g.fillCircle(0, -27, 16);
    g.fillStyle(0xc68a62, 1);
    g.fillRect(-15, -27, 30, 12);
    // expressive eyes and mouth
    g.fillStyle(c, 1);
    if (mood === "alarmed") {
      g.fillCircle(-6, -23, 3);
      g.fillCircle(6, -23, 3);
    } else if (mood === "unimpressed") {
      g.fillRect(-9, -24, 6, 2);
      g.fillRect(3, -24, 6, 2);
    } else {
      g.fillCircle(-6, -23, 2);
      g.fillCircle(6, -23, 2);
    }
    g.lineStyle(2, c, 1);
    g.beginPath();
    if (mood === "impressed") {
      g.arc(0, -18, 6, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
    } else if (mood === "alarmed") {
      g.arc(0, -12, 5, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340));
    } else if (mood === "unimpressed") {
      g.moveTo(-5, -17);
      g.lineTo(5, -18);
    } else {
      g.moveTo(-5, -17);
      g.lineTo(5, -17);
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
    this.container.setPosition(-90, this.homeY);
    this.container.setAlpha(1);
    this.scene.tweens.add({
      targets: this.container,
      x: this.homeX,
      duration: 620,
      ease: "Sine.easeInOut",
      onUpdate: (tween) => {
        this.container.y = this.homeY - Math.abs(Math.sin(tween.progress * Math.PI * 5)) * 5;
      },
      onComplete: () => this.container.setY(this.homeY),
    });
  }

  hide() {
    this.container.setVisible(false);
  }
}