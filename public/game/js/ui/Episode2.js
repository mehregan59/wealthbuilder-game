// Episode 2: 10-question feedback check-in -> hidden learning route (C cautious / F fast / S steady)
// -> Levels 1-3 teaching the same German retirement facts to everyone, with points and coaching
// weighted toward the player's route. Plain HTML overlay so browser zoom scales it. Nothing is saved.
(function () {
  var css = `
  #ep2{position:fixed;inset:0;z-index:50;overflow:auto;background:oklch(0.93 0.045 190);color:oklch(0.3 0.07 190);font-family:"DM Sans",sans-serif;font-size:calc(17px * var(--ws-text,1))}
  #ep2 .wrap{max-width:46rem;margin:0 auto;padding:2rem 1.25rem 4rem}
  #ep2 .card{background:oklch(0.98 0.022 86);border:1px solid oklch(0.85 0.04 190);border-radius:.9rem;padding:1.5rem;margin-top:1rem;box-shadow:0 10px 25px rgba(0,0,0,.08)}
  #ep2 h2{font:700 1.6em "Space Grotesk",sans-serif;margin:0 0 .4em}
  #ep2 h3{font:700 1.1em "Space Grotesk",sans-serif;margin:.6em 0 .3em}
  #ep2 p{line-height:1.55;margin:.4em 0}
  #ep2 .eyebrow{font:700 .8em "Space Grotesk",sans-serif;text-transform:uppercase;opacity:.75;letter-spacing:.04em}
  #ep2 .opts{display:grid;gap:.5rem;margin:.6rem 0}
  #ep2 .chip{min-height:48px;padding:.6rem 1rem;border:1px solid oklch(0.48 0.08 190);border-radius:.5rem;background:transparent;color:inherit;font:600 1em "DM Sans",sans-serif;cursor:pointer;text-align:left}
  #ep2 .chip.on{background:oklch(0.48 0.08 190);color:oklch(0.98 0.022 86)}
  #ep2 .chip[disabled]{cursor:default}
  #ep2 .btn{min-height:52px;padding:0 1.5rem;border:0;border-radius:.6rem;background:oklch(0.78 0.14 80);color:oklch(0.25 0.06 190);font:700 1em "Space Grotesk",sans-serif;cursor:pointer}
  #ep2 .btn[disabled]{opacity:.45;cursor:default}
  #ep2 .btn.ghost{background:transparent;border:1px solid oklch(0.48 0.08 190)}
  #ep2 .actions{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:flex-end;margin-top:1.2rem}
  #ep2 .badge{display:inline-block;font:700 .7em "Space Grotesk",sans-serif;padding:.25em .6em;border-radius:.3rem;margin-right:.4em;vertical-align:middle}
  #ep2 .LAW{background:oklch(0.85 0.09 150)} #ep2 .EFF{background:oklch(0.88 0.1 85)} #ep2 .PROP{background:oklch(0.88 0.07 30)}
  #ep2 .fb{margin-top:.6rem;padding:.8rem 1rem;border-left:4px solid oklch(0.78 0.14 80);background:oklch(0.95 0.03 86);border-radius:.3rem}
  #ep2 input[type=range]{width:100%;height:2.2rem}
  #ep2 .bars{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;align-items:end;height:12rem;margin-top:1rem}
  #ep2 .bar{display:flex;flex-direction:column;justify-content:flex-end;height:100%;text-align:center;font-size:.85em}
  #ep2 .seg{border-radius:.3rem .3rem 0 0;transition:height .4s}
  #ep2 .paid{background:oklch(0.48 0.08 190)} #ep2 .grow{background:oklch(0.78 0.14 80)} #ep2 .sub{background:oklch(0.7 0.12 150)}
  #ep2 .note{font-size:.85em;opacity:.8}
  #ep2 .pts{float:right;font:700 .9em "Space Grotesk",sans-serif;background:oklch(0.48 0.08 190);color:oklch(0.98 0.022 86);padding:.3em .8em;border-radius:1em}
  #ep2 .prog{height:6px;background:oklch(0.85 0.04 190);border-radius:3px;margin:.5rem 0 1rem}
  #ep2 .prog i{display:block;height:100%;background:oklch(0.78 0.14 80);border-radius:3px}
  #ep2-dev{position:fixed;right:12px;bottom:12px;z-index:60;font:600 14px "DM Sans",sans-serif}
  #ep2-dev>button{min-height:44px;padding:0 14px;border-radius:22px;border:0;background:oklch(0.3 0.07 190);color:oklch(0.98 0.022 86);cursor:pointer}
  #ep2-dev .menu{position:absolute;right:0;bottom:52px;background:oklch(0.98 0.022 86);border:1px solid oklch(0.85 0.04 190);border-radius:12px;padding:10px;display:none;min-width:230px;box-shadow:0 10px 25px rgba(0,0,0,.15);color:oklch(0.3 0.07 190)}
  #ep2-dev.open .menu{display:grid;gap:6px}
  #ep2-dev .menu button,#ep2-dev select{min-height:40px;border-radius:8px;border:1px solid oklch(0.85 0.04 190);background:#fff;color:inherit;font:inherit;cursor:pointer}`;

  // ---- 10 feedback questions. Each option scores C (cautious), F (fast reactor) or S (steady). ----
  var Q = [
    { en: 'Your savings fall 20% in a month. What feels most like you?', de: 'Dein Erspartes fällt in einem Monat um 20 %. Was passt am ehesten zu dir?',
      o: [['C', 'Move to cash so it stops hurting', 'In Bargeld wechseln, damit es aufhört'], ['F', 'Look for what is falling fastest to buy or sell', 'Schauen, was am stärksten fällt, und handeln'], ['S', 'Keep my plan and check again later', 'Beim Plan bleiben und später prüfen']] },
    { en: 'Everyone is talking about one booming sector.', de: 'Alle reden über eine boomende Branche.',
      o: [['F', 'Get in before I miss it', 'Schnell einsteigen, bevor ich es verpasse'], ['C', 'Stay away, booms feel risky', 'Fernbleiben, Booms wirken riskant'], ['S', 'Keep my usual mix', 'Meine übliche Mischung behalten']] },
    { en: 'Which matters more for your retirement money?', de: 'Was ist dir bei deinem Altersgeld wichtiger?',
      o: [['C', 'Knowing I cannot lose what I paid in', 'Sicher sein, nichts Eingezahltes zu verlieren'], ['S', 'Growth over decades, even with ups and downs', 'Wachstum über Jahrzehnte, trotz Schwankungen'], ['F', 'Being able to change it whenever I want', 'Jederzeit alles ändern können']] },
    { en: 'How often did headlines change your choices in Episode 1?', de: 'Wie oft haben Schlagzeilen in Episode 1 deine Entscheidungen geändert?',
      o: [['F', 'Often', 'Oft'], ['S', 'Rarely', 'Selten'], ['C', 'They mostly made me wait', 'Sie ließen mich meist abwarten']] },
    { en: 'Spreading money across different districts felt…', de: 'Geld auf verschiedene Viertel zu verteilen fühlte sich an…',
      o: [['S', 'Natural', 'Selbstverständlich'], ['C', 'Uncomfortable, I prefer one safe place', 'Unangenehm, lieber ein sicherer Ort'], ['F', 'Slow, I prefer the strongest district', 'Langsam, lieber das stärkste Viertel']] },
    { en: 'A reward that arrives in 30 years feels…', de: 'Eine Belohnung in 30 Jahren fühlt sich an…',
      o: [['F', 'Too far away to care about', 'Zu weit weg, um sich zu kümmern'], ['S', 'Worth waiting for', 'Das Warten wert'], ['C', 'Uncertain, things might change', 'Unsicher, es kann sich alles ändern']] },
    { en: 'A yearly fee of 1% sounds…', de: 'Eine jährliche Gebühr von 1 % klingt…',
      o: [['F', 'Tiny, not worth thinking about', 'Winzig, nicht der Rede wert'], ['S', 'Important over many years', 'Über viele Jahre wichtig'], ['C', 'Fine if the product feels safe', 'Okay, wenn das Produkt sicher wirkt']] },
    { en: 'How well do you know Germany’s three pension pillars?', de: 'Wie gut kennst du die drei Säulen der deutschen Altersvorsorge?',
      o: [['C', 'Not really, it feels complicated', 'Kaum, es wirkt kompliziert'], ['F', 'I know the basics, details can wait', 'Grundlagen ja, Details später'], ['S', 'Fairly well, I want the gaps filled', 'Ziemlich gut, ich will Lücken schließen']] },
    { en: 'When a pension rule changes, you usually…', de: 'Wenn sich eine Rentenregel ändert, …',
      o: [['C', 'Worry and wait for someone to explain', 'sorge ich mich und warte auf Erklärungen'], ['F', 'React to the first article I read', 'reagiere ich auf den ersten Artikel'], ['S', 'Check if it is law or just a proposal', 'prüfe ich, ob es Gesetz oder Vorschlag ist']] },
    { en: 'What helps you learn best?', de: 'Womit lernst du am besten?',
      o: [['C', 'Calm step-by-step explanations', 'Ruhige Schritt-für-Schritt-Erklärungen'], ['F', 'Quick practice with instant feedback', 'Schnelle Übungen mit sofortigem Feedback'], ['S', 'Real examples I can compare', 'Echte Beispiele zum Vergleichen']] }
  ];
  // Neutral, label-free summaries per route (players never see a category name).
  var SUM = {
    C: { en: 'You protect what you have and think carefully before acting. Next, we practise how time and spreading money can make careful saving work harder — including the risk of playing it too safe.', de: 'Du schützt, was du hast, und denkst gründlich nach. Als Nächstes üben wir, wie Zeit und Streuung vorsichtiges Sparen stärker machen – auch das Risiko, zu vorsichtig zu sein.' },
    F: { en: 'You notice change quickly and like to act. Next, we practise separating useful pension information from noise, and how steady habits can beat quick moves.', de: 'Du bemerkst Veränderungen schnell und handelst gern. Als Nächstes üben wir, nützliche Renteninfos von Rauschen zu trennen und wie stetige Gewohnheiten schnelle Züge schlagen.' },
    S: { en: 'You are patient and consistent. Next, we turn those habits into a complete plan: subsidies, costs and how the three pillars fit together.', de: 'Du bist geduldig und beständig. Als Nächstes machen wir daraus einen vollständigen Plan: Zulagen, Kosten und wie die drei Säulen zusammenpassen.' }
  };

  // ---- Levels. Each task option: [text en, text de, base points, route that earns +5 bonus, feedback en, feedback de]
  // Facts are identical for everyone; only bonus points and the coaching line change by route.
  var B = { LAW: ['LAW', 'GESETZ'], EFF: ['EFFECTIVE 2027', 'AB 2027'], PROP: ['PROPOSAL', 'VORSCHLAG'] };
  var LV = [
    { id: 1, badge: 'EFF', viz: 'subsidy',
      t: ['The Altersvorsorgedepot arrives', 'Das Altersvorsorgedepot kommt'],
      i: ['From 1 January 2027, a new state-supported private retirement account starts. The state adds money on top of what you pay in. Move the slider to see how.', 'Ab 1. Januar 2027 startet ein neues staatlich gefördertes privates Altersvorsorgedepot. Der Staat legt Geld auf deine Einzahlung drauf. Bewege den Regler.'],
      coach: { C: ['The 0% guarantee option is not “gambling”: over decades, an overly safe choice can quietly lose to inflation.', 'Die Option ohne Garantie ist kein „Glücksspiel“: Über Jahrzehnte kann zu viel Sicherheit still gegen die Inflation verlieren.'],
               F: ['The subsidy rewards steady yearly contributions, not clever timing.', 'Die Zulage belohnt stetige jährliche Beiträge, kein geschicktes Timing.'],
               S: ['You already save steadily — the question is whether you collect the full subsidy.', 'Du sparst schon stetig – die Frage ist, ob du die volle Zulage mitnimmst.'] },
      tasks: [
        { q: ['Lena (25) can save €150 a month. How much does the state add per year?', 'Lena (25) kann 150 € im Monat sparen. Wie viel legt der Staat pro Jahr drauf?'],
          o: [['€180', '180 €', 0, null, 'That is the subsidy at €360/year. She pays €1,800/year.', 'Das ist die Zulage bei 360 €/Jahr. Sie zahlt 1.800 €/Jahr.'],
              ['€540', '540 €', 10, 'S', 'Right: 50 cents per € up to €360, then 25 cents up to €1,800 = €540. €2,340 invested before any market return.', 'Richtig: 50 Cent pro € bis 360 €, dann 25 Cent bis 1.800 € = 540 €. 2.340 € angelegt vor jeder Rendite.'],
              ['€900', '900 €', 0, null, 'Too high: the basic subsidy is capped at €540 a year.', 'Zu hoch: Die Grundzulage ist auf 540 € im Jahr begrenzt.']] },
        { q: ['Lena retires in 42 years. Which product type fits her long horizon?', 'Lena geht in 42 Jahren in Rente. Welche Produktart passt zu ihrem langen Horizont?'],
          o: [['Altersvorsorgedepot (no guarantee, higher growth potential)', 'Altersvorsorgedepot (keine Garantie, höheres Wachstumspotenzial)', 10, 'C', 'A long horizon gives time to recover from falls. Ups and downs still happen.', 'Ein langer Horizont gibt Zeit, sich von Einbrüchen zu erholen. Schwankungen bleiben.'],
              ['Garantieprodukt 80%', 'Garantieprodukt 80 %', 6, null, 'A middle path: some protection, less growth potential.', 'Ein Mittelweg: etwas Schutz, weniger Wachstumspotenzial.'],
              ['Garantieprodukt 100%', 'Garantieprodukt 100 %', 3, null, 'Full protection costs growth. Over 42 years that gap can become large.', 'Voller Schutz kostet Wachstum. Über 42 Jahre kann die Lücke groß werden.']] },
        { q: ['A headline says “New pension account will collapse!” What do you check first?', 'Eine Schlagzeile: „Neues Rentenkonto wird scheitern!“ Was prüfst du zuerst?'],
          o: [['Close my account immediately', 'Sofort kündigen', 0, null, 'Acting on one headline is how noise becomes cost.', 'Auf eine Schlagzeile zu reagieren macht Rauschen teuer.'],
              ['Whether it is about law or a proposal, and the source', 'Ob es um Gesetz oder Vorschlag geht und wer die Quelle ist', 10, 'F', 'Yes: status and source first. The account itself is law, effective 2027.', 'Ja: zuerst Status und Quelle. Das Depot selbst ist Gesetz, gültig ab 2027.'],
              ['Ignore all pension news forever', 'Alle Rentennachrichten für immer ignorieren', 3, null, 'Some news matters — rules do change. Filter it, do not block it.', 'Manche Nachrichten zählen – Regeln ändern sich. Filtern, nicht blockieren.']] }
      ] },
    { id: 2, badge: 'LAW', viz: null,
      t: ['Three pillars, one future', 'Drei Säulen, eine Zukunft'],
      i: ['Germany has no single retirement pot. Sort each item into the pillar it belongs to.', 'Deutschland hat keinen einzigen Rententopf. Ordne jeden Punkt der richtigen Säule zu.'],
      coach: { C: ['Several sources mean one weak pillar does not sink your retirement.', 'Mehrere Quellen bedeuten: Eine schwache Säule bringt die Rente nicht zum Einsturz.'],
               F: ['Changes in one pillar rarely mean you must change all of them.', 'Änderungen an einer Säule heißen selten, dass du alle ändern musst.'],
               S: ['Knowing which pillar a rule touches is how you spot gaps in your plan.', 'Zu wissen, welche Säule eine Regel betrifft, zeigt Lücken im Plan.'] },
      sort: true,
      tasks: [
        { q: ['Earnings points (Entgeltpunkte) from your salary', 'Entgeltpunkte aus deinem Gehalt'], a: 0, r: 'S' },
        { q: ['An employer top-up to a company pension', 'Arbeitgeberzuschuss zur Betriebsrente'], a: 1, r: 'C' },
        { q: ['The new Altersvorsorgedepot', 'Das neue Altersvorsorgedepot'], a: 2, r: 'F' },
        { q: ['Today’s workers paying today’s retirees', 'Heutige Beschäftigte zahlen heutige Renten'], a: 0, r: 'C' },
        { q: ['Salary conversion arranged through your job', 'Entgeltumwandlung über den Job'], a: 1, r: 'S' },
        { q: ['A state subsidy on your own private contributions', 'Staatliche Zulage auf eigene private Beiträge'], a: 2, r: 'F' }
      ],
      pillars: [['Pillar I · Statutory', 'Säule I · Gesetzlich'], ['Pillar II · Occupational', 'Säule II · Betrieblich'], ['Pillar III · Private', 'Säule III · Privat']] },
    { id: 3, badge: 'EFF', viz: 'fees',
      t: ['Small monthly choice, long consequence', 'Kleine Monatsentscheidung, lange Wirkung'],
      i: ['The Standarddepot is capped at 1.0% yearly costs. Compare three providers over 30 years at €150 a month (5% assumed return before costs).', 'Das Standarddepot ist auf 1,0 % Kosten pro Jahr begrenzt. Vergleiche drei Anbieter über 30 Jahre mit 150 € im Monat (5 % angenommene Rendite vor Kosten).'],
      coach: { C: ['Costs are a certain loss; market falls are temporary. Cutting costs is the safest win.', 'Kosten sind ein sicherer Verlust, Markteinbrüche vorübergehend. Kosten senken ist der sicherste Gewinn.'],
               F: ['Switching often is not free. After five years you can switch for at most €150 admin — so choose calmly.', 'Häufiges Wechseln kostet. Nach fünf Jahren geht ein Wechsel für höchstens 150 € Gebühr – also ruhig wählen.'],
               S: ['Your steady saving is strong; the fee is the lever you still control.', 'Dein stetiges Sparen ist stark; die Gebühr ist der Hebel, den du noch steuerst.'] },
      tasks: [
        { q: ['Which provider leaves the most for retirement?', 'Welcher Anbieter lässt am meisten für die Rente übrig?'],
          o: [['A · 0.95% a year', 'A · 0,95 % pro Jahr', 0, null, 'Highest cost: the gap grows every year.', 'Höchste Kosten: Die Lücke wächst jedes Jahr.'],
              ['B · 0.45% a year', 'B · 0,45 % pro Jahr', 10, 'S', 'Yes. Lower costs compound in your favour.', 'Ja. Niedrige Kosten wirken über den Zinseszins für dich.'],
              ['C · 0.70% a year', 'C · 0,70 % pro Jahr', 4, null, 'Better than A, but B keeps more.', 'Besser als A, aber B lässt mehr übrig.']] },
        { q: ['Markets fall 25% in year 12. What protects Lena’s plan most?', 'Im Jahr 12 fallen die Märkte um 25 %. Was schützt Lenas Plan am meisten?'],
          o: [['Stop contributions until it recovers', 'Beiträge stoppen, bis es sich erholt', 0, null, 'She would miss cheaper prices and lose subsidy for that year.', 'Sie verpasst günstige Kurse und die Zulage für das Jahr.'],
              ['Keep the monthly contribution going', 'Monatsbeitrag weiterlaufen lassen', 10, 'F', 'Steady contributions buy more when prices are low.', 'Stetige Beiträge kaufen mehr, wenn Kurse niedrig sind.'],
              ['Switch everything to the 100% guarantee', 'Alles in die 100-%-Garantie wechseln', 3, 'C', 'Locks in the fall and lowers future growth. Near retirement, the Standarddepot shifts to safer funds anyway.', 'Macht den Verlust fest und senkt Wachstum. Kurz vor Rente schichtet das Standarddepot ohnehin um.']] }
      ] }
  ];

  function el(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
  function eur(v, de) { return de ? Math.round(v).toLocaleString('de-DE') + ' €' : '€' + Math.round(v).toLocaleString('en-GB'); }
  function subsidy(y) { return Math.min(y, 360) * 0.5 + Math.max(0, Math.min(y, 1800) - 360) * 0.25; }
  function fvNet(m, y, cost) { var r = (0.05 - cost) / 12, n = y * 12; return m * ((Math.pow(1 + r, n) - 1) / r); }
  function route(answers) { var c = { C: 0, F: 0, S: 0 }; answers.forEach(function (a) { if (a) c[a]++; }); return Object.keys(c).sort(function (a, b) { return c[b] - c[a]; })[0]; }

  var state = window.WS_ep2 = window.WS_ep2 || { route: 'S', points: 0, answers: [] };

  function open(lang, start) {
    var de = lang === 'de', L = de ? 1 : 0;
    var X = de ? { next: 'Weiter →', home: 'Zur Startseite', pts: 'Punkte', priv: 'Deine Antworten bleiben auf diesem Gerät und verschwinden beim Schließen.', of: 'von' }
               : { next: 'Continue →', home: 'Back to home', pts: 'points', priv: 'Your answers stay on this device and are gone when you close the game.', of: 'of' };
    if (!document.getElementById('ep2-css')) { var st = document.createElement('style'); st.id = 'ep2-css'; st.textContent = css; document.head.appendChild(st); }
    var root = document.getElementById('ep2'); if (root) root.remove();
    root = el('<div id="ep2" role="dialog" aria-modal="true"><div class="wrap"></div></div>');
    root.style.setProperty('--ws-text', String(window.WS_userText || 1));
    document.body.appendChild(root);
    var wrap = root.firstChild;
    function show(h) { wrap.innerHTML = h; root.scrollTop = 0; }
    function head(eye) { return '<span class="pts">' + state.points + ' ' + X.pts + '</span><div class="eyebrow">' + eye + '</div>'; }

    function intake(i) {
      if (i === 0) state.answers = [];
      var q = Q[i];
      show('<div class="card">' + '<div class="eyebrow">' + (de ? 'Feedback · Frage ' : 'Feedback · Question ') + (i + 1) + ' ' + X.of + ' 10</div>' +
        '<div class="prog"><i style="width:' + (i * 10) + '%"></i></div><h2>' + (de ? q.de : q.en) + '</h2><div class="opts">' +
        q.o.map(function (o, k) { return '<button class="chip" data-k="' + k + '">' + o[1 + L] + '</button>'; }).join('') + '</div>' +
        (i === 0 ? '<p class="note">' + X.priv + '</p>' : '') +
        '<div class="actions"><button class="btn" data-a="n" disabled>' + X.next + '</button></div></div>');
      var pick = null, nb = wrap.querySelector('[data-a=n]');
      wrap.querySelectorAll('.chip').forEach(function (b) { b.onclick = function () { wrap.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('on', c === b); }); pick = q.o[+b.dataset.k][0]; nb.disabled = false; }; });
      nb.onclick = function () { state.answers[i] = pick; if (i < 9) intake(i + 1); else summary(); };
    }
    function summary() {
      state.route = route(state.answers); state.points = 0;
      show('<div class="card"><div class="eyebrow">' + (de ? 'Danke für dein Feedback' : 'Thank you for your feedback') + '</div><h2>' + (de ? 'Was wir gesehen haben' : 'What we noticed') + '</h2><p>' + SUM[state.route][L ? 'de' : 'en'] + '</p>' +
        '<div class="actions"><button class="btn" data-a="n">' + (de ? 'Gelesen →' : 'I have read this →') + '</button></div></div>');
      wrap.querySelector('[data-a=n]').onclick = ready;
    }
    function ready() {
      show('<div class="card"><div class="eyebrow">Episode 2</div><h2>' + (de ? 'Dein nächstes Lernspiel ist bereit' : 'Your next education game is ready') + '</h2><p>' +
        (de ? 'Es ist auf deine Entscheidungen, Stärken und Übungsfelder abgestimmt. Du erkundest, wie Rentenentscheidungen im Alltag funktionieren.' : 'It has been shaped around the decisions, strengths, and areas you can practise further. You will explore how retirement choices work in everyday life.') +
        '</p><div class="actions"><button class="btn" data-a="n">' + (de ? 'Episode 2 starten' : 'Start Episode 2') + '</button></div></div>');
      wrap.querySelector('[data-a=n]').onclick = function () { level(0); };
    }

    function vizHtml(lv) {
      if (lv.viz === 'subsidy') return '<label><b>' + (de ? 'Eigener Beitrag pro Monat: ' : 'Own contribution per month: ') + '<span id="v-m"></span></b><input id="v-r" type="range" min="10" max="200" step="10" value="150"></label><div class="bars" id="v-b"></div><p class="note">' + (de ? 'Grundzulage: 50 Cent je € bis 360 €/Jahr, dann 25 Cent bis 1.800 €/Jahr (max. 540 €).' : 'Basic subsidy: 50 cents per € up to €360/year, then 25 cents up to €1,800/year (max €540).') + '</p>';
      if (lv.viz === 'fees') return '<div class="bars" id="v-b"></div><p class="note">' + (de ? 'Nur zur Veranschaulichung, keine Prognose oder Beratung. Zulagen nicht eingerechnet.' : 'Illustration only, not a forecast or advice. Subsidies not included.') + '</p>';
      return '';
    }
    function drawViz(lv) {
      var b = wrap.querySelector('#v-b'); if (!b) return;
      if (lv.viz === 'subsidy') {
        var r = wrap.querySelector('#v-r');
        var draw = function () {
          var m = +r.value, y = m * 12, s = subsidy(y), max = 200 * 12 + 540;
          wrap.querySelector('#v-m').textContent = eur(m, de);
          b.innerHTML = [[de ? 'Du zahlst' : 'You pay', y, 'paid'], [de ? 'Staat legt drauf' : 'State adds', s, 'sub'], [de ? 'Angelegt' : 'Invested', y + s, 'grow']].map(function (c) {
            return '<div class="bar"><b>' + eur(c[1], de) + '</b><div class="seg ' + c[2] + '" style="height:' + (c[1] / max * 80) + '%"></div><div>' + c[0] + '</div></div>';
          }).join('');
        };
        r.oninput = draw; draw();
      } else {
        var paid = 150 * 360, vals = [['A 0.95%', 0.0095], ['B 0.45%', 0.0045], ['C 0.70%', 0.007]].map(function (p) { return [p[0], fvNet(150, 30, p[1])]; }), max = vals[1][1];
        b.innerHTML = vals.map(function (v) { return '<div class="bar"><b>' + eur(v[1], de) + '</b><div class="seg grow" style="height:' + ((v[1] - paid) / max * 85) + '%"></div><div class="seg paid" style="border-radius:0;height:' + (paid / max * 85) + '%"></div><div>' + (de ? v[0].replace('.', ',') : v[0]) + '</div></div>'; }).join('');
      }
    }

    function level(n) {
      var lv = LV[n], gained = 0;
      var eye = 'Episode 2 · Level ' + lv.id;
      show('<div class="card">' + head(eye) + '<h2><span class="badge ' + lv.badge + '">' + B[lv.badge][L] + '</span>' + lv.t[L] + '</h2><p>' + lv.i[L] + '</p>' + vizHtml(lv) +
        '<div class="actions"><button class="btn" data-a="n">' + (de ? 'Üben →' : 'Practise →') + '</button></div></div>');
      drawViz(lv);
      wrap.querySelector('[data-a=n]').onclick = function () { task(0); };

      function finishTask(pts, fb, i) {
        gained += pts; state.points += pts;
        var card = wrap.querySelector('.card');
        card.querySelector('.pts').textContent = state.points + ' ' + X.pts;
        card.insertAdjacentHTML('beforeend', '<div class="fb"><b>+' + pts + ' ' + X.pts + '</b> · ' + fb + '</div><div class="actions"><button class="btn" data-a="n">' + X.next + '</button></div>');
        card.querySelector('[data-a=n]').onclick = function () { if (i + 1 < lv.tasks.length) task(i + 1); else debrief(); };
      }
      function task(i) {
        var t = lv.tasks[i];
        var opts = lv.sort ? lv.pillars.map(function (p, k) { return [p[0], p[1], k]; }) : t.o;
        show('<div class="card">' + head(eye + ' · ' + (i + 1) + ' ' + X.of + ' ' + lv.tasks.length) + '<div class="prog"><i style="width:' + (i / lv.tasks.length * 100) + '%"></i></div><h2>' + t.q[L] + '</h2><div class="opts">' +
          opts.map(function (o, k) { return '<button class="chip" data-k="' + k + '">' + o[L] + '</button>'; }).join('') + '</div></div>');
        wrap.querySelectorAll('.chip').forEach(function (b) {
          b.onclick = function () {
            var k = +b.dataset.k, pts, fb;
            wrap.querySelectorAll('.chip').forEach(function (c) { c.disabled = true; c.classList.toggle('on', c === b); });
            if (lv.sort) {
              var ok = k === t.a; pts = ok ? 5 + (t.r === state.route ? 5 : 0) : 0;
              fb = ok ? (de ? 'Richtig.' : 'Correct.') : (de ? 'Gehört zu ' : 'Belongs to ') + lv.pillars[t.a][L] + '.';
            } else {
              var o = t.o[k]; pts = o[2] + (o[2] > 0 && o[3] === state.route ? 5 : 0); fb = o[4 + L];
            }
            finishTask(pts, fb, i);
          };
        });
      }
      function debrief() {
        var last = n + 1 >= LV.length;
        show('<div class="card">' + head(eye + (de ? ' · Abschluss' : ' · Debrief')) + '<h2>' + (de ? 'Was du mitnimmst' : 'What to take away') + '</h2><p><b>+' + gained + ' ' + X.pts + '</b></p><p>' + lv.coach[state.route][L] + '</p>' +
          (last ? '<p class="note">' + (de ? 'Level 4–10 folgen bald.' : 'Levels 4–10 are coming soon.') + '</p>' : '') +
          '<div class="actions">' + (last ? '<button class="btn" data-a="h">' + X.home + '</button>' : '<button class="btn" data-a="n">' + (de ? 'Nächstes Level →' : 'Next level →') + '</button>') + '</div></div>');
        var nb = wrap.querySelector('[data-a=n]'); if (nb) nb.onclick = function () { level(n + 1); };
        var hb = wrap.querySelector('[data-a=h]'); if (hb) hb.onclick = function () { root.remove(); window.dispatchEvent(new CustomEvent('wealthsim:home')); };
      }
    }

    if (start === 'L1' || start === 'L2' || start === 'L3') { state.points = 0; level(+start[1] - 1); } else intake(0);
  }

  // Staging/preview-only shortcut: jump straight to the check-in or any level with a chosen route.
  function devMenu() {
    var h = location.hostname, q = location.search;
    if (/money-master-world\.lovable\.app$/.test(h) || document.getElementById('ep2-dev')) return;
    var d = el('<div id="ep2-dev"><button type="button">Episode 2 preview</button><div class="menu">' +
      '<select aria-label="Route"><option value="C">Route: cautious</option><option value="F">Route: fast reactor</option><option value="S" selected>Route: steady</option></select>' +
      '<button data-s="FB">Feedback check-in (10)</button><button data-s="L1">Level 1 · Altersvorsorgedepot</button><button data-s="L2">Level 2 · Three pillars</button><button data-s="L3">Level 3 · Costs</button></div></div>');
    if (!document.getElementById('ep2-css')) { var st = document.createElement('style'); st.id = 'ep2-css'; st.textContent = css; document.head.appendChild(st); }
    document.body.appendChild(d);
    d.firstChild.onclick = function () { d.classList.toggle('open'); };
    d.querySelectorAll('[data-s]').forEach(function (b) {
      b.onclick = function () { state.route = d.querySelector('select').value; d.classList.remove('open'); open(document.documentElement.lang === 'de' ? 'de' : 'en', b.dataset.s); };
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', devMenu); else devMenu();

  window.addEventListener('wealthsim:episode2', function (e) { open((e.detail && e.detail.lang) || 'en'); });
  window.WS_openEpisode2 = open;
  window.WS_ep2Route = route; window.WS_ep2Subsidy = subsidy;
})();
