#!/usr/bin/env node
/**
 * Makes the "share card": the 1200 x 630 picture people see when they paste a
 * link into iMessage, Facebook, WhatsApp, email, Slack and so on.
 *
 *   node redesign-v1/tools/share-cards.js
 *
 * Output: assets/share/landing.jpg, assets/share/home.jpg,
 *         assets/share/procedures/<id>.jpg   (one per procedure)
 * Needs Playwright (dev tool only; the website itself needs nothing).
 * Admin will run this when the team presses "Publish", so a new procedure
 * gets its own card automatically.
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
['data/site.js', 'data/procedures.js', 'data/images.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx));
const NPS = ctx.NPS, P = NPS.procedures;
const MIME = { '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const cache = {};
/* Embed assets as data URIs so the card renders the same everywhere (no file access needed). */
const url = rel => cache[rel] || (cache[rel] = 'data:' + MIME[path.extname(rel)] + ';base64,' + fs.readFileSync(path.join(ROOT, rel)).toString('base64'));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function nameHtml(t) {                       // "Nose surgery (rhinoplasty)" -> serif italic accent
  const m = t.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? `${esc(m[1])} <em>(${esc(m[2])})</em>` : esc(t);
}
function html({ eyebrow, title, blurb, image, fx, fy, size }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'DM Sans';src:url('${url('assets/fonts/DMSans-normal.woff2')}') format('woff2');font-weight:300 700}
@font-face{font-family:'Cormorant Garamond';font-style:italic;src:url('${url('assets/fonts/CormorantGaramond-italic.woff2')}') format('woff2');font-weight:300 700}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#0A2A2F;font-family:'DM Sans',sans-serif;color:#FFFBF4;overflow:hidden}
.card{position:relative;width:1200px;height:630px;display:flex}
.photo{position:absolute;right:0;top:0;bottom:0;width:640px;background:url('${url(image)}') ${fx}% ${fy}%/cover no-repeat}
.photo::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0A2A2F 0%,rgba(10,42,47,.78) 18%,rgba(10,42,47,0) 52%),linear-gradient(0deg,rgba(6,25,29,.55),rgba(6,25,29,0) 38%)}
.left{position:relative;z-index:2;width:760px;padding:54px 0 50px 64px;display:flex;flex-direction:column;justify-content:space-between}
.logo{align-self:flex-start;background:#F8F2E8;border-radius:16px;padding:13px 22px}
.logo img{height:46px;display:block}
.eyebrow{font:600 20px/1 'DM Sans';letter-spacing:.18em;text-transform:uppercase;color:#EBD3A9;margin-bottom:20px}
h1{font:400 ${size}px/1.0 'DM Sans';letter-spacing:-.04em;max-width:660px}
h1 em{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:400;letter-spacing:-.02em;color:#EBD3A9;font-size:1.08em}
.blurb{font:italic 400 31px/1.22 'Cormorant Garamond',serif;color:rgba(255,251,244,.86);margin-top:22px;max-width:560px}
.foot{display:flex;align-items:center;gap:16px;font:500 22px/1 'DM Sans';color:rgba(255,251,244,.9)}
.foot i{width:46px;height:2px;background:#EBD3A9;display:block}
</style></head><body><div class="card"><div class="photo"></div>
<div class="left"><div class="logo"><img src="${url('assets/img/logo.png')}"></div>
<div><div class="eyebrow">${esc(eyebrow)}</div><h1>${title}</h1>${blurb ? `<p class="blurb">${esc(blurb)}</p>` : ''}</div>
<div class="foot"><i></i>Newman Plastic Surgery · Orlando, Florida</div></div></div></body></html>`;
}
const sizeFor = t => { const n = t.length; return n <= 12 ? 120 : n <= 20 ? 100 : n <= 28 ? 82 : n <= 38 ? 68 : 58; };

(async () => {
  fs.mkdirSync(path.join(ROOT, 'assets/share/procedures'), { recursive: true });
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  async function shoot(file, spec) {
    await page.setContent(html(spec), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(120);
    await page.screenshot({ path: path.join(ROOT, 'assets/share', file), type: 'jpeg', quality: 88 });
  }
  await shoot('home.jpg', { eyebrow: 'Plastic surgery & aesthetics', title: 'The beauty of feeling <em>like you.</em>', blurb: 'Thoughtfully considered plastic surgery. Deeply personal care.', image: 'assets/img/hero-1600.webp', fx: 72, fy: 24, size: 88 });
  await shoot('landing.jpg', { eyebrow: 'Website redesign preview', title: 'Newman Plastic Surgery <em>redesign.</em>', blurb: 'See the new home page and explore the earlier concepts.', image: 'assets/img/hero-1600.webp', fx: 72, fy: 24, size: 76 });
  await shoot('meet-dr-newman.jpg', { eyebrow: 'Meet your surgeon', title: 'Charles Newman, Jr., <em>M.D.</em>', blurb: 'Board certified plastic and reconstructive surgeon in Orlando.', image: 'assets/img/hero-1600.webp', fx: 72, fy: 24, size: 78 });
  await shoot('results.jpg', { eyebrow: 'Results', title: 'Real people. <em>Individual possibilities.</em>', blurb: 'Before-and-after photos shared with permission.', image: 'assets/img/hero-1600.webp', fx: 72, fy: 24, size: 74 });
  await shoot('insurance-financing.jpg', { eyebrow: 'Your care', title: 'Insurance <em>& financing.</em>', blurb: 'Clear answers about coverage and payment.', image: 'assets/img/hero-1600.webp', fx: 72, fy: 24, size: 78 });
  await shoot('location.jpg', { eyebrow: 'Visit us', title: 'Find us in <em>Orlando.</em>', blurb: '444 North Mills Avenue · 407.481.9505', image: 'assets/img/hero-1600.webp', fx: 72, fy: 24, size: 84 });
  await shoot('your-visit.jpg', { eyebrow: 'Your visit', title: 'Nothing to prepare. <em>Just come as you are.</em>', blurb: 'What happens at a consultation.', image: 'assets/img/hero-1600.webp', fx: 72, fy: 24, size: 66 });
  for (const p of P) {
    const im = NPS.images[p.img], rel = im.src.replace(/^.*assets\/img\//, 'assets/img/');
    await shoot('procedures/' + p.id + '.jpg', { eyebrow: p.cat + ' · ' + (p.kind === 'surgical' ? 'Surgical' : 'Non-surgical'), title: nameHtml(p.title), blurb: p.blurb, image: rel, fx: 50, fy: 38, size: sizeFor(p.title) });
  }
  await b.close();
  console.log('made', 7 + P.length, 'share cards');
})();
