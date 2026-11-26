/* =====================================================================
   Procedure page behaviour (the one standard format).
   - Sticky section tabs that follow your place on the page
   - (Results and the 18+ confirmation are handled by gallery.js)
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

})();
