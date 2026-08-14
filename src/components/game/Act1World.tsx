import { useEffect, useRef } from "react";
import type Phaser from "phaser";

/**
 * Mounts the Phaser Act 1 world. StrictMode-safe: the game instance is kept at
 * module scope and re-parented instead of destroyed on the dev double-mount.
 */
let game: Phaser.Game | null = null;
let destroyTimer: ReturnType<typeof setTimeout> | null = null;

export default function Act1World() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    if (destroyTimer) {
      clearTimeout(destroyTimer);
      destroyTimer = null;
    }

    if (game) {
      const canvas = game.canvas;
      if (canvas && canvas.parentElement !== host) host.appendChild(canvas);
      game.scale.refresh();
    } else {
      void import("@/phaser/game").then(({ createAct1Game }) => {
        if (cancelled || !hostRef.current) return;
        game = createAct1Game(hostRef.current);
      });
    }

    return () => {
      cancelled = true;
      destroyTimer = setTimeout(() => {
        game?.destroy(true);
        game = null;
        destroyTimer = null;
      }, 250);
    };
  }, []);

  return <div ref={hostRef} className="h-dvh w-full overflow-hidden bg-background" />;
}