# Plan: Retirement context text + smarter use of starting answers

## 1. Closing retirement text on the results screen

Add a short closing section under the persona result that ties the player's behavioural reading to real retirement planning in Germany. Rules:

- Every pension statement carries a status badge: **LAW**, **EFFECTIVE 2027**, or **PROPOSAL**. Frühstart-Rente, the 67→67.5 change, the 70% target and Generationenkapital are shown as proposals, never as enacted law.
- Teach all three pillars (statutory, occupational, private) — never present one pot.
- Text explains why knowing your behaviour matters under the 2027 reform: the new subsidised private pension removes the old 100% capital guarantee, so long-term holding through dips is exactly the skill the game just measured.
- Text points forward: it names the player's weakest observed trait and says which kind of training (next levels) addresses it — education direction, not product advice. No ISINs, no specific products, generic asset classes only.
- Bilingual (EN/DE), same tone as the existing debriefs.

## 2. Starting answers: 10% weight instead of 20%

- The three self-report questions (risk, patience, reaction to loss) keep influencing the result, but at **10%**, with 90% from observed gameplay.
- The stated-vs-observed gap stays visible in the details panel ("You said X, but in Level 4 you did Y") — this self-awareness gap is a teaching tool.
- `assessment.js` blend changes from 0.8/0.2 to 0.9/0.1; `scoring.js` mirrors it; tests updated.

## 3. Age, employment and experience actually shape the game

Collected in PlayerSetup but currently unused. Now they personalise (without changing what's measured):

- **Age group** → time-horizon framing: younger players see longer compounding examples and the Frühstart-Rente proposal; older players (48+) see Aktivrente and catch-up framing. Levels and scoring stay identical — only the narrative framing and the results text differ.
- **Employment** → pillar emphasis in the results text: employed → occupational pension (bAV) angle; self-employed → no statutory coverage, private pillar critical; student → early-start advantage; retired → decumulation/withdrawal framing.
- **Experience** → onboarding depth: "None" gets slightly more explanatory tooltips in early levels; "Experienced" gets less hand-holding. Scoring unaffected.

## 4. Details panel addition

Add one line to the "How we got this result" panel explaining that market events are random each run, so two runs aren't directly comparable — the player's decisions are the constant.

## Technical notes

- Files touched: `public/game/js/assessment.js`, `public/game/js/scoring.js`, `public/game/js/scenes/ProfileScene.js`, `public/game/js/scenes/PlayerSetup.js` (pass data through), `public/game/js/i18n.js` (new EN/DE strings), `tests/assessment.test.ts` (blend weight + new text logic tests).
- Opening steps, story and ending stay untouched. No gamification additions.
- Verify with `bunx vitest run` and a Playwright playthrough checking the results screen text and badges render.
