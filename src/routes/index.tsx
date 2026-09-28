import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ArrowRight, Building2, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import cityImage from "@/assets/wealthsim-eco-city.jpg";

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
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <main className="min-h-dvh bg-background text-foreground">
        <section className="relative flex min-h-[92dvh] items-end overflow-hidden border-b border-border">
          <img src={cityImage} alt="A connected modern eco city" width={1600} height={1000} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/35 to-transparent" />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-12 pt-28 md:px-10 md:pb-16">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground/80">Behavioral retirement education</p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl font-bold leading-[1.02] text-primary-foreground md:text-7xl">WealthSim</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/90 md:text-xl">Build a connected city. Navigate uncertainty. Discover how your decisions shape long-term planning.</p>
            <button onClick={() => setPlaying(true)} className="mt-8 inline-flex h-14 items-center gap-3 rounded-md bg-card px-7 font-heading text-base font-bold text-card-foreground shadow-lg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Start building <ArrowRight className="size-5" />
            </button>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3 md:px-10">
          <div><Building2 className="mb-4 size-7 text-primary"/><h2 className="font-heading text-xl font-bold">Ten city chapters</h2><p className="mt-2 text-muted-foreground">Make choices as your districts grow, react, and face changing events.</p></div>
          <div><ChartNoAxesCombined className="mb-4 size-7 text-primary"/><h2 className="font-heading text-xl font-bold">See your patterns</h2><p className="mt-2 text-muted-foreground">Your final profile explains how recorded decisions shaped the result.</p></div>
          <div><ShieldCheck className="mb-4 size-7 text-primary"/><h2 className="font-heading text-xl font-bold">Education, not advice</h2><p className="mt-2 text-muted-foreground">Learn within Germany’s three-pillar retirement context without product recommendations.</p></div>
        </section>
      </main>
    );
  }
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <WealthSimGame onExit={() => setPlaying(false)} />
      </Suspense>
    </ClientOnly>
  );
}
