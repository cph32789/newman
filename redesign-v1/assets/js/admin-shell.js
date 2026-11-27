/* Admin preview shell: header, section nav, Publish dialog, activity log, toasts.
   Everything is kept in localStorage. On the preview server, assets/js/sync.js copies it to and from
   the server so every person sees the same saved data, and Publish updates the public site. */
(function () {
  'use strict';
  var ADMIN = window.ADMIN = {};
  var ls = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } } };
  ADMIN.ls = ls;
  var KEYS = [['nps.gallery2', 'Gallery'], ['nps.imageSettings', 'Images'], ['nps.customImages', 'Images'], ['nps.procEdits', 'Procedures'], ['nps.siteEdits', 'Settings'], ['nps.categories', 'Categories'], ['nps.team', 'Team'], ['nps.reviews', 'Reviews'], ['nps.media', 'Media'], ['nps.pages', 'Pages'], ['nps.products', 'Skin care'], ['nps.offers', 'Offers'], ['nps.feed', 'Discover'], ['nps.pageEdits', 'Page edits']];
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h; }
  function raw(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  ADMIN.pending = function () {
    var snap = ls.get('nps.pubSnap', {}), out = {};
    KEYS.forEach(function (k) { var cur = raw(k[0]); if ((cur ? hash(cur) : 0) !== (snap[k[0]] || 0)) out[k[1]] = (out[k[1]] || 0) + 1; });
    return out;
  };
  ADMIN.log = function (what) { var a = ls.get('nps.activity', []); a.unshift({ t: Date.now(), who: 'You', what: what }); ls.set('nps.activity', a.slice(0, 60)); };
  ADMIN.toast = function (m) { var t = document.getElementById('atoast'); if (!t) { t = document.createElement('div'); t.id = 'atoast'; t.className = 'toast-a'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 3600); };
  ADMIN.ago = function (t) { var s = (Date.now() - t) / 1000; if (s < 60) return 'just now'; if (s < 3600) return Math.round(s / 60) + ' min ago'; if (s < 86400) return Math.round(s / 3600) + ' hr ago'; return Math.round(s / 86400) + ' days ago'; };
  ADMIN.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var NAV = [['index.html', 'dashboard', 'Dashboard'], ['pages.html', 'pages', 'Pages & images'], ['procedures.html', 'procedures', 'Procedures'], ['gallery.html', 'gallery', 'Gallery'], ['discover.html', 'discover', 'Discover'], ['team.html', 'team', 'Team'], ['reviews.html', 'reviews', 'Reviews'], ['media.html', 'media', 'Media'], ['skincare.html', 'skincare', 'Skin care'], ['offers.html', 'offers', 'Offers'], ['inbox.html', 'inbox', 'Inbox'], ['settings.html', 'settings', 'Settings']];
  var active = (document.currentScript && document.currentScript.getAttribute('data-active')) || '';
  var inbox = ADMIN.ls.get('nps.inbox', null);
  var newCount = inbox ? inbox.filter(function (m) { return m.status === 'new'; }).length : 3;

  function build() {
    var h = document.getElementById('ah'), n = document.getElementById('an');
    if (h) {
      var p = ADMIN.pending(), total = Object.keys(p).length;
      h.innerHTML = '<div class="wrap"><a class="brand" href="index.html"><img src="../assets/img/logo.png" alt="Newman Plastic Surgery"><span class="tag">Admin preview</span></a>' +
        '<div class="who"><button class="btn btn--sm pubbtn" id="pubOpen" type="button">Publish' + (total ? ' · ' + total + ' section' + (total > 1 ? 's' : '') : '') + '</button><a class="btn btn--line btn--sm" style="color:var(--paper);border-color:rgba(255,251,244,.4)" href="../" target="_blank" rel="noopener">View site</a>' + (window.NPSSYNC ? '<button class="btn btn--line btn--sm" id="signOut" type="button" style="color:var(--paper);border-color:rgba(255,251,244,.4)">Sign out</button>' : '<i title="Dr. Newman (preview sign-in)">CN</i>') + '</div></div>';
    }
    if (n) n.innerHTML = NAV.map(function (x) { var c = x[1] === 'inbox' && newCount ? '<span class="cnt">' + newCount + '</span>' : ''; return x[1] === active ? '<a class="on" href="' + x[0] + '" aria-current="page">' + x[2] + c + '</a>' : '<a href="' + x[0] + '">' + x[2] + c + '</a>'; }).join('');
    if (!document.getElementById('dPub')) {
      var d = document.createElement('dialog'); d.className = 'dlg2'; d.id = 'dPub'; d.setAttribute('aria-labelledby', 'dPubT');
      d.innerHTML = '<h2 id="dPubT">Publish your changes</h2><div id="pubBody"></div><div class="pbtn"><button class="btn btn--ink btn--sm" id="pubGo" type="button">Publish now</button><button class="btn btn--line btn--sm" id="pubDisc" type="button">Discard all drafts</button><button class="btn btn--line btn--sm" id="pubNo" type="button">Close</button></div>';
      document.body.appendChild(d);
      d.addEventListener('click', function (e) {
        if (e.target.id === 'pubNo') d.close();
        if (e.target.id === 'pubGo') {
          if (window.NPSSYNC) {
            var go = e.target; go.disabled = true; go.textContent = 'Publishing…';
            NPSSYNC.flush().then(function () { var snap = {}; KEYS.forEach(function (k) { var c = raw(k[0]); snap[k[0]] = c ? hash(c) : 0; }); ls.set('nps.pubSnap', snap); ADMIN.log('Published changes'); return NPSSYNC.post('/api/publish'); })
              .then(function (r) { go.disabled = false; go.textContent = 'Publish now'; d.close(); build(); ADMIN.toast(r && r.ok ? 'Published. Visitors can now see your changes.' : 'Publishing did not finish: ' + ((r && r.error) || 'please try again.')); })
              .catch(function () { go.disabled = false; go.textContent = 'Publish now'; ADMIN.toast('Publishing did not finish. Please try again.'); });
            return;
          }
          var snap = {}; KEYS.forEach(function (k) { var c = raw(k[0]); snap[k[0]] = c ? hash(c) : 0; }); ls.set('nps.pubSnap', snap); ADMIN.log('Published changes'); d.close(); build(); ADMIN.toast('Preview: the live Admin would now update the public site and rebuild the share cards.');
        }
        if (e.target.id === 'pubDisc') {
          if (!confirm('Throw away every unpublished draft change?')) return;
          if (window.NPSSYNC) { NPSSYNC.flush().then(function () { return NPSSYNC.post('/api/discard'); }).then(function () { ADMIN.log('Discarded drafts'); location.reload(); }); return; }
          KEYS.forEach(function (k) { try { localStorage.removeItem(k[0]); } catch (x) {} }); ADMIN.log('Discarded drafts'); d.close(); location.reload();
        }
      });
    }
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('#signOut')) { fetch('/api/admin/logout', { method: 'POST' }).then(function () { location.href = 'signin.html'; }); return; }
    if (e.target.closest('#pubOpen')) {
      var p = ADMIN.pending(), ks = Object.keys(p), b = document.getElementById('pubBody');
      b.innerHTML = ks.length ? '<p class="intro" style="margin:6px 0 10px">These sections have changes that visitors can’t see yet:</p><ul class="dotsl">' + ks.map(function (k) { return '<li>' + k + '</li>'; }).join('') + '</ul><p class="pv">Publishing also rebuilds each affected page, its search entry and its share card (the picture shown when a link is shared).</p>' : '<p class="intro" style="margin:6px 0 10px">Everything is published. There are no unpublished changes.</p>';
      document.getElementById('pubGo').disabled = !ks.length; if (window.NPSSYNC && document.getElementById('pubBody').querySelector('.pv')) document.getElementById('pubBody').querySelector('.pv').textContent = 'Publishing makes these changes visible to everyone and rebuilds each affected procedure page. (Search cards and share pictures are refreshed in the final launch step.)'; document.getElementById('dPub').showModal();
    }
  });
  build();
  ADMIN.refresh = build;
})();
