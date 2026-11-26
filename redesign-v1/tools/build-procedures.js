#!/usr/bin/env node
/**
 * Builds one real web page per procedure from ONE standard format.
 *
 *   node redesign-v1/tools/build-procedures.js
 *
 * Inputs : data/procedures.js, data/procedure-content.js, data/library.js, data/images.js
 *          and the header / footer / sheets of index.html (so every page matches)
 * Output : procedures/<id>/index.html  (one per procedure)
 *
 * Why static pages: each procedure gets its own address and its own social
 * preview (title, description, image) so posts and pages can link to each other.
 * Admin will run this same build when the team presses "Publish".
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://cph32789.github.io/newman/redesign-v1/';   // change when the real domain is connected
const VERSION = (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/\?v=([0-9a-z]+)/) || [])[1] || '1';

/* ---- load the data files exactly as the browser does ---- */
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
['data/site.js', 'data/procedures.js', 'data/images.js', 'data/library.js', 'data/feed.js', 'data/procedure-content.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx));
const NPS = ctx.NPS, P = NPS.procedures, byId = Object.fromEntries(P.map(p => [p.id, p]));

/* ---- shared chunks copied from the home page, so every page is identical in chrome ---- */
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const grab = (re, name) => { const m = home.match(re); if (!m) throw new Error('home chunk not found: ' + name); return m[0]; };
const sprite = grab(/<svg width="0"[\s\S]*?<\/svg>/, 'sprite');
const header = grab(/<header class="hdr"[\s\S]*?<\/header>/, 'header');
const footer = grab(/<footer class="foot">[\s\S]*?<\/footer>/, 'footer');
const tabbar = grab(/<nav class="tabbar"[\s\S]*?<\/nav>/, 'tabbar');
const consult = grab(/<section class="consult section" id="consult"[\s\S]*?<\/section>/, 'consult');
const sheets = home.slice(home.indexOf('<dialog class="sheet full searchscreen"'), home.indexOf('<div class="toast"'));
const toBase = h => h
  .replace(/href="#top"/g, 'href="../../"')
  .replace(/href="#(discover|surgeon|results|visit)"/g, 'href="../../#$1"')
  .replace(/(src|href)="assets\//g, '$1="../../assets/');

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const short = t => t.replace(/\s*\(.*\)/, '');
const ASSET = f => '../../assets/img/' + f;

function titleHtml(t) {                         // "Nose surgery (rhinoplasty)" -> serif-italic accent
  const m = t.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? `${esc(m[1])} <em>(${esc(m[2])})</em>` : esc(t);
}
function img(slot, key, fx, fy, extra) {
  const im = NPS.images[key];
  return `<img class="fit" data-slot="${slot}" src="${ASSET(im.src.replace(/^.*assets\/img\//, ''))}" alt="${esc(im.alt)}" width="${im.w}" height="${im.h}" style="--fx:${fx}%;--fy:${fy}%;--zoom:1;--fit:cover"${extra || ''}>`;
}

function build(p) {
  const kind = p.kind === 'surgical' ? 'surgical' : 'non-surgical';
  const D = NPS.procDefaults[kind], O = NPS.procOverrides[p.id] || {};
  const name = short(p.title);
  const overview = O.overview || [p.detail, 'At your consultation, Dr. Newman will listen to your goals, explain your options clearly, and give you an honest picture of what to expect, including risks, recovery and cost.'];
  const glance = O.glance || D.glance, good = O.good || D.good, discuss = O.discuss || D.discuss, steps = O.steps || D.steps;
  const faq = NPS.procFaq.map(([q, a]) => [q.replace('{t}', name), a.replace('{recovery}', D.recovery)]);
  const sameCat = P.filter(x => x.cat === p.cat), i = sameCat.findIndex(x => x.id === p.id);
  const prev = sameCat[(i - 1 + sameCat.length) % sameCat.length], next = sameCat[(i + 1) % sameCat.length];
  const related = (p.related || []).map(r => byId[r]).filter(Boolean).slice(0, 3);
  const url = SITE_URL + 'procedures/' + p.id + '/';
  const desc = (p.blurb + ' ' + p.detail).slice(0, 158).replace(/\s+\S*$/, '') + '…';
  const ogImg = SITE_URL + 'assets/share/procedures/' + p.id + '.jpg?v=' + VERSION;  // made by tools/share-cards.js
  const catHash = '../../#explore/' + encodeURIComponent(p.cat);

  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'MedicalWebPage', name: p.title + ' | Newman Plastic Surgery', url, description: desc, about: { '@type': 'MedicalProcedure', name }, isPartOf: { '@type': 'WebSite', name: 'Newman Plastic Surgery', url: SITE_URL } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Procedures', item: SITE_URL + '#explore' },
      { '@type': 'ListItem', position: 2, name: p.cat, item: SITE_URL + '#explore/' + encodeURIComponent(p.cat) },
      { '@type': 'ListItem', position: 3, name: name, item: url } ] } ] };

  return `<!doctype html>
<html lang="en" class="pp">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(name)} in Orlando, Florida | Newman Plastic Surgery</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0A2A2F">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Newman Plastic Surgery"><meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(p.title)} · Newman Plastic Surgery"><meta property="og:description" content="${esc(p.blurb)} ${esc(p.detail.split('. ')[0])}.">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}"><meta property="og:image:secure_url" content="${ogImg}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(p.title)} at Newman Plastic Surgery, Orlando">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)} · Newman Plastic Surgery"><meta name="twitter:description" content="${esc(p.blurb)}"><meta name="twitter:image" content="${ogImg}">
<link rel="icon" href="../../assets/img/favicon.png">
<link rel="preload" href="../../assets/fonts/DMSans-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../../assets/css/fonts.css?v=${VERSION}">
<link rel="stylesheet" href="../../assets/css/styles.css?v=${VERSION}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body id="top" data-proc="${p.id}">
${sprite}
<a class="skip" href="#main">Skip to content</a>
${toBase(header)}

<main id="main">

<!-- 1. HERO -->
<div class="wrap crumbs" aria-label="Breadcrumb">
  <a class="back" href="${catHash}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>${esc(p.cat)}</a>
  <span class="full"><a href="../../#explore">Procedures</a><span class="sep">/</span><a href="${catHash}">${esc(p.cat)}</a><span class="sep">/</span><span aria-current="page">${esc(name)}</span></span>
</div>
<section class="phero wrap" aria-labelledby="h1">
  <div class="ptext">
    <p class="eyebrow">${esc(p.cat)} · ${kind === 'surgical' ? 'Surgical' : 'Non-surgical'}</p>
    <h1 id="h1" class="display" style="margin-top:14px">${titleHtml(p.title)}</h1>
    <p class="dblurb">${esc(p.blurb)}</p>
    <div class="acts">
      <a class="btn btn--ink" href="#consult" data-toconsult="${p.id}">Request a consultation <svg><use href="#i-arrow"/></svg></a>
      <button class="btn btn--line" type="button" data-save="${p.id}" aria-pressed="false" aria-label="Save">${'<svg><use href="#i-heart"/></svg>'}<span class="sv">Save</span></button>
      <button class="btn btn--line" type="button" data-share="${p.id}" aria-label="Share">${'<svg><use href="#i-share"/></svg>'}<span>Share</span></button>
    </div>
    ${(p.aka || []).filter(a => a.toLowerCase() !== p.title.toLowerCase() && a.length < 26).length ? `<p class="aka">Also known as ${(p.aka || []).filter(a => a.toLowerCase() !== p.title.toLowerCase() && a.length < 26).slice(0, 4).map(esc).join(', ')}</p>` : ''}
  </div>
  <div class="pimg frame">${img('proc.' + p.id, p.img, 50, 38, ' fetchpriority="high"')}</div>
</section>

<!-- Sticky section navigation (stays visible while you read) -->
<div class="ptabs" id="ptabs">
  <div class="wrap">
    <nav aria-label="On this page">
      <a href="#overview" data-sec="overview" aria-current="true">Overview</a>
      <a href="#process" data-sec="process">Process</a>
      <a href="#results" data-sec="results">Results</a>
      <a href="#faq" data-sec="faq">FAQ</a>
    </nav>
    <a class="btn btn--ink btn--sm" href="#consult" data-toconsult="${p.id}">Request a consultation</a>
  </div>
</div>

<!-- 2. OVERVIEW -->
<section class="section" id="overview" aria-labelledby="ovT">
  <div class="wrap pgrid">
    <div class="pmain">
      <p class="eyebrow">Overview</p>
      <h2 id="ovT" class="h2">About <em>${esc(name)}.</em></h2>
      ${overview.map(t => `<p>${esc(t)}</p>`).join('\n      ')}
      <h3>May be a good fit if</h3>
      <ul class="ticks">${good.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <h3>Worth discussing at your consultation</h3>
      <ul class="dotsl">${discuss.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    </div>
    <aside class="glance" aria-label="At a glance">
      <h3>At a glance</h3>
      <dl>${glance.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </aside>
  </div>
</section>

<!-- 3. PROCESS -->
<section class="section on-sand" id="process" aria-labelledby="prT">
  <div class="wrap">
    <div class="head head--split"><div><p class="eyebrow">What to expect</p><h2 id="prT" class="h2" style="margin-top:14px">Your path, <em>step by step.</em></h2></div>
    <p class="lead" style="max-width:24em">No pressure and no surprises. You decide at every step.</p></div>
    <div class="steps four">${steps.map(([t, d], n) => `<div class="step"><span class="n">${n + 1}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></div>`).join('')}</div>
  </div>
</section>

<!-- 4. RESULTS (managed in the Library) -->
<section class="section on-dark" id="results" aria-labelledby="reT">
  <div class="wrap">
    <div class="head head--split"><div><p class="eyebrow">Real results</p><h2 id="reT" class="h2" style="margin-top:14px">See the <em>difference.</em></h2></div>
    <p class="lead" style="max-width:26em">Photos of ${esc(name.toLowerCase())} patients, shared with permission. Every person and outcome is different.</p></div>
    <div class="cases" id="cases" data-proc="${p.id}"></div>
    <div class="rfoot" style="margin-top:34px">
      <p class="note">Individual results vary. Some photographs are available only during an office visit.${p.cat === 'Breast' ? ' Breast photos require age confirmation (18+).' : ''}</p>
      <button class="btn btn--champagne" data-soon="The full results gallery is part of the next build.">View the full gallery <svg><use href="#i-arrow"/></svg></button>
    </div>
  </div>
</section>

<!-- 5. FAQ -->
<section class="section" id="faq" aria-labelledby="faT">
  <div class="wrap pgrid" style="align-items:start">
    <div class="pmain"><p class="eyebrow">Good questions</p><h2 id="faT" class="h2">Before you <em>decide.</em></h2>
      <p>Can’t find your question? <button class="link" data-toconsult="${p.id}" style="display:inline-flex">Ask us</button></p></div>
    <div class="faqs">${faq.map(([q, a], n) => `<details${n === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>

<!-- 6. RELATED + PREVIOUS / NEXT -->
<section class="section on-sand" id="related" aria-labelledby="rlT">
  <div class="wrap">
    <div class="head"><p class="eyebrow">You may also like</p><h2 id="rlT" class="h2">Related <em>procedures.</em></h2></div>
    <div class="rel-grid">${related.map(r => `<a class="rcard" href="../${r.id}/"><span class="rimg frame">${img('procCard.' + r.id, r.img, 50, 40)}</span><span class="rbody"><span class="eyebrow">${esc(r.cat)}</span><b>${esc(short(r.title))}</b><span class="muted">${esc(r.blurb)}</span></span></a>`).join('')}</div>
    <div class="pager" style="margin-top:34px">
      <a href="../${prev.id}/"><small>Previous in ${esc(p.cat)}</small><b>${esc(short(prev.title))}</b></a>
      <a href="../${next.id}/" class="next"><small>Next in ${esc(p.cat)}</small><b>${esc(short(next.title))}</b></a>
    </div>
    <p class="note" style="margin-top:26px">Sample content for the design review. Procedure details are general and need Dr. Newman’s review before launch.</p>
  </div>
</section>

${toBase(consult)}

</main>

${toBase(footer)}
${toBase(tabbar)}
${toBase(sheets)}
<dialog class="sheet center" id="sheet-age" aria-labelledby="age-t">
  <span class="grab"></span>
  <div class="top"><h2>Age confirmation</h2><button class="close" data-close aria-label="Close"><svg><use href="#i-close"/></svg></button></div>
  <div class="scroll">
    <h3 id="age-t" class="dtitle" style="margin-top:6px">Are you 18 <em style="font-family:var(--serif);font-style:italic;color:var(--clay-ink)">or older?</em></h3>
    <p class="dtext">These photographs show breast surgery results and are intended for adults only. Please confirm you are at least 18 years of age to continue.</p>
    <div class="dacts" style="margin-top:26px"><button class="btn btn--ink" id="age-yes" type="button">Yes, I am 18 or older</button><button class="btn btn--line" id="age-no" type="button">No</button></div>
    <p class="note" id="age-msg" role="status" style="margin-top:14px;min-height:22px"></p>
  </div>
</dialog>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>window.NPS_BASE='../../';</script>
<script src="../../data/site.js?v=${VERSION}"></script>
<script src="../../data/procedures.js?v=${VERSION}"></script>
<script src="../../data/feed.js?v=${VERSION}"></script>
<script src="../../data/images.js?v=${VERSION}"></script>
<script src="../../data/procedure-content.js?v=${VERSION}"></script>
<script src="../../data/library.js?v=${VERSION}"></script>
<script src="../../assets/js/search.js?v=${VERSION}"></script>
<script src="../../assets/js/app.js?v=${VERSION}"></script>
<script src="../../assets/js/procedure.js?v=${VERSION}"></script>
</body>
</html>
`;
}

let n = 0;
P.forEach(p => {
  const dir = path.join(ROOT, 'procedures', p.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), build(p));
  n++;
});
console.log('built', n, 'procedure pages');
