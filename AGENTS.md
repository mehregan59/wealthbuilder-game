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
- The game canvas always fills the window (game size follows the window shape via `scale.setGameSize`, never letterboxed); `window.WS_textScale` = browser zoom ratio × in-game TEXT SIZE choice (`WS_setUserText`), applied live via `CityTheme.fitScene` restarts on setup screens and by updating `GameScene.S` without restarting levels, so zoom never shrinks the city or loses progress. Single touches reach Phaser after a ~110ms hold-off and multi-touch plus a 400ms cooldown never reach it, so pinching can't select options.
- Tie the city day/night phase to level progression while retaining continuous ambient motion, so visual time follows the simulation.
- Track historical district investment separately from current visual capacity, so losses can visibly remove assets without rewriting recorded decisions.
