/* =====================================================================
   Newman Plastic Surgery — Redesign v1 (home page)
   Behaviour only. All words, procedures, feed cards, social posts and
   image settings live in /data and are managed in Admin later.
   ===================================================================== */
(function () {
  'use strict';
  var NPS = window.NPS, SITE = NPS.site, P = NPS.procedures, BASE = window.NPS_BASE || '';
  var HOME = !!document.getElementById('feed');   // home-only features (feed, social, reviews)
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var topicById = {}; NPS.topics.forEach(function (t) { topicById[t.id] = t; });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ic(name, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  var PLAT = { instagram: 'ig', facebook: 'fb', youtube: 'yt', pinterest: 'pin' };

  var tabs = $$('.tab[data-tab]');
  function setTab(name) { tabs.forEach(function (t) { t.setAttribute('aria-current', t.getAttribute('data-tab') === name); }); }

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 3200); }

  /* ---------- Saved list ---------- */
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem('nps.saved') || '[]').filter(function (id) { return byId[id]; }); } catch (e) { saved = []; }
  function persist() { try { localStorage.setItem('nps.saved', JSON.stringify(saved)); } catch (e) {} }
  function isSaved(id) { return saved.indexOf(id) > -1; }
  function toggleSave(id) {
    var i = saved.indexOf(id);
    if (i > -1) { saved.splice(i, 1); toast('Removed from your list'); } else { saved.push(id); toast('Saved to your list'); }
    persist(); refreshSaved();
  }
  function refreshSaved() {
    var c = $('#listCount'); c.textContent = saved.length; c.hidden = !saved.length;
    $$('[data-save]').forEach(function (b) { var on = isSaved(b.getAttribute('data-save')); b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + (byId[b.getAttribute('data-save')] || {}).title); var sv = b.querySelector('.sv'); if (sv) sv.textContent = on ? 'Saved' : 'Save'; });
    var fl = $('#formList');
    if (saved.length) { fl.hidden = false; fl.innerHTML = '<span>Your list:</span>' + saved.map(function (id) { return '<span class="chip">' + esc(byId[id].title.replace(/\s*\(.*\)/, '')) + '</span>'; }).join(''); } else { fl.hidden = true; fl.innerHTML = ''; }
    renderList();
  }
  function renderList() {
    var el = $('#lbody');
    if (!saved.length) {
      el.innerHTML = '<p class="lead" style="margin:10px 0 22px">Nothing saved yet. Tap the heart on anything that speaks to you and it will wait for you here. You can bring your list to a consultation.</p><button class="btn btn--ink" data-open="explore">Explore procedures</button>';
      return;
    }
    el.innerHTML = '<p class="lead" style="margin:6px 0 10px">Your saved ideas. We’ll add them to your consultation request.</p>' +
      saved.map(function (id) { var p = byId[id]; return '<div class="li"><div class="th frame">' + NPS.imgTag('thumb.' + id, { image: p.img, fx: 50, fy: 40 }, { alt: '' }) + '</div><button class="tx" data-detail="' + id + '"><b>' + esc(p.title) + '</b><small>' + esc(p.cat) + '</small></button><button class="act" data-save="' + id + '" aria-pressed="true" aria-label="Remove">' + ic('heart') + '</button></div>'; }).join('') +
      '<div style="margin-top:26px;display:grid;gap:12px"><button class="btn btn--ink" data-toconsult>Request a consultation</button><button class="link" data-clearlist style="justify-self:start">Clear my list</button></div>';
  }

  /* ---------- Sheets ---------- */
  var openCount = 0;
  function openSheet(id) {
    var d = $('#sheet-' + id); if (!d) return null;
    if (!d.open) { d.showModal(); openCount++; document.body.classList.add('is-locked'); }
    return d;
  }
  function closeSheet(d) { if (d && d.open) d.close(); }
  $$('dialog.sheet').forEach(function (d) {
    d.addEventListener('close', function () {
      openCount = Math.max(0, openCount - 1);
      if (!openCount) document.body.classList.remove('is-locked');
      if (d.id === 'sheet-detail' && location.hash.indexOf('#procedure/') === 0) history.replaceState(null, '', location.pathname + location.search);
    });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });   // click backdrop
  });
  function closeAll() { $$('dialog.sheet[open]').forEach(function (d) { d.close(); }); }

  /* ---------- Search (Instagram-style screen: Recent, Suggested, Explore) ---------- */
  var qEl = $('#q'), sBody = $('#sbody'), qClear = $('#qClear'), searchDlg = $('#sheet-search');
  var POP = ['Rhinoplasty', 'Breast augmentation', 'Facelift', 'Botox', 'Tummy tuck', 'Eyelid surgery', 'Lip filler', 'Microneedling'];
  var TILES = [
    { label: 'Midlife refresh', sub: 'Where to begin', q: 'menopause', image: 'cat-skin', fy: 30 },
    { label: 'Face', sub: 'Lifts, eyes, nose', explore: 'Face', image: 'cat-face', fy: 35 },
    { label: 'After pregnancy', sub: 'Mommy makeover', q: 'after baby', image: 'f-poise', fy: 35 },
    { label: 'Breast', sub: 'Lift, augment, reduce', explore: 'Breast', image: 'cat-breast', fy: 40 },
    { label: 'Glow', sub: 'Skin renewal', q: 'glow', image: 'f-glow', fy: 40 },
    { label: 'Body', sub: 'Contour and confidence', explore: 'Body', image: 'cat-body', fy: 30 }
  ];
  var recent = [];
  try { recent = JSON.parse(localStorage.getItem('nps.recent') || '[]').filter(function (r) { return r.k === 'q' || byId[r.v]; }); } catch (e) { recent = []; }
  function saveRecent() { try { localStorage.setItem('nps.recent', JSON.stringify(recent.slice(0, 8))); } catch (e) {} }
  function addRecent(kind, v) {
    v = String(v); recent = recent.filter(function (r) { return !(r.k === kind && r.v === v); });
    recent.unshift({ k: kind, v: v }); recent = recent.slice(0, 8); saveRecent();
  }
  function hl(text, q) {
    var t = esc(text); if (!q) return t;
    var words = NPS.searchNorm(q).split(' ').filter(function (w) { return w.length > 1; });
    words.forEach(function (w) { try { t = t.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); } catch (e) {} });
    return t;
  }
  function avatar(p) { return '<span class="av ring"><span class="in frame">' + NPS.imgTag('thumb.' + p.id, { image: p.img, fx: 50, fy: 40 }, { alt: '' }) + '</span></span>'; }
  function row(p, q, hint, best) {
    return '<button class="srow" data-detail="' + p.id + '">' + avatar(p) + '<span class="tx"><span class="tt">' + hl(p.title, q) + (best ? '<span class="best">Best match</span>' : '') + '</span><span class="mt">' + esc(p.cat) + ' · ' + (p.kind === 'surgical' ? 'Surgical' : 'Non-surgical') + (hint ? ' · ' + esc(hint) : '') + '</span></span></button>';
  }
  function iconRow(icon, label, sub, attrs) {
    return '<button class="srow" ' + attrs + '><span class="av">' + ic(icon) + '</span><span class="tx"><span class="tt">' + esc(label) + '</span>' + (sub ? '<span class="mt">' + esc(sub) + '</span>' : '') + '</span></button>';
  }
  function renderSearch(q) {
    q = (q || '').trim(); qClear.hidden = !q;
    if (!q) {
      var html = '';
      if (recent.length) {
        html += '<div class="shd"><h3>Recent</h3><button data-clearrecent>Clear all</button></div>' + recent.map(function (r, i) {
          var main = r.k === 'p' ? '<button class="srow" data-detail="' + r.v + '">' + avatar(byId[r.v]) + '<span class="tx"><span class="tt">' + esc(byId[r.v].title) + '</span><span class="mt">' + esc(byId[r.v].cat) + '</span></span></button>'
                                 : iconRow('search', r.v, 'Search', 'data-q="' + esc(r.v) + '"');
          return '<div class="recrow">' + main + '<button class="rx" data-rmrecent="' + i + '" aria-label="Remove from recent"><svg><use href="#i-close"/></svg></button></div>';
        }).join('');
      }
      html += '<div class="shd"><h3>Suggested</h3></div>' + POP.slice(0, 5).map(function (x) { return iconRow('search', x, '', 'data-q="' + esc(x) + '"'); }).join('');
      html += '<div class="shd"><h3>Explore</h3></div><div class="tiles">' + TILES.map(function (t, i) {
        return '<button class="tile" ' + (t.q ? 'data-q="' + esc(t.q) + '"' : 'data-explore="' + esc(t.explore) + '"') + '>' + NPS.imgTag('tile.' + i, { image: t.image, fx: 50, fy: t.fy, zoom: 1 }, { alt: '' }) + '<span><b>' + esc(t.label) + '</b><small>' + esc(t.sub) + '</small></span></button>';
      }).join('') + '</div>';
      sBody.innerHTML = html; return;
    }
    var r = NPS.search(q), out = '';
    var best = r.procedures.filter(function (x) { return x.tier === 'best'; }), rel = r.procedures.filter(function (x) { return x.tier !== 'best'; });
    r.topics.forEach(function (t) {
      out += '<div class="shd"><h3>' + esc(t.item.title) + '</h3></div><p class="sgroupt muted" style="margin-bottom:6px;font-size:15px">' + esc(t.item.blurb) + '</p>' + t.picks.map(function (p) { return row(p, '', '', false); }).join('');
    });
    if (best.length) out += best.map(function (x, i) { return row(x.item, q, x.hint, i === 0 && x.score >= 78); }).join('');
    if (rel.length) out += '<div class="shd"><h3>Also relevant</h3></div>' + rel.map(function (x) { return row(x.item, q, x.hint, false); }).join('');
    if (!best.length && !rel.length && !r.topics.length) {
      out = '<div class="sempty"><b>No results for “' + esc(q) + '”</b>Try the name of a procedure, or describe your goal in your own words. Or just ask us, and we’ll point you in the right direction.</div>' +
        POP.slice(0, 4).map(function (x) { return iconRow('search', x, 'Try this instead', 'data-q="' + esc(x) + '"'); }).join('') +
        '<div style="padding:18px 20px"><button class="btn btn--ink" data-toconsult>Ask us a question</button></div>';
    }
    sBody.innerHTML = out;
  }
  var prevTab = 'top';
  function openSearch(q) {
    var cur = tabs.filter(function (t) { return t.getAttribute('aria-current') === 'true'; })[0]; prevTab = cur ? cur.getAttribute('data-tab') : 'top';
    openSheet('search'); setTab('search'); qEl.value = q || ''; renderSearch(q || '');
    var fine = !(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    setTimeout(function () { if (fine || q) { qEl.focus(); if (q) qEl.setSelectionRange(q.length, q.length); } }, 80);
  }
  searchDlg.addEventListener('close', function () { setTab(prevTab); });
  var qT; qEl.addEventListener('input', function () { clearTimeout(qT); qT = setTimeout(function () { renderSearch(qEl.value); }, 40); });
  qClear.addEventListener('click', function () { qEl.value = ''; renderSearch(''); qEl.focus(); });
  qEl.addEventListener('keydown', function (e) {
    var rows = $$('.srow', sBody);
    if (e.key === 'Enter') { e.preventDefault(); if (rows[0]) rows[0].click(); }
    if (e.key === 'ArrowDown' && rows[0]) { e.preventDefault(); rows[0].focus(); }
  });
  sBody.addEventListener('keydown', function (e) {
    var rows = $$('.srow', sBody), i = rows.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && i > -1) { e.preventDefault(); (rows[i + 1] || rows[i]).focus(); }
    if (e.key === 'ArrowUp' && i > -1) { e.preventDefault(); (i ? rows[i - 1] : qEl).focus(); }
  });

  /* ---------- Explorer ---------- */
  var CATS = ['Face', 'Breast', 'Body', 'Skin & aesthetics'], xCat = 'All';
  function renderExplorer(cat) {
    xCat = cat || 'All';
    $('#xtabs').innerHTML = ['All'].concat(CATS).map(function (c) { return '<button class="chip" aria-pressed="' + (c === xCat) + '" data-xtab="' + esc(c) + '">' + (c === 'All' ? 'All procedures' : esc(c)) + '</button>'; }).join('');
    $('#xlist').innerHTML = CATS.filter(function (c) { return xCat === 'All' || c === xCat; }).map(function (c) {
      var items = P.filter(function (p) { return p.cat === c; }).sort(function (a, b) { return a.title.localeCompare(b.title); });
      return '<div class="xgroup"><h3>' + esc(c) + '</h3>' + items.map(function (p) { return '<button class="xrow" data-detail="' + p.id + '"><span>' + esc(p.title) + '</span><small>' + (p.kind === 'surgical' ? 'Surgical' : 'Non-surgical') + '</small></button>'; }).join('') + '</div>';
    }).join('');
  }
  function openExplorer(cat) { renderExplorer(cat); var d = openSheet('explore'); if (d) { var s = $('.scroll', d); if (s) s.scrollTop = 0; } }

  /* ---------- Share ---------- */
  function shareUrl(hash) { return location.origin + location.pathname + (hash || ''); }
  function share(title, hash, full) {
    var url = full || shareUrl(hash);
    if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { toast(url); }); } else { toast(url); }
  }

  function pageUrl(id) { return BASE + 'procedures/' + id + '/'; }
  /* ---------- Detail sheet (a quick preview of a procedure page) ---------- */
  function openDetail(id) {
    var p = byId[id]; if (!p) return;
    var soc = NPS.social.filter(function (s) { return s.ref === id; });
    var rel = (p.related || []).map(function (r) { return byId[r]; }).filter(Boolean);
    var aka = (p.aka || []).filter(function (a) { return a.toLowerCase() !== p.title.toLowerCase() && a.length < 26; }).slice(0, 4);
    $('#dcat').textContent = p.cat;
    $('#dbody').innerHTML =
      '<div class="dimg frame">' + NPS.imgTag('detail.' + id, { image: p.img, fx: 50, fy: 38 }, { eager: true }) + '</div>' +
      '<div class="dmeta"><span>' + esc(p.cat) + '</span><span>' + (p.kind === 'surgical' ? 'Surgical' : 'Non-surgical') + '</span></div>' +
      '<h2 class="dtitle">' + esc(p.title) + '</h2>' +
      '<p class="dblurb">' + esc(p.blurb) + '</p>' +
      '<p class="dtext">' + esc(p.detail) + '</p>' +
      (aka.length ? '<p class="note" style="margin-top:14px">Also known as: ' + aka.map(esc).join(', ') + '</p>' : '') +
      '<a class="btn btn--champagne" href="' + pageUrl(id) + '" style="margin-top:22px;width:100%">View the full page ' + ic('arrow') + '</a>' +
      '<div class="dacts" style="margin-top:12px"><button class="btn btn--ink" data-toconsult="' + id + '">Request a consultation</button>' +
      '<button class="btn btn--line" data-save="' + id + '" aria-pressed="' + isSaved(id) + '" aria-label="Save">' + ic('heart') + '<span class="sv">Save</span></button>' +
      '<button class="btn btn--line" data-share="' + id + '" aria-label="Share">' + ic('share') + '</button></div>' +
      (p.cat === 'Breast' ? '<p class="age-note">Before-and-after photos of breast procedures are shown only to visitors who confirm they are 18 or older.</p>' : '') +
      '<div class="dsec"><h3>Results</h3><a class="link" href="' + pageUrl(id) + '#results">See results for ' + esc(p.title.replace(/\s*\(.*\)/, '').toLowerCase()) + ' ' + ic('arrow') + '</a></div>' +
      (soc.length ? '<div class="dsec"><h3>From our social feeds</h3><div class="dsoc">' + soc.map(function (s) { var pl = SITE.social[s.platform]; return '<a href="' + pl.url + '" target="_blank" rel="noopener">' + NPS.imgTag('soc.' + s.id, { image: s.img, fx: 50, fy: 40 }, { alt: '' }) + '<span><b>' + pl.label + '</b>' + esc(s.caption) + '</span></a>'; }).join('') + '</div></div>' : '') +
      (rel.length ? '<div class="dsec"><h3>Related</h3><div class="pills">' + rel.map(function (r) { return '<button class="chip" data-detail="' + r.id + '">' + esc(r.title.replace(/\s*\(.*\)/, '')) + '</button>'; }).join('') + '</div></div>' : '') +
      '<div class="dsec"><h3>Share</h3><p class="note">Every procedure has its own link, so you can send it to a friend or tag it in a post: <b style="word-break:break-all">' + esc(new URL(pageUrl(id), location.href).href.replace(/^https?:\/\//, '')) + '</b></p></div>';
    var d = openSheet('detail'); var sc = $('#dbody'); sc.scrollTop = 0;
    history.replaceState(null, '', '#procedure/' + id);
    refreshSaved();
  }

  /* ---------- Feed (Discover) ---------- */
  var FILTERS = [['all', 'All'], ['face', 'Face'], ['breast', 'Breast'], ['body', 'Body'], ['skin', 'Skin & glow'], ['nonsurgical', 'Non-surgical'], ['surgical', 'Surgical'], ['learn', 'Learn']];
  var fFilter = 'all', fShown = 0, STEP = 6, FIRST = 9;
  function feedItems() { return NPS.feed.filter(function (c) { return fFilter === 'all' || c.tags.indexOf(fFilter) > -1; }); }
  function firstSentence(t) { var m = String(t).match(/^.*?[.!?](\s|$)/); return m ? m[0].trim() : t; }
  function saveBtn(id) { return '<button class="act" data-save="' + id + '" aria-pressed="' + isSaved(id) + '" aria-label="Save">' + ic('heart') + '</button>'; }
  function card(c, idx) {
    var p = c.ref && byId[c.ref], delay = ' style="animation-delay:' + ((idx % 6) * 70) + 'ms"';
    if (c.type === 'procedure' && p) {
      return '<article class="fc"' + delay + '><button class="ph frame" data-detail="' + p.id + '" aria-label="' + esc(p.title) + '">' + NPS.imgTag('feed.' + c.id, { image: c.img || p.img, fx: 50, fy: 38 }) + '<span class="tag">' + esc(c.eyebrow || p.cat) + '</span></button><div class="body"><h3>' + esc(c.title) + '</h3><p>' + esc(firstSentence(p.detail)) + '</p></div><div class="bar"><button class="link" data-detail="' + p.id + '">Learn more ' + ic('arrow') + '</button><div class="acts">' + saveBtn(p.id) + '<button class="act" data-share="' + p.id + '" aria-label="Share">' + ic('share') + '</button></div></div></article>';
    }
    if (c.type === 'guide') {
      var t = topicById[c.ref];
      return '<article class="fc"' + delay + '><button class="ph frame" data-q="' + esc(t.aka[0]) + '" aria-label="' + esc(c.title) + '">' + NPS.imgTag('feed.' + c.id, { image: c.img, fx: 50, fy: 35 }) + '<span class="tag">' + esc(c.eyebrow) + '</span></button><div class="body"><h3>' + esc(c.title) + '</h3><p>' + esc(t.blurb) + '</p></div><div class="bar"><button class="link" data-q="' + esc(t.aka[0]) + '">See ideas ' + ic('arrow') + '</button></div></article>';
    }
    if (c.type === 'insight') {
      return '<article class="fc text t-' + (c.tone || 'sand') + '"' + delay + '><p class="eyebrow">' + esc(c.eyebrow) + '</p><h3>' + esc(c.title) + '</h3>' + (c.text ? '<p>' + esc(c.text) + '</p>' : '') + (c.list ? '<ul>' + c.list.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '') +
        (c.ref ? '<button class="link" data-detail="' + c.ref + '" style="align-self:flex-start">' + esc(c.cta) + ' ' + ic('arrow') + '</button>' : '<button class="link" data-toconsult style="align-self:flex-start">' + esc(c.cta) + ' ' + ic('arrow') + '</button>') + '</article>';
    }
    if (c.type === 'quote') {
      return '<article class="fc quote text t-' + (c.tone || 'sand') + '"' + delay + '><div class="stars" aria-label="Five stars">' + '<svg><use href="#i-star"/></svg>'.repeat(5) + '</div><blockquote>“' + esc(c.text) + '”</blockquote><cite>' + esc(c.who) + '</cite></article>';
    }
    if (c.type === 'social') {
      var s = NPS.social.filter(function (x) { return x.id === c.soc; })[0], pl = SITE.social[s.platform], rp = byId[s.ref];
      return '<article class="fc"' + delay + '><a class="ph frame" href="' + pl.url + '" target="_blank" rel="noopener" aria-label="Open on ' + pl.label + '">' + NPS.imgTag('feed.' + c.id, { image: s.img, fx: 50, fy: 40 }) + '<span class="tag">' + pl.label + '</span></a><div class="body"><span class="plat">' + ic(PLAT[s.platform]) + ' ' + esc(pl.handle) + '</span><p style="color:var(--ink)">' + esc(s.caption) + '</p></div><div class="bar"><button class="rel" data-detail="' + rp.id + '">On the site: ' + esc(rp.title.replace(/\s*\(.*\)/, '')) + ' ' + ic('arrow') + '</button></div></article>';
    }
    return '';
  }
  function renderFeed(append) {
    if (!HOME) return;
    var items = feedItems(), box = $('#feed');
    if (!append) { box.innerHTML = ''; fShown = 0; }
    var n = fShown ? STEP : FIRST, slice = items.slice(fShown, fShown + n);
    var frag = document.createElement('div'); frag.innerHTML = slice.map(function (c, i) { return card(c, i); }).join('');
    while (frag.firstChild) box.appendChild(frag.firstChild);
    fShown += slice.length;
    $('#feedMore').hidden = fShown >= items.length;
    NPS.applySlots(box); refreshSaved(); balanceFeed();
  }
  /* Keep rows complete: if the last row would be short, widen the last card so the grid always ends square. */
  function balanceFeed() {
    if (!HOME) return;
    var box = $('#feed'), cards = $$('.fc', box);
    cards.forEach(function (c) { c.classList.remove('is-wide', 'is-wide2'); });
    var cols = getComputedStyle(box).gridTemplateColumns.split(' ').length, n = cards.length;
    if (cols < 2 || !n) return;
    var r = n % cols; if (!r) return;
    var last = cards[n - 1];
    if (r === 1) last.classList.add('is-wide');
    else if (cols === 3 && r === 2) last.classList.add('is-wide2');
  }
  var balT; window.addEventListener('resize', function () { clearTimeout(balT); balT = setTimeout(balanceFeed, 120); });
  function renderChips() {
    if (!HOME) return;
    $('#feedChips').innerHTML = FILTERS.map(function (f) { return '<button class="chip" data-ffilter="' + f[0] + '" aria-pressed="' + (f[0] === fFilter) + '">' + f[1] + '</button>'; }).join('');
  }

  /* ---------- Social ---------- */
  function renderSocial() {
    var keys = ['instagram', 'facebook', 'youtube', 'pinterest'];
    if ($('#socialBtns')) $('#socialBtns').innerHTML = keys.map(function (k) { var s = SITE.social[k]; return '<a class="sbtn" href="' + s.url + '" target="_blank" rel="noopener">' + ic(PLAT[k]) + s.label + '</a>'; }).join('');
    var dots = keys.map(function (k) { var s = SITE.social[k]; return '<a href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + s.label + '">' + ic(PLAT[k]) + '</a>'; }).join('');
    $('#footSocials').innerHTML = dots; $('#menuSocials').innerHTML = dots;
    if ($('#posts')) $('#posts').innerHTML = NPS.social.map(function (s) {
      var pl = SITE.social[s.platform], rp = byId[s.ref];
      return '<article class="post"><a class="ph frame" href="' + pl.url + '" target="_blank" rel="noopener" aria-label="Open on ' + pl.label + '">' + NPS.imgTag('post.' + s.id, { image: s.img, fx: 50, fy: 40 }) + '<span class="pl">' + ic(PLAT[s.platform]) + '</span></a><p>' + esc(s.caption) + '</p><button class="rel" data-detail="' + rp.id + '">On the site: ' + esc(rp.title.replace(/\s*\(.*\)/, '')) + ' ' + ic('arrow') + '</button></article>';
    }).join('');
  }

  /* ---------- Voices ---------- */
  function renderVoices() {
    var tr = $('#voices'); if (!tr) return;
    tr.innerHTML = NPS.voices.map(function (v) { return '<figure class="voice"><div class="stars" aria-label="Five stars">' + '<svg><use href="#i-star"/></svg>'.repeat(5) + '</div><q>' + esc(v.text) + '</q><cite>' + esc(v.who) + '</cite></figure>'; }).join('');
    var dots = $('#voiceDots');
    dots.innerHTML = NPS.voices.map(function (v, i) { return '<button aria-label="Review ' + (i + 1) + '" data-vdot="' + i + '"><i></i></button>'; }).join('');
    function upd() {
      var cards = $$('.voice', tr), left = tr.scrollLeft, idx = 0, min = 1e9;
      cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft - tr.offsetLeft - left - parseFloat(getComputedStyle(tr).paddingLeft)); if (d < min) { min = d; idx = i; } });
      $$('button', dots).forEach(function (b, i) { b.setAttribute('aria-current', i === idx); });
    }
    tr.addEventListener('scroll', function () { window.requestAnimationFrame(upd); }, { passive: true }); upd();
    dots.addEventListener('click', function (e) { var b = e.target.closest('[data-vdot]'); if (!b) return; var c = $$('.voice', tr)[+b.dataset.vdot]; tr.scrollTo({ left: c.offsetLeft - tr.offsetLeft - parseFloat(getComputedStyle(tr).paddingLeft), behavior: reduce ? 'auto' : 'smooth' }); });
  }

  /* ---------- Consultation form ---------- */
  function toConsult(id) {
    closeAll();
    var sel = $('#in');
    if (id && byId[id]) { var cat = byId[id].cat; for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === cat) sel.selectedIndex = i; var g = $('#gl'); if (!g.value) g.value = 'I’m interested in: ' + byId[id].title + '.'; }
    else if (saved.length) { var g2 = $('#gl'); if (!g2.value) g2.value = 'I’m interested in: ' + saved.map(function (s) { return byId[s].title.replace(/\s*\(.*\)/, ''); }).join(', ') + '.'; }
    setTimeout(function () { $('#consult').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); setTimeout(function () { var f = $('#fn'); if (f) f.focus({ preventScroll: true }); }, 700); }, 80);
  }
  /* ---------- Consultation form: layered spam protection ----------
     Front-end layers (this file) slow bots and catch the obvious ones.
     The server MUST re-check everything (see docs/FORM-SECURITY.md), because
     anything running in a browser can be bypassed by a determined bot.
       1. Honeypot field      people never see it; bots fill it
       2. Time trap           real people take more than a few seconds
       3. Human interaction   needs real pointer/keyboard activity
       4. Human check         Cloudflare Turnstile (invisible), when configured
       5. Link / junk filter  spam is mostly links and keyword stuffing
       6. Cooldown + hourly cap per browser
       7. Bots that trip a trap get a normal "thanks" and nothing is sent
  ---------------------------------------------------------------- */
  var FC = (NPS.site && NPS.site.form) || {}, formEl = $('#form');
  var formStart = 0, signals = 0, tsToken = '', tsLoaded = false;
  ['pointerdown', 'keydown', 'touchstart', 'focusin'].forEach(function (ev) { formEl.addEventListener(ev, function (e) { if (e.isTrusted) { signals++; if (!formStart) formStart = Date.now(); } }, { passive: true }); });
  function loadTurnstile() {
    if (tsLoaded || !FC.turnstileSiteKey) return; tsLoaded = true;
    var box = $('#humanCheck'); box.hidden = false;
    window.__npsTs = function () { window.turnstile.render(box, { sitekey: FC.turnstileSiteKey, appearance: 'interaction-only', callback: function (t) { tsToken = t; } }); };
    var s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__npsTs&render=explicit'; s.async = true; s.defer = true; document.head.appendChild(s);
  }
  formEl.addEventListener('focusin', loadTurnstile, { once: true });
  function hits() { try { return JSON.parse(localStorage.getItem('nps.sends') || '[]').filter(function (t) { return Date.now() - t < 3600000; }); } catch (e) { return []; } }
  function junky(text) {
    var urls = (text.match(/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ru|xyz|top|click|info|biz)\b)/ig) || []).length;
    var words = /(viagra|cialis|crypto|bitcoin|casino|seo services|backlinks|loan offer|click here|whatsapp|telegram|forex|guest post)/i.test(text);
    return urls > 0 || words;
  }
  function thank() { formEl.hidden = true; $('#thanks').hidden = false; $('#formList').hidden = true; }
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, firstBad = null;
    ['fn', 'em'].forEach(function (id) { var i = $('#' + id); var v = i.value.trim(); var bad = !v || (id === 'em' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)); i.style.borderColor = bad ? 'var(--clay)' : ''; if (bad) { ok = false; firstBad = firstBad || i; } });
    if (!ok) { toast('Please add your name and a valid email'); firstBad.focus(); return; }
    var data = { first: $('#fn').value.trim(), last: $('#ln').value.trim(), email: $('#em').value.trim(), phone: $('#ph').value.trim(), interest: $('#in').value, goals: $('#gl').value.trim() };
    var all = [data.first, data.last, data.goals].join(' ');
    // Human-friendly message for honest people who include a link or pasted text
    if (junky(all)) { toast('Please remove web links and promotional text, then try again'); $('#gl').focus(); return; }
    // Silent traps: pretend success so bots learn nothing
    var elapsed = formStart ? (Date.now() - formStart) / 1000 : 0;
    if ($('#nps_hp_url').value || signals < 4 || elapsed < (FC.minSeconds || 4)) { thank(); return; }
    var sends = hits();
    if (sends.length && Date.now() - sends[sends.length - 1] < (FC.cooldownSeconds || 90) * 1000) { toast('Thanks. Please wait a moment before sending another request.'); return; }
    if (sends.length >= (FC.maxPerHour || 3)) { toast('You’ve reached the limit for now. Please call us at 407.481.9505.'); return; }
    if (FC.turnstileSiteKey && !tsToken) { toast('One moment, we’re confirming you’re human. Please try again.'); return; }
    var btn = formEl.querySelector('button[type=submit]'); btn.disabled = true;
    function done() { sends.push(Date.now()); try { localStorage.setItem('nps.sends', JSON.stringify(sends)); } catch (x) {} btn.disabled = false; thank(); }
    if (!FC.endpoint) { done(); return; }                      // design preview: nothing is sent
    fetch(FC.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: FC.endpoint.charAt(0) === '/' ? 'same-origin' : 'omit',
      body: JSON.stringify({ data: data, saved: saved, turnstile: tsToken, elapsed: Math.round(elapsed), signals: signals, hp: $('#nps_hp_url').value }) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
      .catch(function () { btn.disabled = false; toast('Something went wrong. Please call us at 407.481.9505.'); });
  });
  $('#formReset').addEventListener('click', function () { $('#form').hidden = false; $('#thanks').hidden = true; formStart = 0; signals = 0; refreshSaved(); $('#fn').focus(); });

  /* ---------- Click delegation ---------- */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-rmrecent]'))) { e.preventDefault(); recent.splice(+t.getAttribute('data-rmrecent'), 1); saveRecent(); renderSearch(''); return; }
    if ((t = e.target.closest('[data-clearrecent]'))) { e.preventDefault(); recent = []; saveRecent(); renderSearch(''); return; }
    if ((t = e.target.closest('[data-detail]'))) { e.preventDefault(); var did = t.getAttribute('data-detail'); if (t.closest('#sheet-search')) addRecent('p', did); openDetail(did); return; }
    if ((t = e.target.closest('[data-q]'))) { e.preventDefault(); var qq = t.getAttribute('data-q'); if (t.closest('#sheet-search')) addRecent('q', qq); openSearch(qq); return; }
    if ((t = e.target.closest('[data-explore]'))) { e.preventDefault(); openExplorer(t.getAttribute('data-explore')); return; }
    if ((t = e.target.closest('[data-xtab]'))) { renderExplorer(t.getAttribute('data-xtab')); return; }
    if ((t = e.target.closest('[data-open]'))) {
      e.preventDefault(); var k = t.getAttribute('data-open');
      if (k === 'search') openSearch(''); else if (k === 'explore') openExplorer('All'); else if (k === 'list') { renderList(); openSheet('list'); } else openSheet(k);
      return;
    }
    if ((t = e.target.closest('[data-save]'))) { e.preventDefault(); e.stopPropagation(); toggleSave(t.getAttribute('data-save')); return; }
    if ((t = e.target.closest('[data-share]'))) { e.preventDefault(); var id = t.getAttribute('data-share'); share(byId[id].title + ' · Newman Plastic Surgery', '', new URL(pageUrl(id), location.href).href); return; }
    if ((t = e.target.closest('[data-ffilter]'))) { fFilter = t.getAttribute('data-ffilter'); renderChips(); renderFeed(false); return; }
    if ((t = e.target.closest('[data-toconsult]'))) { e.preventDefault(); toConsult(t.getAttribute('data-toconsult') || null); return; }
    if ((t = e.target.closest('[data-clearlist]'))) { saved = []; persist(); refreshSaved(); return; }
    if ((t = e.target.closest('[data-soon]'))) { e.preventDefault(); toast(t.getAttribute('data-soon')); return; }
    if ((t = e.target.closest('[data-close]'))) { var d = t.closest('dialog'); if (d) { d.close(); var href = t.getAttribute('href'); if (href && href.charAt(0) === '#') { /* anchor handles scroll */ } } if (t.tagName === 'BUTTON') e.preventDefault(); return; }
    if (e.target.closest('[data-sharesite]')) { share('Newman Plastic Surgery', ''); return; }
    if (e.target.closest('#feedMore')) { renderFeed(true); return; }
    var a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1 && !a.hasAttribute('data-close')) { /* normal smooth scroll */ }
  });
  document.addEventListener('keydown', function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if ((e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag)) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openSearch(''); }
  });

  /* ---------- Header / tab bar / reveal ---------- */
  var hdr = $('#hdr');
  function onScroll() { hdr.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if ('IntersectionObserver' in window) {
    var secs = HOME ? [['.hero', 'top'], ['#procedures', 'explore'], ['#discover', 'discover'], ['#consult', 'book']] : [['#consult', 'book']];
    var vis = {};
    var so = new IntersectionObserver(function (es) { es.forEach(function (en) { vis[en.target.dataset.t] = en.isIntersecting ? en.intersectionRatio : 0; }); var best = HOME ? 'top' : 'explore', m = 0; Object.keys(vis).forEach(function (k) { if (vis[k] > m) { m = vis[k]; best = k; } }); setTab(best); }, { threshold: [0, .15, .3, .5, .75] });
    secs.forEach(function (s) { var el = $(s[0]); if (el) { el.dataset.t = s[1]; so.observe(el); } });
    var rvo = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rvo.unobserve(en.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { rvo.observe(el); });
    var auto = new IntersectionObserver(function (es) { if (es[0].isIntersecting && HOME && !$('#feedMore').hidden && fShown > 0 && window.__feedAuto) renderFeed(true); }, { rootMargin: '600px 0px' });
    if (HOME) { auto.observe($('#feedSentinel')); $('#feedMore').addEventListener('click', function () { window.__feedAuto = true; }); }
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Deep links ---------- */
  function route() {
    var h = decodeURIComponent(location.hash || '');
    var m;
    if ((m = h.match(/^#procedure\/(.+)$/))) { if (document.getElementById('gallery')) { history.replaceState(null, '', '#show-' + m[1]); return; } if (byId[m[1]]) openDetail(m[1]); }
    else if ((m = h.match(/^#search\/(.+)$/))) openSearch(m[1]);
    else if ((m = h.match(/^#explore\/?(.*)$/))) openExplorer(m[1] || 'All');
    else if (h === '#list') { renderList(); openSheet('list'); }
  }
  window.addEventListener('hashchange', function () { if (/^#(procedure|search|explore|list)/.test(location.hash)) route(); });

  /* ---------- Init ---------- */
  NPS.applySlots();
  var mq = window.matchMedia('(max-width: 759px)'); (mq.addEventListener ? mq.addEventListener('change', function () { NPS.applySlots(); }) : mq.addListener(function () { NPS.applySlots(); }));
  renderChips(); renderFeed(false); renderSocial(); renderVoices(); refreshSaved();
  if (!HOME) setTab('explore');
  setTimeout(route, 50);
  if (window.NPS_DEBUG) window.NPS_DEBUG = { openDetail: openDetail, openSearch: openSearch };
})();
