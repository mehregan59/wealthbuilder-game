# Store the international pension-system comparison in memory

No code. Records the comparative policy brief (June 2026) as a new memory file so scenario writing, benchmarks and debrief copy can draw on real numbers.

## What gets stored

**Reform status and timeline** — cabinet 17 Dec 2025, Bundestag 27 Mar 2026, Bundesrat 8 May 2026, in force end of May 2026, products available 1 Jan 2027. Frühstart-Rente stays PROPOSAL/implementation-stage, retroactive from 2026 for the 2020 cohort.

**Why Germany is reforming** — old-age dependency 34.7% (2022) to 50.2% (2070); working-age population down ~6.3M by 2030; ~€100bn statutory deficit in 2023; 76% of pensioner income from pillar I, only 8% occupational; ~60% of household financial assets in deposits/insurance vs ~30% US. Riester scorecard: ~15M contracts (down from 16.5M), 20-25% dormant, ~€4bn/yr subsidies, only ~25% of working-age ever enrolled.

**Benchmark systems with verified numbers**
- Sweden AP7 Såfa 9.5/10 — 0.05-0.06% fees, 100% equity to 55 then glide, 1.25x leverage, ~14.2% avg since 2010, only ~13% of self-selectors beat it. Mandatory 2.5% of salary.
- New Zealand KiwiSaver 8.5/10 — 3.33M members (62% of population), NZ$123bn, fees 1.10% to 0.71%, Sorted.org.nz capability ecosystem; 30% of working-age members not contributing.
- Japan New NISA 7.5/10 — 28.26M accounts, under-40s 5.8M to 7.4M in a year, 73.9% report 10%+ gains; proves conservative cultures shift when the first step is simple.
- UK ISA/CTF 6.0/10 — 66% of new money to cash, 9.64% vs 1.2% ten-year returns, £394M unclaimed Child Trust Funds, cash cap from 2027.
- Israel SECP 5.5/10 — 100% enrolment but 41% of parents never choose a plan; amplifies inequality.
- Canada CLB 4.5/10 — 41.9% take-up, 2-5% among Inuit/First Nations; friction is regressive.
- US Saver's Credit 4.0/10 -> Saver's Match 2027 6.0/10 — awareness is the binding constraint.
- Germany 8.0/10 potential — depends on fees, public Standarddepot and education.

**Six risk scenarios** — cash-drag migration (high), fee creep outside the Standarddepot, low self-employed uptake, delayed public Standarddepot, Frühstart-Rente dormant accounts, education/advice grey zone, Aktivrente constitutional challenge.

**Reusable teaching assets**
- Fee-impact illustration: €100/month, 40 years, 5% gross — €150,626 at 0.05% vs €118,196 at 1.0%; gap €32,430.
- Subsidy ladder: €120/€60, €360/€180 (50%), €900/€315, €1,800/€540 (30% blended), capped at €540; €300 per child; €200 career-starter bonus under 25.
- The seven "questions to ask in 2027" — usable directly as a Stage 3/4 checklist.
- Sweden's annual statement moved dashboard use +28pp and claims +33%; Canada's RCT showed removing the word "savings" lifted take-up 5-6 per 100.

## Technical notes
One new memory file `mem://features/international-pension-benchmarks`, plus one index entry and one Core line: benchmark WealthSim's teaching against Sweden/NZ/Japan successes and UK/Israel/Canada/US failure modes; use the verified figures rather than inventing numbers. No project source files touched.