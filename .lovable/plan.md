# German Pension Knowledge Base + Card Database

## What this delivers

Two things: (1) the full German pension domain knowledge saved as project memory rules, so every future level, quiz and AI-coach line stays legally accurate; (2) a game-ready card database the levels can pull from.

## 1. Domain memory (rules, always applied)

Four memory files:

- **Three pillars** — statutory (Umlageverfahren, 18.6%, BBG 8,450/month, Entgeltpunkte, EP value 42.52 EUR from 1 Jul 2026, avg income 51,944 EUR), occupational (2. BRSG), private (Altersvorsorgedepot).
- **Reform inventory with status badges** — every rule carries one of: LAW (enacted), EFFECTIVE 2027 (enacted, later start), PROPOSAL (in process). Rentenpaket 2025, Aktivrente, 2. BRSG, Altersvorsorgereformgesetz = LAW; Muetterrente III + new products = 2027; Fruehstart-Rente, 67 to ~67.5, 70% combined target = PROPOSAL. Generationenkapital must never be shown as law.
- **Accuracy traps** — 48% is a system-level Sicherungsniveau, not an individual replacement rate; Aktivrente 2,000 EUR/month is income-tax-free but not free of health/care contributions and excludes self-employment, Beamte, MdB, Minijob; certification is not a quality guarantee; Riester contracts before 2027 are grandfathered; 1,800 EUR is the subsidised ceiling, not the contribution maximum; tax is deferred, not eliminated.
- **Subsidy and product math** — 0.50 EUR per 1 EUR up to 360 EUR, then 0.25 EUR up to 1,800 EUR, max 540 EUR basic allowance; Kinderzulage; 200 EUR Berufseinsteigerbonus under 25; Standarddepot two funds with automatic glide to conservative, effective cost cap 1.0%/yr (5% gross minus 1% ~ 4% net); 30% lump sum at payout start; payout window 65-70; provider switch free after 5 years, max 150 EUR admin.

## 2. Card database

New content module (JSON + a typed loader) with this schema per card:

```text
id | age | pillar | event | question | options[A,B,C,D] |
effect { statutory, occupational, private, liquid } |
explanation | status_badge | difficulty | tags
```

Seeded with the material above, organised as:

- Misconception / true-false cards (the ten listed, plus derived ones)
- Life-course event cards: age 23 Berufseinsteigerbonus, age 42 early withdrawal (schaedliche Verwendung), home purchase with pension capital, employer change and portability, Muetterrente III for Thomas (born 1960, child 1989), retirement-age Aktivrente decision, fixed-term rehire, age 67 payout choice (annuity / Entnahmeplan / 30% lump sum), moving abroad, provider switch on cost, age 52 Riester keep-switch-transfer
- Policy cards for the demographic system (boomers retire, birth rate, migration, wages, longevity, market crash)

Target ~100 cards; the first pass seeds a representative set per age band and per pillar so the structure is proven, then fills out.

## 3. Four meters + hidden longevity

Define the state model the cards write into: statutory (Entgeltpunkte), occupational, private (Altersvorsorgedepot), liquid wealth, plus a hidden lifespan drawn at game start (65/72/83/91/98) revealed only at the end. Card effects are expressed against these four meters so any level can consume any card.

## Technical notes

- Content lives in `public/game/content/pension-cards.json` with a small loader in `public/game/js/content/CardDeck.js` (filter by age band, pillar, difficulty, status badge) so both the Phaser scenes and any future React screen read one source.
- Meters and lifespan extend the existing `scoring.js` state; `recordDecision(level, value, {elapsed})` stays the telemetry entry point and gains card id + meter deltas.
- Every card string is bilingual (de/en) via the existing `i18n.js` keys.
- No gameplay wiring in this step beyond the deck loader; levels start consuming cards in the next step.

## What I still need from you

Whether cards should be authored German-first (with English translation) or English-first, and whether the life-course simulation (age 18-90) replaces the current 8-level city act or sits after it as the second act.
