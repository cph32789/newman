/* =====================================================================
   Procedure page behaviour (the one standard format).
   - Sticky section tabs that follow your place on the page
   - Results: shows this procedure's visible Library cases, in order
   - 18+ confirmation before any breast photo is shown
   All content comes from /data, managed later in Admin.
   ===================================================================== */
(function () {
  'use strict';
  var NPS = window.NPS, id = document.body.getAttribute('data-proc');
  if (!NPS || !id) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Sticky section tabs ---------- */
  var tabs = $$('#ptabs nav a'), secs = tabs.map(function (a) { return $(a.getAttribute('href')); });
  function spy() {
    var line = ($('.hdr') ? $('.hdr').offsetHeight : 68) + ($('#ptabs') ? $('#ptabs').offsetHeight : 56) + 40, cur = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) cur = i; });
    tabs.forEach(function (a, i) { a.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
  }
  var tick = false;
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; spy(); }); } }, { passive: true });
  spy();

  /* ---------- Age confirmation (breast photos) ---------- */
  var verified = false; try { verified = sessionStorage.getItem('npsAge18') === '1'; } catch (e) {}
  var dlg = $('#sheet-age'), msg = $('#age-msg');
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

  /* ---------- Results: the Library ---------- */
  var box = $('#cases');
  function photo(ph, label, gated) {
    var im = NPS.images[ph.image]; if (!im) return '';
    var src = gated ? 'data-src="' + im.src + '"' : 'src="' + im.src + '"';
    return '<div class="half frame"><img class="fit" ' + src + ' alt="' + esc(im.alt) + '" width="' + im.w + '" height="' + im.h + '" loading="lazy" decoding="async" style="' + NPS.fitStyle(ph) + '"><span class="lb">' + label + '</span></div>';
  }
  function pair(c, v, gated) { var view = c.views[v]; return photo(view.before, 'Before', gated) + photo(view.after, 'After', gated); }
  function info(c) {
    var s = c.show || {}, bits = [];
    if (c.age && s.age !== false) bits.push(c.age + ' years old');
    if (c.height && s.height !== false) bits.push(c.height);
    if (c.weight && s.weight !== false) bits.push(c.weight);
    if (c.postop && s.postop !== false) bits.push(c.postop);
    return '<div class="cinfo">' + (c.patient ? '<span class="pt">' + esc(c.patient) + '</span>' : '') + '<b>' + esc(c.title) + '</b>' + (c.addOn ? '<span class="addon">' + esc(c.addOn.charAt(0).toUpperCase() + c.addOn.slice(1)) + '</span>' : '') +
      (bits.length ? '<ul>' + bits.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') +
      (c.implant && s.implant !== false ? '<span class="implant">Implants: ' + esc(c.implant) + '</span>' : '') + '</div>';
  }
  function render() {
    if (!box) return;
    var cases = (NPS.library ? NPS.library.cases : []).filter(function (c) { return c.visible !== false && c.primary === id; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    if (!cases.length) {
      box.innerHTML = '<div class="rempty"><b>Photos are shared in the office.</b><span>To protect patient privacy, many results are shown only during a consultation. Ask Dr. Newman to show you examples that match your goals.</span><button class="btn btn--champagne" type="button" data-toconsult="' + id + '">Ask about results</button></div>';
      return;
    }
    box.setAttribute('data-n', Math.min(cases.length, 3));
    box.innerHTML = cases.map(function (c) {
      var gated = !!c.ageGate && !verified;
      return '<article class="case" data-case="' + c.id + '"' + (gated ? ' data-gated="1"' : '') + '><div class="pair" data-pair>' + pair(c, 0, gated) +
        (gated ? '<button class="clock" type="button" data-verify><b>Photos for viewers 18+</b><span>Confirm your age to view</span></button>' : '') + '</div>' +
        (c.views.length > 1 ? '<div class="views" role="group" aria-label="Choose a view">' + c.views.map(function (v, i) { return '<button type="button" data-view="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(v.label) + '</button>'; }).join('') + '</div>' : '') +
        info(c) + '</article>';
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
  }
  render();
})();
