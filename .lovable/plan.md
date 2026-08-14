# Act 1 Rebuild: Four Age Tracks, Story + Allocation, React

## Goal

Replace the current eight "pick a card" levels with a React-built Act 1 that feels like a story you live through rather than a questionnaire. Same eight diagnostic traits are measured, but through characters and hands-on allocation instead of labelled multiple-choice.

## Age tracks

Four cohorts, chosen at setup from the player's real age:

```text
T1  18-27   First job, first payslip, first depot
T2  28-37   Salary jump, partner, apartment decision
T3  38-47   Peak earnings, kids, employer pension offer
T4  47+     Consolidation, payout choice, sequence-of-returns risk
```

Each track keeps the same eight level slots and the same eight measured traits, so the profile is comparable across cohorts. What changes per track:

- Cast and setting (a flatmate vs. a spouse vs. a works council rep)
- Money scale (starting income, contribution sizes, existing pot)
- Time horizon shown on screen (49 years left vs. 15)
- Which pension rule each level teaches (Fruhstart/Berufseinsteiger bonus for T1, Entgeltpunkte and bAV for T3, payout options and drawdown risk for T4)
- Pacing: T1 short and fast, T4 slower with heavier consequences

Content lives in one data file per track so tracks can be tuned without touching the engine.

## Two interaction styles only

Every level is one of these — no menu of neutral options anywhere:

**1. Story / dialogue.** A character speaks. You reply in their words ("Sure, I'll join Friday" / "I'll sit this one out"). The financial meaning is never labelled. Response time is recorded silently. Used for the pressure levels: FOMO, panic, patience, the outside offer, the fee conversation.

**2. Drag & allocate.** Your income arrives as physical tokens. You drag them into buckets (spend now / Altersvorsorgedepot / Garantieprodukt / cash). Buckets visibly grow, shrink, decay. Every drag is telemetry: first instinct, how many times you re-dragged, how long you hesitated, final split. Used for the allocation, diversification and fee levels.

Rhythm alternates: dialogue, allocate, dialogue, allocate — no two consecutive levels feel the same.

## Fixing the "questionnaire with limited graphics" problem

- No question marks on screen. Characters make statements you react to.
- One line of text maximum per beat; the consequence is shown, not written.
- Money is visual: tokens, stacks, bars that fill and drain in real time, not numbers in a paragraph.
- Consequences are immediate and visible — a bucket shrinking from fees, a stack evaporating in a crash — and some are delayed, resurfacing levels later.
- Each level has its own screen composition and colour temperature, so nothing repeats.
- Debriefs are one short psychological sentence plus the number, never a spreadsheet.

## Technical approach

- Act 1 moves fully to React under `src/routes/play/*`. Phaser and `public/game/` are retired from the Act 1 path (files stay in the repo until Act 2 is settled).
- New modules:
  - `src/game/tracks/{t1,t2,t3,t4}.ts` — level content per cohort
  - `src/game/engine/levelTypes.ts` — the two level shapes (dialogue, allocate) as typed schemas
  - `src/game/engine/telemetry.ts` — port of `scoring.js`, extended with drag events, re-drag counts, hesitation
  - `src/game/engine/profile.ts` — the eight trait scores, updated continuously
- Components: `DialogueLevel`, `AllocateLevel` (pointer-based drag), `Hud`, `Debrief`, `TrackSelect`
- Animation via Motion for React; state in a single Act 1 store persisted to localStorage.
- Every pension rule rendered with its LAW / EFFECTIVE 2027 / PROPOSAL badge.
- Profile output shape stays compatible with the existing trait names so Act 2 personalisation can consume it unchanged.

## Build order

1. Engine + telemetry + profile types (no UI)
2. `DialogueLevel` and `AllocateLevel` components with placeholder content
3. Track T1 content, all eight levels, end to end
4. Tracks T2-T4 content
5. Debrief screens and the Act 1 profile summary
6. Route switch: `/` sends the player into the React Act 1

## Not in this pass

Act 2 timeline, MoneyMind, the Intelligence Hub calculators.
