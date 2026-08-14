import { useEffect, useRef, useState } from "react";

const SCRIPTS = [
  "city/District",
  "city/RoadNetwork",
  "city/ResourceCube",
  "city/AmbientSystem",
  "city/WeatherSystem",
  "ui/TooltipManager",
  "ui/HUD",
  "ui/StatsPanel",
  "ui/WorldButton",
  "ui/Tutorial",
  "scenes/Boot",
  "scenes/PlayerSetup",
  "scenes/RetirementContext",
  "scenes/StartingQuestions",
  "scenes/GameScene",
  "scenes/ProfileScene",
].map((p) => `/game/js/${p}.js`);

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-ws="${src}"]`,
    );
    if (existing) return resolve();
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset["ws"] = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

// Globals the classic game scripts expect (mirrors the original index.html).
function installGlobals() {
  const w = window as unknown as Record<string, unknown>;
  if (!w["t"]) w["t"] = (k: string) => k;
  if (!w["setLang"]) w["setLang"] = (l: string) => (w["currentLang"] = l);
  if (!w["currentLang"]) w["currentLang"] = "en";
  if (!w["playerInfo"]) w["playerInfo"] = {};
  if (!w["retirementContext"]) w["retirementContext"] = {};
  if (!w["ScoringEngine"]) {
    w["ScoringEngine"] = {
      decisions: [] as unknown[],
      startingAnswers: [] as unknown[],
      levelStartTime: null as number | null,
      reset(this: any) {
        this.decisions = [];
        this.startingAnswers = [];
      },
      startTimer(this: any) {
        this.levelStartTime = Date.now();
      },
      recordDecision(this: any, level: number, value: unknown, extra?: object) {
        const elapsed = this.levelStartTime ? Date.now() - this.levelStartTime : null;
        this.decisions.push({ level, value, elapsed, ...(extra ?? {}) });
      },
      recordStartingAnswer(this: any, idx: number, value: unknown) {
        this.startingAnswers[idx] = value;
      },
    };
  }
}

export default function WealthSimGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let destroyed = false;
    let game: any = null;

    (async () => {
      try {
        const Phaser = (await import("phaser")).default;
        const w = window as any;
        w.Phaser = Phaser;
        installGlobals();

        // Crisp text: give every Text object its own resolution.
        w.WS_TEXT_RES = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
        const F = Phaser.GameObjects.GameObjectFactory.prototype as any;
        if (!F.__wsPatched) {
          const orig = F.text;
          F.text = function (x: number, y: number, text: any, style: any) {
            style = style || {};
            if (style.resolution === undefined) style.resolution = w.WS_TEXT_RES;
            return orig.call(this, x, y, text, style);
          };
          F.__wsPatched = true;
        }
        w.WS_setTextRes = (r: number) => {
          w.WS_TEXT_RES = r;
          const scenes = w.WS_game?.scene ? w.WS_game.scene.getScenes(true) : [];
          scenes.forEach((sc: any) => sc.scene.restart());
        };

        for (const src of SCRIPTS) await loadScript(src);
        if (destroyed || !containerRef.current) return;

        game = new Phaser.Game({
          type: Phaser.AUTO,
          backgroundColor: "#0a1420",
          scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.NO_CENTER,
            parent: containerRef.current,
            width: "100%",
            height: "100%",
          },
          render: { antialias: true, antialiasGL: true, pixelArt: false, roundPixels: false },
          dom: { createContainer: true },
          scene: [
            w.Boot,
            w.PlayerSetup,
            w.RetirementContext,
            w.StartingQuestions,
            w.GameScene,
            w.ProfileScene,
          ],
          audio: { disableWebAudio: false },
        });
        w.WS_game = game;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      destroyed = true;
      if (game) {
        game.destroy(true);
        (window as any).WS_game = null;
      }
    };
  }, []);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0a1420]">
      <div ref={containerRef} className="h-full w-full" />
      {error && (
        <p className="absolute inset-x-0 top-1/2 text-center text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
