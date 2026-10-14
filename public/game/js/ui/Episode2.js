// Episode 2 entry: feedback card, then Episode 2 · Level 1 (three pillars + compounding).
// Plain HTML overlay so browser zoom and pinch scale its text naturally. Nothing is saved.
(function () {
  var css = `
  #ep2{position:fixed;inset:0;z-index:50;overflow:auto;background:oklch(0.93 0.045 190);color:oklch(0.3 0.07 190);font-family:"DM Sans",sans-serif;font-size:calc(17px * var(--ws-text,1))}
  #ep2 .wrap{max-width:46rem;margin:0 auto;padding:2rem 1.25rem 4rem}
  #ep2 .card{background:oklch(0.98 0.022 86);border:1px solid oklch(0.85 0.04 190);border-radius:.9rem;padding:1.5rem;margin-top:1rem;box-shadow:0 10px 25px rgba(0,0,0,.08)}
  #ep2 h2{font:700 1.7em "Space Grotesk",sans-serif;margin:0 0 .4em}
  #ep2 h3{font:700 1.15em "Space Grotesk",sans-serif;margin:0 0 .3em}
  #ep2 p{line-height:1.55;margin:.4em 0}
  #ep2 .eyebrow{font:700 .8em "Space Grotesk",sans-serif;text-transform:uppercase;opacity:.75;letter-spacing:.04em}
  #ep2 .row{display:flex;flex-wrap:wrap;gap:.5rem;margin:.6rem 0}
  #ep2 .chip{min-height:48px;padding:0 1rem;border:1px solid oklch(0.48 0.08 190);border-radius:.5rem;background:transparent;color:inherit;font-weight:600;cursor:pointer}
  #ep2 .chip.on{background:oklch(0.48 0.08 190);color:oklch(0.98 0.022 86)}
  #ep2 textarea{width:100%;min-height:6em;padding:.7rem;border-radius:.5rem;border:1px solid oklch(0.8 0.04 190);font:inherit;background:#fff;color:inherit}
  #ep2 .btn{min-height:52px;padding:0 1.5rem;border:0;border-radius:.6rem;background:oklch(0.78 0.14 80);color:oklch(0.25 0.06 190);font:700 1em "Space Grotesk",sans-serif;cursor:pointer}
  #ep2 .btn.ghost{background:transparent;border:1px solid oklch(0.48 0.08 190)}
  #ep2 .actions{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:flex-end;margin-top:1.2rem}
  #ep2 .pillars{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:.75rem}
  #ep2 .badge{display:inline-block;font:700 .7em "Space Grotesk",sans-serif;padding:.25em .6em;border-radius:.3rem;margin-bottom:.4em}
  #ep2 .LAW{background:oklch(0.85 0.09 150)} #ep2 .EFF{background:oklch(0.88 0.1 85)} #ep2 .PROP{background:oklch(0.88 0.07 30)}
  #ep2 input[type=range]{width:100%;height:2.2rem}
  #ep2 .bars{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;align-items:end;height:14rem;margin-top:1rem}
  #ep2 .bar{display:flex;flex-direction:column;justify-content:flex-end;height:100%;text-align:center;font-size:.85em}
  #ep2 .seg{border-radius:.3rem .3rem 0 0;transition:height .4s}
  #ep2 .paid{background:oklch(0.48 0.08 190)} #ep2 .grow{background:oklch(0.78 0.14 80)}
  #ep2 .note{font-size:.85em;opacity:.8}`;
  var T = {
    en: {
      fbEye: 'Episode 1 complete', fbT: 'How was it?', fbQ1: 'Overall, the game was…', fbR: ['Confusing', 'Okay', 'Good', 'Great'],
      fbQ2: 'What should we look at first?', fbC: ['Clarity', 'Fun', 'Game controls', 'A bug'], fbQ3: 'Anything else? (optional)',
      fbPriv: 'Your answers stay on this device and are gone when you close the game.', skip: 'Skip', next: 'Continue to Episode 2 →', thanks: 'Thank you!',
      e2Eye: 'Episode 2 · Level 1', e2T: 'Three pillars, not one pot',
      e2I: 'Your city now knows how you decide. Episode 2 teaches how retirement income in Germany is actually built — from three separate sources.',
      p: [['LAW', 'LAW', 'Pillar I · Statutory pension', 'Pay-as-you-go: today’s workers fund today’s retirees. Your entitlement grows with earnings points.'],
          ['LAW', 'LAW', 'Pillar II · Occupational pension', 'Arranged through your employer, often with employer top-ups and tax deferral.'],
          ['EFF', 'EFFECTIVE 2027', 'Pillar III · Private provision', 'A new state-supported private retirement account is planned to start in 2027.'],
          ['PROP', 'PROPOSAL', 'Early-start pension (Frühstart-Rente)', 'A proposed state contribution for children. Not law yet.']],
      simT: 'Try it: time vs. money', simI: 'Move the slider. Compare what you pay in with what growth could add.',
      month: 'Monthly saving', yrs: 'years', paidL: 'Paid in', growL: 'Growth',
      simN: 'Illustration only: a constant 5% yearly return is assumed. Real markets go up and down; this is not a forecast or advice.',
      debT: 'What to take away', debP: 'Time does more work than size. Spreading income across all three pillars means one weak source does not sink your retirement.',
      home: 'Back to home'
    },
    de: {
      fbEye: 'Episode 1 abgeschlossen', fbT: 'Wie war es?', fbQ1: 'Insgesamt war das Spiel…', fbR: ['Verwirrend', 'Okay', 'Gut', 'Super'],
      fbQ2: 'Was sollen wir zuerst verbessern?', fbC: ['Verständlichkeit', 'Spaß', 'Bedienung', 'Einen Fehler'], fbQ3: 'Sonst noch etwas? (optional)',
      fbPriv: 'Deine Antworten bleiben auf diesem Gerät und verschwinden beim Schließen.', skip: 'Überspringen', next: 'Weiter zu Episode 2 →', thanks: 'Danke!',
      e2Eye: 'Episode 2 · Level 1', e2T: 'Drei Säulen statt ein Topf',
      e2I: 'Deine Stadt weiß jetzt, wie du entscheidest. Episode 2 zeigt, wie Renteneinkommen in Deutschland wirklich entsteht – aus drei getrennten Quellen.',
      p: [['LAW', 'GESETZ', 'Säule I · Gesetzliche Rente', 'Umlageverfahren: Heutige Beschäftigte finanzieren heutige Renten. Dein Anspruch wächst mit Entgeltpunkten.'],
          ['LAW', 'GESETZ', 'Säule II · Betriebliche Altersvorsorge', 'Über den Arbeitgeber, oft mit Zuschuss und nachgelagerter Besteuerung.'],
          ['EFF', 'AB 2027', 'Säule III · Private Vorsorge', 'Ein neues staatlich gefördertes Altersvorsorgedepot soll 2027 starten.'],
          ['PROP', 'VORSCHLAG', 'Frühstart-Rente', 'Ein vorgeschlagener staatlicher Beitrag für Kinder. Noch kein Gesetz.']],
      simT: 'Probier es: Zeit gegen Geld', simI: 'Bewege den Regler. Vergleiche Einzahlungen mit möglichem Wachstum.',
      month: 'Monatliche Sparrate', yrs: 'Jahre', paidL: 'Eingezahlt', growL: 'Wachstum',
      simN: 'Nur zur Veranschaulichung: konstant 5 % Rendite pro Jahr angenommen. Echte Märkte schwanken; keine Prognose, keine Beratung.',
      debT: 'Was du mitnimmst', debP: 'Zeit wirkt stärker als Höhe. Wer Einkommen auf alle drei Säulen verteilt, ist nicht von einer schwachen Quelle abhängig.',
      home: 'Zur Startseite'
    }
  };
  function el(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
  function fv(m, y) { var r = 0.05 / 12, n = y * 12; return m * ((Math.pow(1 + r, n) - 1) / r); }
  function eur(v) { return '€' + Math.round(v).toLocaleString('de-DE'); }

  function open(lang) {
    var s = T[lang] || T.en;
    if (!document.getElementById('ep2-css')) { var st = document.createElement('style'); st.id = 'ep2-css'; st.textContent = css; document.head.appendChild(st); }
    var root = document.getElementById('ep2'); if (root) root.remove();
    root = el('<div id="ep2" role="dialog" aria-modal="true"><div class="wrap"></div></div>');
    root.style.setProperty('--ws-text', String(window.WS_userText || 1));
    document.body.appendChild(root);
    var wrap = root.firstChild;
    window.WS_feedback = { rating: null, focus: null, comment: '' };

    function chips(list, key) {
      return '<div class="row" data-k="' + key + '">' + list.map(function (l, i) { return '<button class="chip" data-i="' + i + '">' + l + '</button>'; }).join('') + '</div>';
    }
    wrap.innerHTML =
      '<div class="card"><div class="eyebrow">' + s.fbEye + '</div><h2>' + s.fbT + '</h2>' +
      '<h3>' + s.fbQ1 + '</h3>' + chips(s.fbR, 'rating') +
      '<h3>' + s.fbQ2 + '</h3>' + chips(s.fbC, 'focus') +
      '<h3>' + s.fbQ3 + '</h3><textarea aria-label="' + s.fbQ3 + '"></textarea>' +
      '<p class="note">' + s.fbPriv + '</p>' +
      '<div class="actions"><button class="btn ghost" data-a="skip">' + s.skip + '</button><button class="btn" data-a="next">' + s.next + '</button></div></div>';
    wrap.querySelectorAll('.row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        var b = e.target.closest('.chip'); if (!b) return;
        row.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('on', c === b); });
        window.WS_feedback[row.dataset.k] = +b.dataset.i;
      });
    });
    wrap.querySelector('[data-a=skip]').onclick = level1;
    wrap.querySelector('[data-a=next]').onclick = function () { window.WS_feedback.comment = wrap.querySelector('textarea').value; level1(); };

    function level1() {
      root.scrollTop = 0;
      wrap.innerHTML =
        '<div class="card"><div class="eyebrow">' + s.e2Eye + '</div><h2>' + s.e2T + '</h2><p>' + s.e2I + '</p>' +
        '<div class="pillars">' + s.p.map(function (p) { return '<div class="card" style="margin:0"><span class="badge ' + p[0] + '">' + p[1] + '</span><h3>' + p[2] + '</h3><p>' + p[3] + '</p></div>'; }).join('') + '</div></div>' +
        '<div class="card"><h2>' + s.simT + '</h2><p>' + s.simI + '</p>' +
        '<label><b>' + s.month + ': <span id="ep2-m">€100</span></b><input id="ep2-r" type="range" min="25" max="300" step="25" value="100"></label>' +
        '<div class="bars" id="ep2-bars"></div><p class="note">' + s.simN + '</p></div>' +
        '<div class="card"><h2>' + s.debT + '</h2><p>' + s.debP + '</p><div class="actions"><button class="btn" data-a="home">' + s.home + '</button></div></div>';
      var r = wrap.querySelector('#ep2-r');
      function draw() {
        var m = +r.value, max = fv(300, 30);
        wrap.querySelector('#ep2-m').textContent = eur(m);
        wrap.querySelector('#ep2-bars').innerHTML = [10, 20, 30].map(function (y) {
          var tot = fv(m, y), paid = m * 12 * y, h = 78;
          return '<div class="bar"><b>' + eur(tot) + '</b><div class="seg grow" style="height:' + ((tot - paid) / max * h) + '%"></div>' +
            '<div class="seg paid" style="border-radius:0;height:' + (paid / max * h) + '%"></div><div>' + y + ' ' + s.yrs + '</div>' +
            '<div class="note">' + s.paidL + ' ' + eur(paid) + ' · ' + s.growL + ' ' + eur(tot - paid) + '</div></div>';
        }).join('');
      }
      r.addEventListener('input', draw); draw();
      wrap.querySelector('[data-a=home]').onclick = function () { root.remove(); window.dispatchEvent(new CustomEvent('wealthsim:home')); };
    }
  }
  window.addEventListener('wealthsim:episode2', function (e) { open((e.detail && e.detail.lang) || 'en'); });
  window.WS_openEpisode2 = open;
})();
