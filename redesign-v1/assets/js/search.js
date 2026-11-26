/* ------------------------------------------------------------------
   Precise procedure search.
   - Understands the names people actually use ("nose job" → Nose surgery)
   - Understands goals ("droopy eyelids", "sweaty armpits", "menopause")
   - Forgives typos ("rhinoplsty")
   - Returns only what is relevant, best match first
   Pure functions; no page code. Works in the browser and in Node tests.
------------------------------------------------------------------- */
(function (root) {
  'use strict';
  var NPS = root.NPS = root.NPS || {};

  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[®™]/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function stem(t) {
    if (t.length > 5 && /ing$/.test(t)) t = t.slice(0, -3);
    else if (t.length > 4 && /ies$/.test(t)) t = t.slice(0, -3) + 'y';
    else if (t.length > 4 && /(sses|xes|ches|shes)$/.test(t)) t = t.slice(0, -2);
    else if (t.length > 3 && /[^s]s$/.test(t)) t = t.slice(0, -1);
    return t;
  }
  function toks(s) { var n = norm(s); return n ? n.split(' ').map(stem) : []; }
  var STOP = { a:1, an:1, the:1, of:1, for:1, my:1, i:1, to:1, and:1, in:1, on:1, with:1, do:1, you:1, is:1, are:1, can:1, want:1, need:1, get:1, about:1 };
  function meaningful(arr) { var m = arr.filter(function (t) { return !STOP[t]; }); return m.length ? m : arr; }

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var rowMin = cur[0];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  function tokMatch(q, t) {          // 3 = exact, 2 = prefix, 1 = fuzzy, 0 = none
    if (q === t) return 3;
    if (q.length >= 3 && t.indexOf(q) === 0) return 2;
    if (q.length >= 3 && t.length >= 4 && q.indexOf(t) === 0 && t.length >= q.length - 2) return 2;
    var max = q.length >= 8 ? 2 : (q.length >= 5 ? 1 : 0);
    if (max && lev(q, t, max) <= max) return 1;
    return 0;
  }

  /* Score one phrase (a title / alias / concern) against the query. */
  function scorePhrase(qn, qt, phrase, w) {
    var pn = phrase.n, pt = phrase.t;
    if (!pn) return 0;
    if (pn === qn) return w.exact;
    var s = 0;
    // whole-word phrase containment
    if ((' ' + pn + ' ').indexOf(' ' + qn + ' ') > -1) s = Math.max(s, w.contain);
    if (pn.indexOf(qn) === 0) s = Math.max(s, w.prefix);
    // every meaningful query token found (exact / prefix / typo)
    var total = 0, ok = 0, best = 3;
    for (var i = 0; i < qt.length; i++) {
      var m = 0;
      for (var j = 0; j < pt.length; j++) { var r = tokMatch(qt[i], pt[j]); if (r > m) m = r; if (m === 3) break; }
      if (m) { ok++; total += m; if (m < best) best = m; }
    }
    if (ok === qt.length && qt.length) {
      var tight = Math.pow(Math.min(1, qt.length / Math.max(pt.length, 1)), 0.25);
      var quality = best === 3 ? 1 : best === 2 ? 0.86 : 0.72;
      s = Math.max(s, w.tokens * tight * quality);
    } else if (ok > 0 && qt.length > 1) {
      s = Math.max(s, w.partial * (ok / qt.length));
    }
    return s;
  }

  var W = {
    title:   { exact: 100, contain: 84, prefix: 80, tokens: 70, partial: 22 },
    aka:     { exact: 98,  contain: 80, prefix: 76, tokens: 66, partial: 20 },
    concern: { exact: 74,  contain: 60, prefix: 54, tokens: 50, partial: 14 },
    text:    { exact: 0,   contain: 26, prefix: 0,  tokens: 24, partial: 8 }
  };

  var index = null;
  function build() {
    var P = NPS.procedures || [], T = NPS.topics || [];
    index = {
      procs: P.map(function (p) {
        return {
          p: p,
          title: { n: norm(p.title), t: toks(p.title) },
          aka: (p.aka || []).concat([p.title.replace(/\(.*?\)/g, '')]).map(function (a) { return { raw: a, n: norm(a), t: toks(a) }; }),
          concern: (p.concerns || []).map(function (a) { return { raw: a, n: norm(a), t: toks(a) }; }),
          text: { n: norm(p.blurb + ' ' + p.detail), t: toks(p.blurb + ' ' + p.detail) }
        };
      }),
      topics: T.map(function (t) {
        return { t: t, title: { n: norm(t.title), t: toks(t.title) }, aka: (t.aka || []).map(function (a) { return { raw: a, n: norm(a), t: toks(a) }; }) };
      })
    };
  }

  var CATS = { face: 'Face', faces: 'Face', facial: 'Face', breast: 'Breast', breasts: 'Breast', body: 'Body', skin: 'Skin & aesthetics', aesthetics: 'Skin & aesthetics', 'skin and aesthetics': 'Skin & aesthetics' };

  function search(query, opts) {
    opts = opts || {};
    if (!index) build();
    var qn = norm(query);
    if (!qn) return { procedures: [], topics: [], query: '' };
    var qtAll = toks(query), qt = meaningful(qtAll);
    var out = [];

    index.procs.forEach(function (e) {
      var best = 0, why = null, field = '';
      var s = scorePhrase(qn, qt, e.title, W.title);
      if (s > best) { best = s; field = 'title'; }
      e.aka.forEach(function (a) { var v = scorePhrase(qn, qt, a, W.aka); if (v > best) { best = v; field = 'aka'; why = a.raw; } });
      e.concern.forEach(function (a) { var v = scorePhrase(qn, qt, a, W.concern); if (v > best) { best = v; field = 'concern'; why = a.raw; } });
      var tv = scorePhrase(qn, qt, e.text, W.text); if (tv > best) { best = tv; field = 'text'; why = null; }
      // category browsing ("breast", "face")
      if (CATS[qn] && CATS[qn] === e.p.cat) { if (best < 58) { best = 58; field = 'cat'; } }
      if (best > 0) best += (10 - Math.min(e.p.pri || 9, 10)) * 0.45;   // tiny popularity nudge for ties
      if (best >= 20) out.push({ item: e.p, score: best, field: field, why: why });
    });
    out.sort(function (a, b) { return b.score - a.score; });

    var top = out.length ? out[0].score : 0;
    var floor = Math.max(30, top * 0.5);
    var res = out.filter(function (r) { return r.score >= floor; }).slice(0, opts.limit || 7);

    // hint text: show the name the person used when it differs from our title
    res.forEach(function (r) {
      r.tier = (r.score >= top * 0.9) ? 'best' : 'related';
      if (r.field === 'aka' && r.why && norm(r.why) !== norm(r.item.title)) r.hint = 'Also called “' + r.why + '”';
      else if (r.field === 'concern' && r.why) r.hint = 'For “' + r.why + '”';
      else r.hint = '';
    });

    var byId = {}; (NPS.procedures || []).forEach(function (p) { byId[p.id] = p; });
    var topics = [];
    index.topics.forEach(function (e) {
      var best = scorePhrase(qn, qt, e.title, W.title);
      e.aka.forEach(function (a) { var v = scorePhrase(qn, qt, a, W.aka); if (v > best) best = v; });
      if (best >= 56) topics.push({ item: e.t, score: best, picks: (e.t.picks || []).map(function (id) { return byId[id]; }).filter(Boolean) });
    });
    topics.sort(function (a, b) { return b.score - a.score; });
    return { procedures: res, topics: topics.slice(0, 2), query: query };
  }

  NPS.search = search;
  NPS.searchNorm = norm;
  NPS.searchReset = function () { index = null; };
  if (typeof module !== 'undefined' && module.exports) module.exports = search;
})(typeof window !== 'undefined' ? window : globalThis);
