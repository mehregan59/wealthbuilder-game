# WealthSim: Behavioral Mechanics Layer

## What I understand

Five market-proven mechanics, each mapping onto levels that already exist in the game (`GameScene.js` defines levels 1–8 by name):


| Mechanic                          | Source             | Where it lands in WealthSim                                                                                                                                                                                                                                          |
| --------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Physical manifestation of capital | Fortune City       | Every allocation instantly extrudes buildings in the district. Unallocated resource cubes visibly decay — dust, lost glow, shrinking — so the environment itself teaches cash drag and the cost of hesitation.                                                       |
| Endowment-effect trap             | NOVA Financial Lab | By L8 "The Great Storm" the player has hand-built the city, so damage stings. The game observes panic-sell (scrapping damaged buildings) vs. hold — real risk tolerance, not a quiz answer.                                                                          |
| Unannounced behavioral traps      | FINSIMCO           | L5 "The Boom": the Technology district erupts with fireworks and outsized gains. Never labelled as a FOMO test. We silently record whether the player abandons diversification to chase it.                                                                          |
| Experiential sandbox friction     | Banqer             | L6 "The Outside Offer": independence vs. reliance on an outside system, structurally mirroring Säule 3 vs. GRV — experienced before any German term is named.                                                                                                        |
| Psychology-first debrief          | Nibble             | The Curtain Drop reads the behavioral telemetry (panic clicks, allocation spread, time-to-decision) and returns a short empowering psychological profile — reveals the storm was a real historical crash and maps resilience to the fitting reform product category. |


Unifying principle: **Observe → Decide → Watch Consequences**. The environment teaches; the game never announces what it is measuring; the debrief is psychology, not a spreadsheet.

## Plan

This step records the mechanics as design rules — no gameplay code changes yet.

1. Save a memory file with the five mechanics, their level anchors, and the "never announce the test" rule.
2. Add the Observe → Decide → Watch Consequences principle to the memory Core section.
3. Record the telemetry contract the Curtain Drop needs: panic clicks, allocation spread over time, time-to-decision per level, scrap/hold events during the storm.

## Technical notes

- Levels are Phaser scenes in `public/game/js/scenes/GameScene.js` (`_level1`.. `_level8`), with districts in `city/District.js` and cubes in `city/ResourceCube.js` — the cash-drag decay and building extrusion belong there, not in React state. Your note referenced React/Zustand; the current port runs the Phaser canvas inside a React route, so game state lives in Phaser.
- Telemetry already flows through `scoring.js` `recordDecision(level, value, { elapsed })`; the mechanics above add event types (panic click, scrap, chase-the-boom) to that same stream.
- Persisting telemetry and the final profile requires enabling the backend; that is a separate step, not part of this one.

## What would sharpen this further

Not blocking, but useful before building: the decay rate you want for idle cubes (how fast hesitation should visibly cost), and whether the storm should be identifiable as a specific historical crash (2008 vs. 2020) or chosen from the player's profile.

## Next build step after this

Implement mechanic 1 — building extrusion on allocation plus idle-cube decay — since it is the most visible and feeds every later level.

Dont build this is for plant and memory but tell me if you need more data for memory to help you better understanding