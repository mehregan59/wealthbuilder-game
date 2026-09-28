// WealthSim behavioural assessment — pure logic, no Phaser.
// Used by ProfileScene (results + "How we got this" panel) and by the
// automated tests in tests/. Every score is either derived from a recorded
// choice or null ("not observed"); missing data never becomes a neutral 50.

const Assessment = {
  MAPS: {
    risk:   { safe: 20, balanced: 52, aggressive: 88 },
    riskStated: { safe: 20, balanced: 52, aggressive: 88 },
    loss:   { cancel: 90, wait: 70, continue: 30, invest_more: 12 },
    lossStated: { stop: 90, wait: 60, research: 28 },
    patience: { festival: 20, university: 88 },
    patienceStated: { impatient: 20, moderate: 55, patient: 88 },
    greed:  { all_in: 95, increase: 66, hold: 26, reduce: 12 },
    resilience: { hold: 90, rebalance: 86, opportunistic: 76, safe_haven: 44, sell_all: 14 },
    learning: { accept: 60, independent: 60, decline: 50 },
    noise:  { sell: 90, reduce: 56, hold: 22, invest_more: 70 },
    // Level 9 — disposition effect
    dispPair: { sell_winner: 75, sell_loser: 25 },
    dispTwin: { sell_gain: 85, sell_loss: 45, either: 15 }
  },

  // Level 10 forecasts. Outcomes are fixed so every replay faces the same facts.
  FORECASTS: [
    { id: 'f1', q: 'Will the housing district gain value next year?', outcome: true },
    { id: 'f2', q: 'Will energy costs fall by more than 10% next year?', outcome: false },
    { id: 'f3', q: 'Will the technology district outperform transport next year?', outcome: false },
    { id: 'f4', q: 'Will citizen happiness end the year higher than it started?', outcome: true }
  ],
  PRACTICE: { id: 'p1', q: 'Will the transport district recover its losses within two years?', outcome: true },

  // Six cubes over four districts: the most even split is 2/2/1/1 (HHI 0.2778).
  MIN_HHI: 0.2778,

  level3Loss(placedCubes) {
    const exposed = Math.max(0, placedCubes | 0) * 100;
    return { exposed, lost: Math.round(exposed * 0.4) };
  },

  diversification(districtIds) {
    if (!districtIds || !districtIds.length) return null;
    const counts = {};
    districtIds.forEach(k => { counts[k] = (counts[k] || 0) + 1; });
    const vals = Object.values(counts), total = vals.reduce((a, b) => a + b, 0);
    const hhi = vals.reduce((s, v) => s + Math.pow(v / total, 2), 0);
    return Math.round(Math.max(0, Math.min(100, (1 - hhi) / (1 - this.MIN_HHI) * 100)));
  },

  // conf: 50..100 (probability the chosen answer is right). pick: true/false/null (50/50).
  forecastResult(entries) {
    const valid = (entries || []).filter(e => e && typeof e.conf === 'number');
    if (!valid.length) return null;
    let hits = 0, confSum = 0;
    valid.forEach(e => {
      confSum += e.conf;
      if (e.pick === null || e.pick === undefined) hits += 0.5;
      else if (e.pick === e.outcome) hits += 1;
    });
    const avgConf = confSum / valid.length / 100;
    const hitRate = hits / valid.length;
    const gap = avgConf - hitRate;
    return {
      n: valid.length, hits, avgConf, hitRate, gap,
      overconfidence: Math.round(Math.max(0, Math.min(100, gap * 200)))
    };
  },

  computeScores(D, A) {
    D = D || []; A = A || [];
    const M = this.MAPS;
    const finalOf = (n, filter) => (D.filter(d => d.level === n && d.value !== 'research' && d.phase !== 'repair' && (!filter || filter(d))).pop() || {}).value;
    const researched = n => D.some(d => d.level === n && d.value === 'research');
    const pickV = (map, v) => (v === undefined ? null : (map[v] !== undefined ? map[v] : null));
    const pick = (map, n, f) => pickV(map, finalOf(n, f));
    const blend = (game, map, ans) => { if (game === null) return null; const st = map[ans]; return st === undefined ? game : Math.round(game * 0.8 + st * 0.2); };

    const risk = blend(pick(M.risk, 1), M.riskStated, A[0]);
    const loss = blend(pick(M.loss, 2, d => !d.phase || d.phase === 'dip'), M.lossStated, A[2]);
    const pat = blend(pick(M.patience, 4), M.patienceStated, A[1]);
    const greed = pick(M.greed, 5);
    const resil = pick(M.resilience, 8);

    const read6 = researched(6), read7 = researched(7);
    let learn = pick(M.learning, 6);
    if (learn !== null && read6) learn = Math.min(100, learn + 25);

    let noise = pick(M.noise, 7);
    if (noise !== null && read7) noise = Math.max(6, noise - 20);

    const divers = this.diversification(D.filter(d => d.level === 3).map(d => d.districtId || d.value));

    const p9 = pick(M.dispPair, 9, d => d.phase === 'pair');
    const t9 = pick(M.dispTwin, 9, d => d.phase === 'twin');
    const dispParts = [p9, t9].filter(v => v !== null);
    const disposition = dispParts.length ? Math.round(dispParts.reduce((a, b) => a + b, 0) / dispParts.length) : null;

    const fc = this.forecastResult(D.filter(d => d.level === 10 && d.phase === 'forecast'));
    const overconfidence = fc ? fc.overconfidence : null;

    const all = [risk, loss, pat, divers, greed, noise, learn, resil, disposition, overconfidence];
    return {
      riskPreference: risk, lossAversion: loss, patience: pat, diversification: divers,
      greedFomo: greed, reactionToNoise: noise, learning: learn, resilience: resil,
      disposition, overconfidence,
      _researched: read6 || read7, _forecast: fc,
      _observed: all.filter(v => v !== null).length
    };
  },

  personaKey(s) {
    const v = k => s[k]; const has = (...k) => k.every(x => s[x] !== null && s[x] !== undefined);
    if (s._observed < 4) return 'insufficient';
    if (has('reactionToNoise', 'greedFomo') && v('reactionToNoise') > 70 && v('greedFomo') > 60) return 'reactor';
    if (has('patience', 'greedFomo') && v('patience') < 36 && v('greedFomo') > 62) return 'sprinter';
    if (has('riskPreference', 'lossAversion') && v('riskPreference') < 36 && v('lossAversion') > 64) return 'guardian';
    if (has('riskPreference', 'greedFomo') && v('riskPreference') > 68 && v('greedFomo') > 58) return 'challenger';
    if (has('patience', 'reactionToNoise', 'resilience', 'diversification') && v('patience') > 62 && v('reactionToNoise') < 42
        && v('resilience') > 62 && v('diversification') >= 60 && s._researched) return 'strategist';
    return 'explorer';
  },

  // Plain-language "what you did -> how it was read" rows for the details panel.
  evidence(D, A, s) {
    D = D || []; A = A || [];
    const last = (n, f) => D.filter(d => d.level === n && (!f || f(d))).pop();
    const LBL = {
      safe: 'Safe & Steady (housing)', balanced: 'a balanced district', aggressive: 'High Potential (technology)',
      cancel: 'cancel / sell', wait: 'wait', continue: 'continue as planned', invest_more: 'invest more',
      festival: 'Festival Square', university: 'Research University',
      all_in: 'All in', increase: 'Invest more', hold: 'Hold / stay steady', reduce: 'Reduce / take profits',
      accept: 'accept the offer', independent: 'build your own', decline: 'decline both',
      sell: 'Sell tech', sell_all: 'Sell all', rebalance: 'Rebalance', opportunistic: 'Buy the dip',
      sell_winner: 'sold the project in profit', sell_loser: 'sold the project at a loss',
      sell_gain: 'sold the twin bought cheaply (in profit)', sell_loss: 'sold the twin bought expensively (at a loss)',
      either: 'treated the twins as equal'
    };
    const L = v => LBL[v] || v;
    const rows = [];
    const add = (trait, did, how) => rows.push({ trait, did, how });

    const l1 = last(1);
    add('Risk preference', l1 ? 'Level 1: you built first in ' + L(l1.value) + '.' : null,
      'Safer first district = lower, riskier = higher. Your starting answer nudges it by 20%.');
    const dip = last(2, d => d.phase === 'dip' || !d.phase), news = last(2, d => d.phase === 'news');
    add('Loss aversion', dip ? 'Level 2: after a drop with no real news you chose to ' + L(dip.value) + '.' : null,
      'Pulling out of a temporary dip scores high; staying the course scores low.');
    const l3 = D.filter(d => d.level === 3);
    if (l3.length) {
      const c = {}; l3.forEach(d => { const k = d.districtId || '?'; c[k] = (c[k] || 0) + 1; });
      add('Diversification', 'Level 3: you placed ' + l3.length + ' cubes: ' + Object.entries(c).map(([k, n]) => n + ' in ' + k).join(', ') + '.',
        'The more evenly the six cubes are spread, the higher. 2/2/1/1 is the maximum.');
    } else add('Diversification', null, 'Measured from how the six cubes were spread.');
    const l4 = last(4, d => d.phase !== 'repair');
    add('Patience', l4 ? 'Level 4: you built the ' + L(l4.value) + '.' : null,
      'The later, bigger reward (University) scores high. Fixing the burst pipe is never counted as impatience.');
    const l5 = last(5);
    add('FOMO response', l5 ? 'Level 5: during the boom you chose ' + L(l5.value) + '.' : null,
      'Piling in after prices already rose scores high.');
    const l7 = last(7, d => d.value !== 'research');
    add('Reaction to news', l7 ? 'Level 7: under loud headlines you chose ' + L(l7.value) + (D.some(d => d.level === 7 && d.value === 'research') ? ', after reading the report.' : ', without reading the report.') : null,
      'Big moves on headlines score high; reading the free report first lowers it.');
    const l6 = last(6, d => d.value !== 'research');
    add('Adaptability', l6 ? 'Level 6: you chose to ' + L(l6.value) + (D.some(d => d.level === 6 && d.value === 'research') ? ' after researching first.' : ' without researching.') + (news ? ' Level 2 real news: you chose to ' + L(news.value) + '.' : '') : null,
      'Gathering information before deciding raises this.');
    const l8 = last(8);
    add('Resilience', l8 ? 'Level 8: in the storm you chose ' + L(l8.value) + '.' : null,
      'Keeping structure intact through a downturn scores high; selling everything scores low.');
    const p9 = last(9, d => d.phase === 'pair'), t9 = last(9, d => d.phase === 'twin');
    add('Selling winners vs losers', (p9 || t9) ? 'Level 9: you ' + [p9 && L(p9.value), t9 && L(t9.value)].filter(Boolean).join('; then you ') + '.' : null,
      'Selling what is up and keeping what is down — or letting the purchase price decide between identical projects — raises this.');
    const fc = s && s._forecast;
    const pr = last(10, d => d.phase === 'practice');
    add('Overconfidence', fc ? 'Level 10: average confidence ' + Math.round(fc.avgConf * 100) + '%, correct ' + fc.hits + ' of ' + fc.n + ' (' + Math.round(fc.hitRate * 100) + '%).' + (pr ? ' Practice round confidence: ' + pr.conf + '%.' : '') : null,
      'Confidence above your hit rate raises this. Four forecasts show this session only, not a trait.');
    return rows;
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = Assessment;
