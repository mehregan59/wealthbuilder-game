# Store the WealthSim positioning, competitor landscape and Act 2 structure in memory

No code changes. This records three new memory files so every future build decision follows them automatically.

## 1. Four stages, MoneyMind and business model
- Canonical journey: **Profile → Calibrate → Train → Deploy**. Stage 1 maps behaviour through gameplay, Stage 2 refines it with dilemmas and market simulations, Stage 3 teaches against the weak points, Stage 4 gives a real-world simulation, a readiness score and activates the agent.
- **MoneyMind** activates only after Stage 4. It is an intelligent mirror of the user: same instincts, better financial reasoning. It flags patterns and says what to consider — never what to do.
- Target users: primary 18–35, secondary 35–50, niche 50+ Riester holders.
- Business model: government education grant → freemium (MoneyMind premium) → B2B white-label; opt-in-only anonymised data.
- Standing barriers: education/advice legal line, GDPR with EU-only servers, UX quality is existential, short first-mover window.

## 2. Competitive landscape and our white space
- Heavyweight simulators (Boldin, ProjectionLab, RetireEasy): mathematically strong, psychologically empty, and they *ask* for risk tolerance. We **observe** it instead.
- AI co-pilots (Meet Warren, Empower Bullseye): good chat, no behavioural stress testing beforehand. MoneyMind arrives already knowing the user.
- Behavioural habit apps (Whistl, Chip, ZA Bank): loss aversion, present bias, commitment devices, WealthScore, streak quests — but aimed at daily impulse control. We apply the same mechanics to long-horizon pension decisions.
- Gamified education (GoHenry, Greenlight, Zogo): "Money Missions" and Duolingo-style paths — the right format for 18–35, wrong subject matter.
- Institutional stress testers (Mercer): rigorous but sterile; the Steam "Retirement Simulator" is engaging but useless mathematically.
- **White space:** the bridge between emotional education and mathematical reality — e.g. turning sequence-of-returns risk from a calculator into a lived crash the user must react to under pressure.

## 3. Act 2 shape: the Timeline Scenario Path
- A clean 2D winding life path from age 18 to 67 (React + Framer Motion, lightweight — no 3D city needed for Act 2).
- Nodes are missions ("Age 25: First Big Promotion") that open a decision card with three options spanning consumption, Altersvorsorgedepot and guarantee product.
- Every choice logs the option **and the response time** into the behavioural profile, adjusting the hidden risk-tolerance score.
- Consequence nodes land later (e.g. "Age 32: Market Crash") and replay the earlier choice's outcome; panic-selling visibly stretches the timeline to age 70.
- Surface a Chip-style **Resilience / WealthScore** derived from these reactions rather than self-reported answers.

## Technical notes
Three memory files written: `mem://features/product-stages-moneymind`, `mem://features/competitive-landscape`, `mem://features/act2-timeline-path`, plus two new Core lines in `mem://index.md` (MoneyMind never prescribes actions; risk tolerance is observed, never self-reported). No project source files touched.