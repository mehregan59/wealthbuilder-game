import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";

const WealthSimGame = lazy(() => import("@/components/game/WealthSimGame"));

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

function Loading() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-background">
      <h1 className="font-heading text-4xl font-bold text-primary">WealthSim</h1>
      <p className="mt-2 text-sm text-muted-foreground">Building your city…</p>
    </div>
  );
}

function Index() {
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <WealthSimGame />
      </Suspense>
    </ClientOnly>
  );
}
