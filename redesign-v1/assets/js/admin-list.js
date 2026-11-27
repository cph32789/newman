/* Admin: a small, reusable "list editor" used by Reviews and Media.
   Add, edit, reorder, hide and delete items; pictures are resized in the browser and stored on the server.
   Saved shape (per list): { order:[ids], items:{ id:{...fields, hidden, deleted, custom} } }
   ADMINLIST.mount({ el, getBase, getSaved, setSaved, noun, fields, title, sub, thumb, newItem, onChange }) */
(function () {
  'use strict';
  var A = window.ADMIN, esc = A.esc;

  function prepare(file, max) {
    return new Promise(function (res, rej) {
      var fr = new FileReader(); fr.onerror = rej;
      fr.onload = function () {
        var im = new Image(); im.onerror = rej;
        im.onload = function () {
          var k = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.round(im.naturalWidth * k), h = Math.round(im.naturalHeight * k), c = document.createElement('canvas');
          c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h);
          c.toBlob(function (b) { res({ blob: b, w: w, h: h, url: c.toDataURL('image/jpeg', .88) }); }, 'image/jpeg', .88);
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }
  function src(p) { return /^(\/|data:|https?:)/.test(p) ? p : '../' + p; }

  function mount(cfg) {
    var el = cfg.el, cur = null, uid = 'al' + Math.random().toString(36).slice(2, 7);
    function saved() { var s = cfg.getSaved() || {}; s.order = s.order || []; s.items = s.items || {}; return s; }
    function all() {
      var s = saved(), base = cfg.getBase();
      var list = base.map(function (b) { return Object.assign({}, b, s.items[b.id] || {}); });
      Object.keys(s.items).forEach(function (id) { var e = s.items[id]; if (e.custom && !base.some(function (b) { return b.id === id; })) list.push(Object.assign({ id: id }, e)); });
      var pos = function (id) { var i = s.order.indexOf(id); return i < 0 ? 1e6 : i; };
      return list.map(function (m, i) { m.__i = i; return m; }).sort(function (a, b) { return pos(a.id) - pos(b.id) || a.__i - b.__i; }).filter(function (m) { return !m.deleted; });
    }
    function get(id) { return all().filter(function (m) { return m.id === id; })[0]; }
    function patch(id, o) { var s = saved(); s.items[id] = Object.assign(s.items[id] || {}, o); cfg.setSaved(s); cfg.onChange(); }

    el.innerHTML = '<div class="alwrap"><aside><div class="pbtn" style="margin:0 0 10px"><button class="btn btn--ink btn--sm" data-add type="button">+ Add ' + esc(cfg.noun) + '</button></div><div class="pl" data-list></div></aside><section data-ed aria-live="polite"></section></div>';
    var listEl = el.querySelector('[data-list]'), edEl = el.querySelector('[data-ed]');

    function renderList() {
      var a = all();
      listEl.innerHTML = a.length ? a.map(function (m, i) {
        var t = cfg.thumb ? cfg.thumb(m) : '';
        return '<div class="row' + (cfg.thumb ? '' : ' nothumb') + '"' + (m.id === cur ? ' aria-current="true"' : '') + '>' + (cfg.thumb ? '<div class="th">' + (t ? '<img alt="" src="' + esc(src(t)) + '">' : '') + '</div>' : '') +
          '<button type="button" class="pick" data-pick="' + esc(m.id) + '"><b>' + esc(cfg.title(m) || '(untitled)') + (m.hidden ? '<span class="tg">HIDDEN</span>' : '') + '</b><small>' + esc(cfg.sub ? cfg.sub(m) : '') + '</small></button>' +
          '<span class="mv"><button type="button" data-up="' + esc(m.id) + '" aria-label="Move up"' + (i ? '' : ' disabled') + '>↑</button><button type="button" data-down="' + esc(m.id) + '" aria-label="Move down"' + (i < a.length - 1 ? '' : ' disabled') + '>↓</button></span></div>';
      }).join('') : '<p class="pv">Nothing here yet. Add one to get started.</p>';
    }
    function field(f, m) {
      var v = m[f.k], id = uid + f.k;
      if (f.show && !f.show(m)) return '';
      var wide = f.wide ? ' style="grid-column:1/-1"' : '', hint = f.hint ? ' <span class="hint">(' + esc(f.hint) + ')</span>' : '';
      if (f.type === 'textarea') return '<label class="field-a"' + wide + '>' + esc(f.label) + hint + '<textarea data-f="' + f.k + '">' + esc(v || '') + '</textarea></label>';
      if (f.type === 'select') return '<label class="field-a"' + wide + '>' + esc(f.label) + hint + '<select data-f="' + f.k + '">' + f.opts.map(function (o) { return '<option value="' + o[0] + '"' + (v === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>';
      if (f.type === 'check') return '<label class="chk1"' + wide + '><input type="checkbox" data-f="' + f.k + '"' + (v ? ' checked' : '') + '> ' + esc(f.label) + hint + '</label>';
      if (f.type === 'image') return '<div class="field-a imgf"' + wide + '><span>' + esc(f.label) + hint + '</span><div class="imgrow">' + (v ? '<img alt="" src="' + esc(src(v)) + '">' : '<div class="noimg">No picture</div>') + '<div><label class="btn btn--ink btn--sm" style="cursor:pointer">' + (v ? 'Replace' : 'Add') + ' picture<input type="file" accept="image/jpeg,image/png,image/webp" data-img="' + f.k + '" hidden></label>' + (v ? ' <button class="btn btn--line btn--sm" data-noimg="' + f.k + '" type="button">Remove</button>' : '') + '<p class="pv" data-st="' + f.k + '" role="status"></p></div></div></div>';
      return '<label class="field-a"' + wide + '>' + esc(f.label) + hint + '<input type="text" data-f="' + f.k + '" value="' + esc(v || '') + '"' + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + (f.readonly ? ' readonly' : '') + '></label>';
    }
    function renderEd() {
      var m = cur && get(cur);
      if (!m) { edEl.innerHTML = '<div class="panel"><h2>Choose a ' + esc(cfg.noun) + '</h2><p class="intro" style="margin:0">Pick one on the left to edit it, or add a new one.</p></div>'; return; }
      edEl.innerHTML = '<div class="panel"><h2>' + esc(cfg.title(m) || 'New ' + cfg.noun) + '</h2><div class="two-col" style="margin-top:14px">' + cfg.fields.map(function (f) { return field(f, m); }).join('') + '</div>' +
        '<div class="pbtn" style="margin-top:18px"><label class="sw" title="Show on the site"><input type="checkbox" data-vis' + (!m.hidden ? ' checked' : '') + ' aria-label="Show on the site"><i></i></label><span class="pv" style="margin:0">' + (m.hidden ? 'Hidden from the site' : 'Visible on the site') + '</span><button class="btn btn--line btn--sm" data-del type="button" style="margin-left:auto">Delete</button></div></div>';
    }
    function refresh() { renderList(); renderEd(); }

    el.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-pick]'))) { cur = b.getAttribute('data-pick'); refresh(); return; }
      if ((b = e.target.closest('[data-up],[data-down]'))) {
        var id = b.getAttribute('data-up') || b.getAttribute('data-down'), ids = all().map(function (m) { return m.id; }), i = ids.indexOf(id), j = b.hasAttribute('data-up') ? i - 1 : i + 1;
        if (j < 0 || j >= ids.length) return; ids.splice(j, 0, ids.splice(i, 1)[0]); var s = saved(); s.order = ids; cfg.setSaved(s); cfg.onChange(); renderList(); return;
      }
      if (e.target.closest('[data-add]')) {
        var n = prompt(cfg.addPrompt || ('Name of the new ' + cfg.noun + '?')); if (!n || !n.trim()) return;
        var id2 = 'n' + Date.now().toString(36), s2 = saved(); s2.order = all().map(function (m) { return m.id; }); s2.order.push(id2);
        s2.items[id2] = Object.assign({ custom: true }, cfg.newItem(n.trim())); cfg.setSaved(s2); cfg.onChange(); cur = id2; refresh(); return;
      }
      if ((b = e.target.closest('[data-noimg]'))) { var o = {}; o[b.getAttribute('data-noimg')] = ''; if (b.getAttribute('data-noimg') === 'image') { o.w = 0; o.h = 0; } patch(cur, o); refresh(); return; }
      if (e.target.closest('[data-del]')) { var m2 = get(cur); if (confirm('Delete “' + (cfg.title(m2) || cfg.noun) + '”? It disappears from the site.')) { patch(cur, { deleted: true }); cur = null; refresh(); } return; }
    });
    el.addEventListener('input', function (e) {
      var t = e.target; if (!cur || !t.matches || !t.matches('[data-f]') || t.type === 'checkbox') return;
      var k = t.getAttribute('data-f'), v = t.value, f = cfg.fields.filter(function (x) { return x.k === k; })[0], o = {};
      if (f && f.clean) v = f.clean(v);
      o[k] = v; patch(cur, o); renderList();
    });
    el.addEventListener('change', function (e) {
      var t = e.target; if (!cur) return;
      if (t.matches('[data-vis]')) { patch(cur, { hidden: !t.checked }); refresh(); return; }
      if (t.matches('[data-f]') && (t.type === 'checkbox' || t.tagName === 'SELECT')) { var o = {}; o[t.getAttribute('data-f')] = t.type === 'checkbox' ? t.checked : t.value; patch(cur, o); refresh(); return; }
      if (t.matches('[data-img]') && t.files[0]) {
        var k = t.getAttribute('data-img'), id = cur, st = el.querySelector('[data-st="' + k + '"]'); if (st) st.textContent = 'Preparing the picture…';
        prepare(t.files[0], 1400).then(function (p) {
          if (window.NPSSYNC) return fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: p.blob }).then(function (r) { return r.json(); }).then(function (j) { if (!j.ok) throw new Error(j.error || 'Upload failed'); return { u: j.url, w: p.w, h: p.h }; });
          return { u: p.url, w: p.w, h: p.h };
        }).then(function (r) { var o = {}; o[k] = r.u; if (k === 'image') { o.w = r.w; o.h = r.h; } patch(id, o); refresh(); })
          .catch(function (err) { if (st) st.textContent = 'Could not add that picture: ' + (err.message || 'please try another.'); });
      }
    });
    cur = (all()[0] || {}).id; refresh();
    return { refresh: function () { cur = (all().filter(function (m) { return m.id === cur; })[0] || all()[0] || {}).id; refresh(); } };
  }
  window.ADMINLIST = { mount: mount };
})();
