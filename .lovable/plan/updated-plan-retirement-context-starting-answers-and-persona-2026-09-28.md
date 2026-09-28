# Updated plan: Retirement context, starting answers and personalisation

## 0. Disclosure at intake

Add a short disclosure at the start explaining that the session observes decision patterns and explains them in the final results.

- Do not reveal which level measures which trait.
- Provide equivalent EN/DE wording in the existing tone.
- Keep the disclosure brief and integrated into intake.

## 1. Closing retirement text on the results screen

Add a short section under the persona result connecting the player’s observed behaviour to retirement planning in Germany.

### Status badges

Use exactly three states:

- **LAW** — enacted and currently in force.
- **EFFECTIVE 2027** — already enacted, with the relevant provision taking effect in 2027.
- **PROPOSAL** — not yet law, regardless of its intended start date.

A proposed 2027 start date does not qualify an item for **EFFECTIVE 2027**.

### Working status list

The following reflects the supplied status update dated 28 September 2026. Confirm official sources before publishing the copy.


| Item                               | Treatment        | Copy requirement                                                                                                                                    |
| ---------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 48% Rentenniveau extension to 2031 | **LAW**          | Use as an anchor after confirming enactment and commencement. Explain that Rentenniveau is not an individual guarantee of 48% of their last salary. |
| Frühstart-Rente                    | **PROPOSAL**     | Describe 2027 as a conditional target, not a confirmed effective date.                                                                              |
| Retirement age: 67 → 67.5          | **PROPOSAL**     | Identify as a commission recommendation, not an enacted change or formal bill.                                                                      |
| 70% target                         | **PROPOSAL**     | Explain that this is a combined three-pillar target, not a statutory-pension-only target.                                                           |
| Generationenkapital                | **Omit for now** | Conflicting sourcing must be resolved before inclusion or badge assignment.                                                                         |


### Content rules

- Always cover all three pillars: **statutory, occupational and private**. Personalisation may change emphasis, but must not remove a pillar.
- Explain the stakes of the planned 2027 private-pension reform, including the proposed removal of the 100% capital guarantee. Verify the provision and its legal status before release; use conditional language while it remains a proposal.
- Connect potential market fluctuations to the patience and responses to losses observed during gameplay. Avoid presenting a short game as proof of real-world investing ability.
- Name the player’s weakest **observed** trait and suggest a relevant training direction. Refer to existing levels or exercises only.
- Provide education, not product recommendations: no specific products, providers or ISINs; generic asset classes only.
- Provide complete EN/DE copy matching the existing debrief tone.
- Add a practical real-world CTA beside **“Play Again”**, such as **“Check your occupational pension statement”**. Adapt the action to the player’s circumstances without recommending a product.

## 2. Starting answers: 10% weight instead of 20%

Change the blend to **90% observed gameplay + 10% starting answers** for exactly three traits:

- Risk
- Loss aversion
- Patience

The other five traits remain **100% gameplay-derived**. State this scope explicitly in scoring documentation and the results explanation.

### Rationale

Document the design assumption: **revealed preferences receive more weight than stated preferences** because decisions during play are intended to provide stronger evidence for this assessment.

Describe 10% as a design choice, not an empirically validated optimum.

### Protect the stated-vs-observed gap

Preserve the details-panel comparison:

> “You said X; in Level 4, you did Y.”

- Use the player’s actual starting answer and recorded gameplay evidence.
- Keep this panel the highest-priority feature if implementation scope must be reduced.
- If starting questions were skipped, do not invent a stated preference or treat missing answers as neutral. Use gameplay-only scoring for the affected traits and explain the missing comparison.

### One canonical scoring implementation

- Identify which engine is canonical in the new codebase.
- Implement the blend in exactly one place.
- Have other modules consume its output or call the shared implementation.
- Do not maintain matching formulas separately in `assessment.js`, `scoring.js` or the display layer.
- Keep the weakest-observed-trait selection based on gameplay evidence, separate from the blended final result.

## 3. Age, employment and experience personalisation

Use information collected in `PlayerSetup` to personalise explanations and results. These fields must not affect trait scoring, level mechanics, difficulty or outcomes.

### Age → time-horizon framing

- Younger players: longer compounding examples and, where relevant, the **Frühstart-Rente proposal**, with its intended eligibility explained.
- Players aged 48+: catch-up and remaining-time-horizon framing; discuss Aktivrente only where relevant and with verified status and eligibility. Age 48+ is a narrative segment, not an eligibility threshold.
- Avoid implying that every player within an age group has the same circumstances.

### Employment → pillar emphasis

Continue explaining all three pillars while adjusting emphasis:

- **Employed:** occupational pension/bAV context and checking available benefits.
- **Self-employed:** checking statutory coverage and discussing the private pillar. Do not assume all self-employed people lack statutory coverage.
- **Student:** early-start and compounding examples.
- **Retired:** withdrawal and retirement-income framing.

### Experience → explanation depth

- **None:** additional explanatory tooltips in early levels.
- **Experienced:** shorter explanations and less hand-holding.
- Keep the same decisions, evidence collection and scoring for everyone.

Use neutral default wording when personalisation fields are skipped.

## 4. “How we got this result” panel

Include:

- The stated-vs-observed comparison.
- The 90%/10% blend explanation for the three applicable traits.
- A clear statement that the other five traits use gameplay alone.
- A note that market events vary between runs, so raw outcomes are not directly comparable. The assessment focuses on decisions in the situations encountered.
- A brief explanation that the result is an educational interpretation of this session.

## 5. Technical implementation

Confirm file locations and module responsibilities in the current codebase before editing.

Expected areas:

- `public/game/js/assessment.js` / `public/game/js/scoring.js`: establish one canonical blend implementation.
- `public/game/js/scenes/ProfileScene.js`: retirement section, status badges, gap panel and real-world CTA.
- `public/game/js/scenes/PlayerSetup.js`: intake disclosure and passing personalisation data through.
- `public/game/js/i18n.js`: complete EN/DE strings.
- Relevant onboarding/debrief modules: narrative framing and experience-based tooltips.
- `tests/assessment.test.ts` and relevant existing tests: scoring and conditional text coverage.

Maintain pension statuses and supporting official sources in one shared content configuration, including a last-verified date. Both language versions must use the same status data.

### Scope boundaries

- Preserve the existing story, level sequence, mechanics and ending outcome.
- Add the requested intake disclosure, explanatory personalisation and results-screen content.
- Change scoring only through the specified starting-answer blend.
- No new levels or gamification features.

## 6. Verification and acceptance criteria

Run `bunx vitest run` and a Playwright playthrough.

Verify that:

- Only risk, loss aversion and patience use the 90%/10% blend.
- The other five traits remain entirely gameplay-derived.
- Skipped starting answers have defined gameplay-only behaviour.
- Scoring rules exist in one canonical location.
- The gap panel uses actual answers and recorded decisions.
- All three pension pillars remain visible across personalisation paths.
- Proposal dates never produce an **EFFECTIVE 2027** badge.
- Generationenkapital is omitted.
- Pension claims have verified official sources before release.
- Age, employment and experience affect explanations only.
- EN/DE text, badges and the real-world CTA render correctly.
- Intake disclosure does not reveal level-to-trait mappings.