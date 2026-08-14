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
          "A behavioral investment simulation: build a city, make eight decisions, and discover your investor profile.",
      },
      { property: "og:title", content: "WealthSim — Build Your Future" },
      {
        property: "og:description",
        content:
          "A behavioral investment simulation: build a city, make eight decisions, and discover your investor profile.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Loading() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-[#061019]">
      <h1 className="font-serif text-4xl tracking-wide text-[#e2a840]">WealthSim</h1>
      <p className="mt-2 text-sm text-[#4a6080]">Building your city…</p>
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
