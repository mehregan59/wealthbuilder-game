# Act 1 as a real game world: isometric city + life road, in Phaser

You're right — right now it reads as a card questionnaire with a HUD. The fix is to
put the decisions inside a living world instead of on top of one: an isometric city
that physically grows or decays from your money, a road along the bottom that walks
you from 18 to 67, and one mentor character who watches, reacts, and comments.

Nothing about the eight chapters or the behavioural profiling changes. Only the
surface changes — from cards to a world.

## The screen

```text
  ┌──────────────────────────────────────────────┐
  │        isometric city (your wealth)          │
  │      towers rise · cranes · lights on        │
  │                                              │
  │   ┌────────────────────────────────────┐     │
  │   │  mentor portrait + speech          │     │
  │   │  choices appear as world objects   │     │
  │   └────────────────────────────────────┘     │
  │──────────────────────────────────────────────│
  │ 18 ──●──●──○──○──○──○──○──○────────── 67     │
  └──────────────────────────────────────────────┘
```

- **City (top ~65%)**: isometric low-poly districts on the existing navy/gold palette.
  Growth money builds tall glass towers, guarantee money builds squat stone blocks,
  cash builds a flat lot that visibly greys out, spending money becomes a firework
  that vanishes. Crashes physically shrink buildings; recoveries regrow them.
- **Road (bottom strip)**: the age timeline. Your figure walks a few years forward
  after each chapter, scenery behind changing with the life stage.
- **Mentor**: one recurring companion (early MoneyMind). Appears at the side with a
  portrait that changes expression — calm, alarmed, impressed, unimpressed — reacts
  in one or two lines after every decision, and never tells you what to do.

## How the eight chapters play in the world

- **Dialogue chapters**: another character walks up to you on the road (flatmate,
  boss, broker, a phone notification). Speech bubble, 2–3 choices as objects you
  click in the scene rather than list rows. The mentor reacts, then the city changes.
- **Allocation chapters**: money appears as glowing coin tokens above the city. You
  drag each coin onto a district — the building for that district grows in real time
  as coins land, so you watch the consequence while allocating rather than after.
- **After each chapter**: the world moves — years advance on the road, the skyline
  updates, and a short mentor line lands as a speech bubble instead of a modal.
  The rule badge (LAW / EFFECTIVE 2027 / PROPOSAL) sits on a small street sign.

## End of Act 1

Camera pulls back over the finished city while the mentor narrates your persona.
Traits render as parts of the city ("your skyline is tall but narrow"), with the
numeric bars still available underneath.

## What this means technically

- Act 1 is rebuilt in Phaser 3 (already installed) as ES modules under `src/phaser/`,
  mounted in the existing `/play` route through a thin React wrapper. Phaser owns the
  whole screen; React only handles routing and page metadata.
- The content and scoring stay: `src/game/tracks/t1–t4.ts` (four age tracks, eight
  chapters each), `src/game/types.ts`, `src/game/engine/telemetry.ts` and the profile
  logic are imported straight into the Phaser scenes — no rewrite, no duplication.
- Isometric rendering reuses the approach from the old city code
  (`public/game/js/city/District.js`, `ResourceCube.js`, `RoadNetwork.js`,
  `AmbientSystem.js`) rebuilt as typed modules: procedurally drawn geometry, no
  external art assets, so it stays crisp at any resolution and scales to any screen.
- Scenes: `Boot` (palette, procedural textures) → `TrackSelect` (pick your decade,
  shown as four different city skylines) → `World` (city + road + mentor, runs all
  eight chapters) → `Verdict` (camera pullback + persona).
- Telemetry unchanged: choice, response time, re-drag count all still recorded, so
  the profile that feeds Act 2 is identical.
- The current React card components (`src/components/act1/*`) are retired once the
  Phaser world is working; the landing page and `/play` route stay.

## Build order

1. Boot + isometric city renderer with a district that grows and decays on demand.
2. Road/timeline strip with the walking figure and age progression.
3. Mentor portrait system with expression states and speech bubbles.
4. Dialogue chapters wired to the existing track data.
5. Allocation chapters as drag-coins-onto-districts.
6. Verdict scene with the camera pullback and persona narration.
7. Responsive scaling pass + a full playthrough check on all four tracks.

## Not in this plan

Act 2 (the 18→67 mission path), the live MoneyMind AI agent, and the Intelligence Hub
calculators. Those come after Act 1 feels like a game.
