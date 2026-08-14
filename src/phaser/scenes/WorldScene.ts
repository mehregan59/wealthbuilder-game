import Phaser from "phaser";
import { P, type ToneId } from "../palette";
import { City, skylineBackdrop } from "../city";
import { Road } from "../road";
import { Mentor, type Mood } from "../mentor";
import { fadeIn, makeButton, makeRuleSign, panel } from "../ui";
import { getTrack } from "@/game/tracks";
import { computeMetrics, traitsFromScores } from "@/game/engine/telemetry";
import type {
  AllocateLevel,
  BucketId,
  DecisionRecord,
  DialogueLevel,
  RuleNote,
  Metric,
  Track,
  TrackId,
} from "@/game/types";

const START_AGE: Record<TrackId, [number, number]> = {
  T1: [18, 30],
  T2: [28, 40],
  T3: [38, 50],
  T4: [48, 60],
};

export class WorldScene extends Phaser.Scene {
  private track!: Track;
  private city!: City;
  private road!: Road;
  private mentor!: Mentor;
  private stage!: Phaser.GameObjects.Container;
  private index = 0;
  private pot = 0;
  private decisions: DecisionRecord[] = [];
  private potText!: Phaser.GameObjects.Text;
  private chapterText!: Phaser.GameObjects.Text;
  private dots: Phaser.GameObjects.Graphics[] = [];
  private startedAt = 0;

  constructor() {
    super("World");
  }

  init(data: { trackId: TrackId }) {
    this.track = getTrack(data.trackId ?? "T1");
    this.index = 0;
    this.pot = this.track.startPot;
    this.decisions = [];
    this.dots = [];
  }

  create() {
    const { width, height } = this.scale;
    skylineBackdrop(this, width, height);

    this.city = new City(this, width / 2, 278);
    const [a0, a1] = START_AGE[this.track.id];
    this.road = new Road(this, {
      x0: 120,
      x1: width - 120,
      y: height - 56,
      steps: 8,
      startAge: a0,
      endAge: a1,
    });
    this.mentor = new Mentor(this, 110, 470, 560);
    this.stage = this.add.container(0, 0);

    this.buildHud();
    this.runLevel();
  }

  // ---------- HUD ----------

  private buildHud() {
    const { width } = this.scale;
    panel(this, 0, 0, width, 62, 0.9);
    this.add.text(24, 14, this.track.label, {
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      color: "#e2a840",
      fontStyle: "bold",
    });
    this.add.text(24, 34, `${this.track.ageRange} · ${this.track.horizonYears} years to 67`, {
      fontFamily: "Inter, sans-serif",
      fontSize: "11px",
      color: "#5d7a94",
    });

    this.chapterText = this.add
      .text(width / 2, 31, "", {
        fontFamily: "Playfair Display, serif",
        fontSize: "20px",
        color: "#e8eef5",
      })
      .setOrigin(0.5);

    this.potText = this.add
      .text(width - 24, 20, "", {
        fontFamily: "Inter, sans-serif",
        fontSize: "18px",
        color: "#e8eef5",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.add
      .text(width - 24, 42, "simulated pot", {
        fontFamily: "Inter, sans-serif",
        fontSize: "10px",
        color: "#5d7a94",
      })
      .setOrigin(1, 0);
    this.updatePot(0);

    for (let i = 0; i < 8; i++) {
      const g = this.add.graphics();
      g.setPosition(width / 2 - 70 + i * 20, 54);
      this.dots.push(g);
    }
    this.paintDots();
  }

  private paintDots() {
    this.dots.forEach((g, i) => {
      g.clear();
      const done = i < this.index;
      const current = i === this.index;
      g.fillStyle(done ? P.gold : current ? P.gold : 0x24405a, current || done ? 1 : 1);
      g.fillCircle(0, 0, current ? 5 : 3.5);
      if (current) {
        g.lineStyle(1, P.gold, 0.5);
        g.strokeCircle(0, 0, 9);
      }
    });
  }

  private updatePot(delta: number) {
    this.pot = Math.max(0, Math.round(this.pot + delta));
    this.potText.setText(`€${this.pot.toLocaleString("de-DE")}`);
  }

  private setPotFactor(factor: number) {
    const next = Math.round(this.pot * factor);
    this.updatePot(next - this.pot);
  }

  // ---------- flow ----------

  private clearStage() {
    this.stage.removeAll(true);
    this.city.clearHighlights();
  }

  private runLevel() {
    const level = this.track.levels[this.index];
    if (!level) {
      this.scene.start("Verdict", {
        decisions: this.decisions,
        track: this.track.id,
        pot: this.pot,
        city: this.city.snapshot(),
      });
      return;
    }
    this.clearStage();
    this.city.resetLabels();
    this.city.activateAll();
    this.chapterText.setText(level.chapter);
    this.paintDots();
    this.startedAt = this.time.now;

    if (level.kind === "dialogue") this.runDialogue(level);
    else this.runAllocate(level);
  }

  // ---------- dialogue ----------

  private runDialogue(level: DialogueLevel) {
    const { width } = this.scale;

    if (level.slot === 7) {
      // the storm hits before you decide
      this.cameras.main.shake(600, 0.006);
      this.city.scaleAll(0.7);
    }

    const visitor = this.add.container(width - 130, 430);
    const vg = this.add.graphics();
    vg.fillStyle(P.panelSoft, 0.95);
    vg.fillCircle(0, 0, 44);
    vg.lineStyle(2, P.gold, 0.5);
    vg.strokeCircle(0, 0, 44);
    const emoji = this.add
      .text(0, 2, level.character.emoji, { fontSize: "40px" })
      .setOrigin(0.5);
    const vname = this.add
      .text(0, 56, level.character.name, {
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        color: "#e8eef5",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    const vrole = this.add
      .text(0, 74, level.character.role, {
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        color: "#5d7a94",
      })
      .setOrigin(0.5, 0);
    visitor.add([vg, emoji, vname, vrole]);
    this.stage.add(visitor);
    visitor.setX(width + 80);
    this.tweens.add({ targets: visitor, x: width - 130, duration: 520, ease: "Sine.easeOut" });

    // speech bubble
    const bubbleText = this.add.text(0, 0, level.lines.join("\n"), {
      fontFamily: "Inter, sans-serif",
      fontSize: "17px",
      color: "#e8eef5",
      wordWrap: { width: 640 },
      lineSpacing: 7,
    });
    const bw = 680;
    const bh = bubbleText.height + 44;
    const bubble = this.add.container(width - 220 - bw, 430 - bh / 2);
    const bg = this.add.graphics();
    bg.fillStyle(P.panelSoft, 0.95);
    bg.fillRoundedRect(0, 0, bw, bh, 14);
    bg.lineStyle(1, 0x24405a, 1);
    bg.strokeRoundedRect(0, 0, bw, bh, 14);
    bg.fillStyle(P.panelSoft, 0.95);
    bg.fillTriangle(bw, bh / 2 - 10, bw, bh / 2 + 10, bw + 18, bh / 2);
    bubbleText.setPosition(22, 22);
    bubble.add([bg, bubbleText]);
    this.stage.add(bubble);
    fadeIn(this, bubble, 220);

    // options as clickable slabs
    level.options.forEach((opt, i) => {
      const y = 540 + i * 62;
      const w = 760;
      const c = this.add.container(width / 2, y);
      const g = this.add.graphics();
      const draw = (hover: boolean) => {
        g.clear();
        g.fillStyle(hover ? P.panelSoft : P.panel, 0.96);
        g.fillRoundedRect(-w / 2, -25, w, 50, 10);
        g.lineStyle(hover ? 2 : 1, hover ? P.gold : 0x24405a, 1);
        g.strokeRoundedRect(-w / 2, -25, w, 50, 10);
        g.fillStyle(hover ? P.gold : 0x24405a, 1);
        g.fillCircle(-w / 2 + 26, 0, 7);
      };
      draw(false);
      const t = this.add
        .text(-w / 2 + 50, 0, opt.text, {
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          color: "#dbe6f2",
          wordWrap: { width: w - 80 },
        })
        .setOrigin(0, 0.5);
      c.add([g, t]);
      c.setSize(w, 50);
      c.setInteractive({ useHandCursor: true });
      c.on("pointerover", () => draw(true));
      c.on("pointerout", () => draw(false));
      c.on("pointerdown", () => this.chooseDialogue(level, i));
      this.stage.add(c);
      fadeIn(this, c, 380 + i * 90);
    });
  }

  private chooseDialogue(level: DialogueLevel, i: number) {
    const opt = level.options[i]!;
    const elapsedMs = this.time.now - this.startedAt;
    if (opt.potFactor !== undefined) {
      this.setPotFactor(opt.potFactor);
      this.city.scaleAll(opt.potFactor);
    } else {
      this.city.add("growth", 0.4);
    }
    this.decisions.push({
      levelId: level.id,
      slot: level.slot,
      kind: "dialogue",
      optionId: opt.id,
      traits: opt.traits,
      elapsedMs,
    });
    const mood: Mood = ["sell", "react", "now"].includes(opt.id)
      ? "alarmed"
      : ["hold", "buy", "later", "watch"].includes(opt.id)
        ? "impressed"
        : ["ignore", "safe"].includes(opt.id)
          ? "unimpressed"
          : "calm";
    this.showReaction(opt.insight, mood, level.rule);
  }

  // ---------- allocation ----------

  private runAllocate(level: AllocateLevel) {
    const { width } = this.scale;
    const allocation: Partial<Record<BucketId, number>> = {};
    let placed = 0;
    let redrags = 0;

    const prompt = this.add
      .text(width / 2, 448, level.prompt, {
        fontFamily: "Inter, sans-serif",
        fontSize: "17px",
        color: "#e8eef5",
        align: "center",
        wordWrap: { width: 760 },
        lineSpacing: 6,
      })
      .setOrigin(0.5, 0);
    this.stage.add(prompt);

    // label the districts for this chapter
    const zones: { tone: ToneId; bucket: BucketId; x: number; y: number }[] = [];
    for (const b of level.buckets) {
      const tone = b.tone as ToneId;
      const d = this.city.get(tone);
      d.setLabel(b.label, b.sub);
      d.setHighlight(true);
      zones.push({ tone, bucket: b.id, x: d.container.x, y: d.container.y });
    }
    this.city.setActiveTones(level.buckets.map((b) => b.tone as ToneId));

    const hint = this.add
      .text(width / 2, 512, "Drag each coin onto a district. The city reacts as you go.", {
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        color: "#5d7a94",
      })
      .setOrigin(0.5, 0);
    this.stage.add(hint);

    const coins: Phaser.GameObjects.Container[] = [];
    const total = level.tokens;
    for (let i = 0; i < total; i++) {
      const home = { x: width / 2 - ((total - 1) * 62) / 2 + i * 62, y: 580 };
      const coin = this.add.container(home.x, home.y);
      const g = this.add.graphics();
      g.fillStyle(P.gold, 1);
      g.fillCircle(0, 0, 22);
      g.fillStyle(0xf6d089, 1);
      g.fillCircle(0, -3, 17);
      const t = this.add
        .text(0, -2, `€${level.tokenValue}`, {
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          color: "#0a1622",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      coin.add([g, t]);
      coin.setSize(48, 48);
      coin.setInteractive({ useHandCursor: true, draggable: true });
      this.input.setDraggable(coin);
      coin.setData("home", home);
      coins.push(coin);
      this.stage.add(coin);
      fadeIn(this, coin, 200 + i * 60);
    }

    const onDrag = (
      _p: Phaser.Input.Pointer,
      obj: Phaser.GameObjects.GameObject,
      dragX: number,
      dragY: number,
    ) => {
      const c = obj as Phaser.GameObjects.Container;
      c.setPosition(dragX, dragY);
      c.setDepth(50);
    };

    const onDragEnd = (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
      const c = obj as Phaser.GameObjects.Container;
      // nearest playable district within a generous radius
      let hit: (typeof zones)[number] | undefined;
      let best = Infinity;
      for (const z of zones) {
        const dx = Math.abs(c.x - z.x);
        const dy = Math.abs(c.y - z.y);
        if (dx > 110 || dy > 120) continue;
        const d = dx * dx + dy * dy;
        if (d < best) {
          best = d;
          hit = z;
        }
      }
      if (!hit) {
        redrags += 1;
        const home = c.getData("home") as { x: number; y: number };
        this.tweens.add({ targets: c, x: home.x, y: home.y, duration: 260, ease: "Back.easeOut" });
        return;
      }
      c.disableInteractive();
      allocation[hit.bucket] = (allocation[hit.bucket] ?? 0) + 1;
      this.city.add(hit.tone, 1);
      placed += 1;
      this.tweens.add({
        targets: c,
        x: hit.x,
        y: hit.y,
        alpha: 0,
        scale: 0.4,
        duration: 320,
        ease: "Sine.easeIn",
      });
      if (placed >= total) {
        this.time.delayedCall(520, () => this.finishAllocate(level, allocation, redrags));
      }
    };

    this.input.on("drag", onDrag);
    this.input.on("dragend", onDragEnd);
    this.events.once("shutdown", () => {
      this.input.off("drag", onDrag);
      this.input.off("dragend", onDragEnd);
    });
    this.stage.once("destroy", () => {
      this.input.off("drag", onDrag);
      this.input.off("dragend", onDragEnd);
    });
    this.pendingCleanup = () => {
      this.input.off("drag", onDrag);
      this.input.off("dragend", onDragEnd);
    };
  }

  private pendingCleanup: (() => void) | null = null;

  private finishAllocate(
    level: AllocateLevel,
    allocation: Partial<Record<BucketId, number>>,
    redrags: number,
  ) {
    this.pendingCleanup?.();
    this.pendingCleanup = null;
    const elapsedMs = this.time.now - this.startedAt;
    const metrics: Record<Metric, number> = computeMetrics(allocation, {
      elapsedMs,
      redrags,
      tokens: level.tokens,
    });
    const traits = traitsFromScores(level.scores, metrics);
    this.decisions.push({
      levelId: level.id,
      slot: level.slot,
      kind: "allocate",
      allocation,
      metrics,
      traits,
      elapsedMs,
      redrags,
    });

    const invested = level.tokens - (allocation.spend ?? 0);
    this.updatePot(invested * level.tokenValue);

    const mood: Mood =
      metrics.spendShare > 40 || metrics.hotShare > 50
        ? "alarmed"
        : metrics.growthShare > 55 && metrics.diversity > 45
          ? "impressed"
          : metrics.cashShare > 45
            ? "unimpressed"
            : "calm";
    this.showReaction(level.insight(metrics), mood, level.rule);
  }

  // ---------- reaction & advance ----------

  private showReaction(insight: string, mood: Mood, rule: RuleNote) {
    const { width } = this.scale;
    this.clearStage();
    this.mentor.say(insight, mood);

    const sign = makeRuleSign(this, width - 480, 460, rule, 420);
    this.stage.add(sign);
    fadeIn(this, sign, 200);

    const btn = makeButton(
      this,
      width / 2,
      620,
      this.index >= 7 ? "See what the city says about you" : "Walk on",
      () => this.advance(),
      { width: this.index >= 7 ? 340 : 200 },
    );
    this.stage.add(btn);
    fadeIn(this, btn, 420);
  }

  private advance() {
    this.index += 1;
    this.paintDots();
    this.mentor.hide();
    this.clearStage();
    this.road.walkTo(this.index, () => this.runLevel());
  }
}