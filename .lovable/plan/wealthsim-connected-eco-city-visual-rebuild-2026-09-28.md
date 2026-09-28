# WealthSim Connected Eco-City Visual Rebuild

## Goal
Rebuild the opening and playable world around the selected **Modern Eco City** direction: bright, credible, detailed, and visibly alive. The four districts will become neighborhoods inside one continuous regional city rather than separate tiles.

The educational journey, all 10 levels, bilingual content, random events, behavioral scoring, final report, and AI results helper remain unchanged.

## Visual direction
- Use the locked palette: sky `#A7D8DE`, landscape `#5D9B62`, warm civic surfaces `#F2E7C9`, investment accent `#E0A82E`, and deep teal `#296B72`.
- Use **Space Grotesk** for headings and **DM Sans** for interface and body copy.
- Replace the dark starfield onboarding with a bright regional-city backdrop that previews the same world the player will build.
- Follow the selected composition: the city occupies most of the screen, with compact information and decision surfaces around it rather than a large permanent dark rail.

## 1. Rebuild the opening journey
- Restyle loading, player details, retirement context, city naming, and starting questions as light civic-planning screens.
- Keep every existing question, skip path, disclosure, tooltip, and EN/DE behavior.
- Use a visible eco-city background, map texture, clear progress, stronger type hierarchy, and high-contrast selected states.
- Replace black fade transitions with short light/teal transitions so the experience no longer returns to dark mode before play.

## 2. Build one connected regional city
- Replace four floating diamond plots with one continuous isometric/2.5D terrain surface.
- Establish a credible street hierarchy: main avenue, neighborhood streets, junction markings, sidewalks, crossings, tram/bus stops, cycle paths, and service access.
- Blend district edges with mixed-use infill, trees, parks, verges, plazas, and shared civic buildings.
- Keep Housing, Transport, Technology, and Energy clearly identifiable through architecture, labels, and subtle color accents rather than isolated colored islands.
- Reframe the camera and city footprint for desktop, tablet, and mobile while preserving full-screen scaling.

## 3. Raise asset quality
- Replace primitive block graphics with reusable layered city assets drawn at higher detail: roofs, windows, balconies, doors, solar panels, street lamps, benches, trees, road furniture, rails, and shadows.
- Improve cars with distinct body shapes, windows, wheels, lights, direction, lane placement, stopping, and scale variation.
- Improve people with clearer silhouettes, clothing variation, walking direction, shadows, and appropriate placement on sidewalks and plazas.
- Add environmental depth using terrain variation, distant neighborhoods, soft atmospheric perspective, and restrained day/night lighting.

## 4. Make investment visibly build the city
- Give each district staged visual growth tied to its existing health/resources:
  - **Housing:** more homes, denser apartments, gardens, playgrounds, and rooftop solar.
  - **Transport:** upgraded junctions, shelters, buses/trams, cycle infrastructure, and improved streets.
  - **Technology:** additional offices/labs, taller buildings, public space, and campus details.
  - **Energy:** expanded solar arrays, more turbines, storage, substations, and service buildings.
- Animate new construction in short neutral phases: site preparation, scaffolding/crane, then completed asset.
- Keep permanent choice landmarks but integrate them physically into the city instead of relying mainly on floating badges.
- Preserve damaged, storm, construction, repaired, selected, and strengthened states with unmistakable visual differences that do not imply a morally “correct” choice.

## 5. Improve the interface around the map
- Restyle the top bar, status information, level progress, choice cards, tutorials, consequence messages, tooltips, and results surfaces using the selected light design.
- Keep the city visible behind decisions and consequences whenever practical.
- Reduce label collisions by anchoring district names to neighborhoods and using contextual labels only when needed.
- Preserve the factual decision timeline, method-and-limits section, retirement status badges, and AI question feature.

## 6. Rendering approach
- **Keep Phaser** and replace its current procedural city renderer with a modular scene-graph asset system. Phaser already provides the required canvas/WebGL rendering, animation, pointer input, scene lifecycle, and responsive resizing; changing engines would require rewriting the entire tested game without a clear quality benefit.
- Separate terrain, roads, buildings, vegetation, vehicles, people, effects, and interaction overlays into independent render layers.
- Use reusable high-resolution vector-like Phaser geometry and generated raster textures where detail materially improves buildings and vehicles.
- Centralize the palette, typography, asset sizing, and growth-stage rules so the embedded Lovable version and standalone GitHub Pages version remain visually identical.

## 7. Quality and regression checks
- Verify the complete opening path and all 10 levels without changing recorded values or scoring outcomes.
- Confirm every investment produces the correct persistent district growth and survives later levels.
- Check roads, cars, people, labels, choice panels, and city assets at desktop, tablet, and mobile sizes.
- Check reduced-motion behavior, replay cleanup, touch allocation in Level 3, random events, storm/recovery visuals, and results/AI overlays.
- Run the existing assessment tests and add focused visual-state tests for district growth stages and persistent landmarks.

## Delivery sequence
1. Establish shared visual tokens, fonts, brighter transitions, and redesigned onboarding.
2. Replace terrain and roads with the connected regional city foundation.
3. Rebuild district assets, vehicles, and people at higher fidelity.
4. Connect existing investment and event state to staged physical city growth.
5. Restyle the in-game interface and results presentation.
6. Validate the full Level 1–10 journey and responsive layouts.
