<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Phaser as WealthSim's rendering engine; visual quality comes from modular layered city assets, avoiding a risky rewrite of tested gameplay.
- Centralize game palette and typography in `CityTheme`; the embedded app and standalone build must load identical city modules.
- The Lovable site root redirects to `public/game/index.html`; the standalone landing + game is the single source of truth so the Lovable and GitHub Pages links always show identical content.
- Preload ordered classic game scripts from the home screen and keep the game container at its 100%-zoom CSS size (re-measured only on real resizes) so browser zoom visibly scales the game; two-finger touches bypass Phaser so mobile pinch zoom works.
- Tie the city day/night phase to level progression while retaining continuous ambient motion, so visual time follows the simulation.
- Track historical district investment separately from current visual capacity, so losses can visibly remove assets without rewriting recorded decisions.
