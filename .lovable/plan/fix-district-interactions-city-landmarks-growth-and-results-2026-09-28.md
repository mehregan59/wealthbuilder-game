# Fix district interactions, city landmarks, growth, and results layout

## Goal
Make district information calm and intentional, correct the remaining city-placement errors, show a visible physical response to every Level 3 coin and later loss, and keep the final results readable at short and wide screen sizes. Gameplay, scoring, decisions, and pension content remain unchanged.

## Changes

1. **District information on deliberate hover**
   - Show the district panel only after the pointer remains over the same district for a clear dwell period; merely crossing a district will not open it.
   - Cancel the pending panel immediately when the pointer leaves and hide an open hover panel immediately on exit.
   - Place each panel above its own district landmark, then clamp it within the playable area so it cannot appear over another district or under the status panel.
   - Preserve tap access on touch devices, where hover is unavailable, without leaving stale panels open.

2. **Shorter automatic text timing**
   - Reduce all self-closing, non-interactive game messages, level reveals, transient consequences, news strips, and cinematic result intro timing by 20%.
   - Do not shorten guides, reports, choices, or any information that waits for a player click.

3. **Transport landmark cleanup**
   - Move the station/clock-tower group clear of the overlapping background building and rail geometry.
   - Move the clock tower approximately 3% upward relative to its district footprint and reposition its attached label so neither sits on the rail line.
   - Keep the station, platforms, tracks, and moving trains aligned as one transport quarter.

4. **Energy landmark cleanup**
   - Remove the rightmost third column from the background solar farm that currently crosses the street.
   - Keep the remaining panels tilted and fully inside the energy land rather than on a road.

5. **Correct the river investment ship**
   - Redraw the Level 6 visitor as a recognizable isometric boat with a pointed bow, hull, deck/cabin, mast, and correctly attached offer flag.
   - Rotate and position the vessel along the river tangent so it follows the water instead of reading as a misplaced symbol.
   - Preserve the existing accept/decline behavior: dock and celebrate only after acceptance; sail away without celebration otherwise.

6. **Visible growth and loss for every district**
   - Give each district a discrete visual-capacity count separate from behavioral scoring.
   - On every coin placement, animate construction and add a new visible asset: housing adds homes, transport adds train/platform capacity, technology adds a separate building, and energy adds solar or wind capacity.
   - Do not satisfy later investments by only making an existing building taller; each coin must create an obvious new object or cluster.
   - When an event removes district value, animate deconstruction/damage and remove or shrink the newest corresponding assets in proportion to the loss.
   - Keep the district metrics and historical invested-credit total accurate while the visible city reflects current capacity.

7. **Final results layout**
   - Reflow the retirement explanation, status row, session disclaimer, education notice, and bottom actions from measured content heights rather than fixed positions.
   - Reserve a non-overlapping bottom action area and allow the result content to scroll when the viewport is too short.
   - Keep one LAW status and one grouped PROPOSAL status, with all text contained inside its panel.
   - Preserve the working Back to home and occupational-pension action.

## Verification
- Verify quick pointer pass, sustained hover, pointer exit, and touch tap behavior on all four districts.
- Place multiple Level 3 coins into each district and confirm one visible addition per coin; trigger losses and confirm visible shrink/removal.
- Check station, clock tower, solar farm, and Level 6 ship against the reported screenshots.
- Check the complete results screen at normal desktop, wide/short desktop, and mobile sizes with no overlap or clipped text.
- Run the behavioral assessment tests and confirm the preview build remains clean.
