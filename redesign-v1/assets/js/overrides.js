/* Applies the practice's saved Admin edits to the site data, before the page draws itself.
   Runs in two places with the same code: in the visitor's browser (so cards, search and the
   explorer follow the edits), and inside the server's "Publish" build (so each procedure page is
   rebuilt from them). Edits live in localStorage-style keys: nps.procEdits, nps.siteEdits. */
(function () {
  'use strict';
  var NPS = window.NPS; if (!NPS || !NPS.procedures) return;
  function read(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  var cfg = window.__NPS_CFG__;
  if (cfg && NPS.site) { NPS.site.form = Object.assign({}, NPS.site.form, cfg); }
  var ed = read('nps.procEdits') || {}, ids = Object.keys(ed); if (!ids.length) return;
  var P = NPS.procedures, byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var BASE = ['title', 'cat', 'kind', 'blurb', 'detail', 'aka', 'concerns', 'img', 'related'];
  var CONTENT = ['overview', 'good', 'glance', 'timeline', 'faq'];
  NPS.procOverrides = NPS.procOverrides || {};
  ids.forEach(function (id) {
    var e = ed[id] || {}, p = byId[id];
    if (!p && e.custom) { p = { id: id, title: e.title || id, cat: e.cat || 'Face', kind: e.kind || 'non-surgical', img: e.img || 'f-glow', aka: [], concerns: [], blurb: '', detail: '', related: [], pri: 9 }; P.push(p); byId[id] = p; }
    if (!p) return;
    BASE.forEach(function (k) { if (k in e) p[k] = e[k]; });
    var o = NPS.procOverrides[id] = Object.assign({}, NPS.procOverrides[id]);
    CONTENT.forEach(function (k) { if (k in e) o[k] = e[k]; });
    if (e.hidden || e.deleted) p.__gone = true;
  });
  for (var i = P.length - 1; i >= 0; i--) if (P[i].__gone) P.splice(i, 1);
})();
