import Phaser from "phaser";
import { P } from "./palette";

export class Road {
  private scene: Phaser.Scene;
  private walker: Phaser.GameObjects.Container;
  private nodes: Phaser.GameObjects.Graphics[] = [];
  private ageText: Phaser.GameObjects.Text;
  private x0: number;
  private x1: number;
  private y: number;
  private steps: number;
  private startAge: number;
  private endAge: number;

  constructor(
    scene: Phaser.Scene,
    opts: { x0: number; x1: number; y: number; steps: number; startAge: number; endAge: number },
  ) {
    this.scene = scene;
    this.x0 = opts.x0;
    this.x1 = opts.x1;
    this.y = opts.y;
    this.steps = opts.steps;
    this.startAge = opts.startAge;
    this.endAge = opts.endAge;

    const g = scene.add.graphics();
    g.fillStyle(P.panel, 0.85);
    g.fillRect(0, opts.y - 42, scene.scale.width, 96);
    g.lineStyle(3, 0x1c3247, 1);
    g.lineBetween(opts.x0, opts.y, opts.x1, opts.y);

    for (let i = 0; i <= opts.steps; i++) {
      const nx = this.stepX(i);
      const n = scene.add.graphics();
      n.fillStyle(0x24405a, 1);
      n.fillCircle(nx, opts.y, 6);
      this.nodes.push(n);
    }

    scene.add
      .text(opts.x0 - 26, opts.y + 16, `${opts.startAge}`, {
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        color: "#5d7a94",
      })
      .setOrigin(0.5, 0);
    scene.add
      .text(opts.x1 + 26, opts.y + 16, `${opts.endAge}`, {
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        color: "#5d7a94",
      })
      .setOrigin(0.5, 0);

    this.walker = scene.add.container(this.stepX(0), opts.y);
    const body = scene.add.graphics();
    body.fillStyle(P.gold, 1);
    body.fillCircle(0, -22, 7);
    body.fillRoundedRect(-6, -14, 12, 18, 4);
    body.fillStyle(P.goldDim, 1);
    body.fillRect(-5, 4, 4, 9);
    body.fillRect(1, 4, 4, 9);
    this.ageText = scene.add
      .text(0, -48, `${opts.startAge}`, {
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        color: "#e2a840",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.walker.add([body, this.ageText]);
  }

  private stepX(i: number) {
    return this.x0 + ((this.x1 - this.x0) * i) / this.steps;
  }

  ageAt(i: number) {
    return Math.round(
      this.startAge + ((this.endAge - this.startAge) * i) / this.steps,
    );
  }

  walkTo(step: number, onDone?: () => void) {
    const node = this.nodes[step];
    if (node) {
      node.clear();
      node.fillStyle(P.gold, 1);
      node.fillCircle(this.stepX(step), this.y, 7);
    }
    this.scene.tweens.add({
      targets: this.walker,
      x: this.stepX(step),
      duration: 900,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        const t = (this.walker.x - this.x0) / (this.x1 - this.x0);
        const age = Math.round(this.startAge + (this.endAge - this.startAge) * t);
        this.ageText.setText(`${age}`);
        this.walker.y = this.y - Math.abs(Math.sin(this.walker.x / 14)) * 4;
      },
      onComplete: () => onDone?.(),
    });
  }
}