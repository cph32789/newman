#!/usr/bin/env node
/**
 * Newman Plastic Surgery: client preview server (no dependencies, Node 18+).
 *
 *   PREVIEW_PASSWORD=halo ADMIN_PASSWORD=secret node server/preview-server.js
 *
 * What it does
 *   1. Password gate for the whole site (visitors enter one shared password).
 *   2. Serves redesign-v1/ and makes the Admin REAL for everyone:
 *        - every Admin edit is saved on the server (not just in one browser)
 *        - edits are drafts until "Publish"; visitors only see published edits
 *        - Publish rebuilds the procedure pages (tools/build-procedures.js)
 *   3. Contact form: server-side spam checks (honeypot, speed, links, rate limit),
 *      saved to the Admin Inbox, optionally emailed (Resend) and checked with Turnstile.
 *
 * Environment
 *   PREVIEW_PASSWORD   password for the whole preview (empty = no gate, for local work)
 *   ADMIN_PASSWORD     password for /admin (defaults to PREVIEW_PASSWORD)
 *   SESSION_SECRET     random string that signs cookies (Render can generate it)
 *   DATA_DIR           where to keep saved data (use the Render disk, e.g. /var/data)
 *   RESEND_API_KEY, MAIL_FROM, NOTIFY_TO   optional: email new requests
 *   TURNSTILE_SITE_KEY, TURNSTILE_SECRET   optional: human check on the form
 *   PORT               set by Render
 */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto'), vm = require('vm');
const { execFile } = require('child_process');

const ROOT = path.resolve(__dirname, '..', 'redesign-v1');
let DATA = path.resolve(process.env.DATA_DIR || path.join(__dirname, '..', '.data'));
try { fs.mkdirSync(DATA, { recursive: true }); fs.accessSync(DATA, fs.constants.W_OK); }
catch (e) {   // no disk attached (e.g. the free plan): keep working, but saved edits vanish on restart
  const fallback = path.join(require('os').tmpdir(), 'newman-data');
  console.warn('WARNING: cannot write to ' + DATA + ' (' + e.code + '). Using ' + fallback + '. Admin edits will be LOST when the service restarts. Attach a disk and set DATA_DIR to its mount path.');
  DATA = fallback;
}
const PASS = process.env.PREVIEW_PASSWORD || '';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || PASS;
const SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256').update('nps|' + PASS + '|' + ADMIN_PASS).digest('hex');
const PORT = +process.env.PORT || 8080;
fs.mkdirSync(DATA, { recursive: true });

/* ------------------------------------------------------------------ saved state */
const PUB_KEYS = ['nps.gallery2', 'nps.imageSettings', 'nps.customImages', 'nps.procEdits', 'nps.siteEdits', 'nps.categories', 'nps.team', 'nps.reviews', 'nps.media'];
const SHARED_KEYS = ['nps.inbox', 'nps.users', 'nps.sendTo', 'nps.activity', 'nps.pubSnap'];
const ALL_KEYS = PUB_KEYS.concat(SHARED_KEYS);
const STATE_FILE = path.join(DATA, 'state.json');
let state = { draft: {}, published: {}, shared: { 'nps.inbox': '[]' } };
try { state = Object.assign(state, JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))); } catch (e) { /* first run */ }
let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const tmp = STATE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(state)); fs.renameSync(tmp, STATE_FILE);
  }, 150);
}
process.on('uncaughtException', e => console.error('uncaught', e));
process.on('unhandledRejection', e => console.error('unhandled', e));
process.on('SIGTERM', () => { try { fs.writeFileSync(STATE_FILE, JSON.stringify(state)); } catch (e) {} process.exit(0); });

/* ------------------------------------------------------------------ cookies */
const b64 = s => Buffer.from(s).toString('base64url');
const sign = (kind, exp) => crypto.createHmac('sha256', SECRET).update(kind + '.' + exp).digest('base64url');
const makeToken = (kind, hours) => { const exp = Date.now() + hours * 3600e3; return exp + '.' + sign(kind, exp); };
function checkToken(kind, tok) {
  if (!tok) return false; const i = tok.indexOf('.'); if (i < 1) return false;
  const exp = +tok.slice(0, i), sig = tok.slice(i + 1); if (!(exp > Date.now())) return false;
  const want = sign(kind, exp); return sig.length === want.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want));
}
function cookies(req) { const o = {}; (req.headers.cookie || '').split(/;\s*/).forEach(c => { const i = c.indexOf('='); if (i > 0) o[c.slice(0, i)] = decodeURIComponent(c.slice(i + 1)); }); return o; }
const isSecure = req => (req.headers['x-forwarded-proto'] || '').split(',')[0] === 'https';
const setCookie = (req, name, val, hours) => `${name}=${encodeURIComponent(val)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.round(hours * 3600)}${isSecure(req) ? '; Secure' : ''}`;
const clearCookie = name => `${name}=; Path=/; HttpOnly; Max-Age=0`;
function same(a, b) { const x = crypto.createHash('sha256').update(String(a)).digest(), y = crypto.createHash('sha256').update(String(b)).digest(); return crypto.timingSafeEqual(x, y); }

/* simple in-memory rate limiter */
const buckets = new Map();
function limited(key, max, windowMs) {
  const now = Date.now(), a = (buckets.get(key) || []).filter(t => now - t < windowMs);
  if (a.length >= max) { buckets.set(key, a); return true; }
  a.push(now); buckets.set(key, a); return false;
}
const ipOf = req => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

/* ------------------------------------------------------------------ helpers */
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
function send(res, code, body, headers) {
  res.writeHead(code, Object.assign({ 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin' }, headers));
  res.end(body);
}
const json = (res, code, obj) => send(res, code, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
function body(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let n = 0;
    req.on('data', c => { n += c.length; if (n > limit) { reject(Object.assign(new Error('too large'), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
function bodyBuf(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let n = 0;
    req.on('data', c => { n += c.length; if (n > limit) { reject(Object.assign(new Error('too large'), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ------------------------------------------------------------------ gate page */
function gatePage(next, bad) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Private preview | Newman Plastic Surgery</title>
<style>:root{--teal:#0e2b2c;--ivory:#f7f1e7;--clay:#9a5b3c;--ink:#14201f}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:var(--teal);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink)}
.card{width:100%;max-width:420px;background:var(--ivory);border-radius:22px;padding:34px 30px}h1{font:400 34px/1.08 Georgia,"Times New Roman",serif;margin:0 0 8px}h1 em{color:var(--clay)}p{margin:0 0 18px;line-height:1.5;color:#46524f}
.eyebrow{font:600 12px system-ui;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin-bottom:14px}label{display:block;font-weight:600;font-size:15px}input{width:100%;margin-top:8px;min-height:52px;padding:0 16px;border:1px solid #cfc6b6;border-radius:14px;background:#fff;font-size:18px}
button{margin-top:16px;width:100%;min-height:54px;border:0;border-radius:999px;background:var(--teal);color:#fff;font-size:17px;font-weight:600;cursor:pointer}.err{color:#a3321d;font-weight:600;margin:12px 0 0}</style></head>
<body><main class="card"><div class="eyebrow">Newman Plastic Surgery · Private preview</div><h1>Welcome. <em>Please enter</em> the password.</h1><p>This preview of the new website is shared only with people who have the password.</p>
<form method="post" action="/__gate"><input type="hidden" name="next" value="${esc(next)}"><label>Password<input type="password" name="password" autocomplete="current-password" autofocus required></label>${bad ? '<p class="err" role="alert">That password was not right. Please try again.</p>' : ''}<button type="submit">Enter the preview</button></form></main></body></html>`;
}
const safeNext = n => (typeof n === 'string' && /^\/[^\/\\]/.test(n) || n === '/') ? n : '/';

/* ------------------------------------------------------------------ procedure titles (for inbox) */
let titles = {};
try { const c = { console }; c.window = c; vm.createContext(c); vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/procedures.js'), 'utf8'), c); c.NPS.procedures.forEach(p => titles[p.id] = p.title.replace(/\s*\(.*\)/, '')); } catch (e) {}

/* ------------------------------------------------------------------ publish / rebuild */
const BUILD = path.join(DATA, 'build');
const UPLOADS = path.join(DATA, 'uploads'); fs.mkdirSync(UPLOADS, { recursive: true });
let removed = []; const loadRemoved = () => { try { removed = JSON.parse(fs.readFileSync(path.join(BUILD, '_removed.json'), 'utf8')); } catch (e) { removed = []; } };
loadRemoved();
let building = null;
function rebuild(origin) {
  if (building) return building;
  building = new Promise(resolve => {
    const tmp = path.join(DATA, 'build-tmp'), stf = path.join(DATA, 'published-state.json');
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.writeFileSync(stf, JSON.stringify(state.published));
    execFile(process.execPath, [path.join(ROOT, 'tools', 'build-procedures.js')], { env: Object.assign({}, process.env, { NPS_OUT: tmp, NPS_STATE: stf, SITE_URL: origin + '/' }), timeout: 120000 }, (err, out, errout) => {
      if (err) { console.error('build failed', errout || err); fs.rmSync(tmp, { recursive: true, force: true }); resolve({ ok: false, error: String(errout || err).slice(0, 400) }); return; }
      fs.rmSync(BUILD + '-old', { recursive: true, force: true });
      if (fs.existsSync(BUILD)) fs.renameSync(BUILD, BUILD + '-old');
      fs.renameSync(tmp, BUILD); fs.rmSync(BUILD + '-old', { recursive: true, force: true }); loadRemoved();
      resolve({ ok: true, log: out.trim() });
    });
  }).finally(() => { building = null; });
  return building;
}

/* ------------------------------------------------------------------ HTML transform */
const ORIGINAL = { phone: '407.481.9505', fax: '407.481.9506', street: '444 North Mills Avenue', city: 'Orlando, Florida 32803' };
function siteText(html, siteEdits) {
  let ed; try { ed = JSON.parse(siteEdits || '{}') || {}; } catch (e) { ed = {}; }
  const swap = (from, to) => { if (to && to !== from) html = html.split(from).join(esc(to).replace(/&quot;/g, '"')); };
  if (ed.phone && ed.phone !== ORIGINAL.phone) {
    const digits = ed.phone.replace(/\D/g, '');
    html = html.split('tel:+14074819505').join('tel:+1' + digits.replace(/^1/, ''));
    html = html.split('407.481.9505').join(esc(ed.phone)).split('407-481-9505').join(esc(ed.phone));
  }
  swap(ORIGINAL.fax, ed.fax); swap(ORIGINAL.street, ed.street); swap(ORIGINAL.city, ed.city);
  return html;
}
function transform(html, req, isAdmin, urlPath) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost', proto = isSecure(req) ? 'https' : 'http', origin = proto + '://' + host;
  const view = {}; PUB_KEYS.forEach(k => { const src = isAdmin ? state.draft : state.published; if (k in src) view[k] = src[k]; });
  if (isAdmin) SHARED_KEYS.forEach(k => { if (k in state.shared) view[k] = state.shared[k]; });
  html = siteText(html, view['nps.siteEdits']);
  html = html.split('https://cph32789.github.io/newman/redesign-v1/').join(origin + '/');
  const cfg = { endpoint: '/api/contact' }; if (process.env.TURNSTILE_SITE_KEY) cfg.turnstileSiteKey = process.env.TURNSTILE_SITE_KEY;
  const j = o => JSON.stringify(o).replace(/</g, '\\u003c').split('\u2028').join('').split('\u2029').join('');
  const head = `<script>window.__NPS_STATE__=${j(view)};window.__NPS_KEYS__=${j(ALL_KEYS)};window.__NPS_ADMIN__=${isAdmin};window.__NPS_CFG__=${j(cfg)};</script><script src="/assets/js/sync.js"></script>`;
  html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + head) : head + html;
  if (!/^\/admin\//.test(urlPath)) {   // public pages: apply saved edits to the data before the first page script runs
    html = html.replace(/<script[^>]*src="[^"]*assets\/js\/(?!sync)[^"]*"/i, m => '<script src="/assets/js/overrides.js"></script>' + m);
  }
  return html;
}

/* ------------------------------------------------------------------ contact form */
function junky(t) { return /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ru|xyz|top|click|info|biz)\b)/i.test(t) || /(viagra|cialis|crypto|bitcoin|casino|seo services|backlinks|loan offer|click here|whatsapp|telegram|forex|guest post)/i.test(t); }
async function handleContact(req, res) {
  let b; try { b = JSON.parse(await body(req, 60 * 1024)); } catch (e) { return json(res, 400, { ok: false }); }
  const d = b.data || {}, clean = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, n);
  const m = { id: 'm' + Date.now().toString(36) + crypto.randomBytes(2).toString('hex'), status: 'new', name: (clean(d.first, 80) + ' ' + clean(d.last, 80)).trim(), email: clean(d.email, 160), phone: clean(d.phone, 40), interest: clean(d.interest, 60),
    list: (Array.isArray(b.saved) ? b.saved : []).slice(0, 20).map(id => titles[id]).filter(Boolean), goals: clean(d.goals, 2000), t: Date.now(), page: 'Home' };
  try { const r = new URL(req.headers.referer || '').pathname.replace(/\/+$/, '').split('/').pop(); if (r) m.page = (titles[r] || r.replace(/-/g, ' ')).replace(/^./, c => c.toUpperCase()); } catch (e) {}
  if (!m.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.email)) return json(res, 400, { ok: false });
  const why = [];
  if (b.hp) why.push('Hidden field was filled in (only automated tools do this)');
  if (!(b.signals >= 4)) why.push('No real mouse, touch or keyboard activity');
  if (!(b.elapsed >= 4)) why.push('Submitted in ' + (+b.elapsed || 0) + ' seconds (people take longer)');
  if (junky([m.name, m.goals].join(' '))) why.push('Message contains links or promotional words');
  const ip = ipOf(req);
  if (limited('c1:' + ip, 1, 90e3) || limited('c3:' + ip, 3, 3600e3)) why.push('Too many requests from one person');
  if (process.env.TURNSTILE_SECRET) {
    let ok = false;
    try { const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET, response: b.turnstile || '', remoteip: ip }) }); ok = (await r.json()).success === true; } catch (e) {}
    if (!ok) why.push('Human check failed');
  }
  if (why.length) { m.status = 'spam'; m.why = why; }
  let box = []; try { box = JSON.parse(state.shared['nps.inbox'] || '[]'); } catch (e) {}
  box.unshift(m); state.shared['nps.inbox'] = JSON.stringify(box.slice(0, 500)); save();
  if (m.status === 'new') notify(m);
  json(res, 200, { ok: true });          // bots get the same answer as people
}
async function notify(m) {
  let st = {}; try { st = JSON.parse(state.shared['nps.sendTo'] || '{}'); } catch (e) {}
  const to = st.to || process.env.NOTIFY_TO, key = process.env.RESEND_API_KEY; if (!to || !key) return;
  const full = /Everything/.test(st.incl || '');
  const L = ['New consultation request', '', 'Name: ' + m.name, 'Email: ' + m.email, m.phone ? 'Phone: ' + m.phone : null, m.interest ? 'Interested in: ' + m.interest : null, m.list.length ? 'Saved list: ' + m.list.join(', ') : null, full && m.goals ? 'Goals: ' + m.goals : null, '', 'Open the Admin Inbox to see the full request.'];
  const text = L.filter(x => x !== null).join('\n');
  try { await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.MAIL_FROM || 'Newman Preview <onboarding@resend.dev>', to: [to].concat(st.cc ? [st.cc] : []), subject: 'New consultation request from ' + m.name, text }) }); } catch (e) { console.error('mail failed', e.message); }
}

/* ------------------------------------------------------------------ static files */
function findFile(urlPath) {
  let p; try { p = decodeURIComponent(urlPath); } catch (e) { return null; }
  const um = p.match(/^\/uploads\/([a-f0-9]{20}\.(?:jpg|png|webp))$/); if (um) { const f = path.join(UPLOADS, um[1]); return fs.existsSync(f) ? f : null; }
  if (p.includes('\0')) return null;
  const rel = path.normalize(p).replace(/^([/\\])+/, '');
  if (rel.startsWith('..')) return null;
  const first = rel.split(path.sep)[0];
  if (first === 'tools' || first === 'node_modules') return null;
  const m = rel.match(/^procedures[\\/]([^\\/]+)/); if (m && removed.includes(m[1])) return null;
  for (const base of [BUILD, ROOT]) {
    let f = path.join(base, rel);
    if (!f.startsWith(base)) continue;
    try { const st = fs.statSync(f); if (st.isDirectory()) { f = path.join(f, 'index.html'); fs.statSync(f); } return f; } catch (e) { /* next */ }
  }
  return null;
}

/* ------------------------------------------------------------------ server */
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x'), p = url.pathname, ck = cookies(req);
    if (p === '/healthz') return send(res, 200, 'ok', { 'Content-Type': 'text/plain' });

    /* gate */
    const gated = !!PASS, inGate = !gated || checkToken('gate', ck.nps_gate);
    if (p === '/__gate') {
      if (req.method === 'POST') {
        const f = new URLSearchParams(await body(req, 4096));
        if (limited('g:' + ipOf(req), 8, 600e3)) return send(res, 429, gatePage('/', true), { 'Content-Type': 'text/html; charset=utf-8' });
        if (same(f.get('password') || '', PASS)) { res.setHeader('Set-Cookie', setCookie(req, 'nps_gate', makeToken('gate', 24 * 30), 24 * 30)); return send(res, 303, '', { Location: safeNext(f.get('next')) }); }
        return send(res, 401, gatePage(safeNext(f.get('next')), true), { 'Content-Type': 'text/html; charset=utf-8' });
      }
      return send(res, 200, gatePage(safeNext(url.searchParams.get('next')), false), { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    }
    if (!inGate) {
      if (p.startsWith('/api/')) return json(res, 401, { ok: false, error: 'locked' });
      if (req.method === 'GET' && /(^\/$|\/$|\.html$)/.test(p)) return send(res, 302, '', { Location: '/__gate?next=' + encodeURIComponent(p + url.search) });
      return send(res, 401, 'Password required', { 'Content-Type': 'text/plain' });
    }

    const isAdmin = checkToken('admin', ck.nps_admin);

    /* admin sign-in */
    if (p === '/api/admin/login' && req.method === 'POST') {
      if (limited('a:' + ipOf(req), 8, 600e3)) return json(res, 429, { ok: false, error: 'Too many tries. Please wait a few minutes.' });
      let b = {}; try { b = JSON.parse(await body(req, 4096)); } catch (e) {}
      if (ADMIN_PASS && same(b.password || '', ADMIN_PASS)) { res.setHeader('Set-Cookie', setCookie(req, 'nps_admin', makeToken('admin', 12), 12)); return json(res, 200, { ok: true }); }
      return json(res, 401, { ok: false, error: 'That password was not right.' });
    }
    if (p === '/api/admin/logout') { res.setHeader('Set-Cookie', clearCookie('nps_admin')); return json(res, 200, { ok: true }); }
    if (p === '/api/contact' && req.method === 'POST') return await handleContact(req, res);

    /* admin API */
    if (p.startsWith('/api/')) {
      if (!isAdmin) return json(res, 401, { ok: false, error: 'Please sign in to the Admin.' });
      let m;
      if ((m = p.match(/^\/api\/state\/([\w.]+)$/)) && ALL_KEYS.includes(m[1])) {
        const k = m[1], store = PUB_KEYS.includes(k) ? state.draft : state.shared;
        if (req.method === 'PUT') { store[k] = await body(req, 40 * 1024 * 1024); save(); return json(res, 200, { ok: true }); }
        if (req.method === 'DELETE') { delete store[k]; save(); return json(res, 200, { ok: true }); }
      }
      if (p === '/api/upload' && req.method === 'POST') {          // photos from the Admin (already resized in the browser)
        const buf = await bodyBuf(req, 8 * 1024 * 1024);
        const ext = buf.slice(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) ? '.jpg' : buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) ? '.png' : (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') ? '.webp' : '';
        if (!ext) return json(res, 400, { ok: false, error: 'Please choose a JPG, PNG or WebP picture.' });
        const name = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 20) + ext;
        fs.writeFileSync(path.join(UPLOADS, name), buf);
        return json(res, 200, { ok: true, url: '/uploads/' + name });
      }
      if (p === '/api/publish' && req.method === 'POST') {
        PUB_KEYS.forEach(k => { if (k in state.draft) state.published[k] = state.draft[k]; else delete state.published[k]; });
        save(); const host = req.headers['x-forwarded-host'] || req.headers.host, r = await rebuild((isSecure(req) ? 'https://' : 'http://') + host);
        return json(res, r.ok ? 200 : 500, r);
      }
      if (p === '/api/discard' && req.method === 'POST') { state.draft = Object.assign({}, state.published); save(); return json(res, 200, { ok: true }); }
      if (p === '/api/export') return send(res, 200, JSON.stringify(state, null, 2), { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="newman-preview-backup.json"' });
      return json(res, 404, { ok: false });
    }

    if (p === '/admin') return send(res, 302, '', { Location: '/admin/' });
    /* admin pages need the admin sign-in (the sign-in page itself does not) */
    if (/^\/admin(\/|$)/.test(p) && !/^\/admin\/signin\.html$/.test(p) && !isAdmin) return send(res, 302, '', { Location: '/admin/signin.html' });

    /* files */
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', { 'Content-Type': 'text/plain' });
    let file = findFile(p === '/admin' ? '/admin/' : p);
    if (!file) { const nf = findFile('/404.html'); return send(res, 404, nf ? fs.readFileSync(nf) : 'Not found', { 'Content-Type': nf ? MIME['.html'] : 'text/plain' }); }
    const ext = path.extname(file).toLowerCase();
    if (ext === '.html') {
      const html = transform(fs.readFileSync(file, 'utf8'), req, isAdmin, p);
      return send(res, 200, req.method === 'HEAD' ? '' : html, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
    }
    const st = fs.statSync(file), etag = '"' + st.size.toString(36) + '-' + Math.round(st.mtimeMs).toString(36) + '"';
    const cache = file.startsWith(UPLOADS) ? 'public, max-age=31536000, immutable' : /\/(sync|overrides|admin-shell)\.js$/.test(file) ? 'no-cache' : /\.(webp|jpe?g|png|svg|woff2?)$/.test(ext) ? 'public, max-age=86400' : 'public, max-age=300';
    if (req.headers['if-none-match'] === etag) return send(res, 304, '', { ETag: etag, 'Cache-Control': cache });
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': st.size, ETag: etag, 'Cache-Control': cache, 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) send(res, e.code === 413 ? 413 : 500, e.code === 413 ? 'Too large' : 'Server error', { 'Content-Type': 'text/plain' }); else res.end();
  }
});
server.listen(PORT, () => console.log(`Newman preview on :${PORT}  gate=${PASS ? 'on' : 'OFF'}  data=${DATA}`));
