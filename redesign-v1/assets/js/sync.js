/* Saves the Admin's work on the server (only present when the site runs on the preview server).
   The server puts the current saved data into the page as window.__NPS_STATE__. This script
   copies it into localStorage before any other script runs (so every page and Admin screen
   works exactly as before), then sends every Admin change back to the server. */
(function () {
  'use strict';
  var S = window.__NPS_STATE__, KEYS = window.__NPS_KEYS__ || []; if (!S) return;
  var admin = !!window.__NPS_ADMIN__, ls;
  try { ls = window.localStorage; KEYS.forEach(function (k) { if (k in S) ls.setItem(k, S[k]); else ls.removeItem(k); }); } catch (e) { return; }
  var queue = {}, timer = null, inflight = [], failed = false;
  function note(msg) { try { if (window.ADMIN && ADMIN.toast) ADMIN.toast(msg); else console.warn(msg); } catch (e) {} }
  function sendKey(k) {
    var v = queue[k]; delete queue[k];
    var opts = v === null ? { method: 'DELETE' } : { method: 'PUT', body: v, headers: { 'Content-Type': 'text/plain' } };
    return fetch('/api/state/' + k, opts).then(function (r) {
      if (r.status === 401) { note('Your Admin sign-in expired. Please sign in again.'); setTimeout(function () { location.href = '/admin/signin.html'; }, 1200); throw new Error('401'); }
      if (!r.ok) throw new Error(r.status); failed = false;
    }).catch(function (e) { if (!failed) { failed = true; note('Could not save to the server. Check your connection and try again.'); } throw e; });
  }
  function run() { timer = null; var p = Promise.all(Object.keys(queue).map(sendKey)); inflight.push(p); p.then(function () { inflight.splice(inflight.indexOf(p), 1); }, function () { inflight.splice(inflight.indexOf(p), 1); }); }
  function schedule(k, v) { queue[k] = v; if (!timer) timer = setTimeout(run, 250); }
  if (admin) {
    var set = Storage.prototype.setItem, del = Storage.prototype.removeItem;
    Storage.prototype.setItem = function (k, v) { set.call(this, k, v); if (this === ls && KEYS.indexOf(k) > -1) schedule(k, String(v)); };
    Storage.prototype.removeItem = function (k) { del.call(this, k); if (this === ls && KEYS.indexOf(k) > -1) schedule(k, null); };
  }
  window.NPSSYNC = {
    server: true, admin: admin,
    flush: function () { if (timer) { clearTimeout(timer); run(); } return Promise.all(inflight.slice()).then(function () { return true; }); },
    post: function (path) { return window.NPSSYNC.flush().then(function () { return fetch(path, { method: 'POST' }); }).then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); }); }
  };
  window.addEventListener('pagehide', function () { if (timer) { clearTimeout(timer); run(); } });
})();
