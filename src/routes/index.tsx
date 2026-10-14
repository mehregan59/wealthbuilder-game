import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

// Single source of truth: the Lovable site shows the exact same standalone
// game (landing + Phaser) that GitHub Pages publishes from public/game/.
const GAME_URL = "/game/index.html";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WealthSim — Build Your Future" },
      {
        name: "description",
        content:
          "A behavioral retirement-planning simulation: build a connected city, make ten decisions, and understand your decision patterns.",
      },
      { property: "og:title", content: "WealthSim — Build Your Future" },
      {
        property: "og:description",
        content:
          "A behavioral retirement-planning simulation: build a connected city, make ten decisions, and understand your decision patterns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace(GAME_URL);
  }, []);
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-background text-foreground">
      <h1 className="font-heading text-4xl font-bold text-primary">WealthSim</h1>
      <a className="mt-3 underline" href={GAME_URL}>Open the game</a>
    </main>
  );
}
