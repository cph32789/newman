/* =====================================================================
   Gallery engine (shared by procedure pages and the Results gallery).
   - Renders Library cases (before/after pairs, extra views, details)
   - 18+ confirmation: Admin chooses WHICH procedures require it
     (NPS.library.ageGate.procedures, or the preview override in
     localStorage "nps.ageGate"). A case is locked when any procedure it
     belongs to requires confirmation.
   ===================================================================== */
(function () {
  'use strict';
  var NPS = window.NPS; if (!NPS) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var G = NPS.gallery = {};

  /* ---------- galleries, visibility and 18+ come from the Gallery admin layer (data/library.js) ---------- */
  G.isGated = function (c) { return NPS.library.isGated(c); };
  G.cases = function () { return NPS.library.publicCases(); };

  /* ---------- 18+ dialog ---------- */
  var verified = false; try { verified = sessionStorage.getItem('npsAge18') === '1'; } catch (e) {}
  var dlg = $('#sheet-age'), msg = $('#age-msg');
  G.verified = function () { return verified; };
  G.ask = function () { if (!verified && dlg && !dlg.open) dlg.showModal(); };
  function reveal() {
    $$('.case[data-gated]').forEach(function (c) {
      c.removeAttribute('data-gated');
      var l = $('.clock', c); if (l) l.remove();
      $$('img[data-src]', c).forEach(function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); });
    });
  }
  if (dlg) {
    $('#age-yes').addEventListener('click', function () { verified = true; try { sessionStorage.setItem('npsAge18', '1'); } catch (e) {} reveal(); dlg.close(); });
    $('#age-no').addEventListener('click', function () { msg.textContent = 'Sorry, you must be 18 or older to view these photos.'; setTimeout(function () { dlg.close(); msg.textContent = ''; }, 1800); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }
  document.addEventListener('click', function (e) { if (e.target.closest('[data-verify]') && !verified && dlg) { e.preventDefault(); dlg.showModal(); } });

  /* ---------- case markup ---------- */
  function photo(ph, label, gated) {
    var im = NPS.images[ph.image]; if (!im) return '';
    var src = gated ? 'data-src="' + im.src + '"' : 'src="' + im.src + '"';
    return '<div class="half frame"><img class="fit" ' + src + ' alt="' + esc(im.alt) + '" width="' + im.w + '" height="' + im.h + '" loading="lazy" decoding="async" style="' + NPS.fitStyle(ph) + '"><span class="lb">' + label + '</span></div>';
  }
  function pair(c, v, gated) { var view = c.views[v]; return photo(view.before, 'Before', gated) + photo(view.after, 'After', gated); }
  function info(c, link) {
    var s = c.show || {}, bits = [];
    if (c.age && s.age !== false) bits.push(c.age + ' years old');
    if (c.height && s.height !== false) bits.push(c.height);
    if (c.weight && s.weight !== false) bits.push(c.weight);
    if (c.postop && s.postop !== false) bits.push(c.postop);
    var gl = link && NPS.library.gallery(c.primary), pr = gl && gl.procedure && NPS.procedures.filter(function (p) { return p.id === gl.procedure; })[0];
    return '<div class="cinfo">' + (c.patient ? '<span class="pt">' + esc(c.patient) + '</span>' : '') + '<b>' + esc(c.title) + '</b>' + (c.addOn ? '<span class="addon">' + esc(c.addOn.charAt(0).toUpperCase() + c.addOn.slice(1)) + '</span>' : '') +
      (bits.length ? '<ul>' + bits.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') +
      (c.implant && s.implant !== false ? '<span class="implant">Implants: ' + esc(c.implant) + '</span>' : '') +
      (pr ? '<a class="clink" href="' + (window.NPS_BASE || '') + 'procedures/' + pr.id + '/">About ' + esc(pr.title.replace(/\s*\(.*\)/, '')) + ' <span aria-hidden="true">→</span></a>' : '') + '</div>';
  }

  /* Draws cases into a container. opts.links adds "About <procedure>" links. */
  G.mount = function (box, cases, opts) {
    opts = opts || {};
    box.setAttribute('data-n', Math.min(cases.length, 3));
    box.innerHTML = cases.map(function (c) {
      var gated = G.isGated(c) && !verified;
      return '<article class="case" data-case="' + c.id + '"' + (gated ? ' data-gated="1"' : '') + '><div class="pair" data-pair>' + pair(c, 0, gated) +
        (gated ? '<button class="clock" type="button" data-verify aria-label="Confirm you are 18 or older to view these photos"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><b>Photos for viewers 18+</b><span>Tap to confirm your age</span></button>' : '') + '</div>' +
        (c.views.length > 1 ? '<div class="views" role="group" aria-label="Choose a view">' + c.views.map(function (v, i) { return '<button type="button" data-view="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(v.label) + '</button>'; }).join('') + '</div>' : '') +
        info(c, opts.links) + '</article>';
    }).join('');
    $$('.case', box).forEach(function (el) {
      var c = cases.filter(function (x) { return x.id === el.getAttribute('data-case'); })[0];
      $$('[data-view]', el).forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.getAttribute('data-view'), gated = el.hasAttribute('data-gated'), p = $('[data-pair]', el), lock = $('.clock', el);
          p.innerHTML = pair(c, i, gated); if (lock) p.appendChild(lock);
          $$('[data-view]', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        });
      });
    });
  };

  /* ---------- Procedure page: its own cases ---------- */
  var pid = document.body.getAttribute('data-proc'), one = $('#cases[data-proc]');
  if (pid && one) {
    var mine = G.cases().filter(function (c) { return c.primary === pid; });
    if (mine.length) G.mount(one, mine);
    else one.innerHTML = '<div class="rempty"><b>Photos are shared in the office.</b><span>To protect patient privacy, many results are shown only during a consultation. Ask Dr. Newman to show you examples that match your goals.</span><button class="btn btn--champagne" type="button" data-toconsult="' + pid + '">Ask about results</button></div>';
  }

  /* ---------- Results gallery page ---------- */
  var page = $('#gallery'); if (!page) return;
  var CATS = [['face', 'Face', 'Face'], ['breast', 'Breast', 'Breast'], ['body', 'Body', 'Body'], ['skin', 'Skin', 'Skin & aesthetics']];   // slug, label, category name
  var all = G.cases(), state = { cat: '', proc: '' }, list = $('#gList'), chips = $('#gChips'), procs = $('#gProcs'), count = $('#gCount');
  var gal = {}; NPS.library.galleries().forEach(function (g) { gal[g.id] = g; });
  var catOf = function (c) { return (gal[c.primary] || {}).cat || ''; };
  var gname = function (id) { return (gal[id] || {}).name || id; };
  function draw() {
    var cs = all.filter(function (c) { return (!state.cat || catOf(c) === state.cat) && (!state.proc || c.primary === state.proc); });
    chips.innerHTML = '<button class="chip" type="button" data-cat="" aria-pressed="' + !state.cat + '">All <span class="n">' + all.length + '</span></button>' +
      CATS.map(function (k) {
        var n = all.filter(function (c) { return catOf(c) === k[2]; }).length, lock = all.some(function (c) { return catOf(c) === k[2] && G.isGated(c); });
        if (!n) return '';
        return '<button class="chip" type="button" data-cat="' + esc(k[2]) + '" aria-pressed="' + (state.cat === k[2]) + '">' + k[1] + (lock ? ' <span class="age">18+</span>' : '') + ' <span class="n">' + n + '</span></button>';
      }).join('');
    var ids = []; all.forEach(function (c) { if ((!state.cat || catOf(c) === state.cat) && ids.indexOf(c.primary) < 0) ids.push(c.primary); });
    procs.hidden = !state.cat || ids.length < 2;
    procs.innerHTML = '<span class="lbl">Gallery</span>' + '<button class="chip chip--sm" type="button" data-proc="" aria-pressed="' + !state.proc + '">All</button>' +
      ids.map(function (id) { return '<button class="chip chip--sm" type="button" data-proc="' + esc(id) + '" aria-pressed="' + (state.proc === id) + '">' + esc(gname(id)) + '</button>'; }).join('');
    count.textContent = cs.length + (cs.length === 1 ? ' case' : ' cases') + (state.proc ? ' · ' + gname(state.proc) : state.cat ? ' · ' + (CATS.filter(function (k) { return k[2] === state.cat; })[0] || [0, state.cat])[1] : '');
    if (!cs.length) { list.removeAttribute('data-n'); list.innerHTML = '<div class="rempty"><b>Photos are shared in the office.</b><span>To protect patient privacy, many results are shown only during a consultation. Ask Dr. Newman to show you examples that match your goals.</span><a class="btn btn--champagne" href="#consult">Ask about results</a></div>'; }
    else G.mount(list, cs, { links: true });
    if ((state.cat || state.proc) && cs.length && cs.every(G.isGated) && !verified) G.ask();
  }
  function fromHash() {
    var h = decodeURIComponent((location.hash || '').slice(1)), m = h.match(/^show-(.+)$/);
    state.proc = m && gal[m[1]] ? m[1] : ''; state.cat = state.proc ? gal[state.proc].cat : (CATS.filter(function (k) { return k[0] === h || k[2] === h; })[0] || ['', '', ''])[2];
  }
  function setHash() { var h = state.proc ? 'show-' + state.proc : state.cat ? (CATS.filter(function (k) { return k[2] === state.cat; })[0] || [''])[0] : ''; history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); }
  page.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cat]'), b = e.target.closest('[data-proc]');
    if (a && a.tagName === 'BUTTON') { state.cat = a.getAttribute('data-cat'); state.proc = ''; setHash(); draw(); }
    else if (b && b.tagName === 'BUTTON') { state.proc = b.getAttribute('data-proc'); setHash(); draw(); }
  });
  window.addEventListener('hashchange', function () { fromHash(); draw(); });
  fromHash(); draw();
})();
