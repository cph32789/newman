/* Page kit: how a page is divided into sections and editable pieces.
   Shared by the public pages (to show the Admin's edits) and by Admin > Page editor.
   An edit is found by (section key, kind, number), so it survives rebuilds of the page,
   and it is applied only while the original text still matches. */
(function (g) {
  'use strict';
  var NOEDIT = '#feed,#feedChips,#posts,#voices,#socialBtns,#cases,#gallery,#gList,#gChips,#gProcs,#gCount,[data-noedit],form,dialog,script,style,noscript,svg,.rslim,.tabs';
  var INLINE = { EM: 1, STRONG: 1, B: 1, I: 1, BR: 1, SPAN: 1, SMALL: 1, SUP: 1, SUB: 1, U: 1, MARK: 1, A: 1, ABBR: 1, CODE: 1 };
  var ALLOWED = { EM: 1, STRONG: 1, B: 1, I: 1, BR: 1, SPAN: 1, SMALL: 1, SUP: 1, SUB: 1, U: 1, A: 1 };
  var norm = function (h) { return String(h == null ? '' : h).replace(/\s+/g, ' ').trim(); };

  function pageKey(pathname) { return String(pathname || '/').replace(/index\.html$/, '').replace(/^\/+|\/+$/g, ''); }

  function sections(main) {
    var out = [], seen = {};
    Array.prototype.forEach.call(main.children, function (el, i) {
      if (el.tagName !== 'SECTION') return;
      var k = el.getAttribute('data-pk-key') || el.id || el.getAttribute('aria-labelledby') || ('s' + i);
      while (seen[k]) k += '_';
      seen[k] = 1; el.setAttribute('data-pk-key', k); out.push({ el: el, key: k });
    });
    return out;
  }
  function sectionName(sec) {
    var h = sec.el.querySelector('h1,h2,h3'), e = sec.el.querySelector('.eyebrow');
    var t = (h && h.textContent.trim()) || (e && e.textContent.trim()) || sec.el.getAttribute('aria-label') || '';
    if (!t) { var any = sec.el.querySelector('p,li,div,span,a'); t = any ? any.textContent.trim() : ''; }
    if (sec.key === 'consult') t = 'Consultation form (bottom of page)';
    return (t || sec.key).replace(/\s+/g, ' ').slice(0, 60);
  }

  /* the editable pieces of one section, in page order: text, link, img */
  function parts(secEl) {
    var T = [], L = [], I = [], lastText = null;
    var all = secEl.querySelectorAll('*');
    for (var n = 0; n < all.length; n++) {
      var el = all[n], tag = el.tagName;
      if (el.closest(NOEDIT)) continue;
      if (lastText && lastText.contains(el)) continue;
      if (tag === 'IMG') { I.push(el); continue; }
      if (tag === 'A' || tag === 'BUTTON') {
        var kids = Array.prototype.filter.call(el.children, function (c) { return c.localName !== 'svg'; });
        if (!kids.length && el.textContent.trim()) { if (!el.closest('a,button') || el.closest('a,button') === el) L.push(el); }
        continue;
      }
      if (el.closest('a,button') && !isTextOnlyLink(el.closest('a,button')) === false) continue;   // text inside a plain link is edited through the link
      if (!el.textContent.trim()) continue;
      var ok = true;
      for (var c = 0; c < el.children.length; c++) { if (!INLINE[el.children[c].tagName]) { ok = false; break; } }
      if (!ok) continue;
      // a leaf with its own text only (not a wrapper whose text lives in children we will visit)
      T.push(el); lastText = el;
    }
    return { text: T, link: L, img: I };
  }
  function isTextOnlyLink(a) { return !Array.prototype.some.call(a.children, function (c) { return c.localName !== 'svg'; }); }

  /* keep only simple formatting */
  function sanitize(html) {
    var t = document.createElement('template'); t.innerHTML = String(html || '');
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) return;
        if (c.nodeType !== 1) { node.removeChild(c); return; }
        if (!ALLOWED[c.tagName]) { walk(c); while (c.firstChild) node.insertBefore(c.firstChild, c); node.removeChild(c); return; }
        Array.prototype.slice.call(c.attributes).forEach(function (a) {
          var keep = a.name === 'class' || (c.tagName === 'A' && a.name === 'href' && /^(https?:|mailto:|tel:|\/|#|\.\.?\/|[a-z0-9-]+\/)/i.test(a.value));
          if (!keep) c.removeAttribute(a.name);
        });
        walk(c);
      });
    })(t.content);
    return t.innerHTML.replace(/&nbsp;/g, ' ').trim();
  }

  function reorder(main, keys) {
    var secs = sections(main); if (!keys || !keys.length) return;
    var idx = function (k) { var i = keys.indexOf(k); return i < 0 ? 1e6 : i; };
    var slots = secs.map(function (s) { var c = main.ownerDocument.createComment('pk'); main.insertBefore(c, s.el); return c; });
    var sorted = secs.map(function (s, i) { return { s: s, i: i }; }).sort(function (a, b) { return idx(a.s.key) - idx(b.s.key) || a.i - b.i; }).map(function (x) { return x.s; });
    sorted.forEach(function (s, i) { slots[i].parentNode.insertBefore(s.el, slots[i]); });
    slots.forEach(function (c) { c.parentNode.removeChild(c); });
  }

  function firstTextNode(el) { for (var i = 0; i < el.childNodes.length; i++) { var n = el.childNodes[i]; if (n.nodeType === 3 && n.nodeValue.trim()) return n; } return null; }

  /* show an edit set (E = the edits for this page) on a document */
  function apply(doc, E, opts) {
    var main = doc.querySelector('main'); if (!main || !E) return;
    var secs = sections(main), editor = opts && opts.editor;
    secs.forEach(function (s) {
      var p = parts(s.el), k = s.key;
      p.text.forEach(function (el, i) {
        var e = E.text && E.text[k + '|t|' + i]; if (!e) return;
        if (norm(el.innerHTML) === norm(e.from)) { el.setAttribute('data-pk-from', e.from); el.innerHTML = sanitize(e.to); }
      });
      p.link.forEach(function (el, i) {
        var e = E.link && E.link[k + '|l|' + i]; if (!e) return;
        var tn = firstTextNode(el), cur = tn ? tn.nodeValue.trim() : '';
        if (cur === (e.from.t || '').trim()) { el.setAttribute('data-pk-from', JSON.stringify(e.from)); if (tn && e.to.t) tn.nodeValue = tn.nodeValue.replace(cur, e.to.t); if (e.to.h != null && el.tagName === 'A') el.setAttribute('href', e.to.h); }
      });
      p.img.forEach(function (el, i) {
        var e = E.img && E.img[k + '|i|' + i]; if (!e) return;
        if ((el.getAttribute('src') || '') === e.from) {
          el.setAttribute('data-pk-from', e.from); el.removeAttribute('srcset'); el.setAttribute('src', e.src);
          if (e.w && e.h) { el.setAttribute('width', e.w); el.setAttribute('height', e.h); }
          if (e.alt != null) el.setAttribute('alt', e.alt);
          var pic = el.closest('picture'); if (pic) Array.prototype.forEach.call(pic.querySelectorAll('source'), function (so) { so.parentNode.removeChild(so); });
        }
      });
    });
    if (E.order && E.order.length) reorder(main, E.order);
    sections(main).forEach(function (s) { var hide = !!(E.hidden && E.hidden[s.key]); if (editor) s.el.classList.toggle('pk-hidden', hide); else s.el.hidden = hide; });
  }

  g.PAGEKIT = { pageKey: pageKey, sections: sections, sectionName: sectionName, parts: parts, sanitize: sanitize, reorder: reorder, apply: apply, norm: norm, firstTextNode: firstTextNode };
})(window);
