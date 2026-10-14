import { useEffect, useRef, useState } from "react";

const SCRIPTS = [
  "i18n",
  "scoring",
  "assessment",
  "pensionContent",
  "city/CityTheme",
  "city/UrbanFabric",
  "city/CityScape",
  "city/Metropolis",

  "city/District",
  "city/RoadNetwork",
  "city/ResourceCube",
  "city/AmbientSystem",
  "city/WeatherSystem",
  "ui/TooltipManager",
  "ui/AskResults",
  "ui/HUD",
  "ui/StatsPanel",
  "ui/WorldButton",
  "ui/Tutorial",
  "ui/RotateHint",
  "scenes/Boot",
  "scenes/PlayerSetup",
  "scenes/RetirementContext",
  "scenes/StartingQuestions",
  "scenes/GameScene",
  "scenes/ProfileScene",
].map((p) => `/game/js/${p}.js`);

const scriptLoads = new Map<string, Promise<void>>();
function loadScript(src: string) {
  const existing = scriptLoads.get(src);
  if (existing) return existing;
  const pending = new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset["ws"] = src;
    el.onload = () => resolve();
    el.onerror = () => {
      scriptLoads.delete(src);
      el.remove();
      reject(new Error(`Failed to load ${src}`));
    };
    document.head.appendChild(el);
  });
  scriptLoads.set(src, pending);
  return pending;
}

let preloadPromise: Promise<typeof import("phaser")> | null = null;
export function preloadGame() {
  preloadPromise ??= import("phaser").then(async ({ default: Phaser }) => {
    (window as any).Phaser = Phaser;
    installGlobals();
    // async=false preserves classic-script execution order while downloads overlap.
    await Promise.all(SCRIPTS.map(loadScript));
    return Phaser;
  }).catch((error) => {
    preloadPromise = null;
    throw error;
  });
  return preloadPromise;
}

// Globals the classic game scripts expect (mirrors the original index.html).
function installGlobals() {
  const w = window as unknown as Record<string, unknown>;
  if (!w["t"]) w["t"] = (k: string) => k;
  if (!w["setLang"]) w["setLang"] = (l: string) => (w["currentLang"] = l);
  if (!w["currentLang"]) w["currentLang"] = "en";
  if (!w["playerInfo"]) w["playerInfo"] = {};
  if (!w["retirementContext"]) w["retirementContext"] = {};
  // ScoringEngine comes from the real scoring.js loaded in SCRIPTS —
  // no stub here, or the persona/trait scoring would silently no-op.
}

// The Phaser instance is kept at module scope so React StrictMode's
// double-invoked effects (and fast refresh) don't tear the game down.
let gameInstance: any = null;
let destroyTimer: ReturnType<typeof setTimeout> | null = null;
let initPromise: Promise<void> | null = null;

export default function WealthSimGame({ onExit, language = "en" }: { onExit?: () => void; language?: "en" | "de" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (destroyTimer) {
      clearTimeout(destroyTimer);
      destroyTimer = null;
    }

    const adopt = () => {
      const parent = containerRef.current;
      if (!parent || !gameInstance) return;
      const canvas = gameInstance.canvas as HTMLCanvasElement | undefined;
      const domRoot = gameInstance.domContainer as HTMLElement | undefined;
      if (canvas && canvas.parentElement !== parent) parent.appendChild(canvas);
      if (domRoot && domRoot.parentElement !== parent) parent.appendChild(domRoot);
      gameInstance.scale?.refresh();
      setReady(true);
    };

    const init = async () => {
      try {
        const Phaser = await preloadGame();
        const w = window as any;
        w.Phaser = Phaser;
        installGlobals();
        w.setLang(language);
        w.currentLang = language;

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

        if (cancelled || !containerRef.current || gameInstance) return;

        gameInstance = new Phaser.Game({
          type: Phaser.AUTO,
          backgroundColor: "#a7d8de",
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: containerRef.current,
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
          },
          render: { antialias: true, antialiasGL: true, pixelArt: false, roundPixels: false },
          dom: { createContainer: true },
          fps: { smoothStep: false, min: 10, panicMax: 0 },
          // Scene classes are top-level `class` declarations in classic
          // scripts: they live in global lexical scope, not on window.
          scene: new Function(
            "return [Boot,PlayerSetup,RetirementContext,StartingQuestions,GameScene,ProfileScene]",
          )(),
          audio: { disableWebAudio: false },
        });
        w.WS_game = gameInstance;
        setReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    };

    if (gameInstance) {
      adopt();
    } else {
      initPromise = (initPromise ?? Promise.resolve()).then(init);
      void initPromise.then(() => {
        if (!cancelled) adopt();
      });
    }

    // Scale the complete scene instead of resizing its coordinate system:
    // zoom must not detach cards, hit areas, or districts from their artwork.
    const ro = new ResizeObserver(() => {
      const el = containerRef.current;
      if (el && gameInstance?.scale) {
        gameInstance.scale.refresh();
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      cancelled = true;
      ro.disconnect();
      destroyTimer = setTimeout(() => {
        destroyTimer = null;
        if (gameInstance) {
          gameInstance.destroy(true);
          gameInstance = null;
          initPromise = null;
          (window as any).WS_game = null;
        }
      }, 200);
    };
  }, []);

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w["WS_embedded"] = true;
    const exit = () => onExit?.();
    window.addEventListener("wealthsim:home", exit);
    return () => {
      w["WS_embedded"] = false;
      window.removeEventListener("wealthsim:home", exit);
    };
  }, [onExit]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <div ref={containerRef} className="h-full w-full" />
      {!ready && !error && (
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background text-foreground">
          <span className="font-heading text-3xl font-bold">WealthSim</span>
          <p>{language === "de" ? "Deine Stadt wird vorbereitet…" : "Preparing your city…"}</p>
        </div>
      )}
      {error && (
        <p className="absolute inset-x-0 top-1/2 text-center text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
