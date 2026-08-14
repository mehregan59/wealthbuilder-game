import { createFileRoute, Link } from "@tanstack/react-router";
import { TRACKS } from "@/game/tracks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WealthSim — A Retirement Story You Live Through" },
      {
        name: "description",
        content:
          "Eight decisions, four age tracks, no questionnaire. WealthSim reads how you behave with money under pressure and explains Germany's 2027 pension reform along the way.",
      },
      { property: "og:title", content: "WealthSim — A Retirement Story You Live Through" },
      {
        property: "og:description",
        content:
          "Eight decisions, four age tracks, no questionnaire. Behavioural profiling through play, built around Germany's 2027 pension reform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-dvh bg-background px-4 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Act 1 · Profile
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground sm:text-6xl">
          Nobody asks you what kind of investor you are.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Eight scenes from a life: people talk to you, money arrives, and you
          decide. What you do — and how long you take — becomes your profile.
          Every pension rule you meet is labelled LAW, EFFECTIVE 2027 or
          PROPOSAL, so you always know what is real.
        </p>

        <div className="mt-8">
          <Link
            to="/play"
            className="inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Start Act 1
          </Link>
        </div>

        <section className="mt-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Four decades, four different games
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {TRACKS.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-border bg-card/60 p-5"
              >
                <p className="text-xs uppercase tracking-widest text-primary">
                  {t.ageRange}
                </p>
                <p className="mt-1 font-serif text-xl text-foreground">
                  {t.label}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-16 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          WealthSim is educational. It never recommends a product, a provider or
          a security, and nothing here is investment advice.
        </p>
      </div>
    </main>
  );
}
