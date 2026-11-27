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
  /* Team: Admin ("Team") saves { order:[ids], members:{ id:{...fields, hidden, deleted, custom} } } */
  if (NPS.team && NPS.team.members) {
    NPS.teamBase = JSON.parse(JSON.stringify(NPS.team));
    var te = read('nps.team');
    if (te && te.members) {
      var list = NPS.team.members.map(function (m) { return Object.assign({}, m, te.members[m.id] || {}); });
      Object.keys(te.members).forEach(function (id) { var e = te.members[id]; if (e && e.custom && !NPS.team.members.some(function (m) { return m.id === id; })) list.push(Object.assign({ id: id }, e)); });
      var ord = te.order || [], pos = function (id) { var i = ord.indexOf(id); return i < 0 ? 1e6 : i; };
      list = list.map(function (m, i) { m.__i = i; return m; }).sort(function (a, b) { return pos(a.id) - pos(b.id) || a.__i - b.__i; });
      NPS.team.principals = NPS.team.principals.map(function (pr) { return Object.assign({}, pr, te.members[pr.id] || {}); });
      NPS.team.members = list.filter(function (m) { return !m.hidden && !m.deleted; });
      if (te.intro != null && te.intro !== '') NPS.team.intro = te.intro;
    }
  }
  /* Reviews and Media: Admin saves { order:[ids], items:{ id:{...fields, hidden, deleted, custom} }, intro } (media has one per list) */
  function mergeList(base, saved) {
    var items = (saved && saved.items) || {};
    var list = base.map(function (b) { return Object.assign({}, b, items[b.id] || {}); });
    Object.keys(items).forEach(function (id) { var e = items[id]; if (e && e.custom && !base.some(function (b) { return b.id === id; })) list.push(Object.assign({ id: id }, e)); });
    var ord = (saved && saved.order) || [], pos = function (id) { var i = ord.indexOf(id); return i < 0 ? 1e6 : i; };
    return list.map(function (m, i) { m.__i = i; return m; }).sort(function (a, b) { return pos(a.id) - pos(b.id) || a.__i - b.__i; }).filter(function (m) { return !m.hidden && !m.deleted; });
  }
  NPS.mergeList = mergeList;
  NPS.pagesHidden = (read('nps.pages') || {}).hidden || {};
  if (NPS.reviews && NPS.reviews.items) {
    NPS.reviewsBase = JSON.parse(JSON.stringify(NPS.reviews));
    var rs = read('nps.reviews');
    if (rs) { NPS.reviews.items = mergeList(NPS.reviews.items, rs); if (rs.intro) NPS.reviews.intro = rs.intro; }
    NPS.voices = NPS.reviews.items.filter(function (r) { return r.home; }).map(function (r) { return { text: r.text, who: r.who || 'Patient review' }; });
  }
  if (NPS.media && NPS.media.articles) {
    NPS.mediaBase = JSON.parse(JSON.stringify(NPS.media));
    var ms = read('nps.media');
    if (ms) { NPS.media.articles = mergeList(NPS.media.articles, ms.articles); NPS.media.videos = mergeList(NPS.media.videos, ms.videos); if (ms.intro) NPS.media.intro = ms.intro; }
  }
  if (NPS.products && NPS.products.brands) {
    NPS.productsBase = JSON.parse(JSON.stringify(NPS.products));
    var ps = read('nps.products');
    if (ps) { NPS.products.brands = mergeList(NPS.products.brands, ps); if (ps.intro) NPS.products.intro = ps.intro; if (ps.shop) NPS.products.shop = Object.assign({}, NPS.products.shop, ps.shop); }
  }
  if (NPS.offers && NPS.offers.items) {
    NPS.offersBase = JSON.parse(JSON.stringify(NPS.offers));
    var os = read('nps.offers');
    if (os) { NPS.offers.items = mergeList(NPS.offers.items, os); if (os.intro) NPS.offers.intro = os.intro; if (os.empty) NPS.offers.empty = os.empty; }
  }
  /* Discover feed + social posts: Admin saves { cards:{order,items}, social:{order,items} } */
  if (NPS.feed && NPS.feed.length && NPS.social) {
    NPS.feedBase = JSON.parse(JSON.stringify({ feed: NPS.feed, social: NPS.social }));
    var fsv = read('nps.feed'), procOk = {}, topicOk = {};
    if (fsv) { NPS.feed = mergeList(NPS.feed, fsv.cards); NPS.social = mergeList(NPS.social, fsv.social); }
    (NPS.procedures || []).forEach(function (p) { procOk[p.id] = 1; }); (NPS.topics || []).forEach(function (t) { topicOk[t.id] = 1; });
    function pic(o, key) { if (o.image) { NPS.images[key] = { src: o.image, w: o.w || 800, h: o.h || 800, alt: '' }; o.img = key; } }
    NPS.social = NPS.social.filter(function (x) { pic(x, 'soc-' + x.id); return procOk[x.ref] && (!x.img || NPS.images[x.img]); });
    NPS.feed = NPS.feed.filter(function (c) {
      c.tags = Array.isArray(c.tags) ? c.tags : []; pic(c, 'feed-' + c.id);
      if (c.type === 'procedure') return procOk[c.ref];
      if (c.type === 'guide') return topicOk[c.ref] && c.img && NPS.images[c.img];
      if (c.type === 'social') return NPS.social.some(function (x) { return x.id === c.soc; });
      if (c.list && !c.list.length) delete c.list;
      return true;
    });
  }
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
