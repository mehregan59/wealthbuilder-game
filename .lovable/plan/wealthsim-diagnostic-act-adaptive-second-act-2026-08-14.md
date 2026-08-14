# WealthSim: Diagnostic Act + Adaptive Second Act

## The design (confirmed)

Levels 1–8 are a **diagnostic act**. Every decision and its response time feeds the scoring engine, producing a behavioral profile (persona + trait scores: risk preference, loss aversion, diversification, inflation awareness, fee sensitivity, engagement).

After level 8 the game continues on **one shared track whose parameters are personalized**:

- Same core mechanics (city/district building) throughout — no separate gameplay modes per persona.
- **Scenarios differ**: which events fire, their severity, ordering and framing are chosen from the profile. A loss-averse player meets recovery-focused crash scenarios; a concentrated player meets correlation and single-sector shocks.
- **Coaching tone differs**: the AI Persona Mirror adapts language per persona (reassure the Realist, challenge the Enterpriser).
- **The profile keeps updating**: later levels also record decisions, so the profile drifts with real behavior and the scenario selector responds to the current profile, not the level-8 snapshot.

Constraint carried over: purposeful gamification only — no confetti, prize draws or dopamine loops; each level ends in a tangible insight, and all content stays educational (generic asset classes, no product advice).

## What this plan does

This is a **memory-only step**. No game code changes.

1. Write the diagnostic/adaptive structure into project memory as a feature rule, so every future level, scenario and AI-coach change follows it automatically.
2. Add a one-line rule to the memory index Core section so it applies to all future work.

## Technical notes

- Memory file: `mem://features/adaptive-level-structure` (type: feature), referenced from `mem://index.md`.
- Records that `scoring.js` `recordDecision(level, value, {elapsed})` is the profile input and must stay wired for levels beyond 8, and that a scenario selector reads the live profile rather than a frozen one.

## Next step after this

Once saved, the natural first build is the scenario-selection layer: define the trait-to-scenario mapping and have level 9+ pull its events from it.
