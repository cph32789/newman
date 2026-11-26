/* ------------------------------------------------------------------
   LIBRARY: before & after cases.
   Admin ("Library") will manage this list. The team can:
     - upload photos or videos and attach them to one or more procedures
     - mark each case Visible / Hidden
     - drag cases into the order they want
     - choose which details are shown for each case (show.*)
   Every procedure page shows its visible cases automatically, in order.

   Case fields (the same details the current website shows)
     procedures   which procedure pages it appears on
     primary      the ONE procedure whose page shows it in full (others link to it)
     title        e.g. "Abdominoplasty"          addOn   e.g. "with Liposuction to Hips and Thighs"
     age, height, weight, implant, postop        patient     e.g. "Patient 1"
     visible      true/false                      order       lower shows first
     views        one or more Before/After pairs  (front, side, three-quarter ...)
     show         which details are public for this case

   Photo fit (focus point, zoom) works exactly like every other image on the
   site: never stretched, saved per photo.

   NOTE: details below were copied from the current website's gallery
   ordering. Verify each case against the original records before launch.
------------------------------------------------------------------- */
window.NPS = window.NPS || {};
(function () {
  var L = (window.NPS_BASE || '') + 'assets/img/library/';
  function img(id, w, h, alt) { NPS.images[id] = { src: L + id + '.webp', w: w, h: h, alt: alt }; return id; }
  function ph(id, w, h, alt, fx, fy) { return { image: img(id, w, h, alt), fx: fx == null ? 50 : fx, fy: fy == null ? 40 : fy, zoom: 1 }; }

  NPS.library = { cases: [
    { id: 'facelift-1', procedures: ['facelift'], primary: 'facelift', title: 'Facelift', addOn: 'with TCA peel', patient: 'Patient 1', age: 46, postop: '8 months post-op', visible: true, order: 1,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [
        { label: 'Front', before: ph('facelift-1-front-before', 446, 356, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-1-front-after', 379, 304, 'After: facelift patient, front view', 50, 35) },
        { label: 'Side',  before: ph('facelift-1-side-before', 464, 370, 'Before: facelift patient, side view', 60, 40), after: ph('facelift-1-side-after', 424, 339, 'After: facelift patient, side view', 60, 40) }
      ] },

    { id: 'breast-aug-1', procedures: ['breast-augmentation'], primary: 'breast-augmentation', title: 'Breast augmentation', addOn: 'with circum-areolar left breast lift', patient: 'Patient 1', age: 28, height: '5′3″', weight: '130 lbs',
      implant: 'Silicone, smooth, moderate profile. Right 397 cc, left 371 cc', visible: true, order: 1,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-1-before', 800, 533, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-1-after', 800, 533, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: 'breast-aug-2', procedures: ['breast-augmentation'], primary: 'breast-augmentation', title: 'Breast augmentation', patient: 'Patient 4', visible: true, order: 2,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-2-before', 800, 533, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-2-after', 800, 533, 'After: breast augmentation patient, front view', 50, 40) } ] },

    { id: 'tummy-1', procedures: ['tummy-tuck', 'mommy-makeover'], primary: 'tummy-tuck', title: 'Abdominoplasty', addOn: 'with liposuction to hips and thighs', patient: 'Patient 1', age: 32, height: '5′4″', weight: '180 lbs', visible: true, order: 1,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [
        { label: 'Three-quarter', before: ph('tummy-1-3q-before', 663, 528, 'Before: abdominoplasty patient, three-quarter view', 50, 45), after: ph('tummy-1-3q-after', 662, 534, 'After: abdominoplasty patient, three-quarter view', 50, 45) },
        { label: 'Front', before: ph('tummy-1-front-before', 578, 562, 'Before: abdominoplasty patient, front view', 50, 45), after: ph('tummy-1-front-after', 546, 562, 'After: abdominoplasty patient, front view', 50, 45) }
      ] },

    { id: 'inject-1', procedures: ['botox', 'fillers'], primary: 'botox', title: 'Injectable treatment', patient: 'Patient 1', visible: true, order: 1,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('inject-1-before', 800, 533, 'Before: injectable treatment patient, front view', 50, 35), after: ph('inject-1-after', 800, 533, 'After: injectable treatment patient, front view', 50, 35) } ] }
  ] };

  /* 18+ CONFIRMATION: Admin ("Galleries") chooses which procedures need it.
     A case is locked when ANY procedure it belongs to is in this list.
     Today only the breast procedures require it. */
  NPS.library.ageGate = { procedures: ['breast-augmentation', 'breast-lift', 'breast-reduction', 'breast-reconstruction', 'male-breast-reduction', 'implant-exchange'] };
})();
