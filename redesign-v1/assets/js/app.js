/* =====================================================================
   Newman Plastic Surgery — Redesign v1 (home page)
   Behaviour only. All words, procedures, feed cards, social posts and
   image settings live in /data and are managed in Admin later.
   ===================================================================== */
(function () {
  'use strict';
  var NPS = window.NPS, SITE = NPS.site, P = NPS.procedures;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var topicById = {}; NPS.topics.forEach(function (t) { topicById[t.id] = t; });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ic(name, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  var PLAT = { instagram: 'ig', facebook: 'fb', youtube: 'yt', pinterest: 'pin' };

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

  /* ---------- Search ---------- */
  var qEl = $('#q'), sBody = $('#sbody'), qClear = $('#qClear');
  var POP = ['Rhinoplasty', 'Breast augmentation', 'Facelift', 'Botox', 'Tummy tuck', 'Eyelid surgery', 'Lip filler', 'Microneedling'];
  var GOALS = [['Midlife refresh', 'menopause'], ['After pregnancy', 'after baby'], ['After weight loss', 'weight loss skin'], ['Glow and skin renewal', 'glow'], ['Subtle, no surgery', 'no surgery']];
  function hl(text, q) {
    var t = esc(text); if (!q) return t;
    var words = NPS.searchNorm(q).split(' ').filter(function (w) { return w.length > 1; });
    words.forEach(function (w) { try { t = t.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); } catch (e) {} });
    return t;
  }
  function row(p, q, hint, best) {
    return '<button class="rr" data-detail="' + p.id + '"><span class="th frame">' + NPS.imgTag('thumb.' + p.id, { image: p.img, fx: 50, fy: 40 }, { alt: '' }) + '</span><span class="tx"><span class="tt">' + hl(p.title, q) + (best ? '<span class="best">Best match</span>' : '') + '</span><span class="mt">' + esc(p.cat) + ' · ' + (p.kind === 'surgical' ? 'Surgical' : 'Non-surgical') + (hint ? ' · ' + esc(hint) : '') + '</span></span><svg class="go"><use href="#i-chev"/></svg></button>';
  }
  function renderSearch(q) {
    q = (q || '').trim(); qClear.hidden = !q;
    if (!q) {
      sBody.innerHTML = '<div class="sgroup"><h3>Popular searches</h3><div class="pills">' + POP.map(function (x) { return '<button class="chip" data-q="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div></div>' +
        '<div class="sgroup"><h3>Start from your goal</h3>' + GOALS.map(function (g) { return '<button class="guide" style="width:100%;text-align:left" data-q="' + esc(g[1]) + '"><b>' + esc(g[0]) + '</b><span>See thoughtful starting points</span></button>'; }).join('') + '</div>' +
        '<div class="sgroup"><h3>Browse</h3><div class="pills"><button class="chip" data-explore="Face">Face</button><button class="chip" data-explore="Breast">Breast</button><button class="chip" data-explore="Body">Body</button><button class="chip" data-explore="Skin &amp; aesthetics">Skin &amp; aesthetics</button></div></div>';
      return;
    }
    var r = NPS.search(q), html = '';
    var best = r.procedures.filter(function (x) { return x.tier === 'best'; }), rel = r.procedures.filter(function (x) { return x.tier !== 'best'; });
    if (r.topics.length) {
      r.topics.forEach(function (t) {
        html += '<div class="sgroup" style="margin-top:6px"><h3>Guide</h3><div class="guide" style="cursor:default"><b>' + esc(t.item.title) + '</b><span>' + esc(t.item.blurb) + '</span></div><div class="res">' + t.picks.map(function (p) { return row(p, '', '', false); }).join('') + '</div></div>';
      });
    }
    if (best.length) html += '<div class="res" style="margin-top:' + (r.topics.length ? '22' : '14') + 'px">' + best.map(function (x, i) { return row(x.item, q, x.hint, i === 0 && best.length > 0 && x.score >= 78); }).join('') + '</div>';
    if (rel.length) html += '<div class="sgroup"><h3>Also relevant</h3><div class="res">' + rel.map(function (x) { return row(x.item, q, x.hint, false); }).join('') + '</div></div>';
    if (!best.length && !rel.length && !r.topics.length) {
      html = '<div class="empty"><b>We couldn’t find “' + esc(q) + '”.</b>Try a different word, like the name of the procedure or how you’d describe your goal. Or tell us what you’re curious about and we’ll point you in the right direction.</div>' +
        '<div class="pills" style="margin-bottom:22px">' + POP.slice(0, 5).map(function (x) { return '<button class="chip" data-q="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div><button class="btn btn--ink" data-toconsult>Ask us a question</button>';
    }
    sBody.innerHTML = html;
  }
  function openSearch(q) {
    openSheet('search'); qEl.value = q || ''; renderSearch(q || '');
    setTimeout(function () { qEl.focus(); if (q) qEl.setSelectionRange(q.length, q.length); }, 60);
  }
  var qT; qEl.addEventListener('input', function () { clearTimeout(qT); qT = setTimeout(function () { renderSearch(qEl.value); }, 40); });
  qClear.addEventListener('click', function () { qEl.value = ''; renderSearch(''); qEl.focus(); });
  qEl.addEventListener('keydown', function (e) {
    var rows = $$('.rr', sBody);
    if (e.key === 'Enter') { e.preventDefault(); if (rows[0]) rows[0].click(); }
    if (e.key === 'ArrowDown' && rows[0]) { e.preventDefault(); rows[0].focus(); }
  });
  sBody.addEventListener('keydown', function (e) {
    var rows = $$('.rr', sBody), i = rows.indexOf(document.activeElement);
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
  function share(title, hash) {
    var url = shareUrl(hash);
    if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { toast(url); }); } else { toast(url); }
  }

  /* ---------- Detail sheet (a preview of a procedure page) ---------- */
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
      '<div class="dacts"><button class="btn btn--ink" data-toconsult="' + id + '">Request a consultation</button>' +
      '<button class="btn btn--line" data-save="' + id + '" aria-pressed="' + isSaved(id) + '" aria-label="Save">' + ic('heart') + '<span class="sv">Save</span></button>' +
      '<button class="btn btn--line" data-share="' + id + '" aria-label="Share">' + ic('share') + '</button></div>' +
      (p.cat === 'Breast' ? '<p class="age-note">Before-and-after photos of breast procedures are shown only to visitors who confirm they are 18 or older.</p>' : '') +
      '<div class="dsec"><h3>Results</h3><button class="link" data-soon="The results gallery is part of the next build.">See results for ' + esc(p.title.replace(/\s*\(.*\)/, '').toLowerCase()) + ' ' + ic('arrow') + '</button></div>' +
      (soc.length ? '<div class="dsec"><h3>From our social feeds</h3><div class="dsoc">' + soc.map(function (s) { var pl = SITE.social[s.platform]; return '<a href="' + pl.url + '" target="_blank" rel="noopener">' + NPS.imgTag('soc.' + s.id, { image: s.img, fx: 50, fy: 40 }, { alt: '' }) + '<span><b>' + pl.label + '</b>' + esc(s.caption) + '</span></a>'; }).join('') + '</div></div>' : '') +
      (rel.length ? '<div class="dsec"><h3>Related</h3><div class="pills">' + rel.map(function (r) { return '<button class="chip" data-detail="' + r.id + '">' + esc(r.title.replace(/\s*\(.*\)/, '')) + '</button>'; }).join('') + '</div></div>' : '') +
      '<div class="dsec"><h3>Share</h3><p class="note">Every procedure has its own link, so you can send it to a friend or tag it in a post: <b style="word-break:break-all">' + esc(location.host + location.pathname + '#procedure/' + id) + '</b></p></div>';
    var d = openSheet('detail'); var sc = $('#dbody'); sc.scrollTop = 0;
    history.replaceState(null, '', '#procedure/' + id);
    refreshSaved();
  }

  /* ---------- Feed (Discover) ---------- */
  var FILTERS = [['all', 'All'], ['face', 'Face'], ['breast', 'Breast'], ['body', 'Body'], ['skin', 'Skin & glow'], ['nonsurgical', 'Non-surgical'], ['surgical', 'Surgical'], ['learn', 'Learn']];
  var fFilter = 'all', fShown = 0, STEP = 6, FIRST = 8;
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
        (c.ref ? '<button class="link" data-detail="' + c.ref + '" style="align-self:flex-start;margin-top:6px">' + esc(c.cta) + ' ' + ic('arrow') + '</button>' : '<button class="link" data-toconsult style="align-self:flex-start;margin-top:6px">' + esc(c.cta) + ' ' + ic('arrow') + '</button>') + '</article>';
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
    var items = feedItems(), box = $('#feed');
    if (!append) { box.innerHTML = ''; fShown = 0; }
    var n = fShown ? STEP : FIRST, slice = items.slice(fShown, fShown + n);
    var frag = document.createElement('div'); frag.innerHTML = slice.map(function (c, i) { return card(c, i); }).join('');
    while (frag.firstChild) box.appendChild(frag.firstChild);
    fShown += slice.length;
    $('#feedMore').hidden = fShown >= items.length;
    NPS.applySlots(box); refreshSaved();
  }
  function renderChips() {
    $('#feedChips').innerHTML = FILTERS.map(function (f) { return '<button class="chip" data-ffilter="' + f[0] + '" aria-pressed="' + (f[0] === fFilter) + '">' + f[1] + '</button>'; }).join('');
  }

  /* ---------- Social ---------- */
  function renderSocial() {
    var keys = ['instagram', 'facebook', 'youtube', 'pinterest'];
    $('#socialBtns').innerHTML = keys.map(function (k) { var s = SITE.social[k]; return '<a class="sbtn" href="' + s.url + '" target="_blank" rel="noopener">' + ic(PLAT[k]) + s.label + '</a>'; }).join('');
    var dots = keys.map(function (k) { var s = SITE.social[k]; return '<a href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + s.label + '">' + ic(PLAT[k]) + '</a>'; }).join('');
    $('#footSocials').innerHTML = dots; $('#menuSocials').innerHTML = dots;
    $('#posts').innerHTML = NPS.social.map(function (s) {
      var pl = SITE.social[s.platform], rp = byId[s.ref];
      return '<article class="post"><a class="ph frame" href="' + pl.url + '" target="_blank" rel="noopener" aria-label="Open on ' + pl.label + '">' + NPS.imgTag('post.' + s.id, { image: s.img, fx: 50, fy: 40 }) + '<span class="pl">' + ic(PLAT[s.platform]) + '</span></a><p>' + esc(s.caption) + '</p><button class="rel" data-detail="' + rp.id + '">On the site: ' + esc(rp.title.replace(/\s*\(.*\)/, '')) + ' ' + ic('arrow') + '</button></article>';
    }).join('');
  }

  /* ---------- Voices ---------- */
  function renderVoices() {
    var tr = $('#voices');
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
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, ok = true;
    ['fn', 'em'].forEach(function (id) { var i = $('#' + id); var v = i.value.trim(); var bad = !v || (id === 'em' && !/^\S+@\S+\.\S+$/.test(v)); i.style.borderColor = bad ? 'var(--clay)' : ''; if (bad) { ok = false; if (ok === false && !f._f) { f._f = 1; i.focus(); } } });
    f._f = 0;
    if (!ok) { toast('Please add your name and a valid email'); return; }
    f.hidden = true; $('#thanks').hidden = false; $('#formList').hidden = true;
  });
  $('#formReset').addEventListener('click', function () { $('#form').hidden = false; $('#thanks').hidden = true; refreshSaved(); $('#fn').focus(); });

  /* ---------- Click delegation ---------- */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-detail]'))) { e.preventDefault(); openDetail(t.getAttribute('data-detail')); return; }
    if ((t = e.target.closest('[data-q]'))) { e.preventDefault(); openSearch(t.getAttribute('data-q')); return; }
    if ((t = e.target.closest('[data-explore]'))) { e.preventDefault(); openExplorer(t.getAttribute('data-explore')); return; }
    if ((t = e.target.closest('[data-xtab]'))) { renderExplorer(t.getAttribute('data-xtab')); return; }
    if ((t = e.target.closest('[data-open]'))) {
      e.preventDefault(); var k = t.getAttribute('data-open');
      if (k === 'search') openSearch(''); else if (k === 'explore') openExplorer('All'); else if (k === 'list') { renderList(); openSheet('list'); } else openSheet(k);
      return;
    }
    if ((t = e.target.closest('[data-save]'))) { e.preventDefault(); e.stopPropagation(); toggleSave(t.getAttribute('data-save')); return; }
    if ((t = e.target.closest('[data-share]'))) { e.preventDefault(); var id = t.getAttribute('data-share'); share(byId[id].title + ' · Newman Plastic Surgery', '#procedure/' + id); return; }
    if ((t = e.target.closest('[data-ffilter]'))) { fFilter = t.getAttribute('data-ffilter'); renderChips(); renderFeed(false); return; }
    if ((t = e.target.closest('[data-toconsult]'))) { e.preventDefault(); toConsult(t.getAttribute('data-toconsult') || null); return; }
    if ((t = e.target.closest('[data-clearlist]'))) { saved = []; persist(); refreshSaved(); return; }
    if ((t = e.target.closest('[data-soon]'))) { e.preventDefault(); toast(t.getAttribute('data-soon')); return; }
    if ((t = e.target.closest('[data-close]'))) { var d = t.closest('dialog'); if (d) { d.close(); var href = t.getAttribute('href'); if (href && href.charAt(0) === '#') { /* anchor handles scroll */ } } if (t.tagName === 'BUTTON') e.preventDefault(); return; }
    if (e.target.closest('#shareSite')) { share('Newman Plastic Surgery', ''); return; }
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
  var tabs = $$('.tab[data-tab]');
  function setTab(name) { tabs.forEach(function (t) { t.setAttribute('aria-current', t.getAttribute('data-tab') === name); }); }
  if ('IntersectionObserver' in window) {
    var secs = [['.hero', 'top'], ['#procedures', 'explore'], ['#discover', 'discover'], ['#consult', 'book']];
    var vis = {};
    var so = new IntersectionObserver(function (es) { es.forEach(function (en) { vis[en.target.dataset.t] = en.isIntersecting ? en.intersectionRatio : 0; }); var best = 'top', m = 0; Object.keys(vis).forEach(function (k) { if (vis[k] > m) { m = vis[k]; best = k; } }); setTab(best); }, { threshold: [0, .15, .3, .5, .75] });
    secs.forEach(function (s) { var el = $(s[0]); if (el) { el.dataset.t = s[1]; so.observe(el); } });
    var rvo = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rvo.unobserve(en.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { rvo.observe(el); });
    var auto = new IntersectionObserver(function (es) { if (es[0].isIntersecting && !$('#feedMore').hidden && fShown > 0 && window.__feedAuto) renderFeed(true); }, { rootMargin: '600px 0px' });
    auto.observe($('#feedSentinel'));
    $('#feedMore').addEventListener('click', function () { window.__feedAuto = true; });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Hero search placeholder ---------- */
  var ph = $('#heroPlaceholder'), phs = ['Search “nose job”', 'Search “breast augmentation”', 'Search “droopy eyelids”', 'Search “sweaty armpits”', 'Search “wrinkles”', 'Search “menopause”'], pi = 0;
  if (!reduce) setInterval(function () { pi = (pi + 1) % phs.length; ph.style.opacity = 0; setTimeout(function () { ph.textContent = phs[pi]; ph.style.opacity = 1; }, 250); }, 3600);
  ph.style.transition = 'opacity .25s';

  /* ---------- Deep links ---------- */
  function route() {
    var h = decodeURIComponent(location.hash || '');
    var m;
    if ((m = h.match(/^#procedure\/(.+)$/))) { if (byId[m[1]]) openDetail(m[1]); }
    else if ((m = h.match(/^#search\/(.+)$/))) openSearch(m[1]);
    else if ((m = h.match(/^#explore\/?(.*)$/))) openExplorer(m[1] || 'All');
    else if (h === '#list') { renderList(); openSheet('list'); }
  }
  window.addEventListener('hashchange', function () { if (/^#(procedure|search|explore|list)/.test(location.hash)) route(); });

  /* ---------- Init ---------- */
  NPS.applySlots();
  var mq = window.matchMedia('(max-width: 759px)'); (mq.addEventListener ? mq.addEventListener('change', function () { NPS.applySlots(); }) : mq.addListener(function () { NPS.applySlots(); }));
  renderChips(); renderFeed(false); renderSocial(); renderVoices(); refreshSaved();
  setTimeout(route, 50);
  if (window.NPS_DEBUG) window.NPS_DEBUG = { openDetail: openDetail, openSearch: openSearch };
})();
