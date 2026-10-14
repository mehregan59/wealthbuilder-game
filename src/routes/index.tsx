import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ArrowRight, Building2, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import cityImage from "@/assets/wealthsim-eco-city.jpg";
import { Button } from "@/components/ui/button";

const WealthSimGame = lazy(() => import("@/components/game/WealthSimGame"));
const HOME_COPY = {
  en: {
    tagline: "Behavioral retirement education",
    intro: "Build a connected city. Navigate uncertainty. Discover how your decisions shape long-term planning.",
    start: "Start building",
    chapters: "Ten city chapters",
    chaptersText: "Make choices as your districts grow, react, and face changing events.",
    patterns: "See your patterns",
    patternsText: "Your final profile explains how recorded decisions shaped the result.",
    education: "Education, not advice",
    educationText: "Learn within Germany’s three-pillar retirement context without product recommendations.",
  },
  de: {
    tagline: "Verhaltensorientierte Altersvorsorgebildung",
    intro: "Baue eine vernetzte Stadt. Navigiere durch Unsicherheit. Entdecke, wie deine Entscheidungen langfristige Planung prägen.",
    start: "Jetzt bauen",
    chapters: "Zehn Stadtkapitel",
    chaptersText: "Triff Entscheidungen, während deine Stadtteile wachsen und sich verändern.",
    patterns: "Erkenne deine Muster",
    patternsText: "Dein Abschlussprofil erklärt, wie deine Entscheidungen das Ergebnis geprägt haben.",
    education: "Bildung, keine Beratung",
    educationText: "Lerne im Kontext des deutschen Drei-Säulen-Rentensystems – ohne Produktempfehlungen.",
  },
};

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
  const [language, setLanguage] = useState<"en" | "de">("en");
  const copy = HOME_COPY[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void import("@/components/game/WealthSimGame").then(({ preloadGame }) => preloadGame()).catch(() => {});
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  // A browser refresh or back/forward cache restore always returns to the
  // public landing page rather than reviving an unfinished Phaser session.
  useEffect(() => {
    setPlaying(false);
    const showLanding = (event: PageTransitionEvent) => {
      if (event.persisted) setPlaying(false);
    };
    window.addEventListener("pageshow", showLanding);
    return () => window.removeEventListener("pageshow", showLanding);
  }, []);

  if (!playing) {
    return (
      <main className="min-h-dvh bg-background text-foreground">
        <section className="relative flex min-h-[92dvh] items-end overflow-hidden border-b border-border">
          <img src={cityImage} alt="A connected modern eco city" width={1600} height={1000} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/35 to-transparent" />
          <div role="group" aria-label="Language selection" className="absolute right-6 top-6 z-10 flex gap-2 rounded-lg bg-card p-2 shadow-lg md:right-10">
            {(["en", "de"] as const).map((code) => (
              <Button key={code} variant={language === code ? "default" : "ghost"} aria-pressed={language === code} aria-label={code === "en" ? "English" : "Deutsch"} onClick={() => setLanguage(code)}>{code.toUpperCase()}</Button>
            ))}
          </div>
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-12 pt-28 md:px-10 md:pb-16">
            <p className="font-heading text-sm font-bold uppercase text-primary-foreground/80">{copy.tagline}</p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl font-bold leading-[1.02] text-primary-foreground md:text-7xl">WealthSim</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/90 md:text-xl">{copy.intro}</p>
            <Button onClick={() => setPlaying(true)} size="lg" variant="secondary" className="mt-8 h-14 gap-3 px-7 font-heading text-base font-bold shadow-lg transition-transform hover:scale-[1.02]">
              {copy.start} <ArrowRight className="size-5" />
            </Button>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3 md:px-10">
          <div><Building2 className="mb-4 size-7 text-primary"/><h2 className="font-heading text-xl font-bold">{copy.chapters}</h2><p className="mt-2 text-muted-foreground">{copy.chaptersText}</p></div>
          <div><ChartNoAxesCombined className="mb-4 size-7 text-primary"/><h2 className="font-heading text-xl font-bold">{copy.patterns}</h2><p className="mt-2 text-muted-foreground">{copy.patternsText}</p></div>
          <div><ShieldCheck className="mb-4 size-7 text-primary"/><h2 className="font-heading text-xl font-bold">{copy.education}</h2><p className="mt-2 text-muted-foreground">{copy.educationText}</p></div>
        </section>
      </main>
    );
  }
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <WealthSimGame language={language} onExit={() => setPlaying(false)} />
      </Suspense>
    </ClientOnly>
  );
}
