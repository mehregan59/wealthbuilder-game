import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Act1Game = lazy(() => import("@/components/act1/Act1Game"));

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play Act 1 — WealthSim Retirement Odyssey" },
      {
        name: "description",
        content:
          "Eight lived decisions across four age tracks. Talk to people, move your money, and watch what it costs — no quiz, no advice.",
      },
      { property: "og:title", content: "Play Act 1 — WealthSim" },
      {
        property: "og:description",
        content:
          "Eight lived decisions across four age tracks: dialogue under pressure and hands-on allocation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayPage,
});

function Fallback() {
  return (
    <div className="flex h-dvh items-center justify-center bg-background">
      <p className="font-serif text-2xl text-primary">WealthSim</p>
    </div>
  );
}

function PlayPage() {
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <Act1Game />
      </Suspense>
    </ClientOnly>
  );
}