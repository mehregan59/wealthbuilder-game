# Fix WealthSim city presentation and level flow

## Goal
Repair the visual regressions shown in the screenshots while preserving every decision, score, random event, level, and ending.

## Changes

1. **City status panel and graph**
   - Widen the desktop panel and rebalance its sections so the full trend chart, legend, district list, and text-size controls fit.
   - Replace remaining low-contrast legacy colors with the Modern Eco City palette.

2. **Messages and level transitions**
   - Restyle top instructions, reports, temporary messages, and consequences as light, readable city UI.
   - Remove the large manual Continue control after consequences; advance after a readable pause.
   - Show each new level number and title prominently in the center with a restrained animated transition before its guide.

3. **Connected regional city and traffic**
   - Rework road lanes so they connect around district edges rather than passing through buildings.
   - Keep cars centered and rotated on their lanes, with consistent depth so they do not appear inside structures.
   - Strengthen the continuous regional-city layer with connected streets, rail, parks, neighborhoods, and shared terrain rather than isolated district islands.

4. **Night readability**
   - Make night visibly dark across sky and land, with building windows, street lighting, and vehicle lights.
   - Keep top instructions and all interactive text readable in daylight, night, and storms.

5. **Level 3 allocation**
   - Restore the six visible investment blocks above the map controls and give them clear `100 credits` labels.
   - Add a persistent allocation tray and counter, clear selected-district feedback, and reliable drag or tap placement.
   - Preserve the existing six-allocation scoring and random district shock exactly.

6. **District labels and tooltips**
   - Replace black landmark labels with readable light labels.
   - Delay district tooltips until the pointer rests on a district; cancel immediately when it moves away.
   - Position tooltips relative to the hovered district and current screen bounds so Energy cannot appear above Technology.

7. **Results screen**
   - Correct all low-contrast text and button styling.
   - Present LAW / EFFECTIVE 2027 / PROPOSAL as clearly non-interactive status labels, not buttons.
   - Replace the non-working AI question action with a visible “Coming soon” label for this prototype.
   - Add a final “Start your personal retirement investment education” section with a coming-soon action.
   - Replace Play Again with Back to home.

8. **Game home page**
   - Add a polished first screen explaining the educational city game with a strong city visual and Start button.
   - Keep the actual game one click away and return players here from the result screen.

9. **Verification**
   - Check desktop and mobile layouts, Level 3 allocation, automatic level transition, tooltip timing, night mode, traffic alignment, and the results screen in the running preview.
   - Run the existing behavioral scoring tests to confirm presentation fixes did not alter assessment logic.
