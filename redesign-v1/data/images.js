/* ------------------------------------------------------------------
   IMAGE MODEL (the rule behind every picture on the site)

   1. An image is NEVER stretched, squished or force-filled. It is drawn
      inside a frame with its true proportions (crop = "cover", or show
      whole = "contain"). Distortion is not an option.
   2. Whenever an image is placed or replaced, the person chooses how it
      fits the space: where the focus is (x, y), how far it is zoomed,
      and cover / contain. Those choices are SAVED with the slot and are
      what every visitor sees.
   3. A slot can have different settings on phone and desktop.

   Library   : NPS.images[id]          the picture itself + description
   Slots     : NPS.slotDefaults[slot]  which picture, and its default fit
   Overrides : NPS.imageSettings[slot] what the team saved in Admin
               (this demo also reads localStorage "nps.imageSettings")

   Fit settings per slot
     image  library id        fx / fy  focus point, 0-100 (%)
     zoom   1 to 3            fit      "cover" | "contain"
     m      optional phone overrides {fx, fy, zoom, fit}
------------------------------------------------------------------- */
window.NPS = window.NPS || {};
var A = (window.NPS_BASE || '') + 'assets/img/';
NPS.images = {
  'hero-1600':{ src:A+'hero-1600.webp', w:1600, h:899, alt:'Illustrative portrait of a confident woman in warm evening light' },
  'hero-m':   { src:A+'hero-m.webp',    w:900,  h:929, alt:'Illustrative portrait of a confident woman in warm evening light' },
  'cat-face': { src:A+'cat-face.webp',  w:720,  h:951, alt:'Illustrative model with softly lit, naturally rested skin' },
  'cat-breast':{src:A+'cat-breast.webp',w:720,  h:1080,alt:'Illustrative model in an ivory silk camisole' },
  'cat-body': { src:A+'cat-body.webp',  w:720,  h:1080,alt:'Illustrative model standing in an ivory swimsuit and linen wrap' },
  'chest':    { src:A+'chest.webp',    w:575,  h:613, alt:'Illustrative model’s collarbones and chest in an ivory silk camisole' },
  'torso':    { src:A+'torso.webp',    w:575,  h:670, alt:'Illustrative model’s full torso, from shoulders to hips, in an ivory swimsuit' },
  'cat-skin': { src:A+'cat-skin.webp',  w:720,  h:1080,alt:'Illustrative model with glowing skin resting her hand on her cheek' },
  'f-eyes':   { src:A+'f-eyes.webp',    w:640,  h:511, alt:'Close portrait of a woman’s eyes and cheek in soft light' },
  'f-eyes2':  { src:A+'f-eyes2.webp',   w:640,  h:468, alt:'Illustrative model looking to the side, lit in teal and amber' },
  'f-neck':   { src:A+'f-neck.webp',    w:640,  h:464, alt:'Illustrative model’s jawline and neck in warm light' },
  'f-hand':   { src:A+'f-hand.webp',    w:640,  h:699, alt:'Illustrative model with her hand at her chin' },
  'f-glow':   { src:A+'f-glow.webp',    w:640,  h:526, alt:'Illustrative model with radiant, even skin' },
  'f-silk':   { src:A+'f-silk.webp',    w:640,  h:556, alt:'Illustrative detail of an ivory silk camisole' },
  'f-poise':  { src:A+'f-poise.webp',   w:640,  h:480, alt:'Illustrative model standing with quiet confidence' },
  'dr-newman':{ src:A+'dr-newman.png',  w:341,  h:341, alt:'Charles E. Newman, Jr., MD' },
  'dzi-newman':{ src:A+'dzi-newman.png', w:341, h:341, alt:'Dzi-Long Newman, MPAS, PA-C' },
  'practice': { src:A+'practice.webp',  w:1348, h:717, alt:'The Newman Plastic Surgery office entrance on North Mills Avenue' }
};

/* Where each picture is used, and its default fit. fx/fy = focus point. */
NPS.slotDefaults = {
  'hero':            { image:'hero-1600', fx:70, fy:22, zoom:1, fit:'cover', m:{ image:'hero-m', fx:50, fy:18, zoom:1 } },
  'cat.face':        { image:'cat-face',   fx:50, fy:35, zoom:1, fit:'cover' },
  'cat.breast':      { image:'chest', fx:50, fy:45, zoom:1, fit:'cover' },
  'cat.body':        { image:'torso',    fx:50, fy:50, zoom:1, fit:'cover' },
  'cat.skin':        { image:'cat-skin',   fx:50, fy:30, zoom:1, fit:'cover' },
  'surgeon':         { image:'dr-newman',  fx:50, fy:50, zoom:1.4, fit:'cover' },
  'dzi':             { image:'dzi-newman', fx:50, fy:50, zoom:1.4, fit:'cover' },
  'visit':           { image:'practice',   fx:50, fy:50, zoom:1, fit:'cover' }
};
NPS.imageSettings = NPS.imageSettings || {};   /* Admin writes here (saved per slot) */

/* ---- Helpers used by every page ---- */
(function () {
  function stored() { try { return JSON.parse(localStorage.getItem('nps.imageSettings') || '{}'); } catch (e) { return {}; } }
  function pct(n) { return (Math.max(0, Math.min(100, +n)) || 0) + '%'; }
  var phone = function () { return window.matchMedia && window.matchMedia('(max-width: 759px)').matches; };

  /* Merge: defaults  <  saved in Admin  <  this browser's preview edits */
  NPS.slot = function (slot, extra) {
    var d = NPS.slotDefaults[slot] || {};
    var s = Object.assign({}, d, NPS.imageSettings[slot] || {}, stored()[slot] || {}, extra || {});
    if (phone() && s.m) s = Object.assign({}, s, s.m);
    s.image = s.image || (extra && extra.image);
    return s;
  };
  NPS.fitStyle = function (s) {
    return '--fx:' + pct(s.fx == null ? 50 : s.fx) + ';--fy:' + pct(s.fy == null ? 50 : s.fy) + ';--zoom:' + (s.zoom || 1) + ';--fit:' + (s.fit === 'contain' ? 'contain' : 'cover');
  };
  /* Markup for an image in a frame. Never sets width+height that could distort. */
  NPS.imgTag = function (slot, extra, attrs) {
    var s = NPS.slot(slot, extra), im = NPS.images[s.image];
    if (!im) return '';
    return '<img class="fit" src="' + im.src + '" alt="' + (attrs && attrs.alt != null ? attrs.alt : im.alt.replace(/"/g, '&quot;')) + '" width="' + im.w + '" height="' + im.h + '" loading="' + ((attrs && attrs.eager) ? 'eager' : 'lazy') + '" decoding="async" style="' + NPS.fitStyle(s) + '">';
  };
  /* Apply saved fit to images already in the HTML (data-slot="hero"). */
  NPS.applySlots = function (root) {
    (root || document).querySelectorAll('img[data-slot]').forEach(function (img) {
      var slot = img.getAttribute('data-slot');
      /* Only touch an image that has settings. Otherwise keep the fit it was built with. */
      if (!(NPS.slotDefaults[slot] || NPS.imageSettings[slot] || stored()[slot])) return;
      var s = NPS.slot(slot);
      img.style.cssText += ';' + NPS.fitStyle(s);
      var im = NPS.images[s.image];
      if (im && img.getAttribute('src') !== im.src && !img.closest('picture')) { img.src = im.src; }
    });
  };
})();
