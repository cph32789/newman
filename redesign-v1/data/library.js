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
    { id: 'breast-aug-2', procedures: ['breast-augmentation'], primary: 'breast-augmentation', title: 'Breast augmentation', patient: 'Patient 4', visible: true, order: 4,
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
      views: [ { label: 'Front', before: ph('inject-1-before', 800, 533, 'Before: injectable treatment patient, front view', 50, 35), after: ph('inject-1-after', 800, 533, 'After: injectable treatment patient, front view', 50, 35) } ] },
    /* IMPORT-START */
    { id: "facelift-p2", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Laser Resurfacing", patient: 'Patient 2', age: 63, postop: "3 years post-op", visible: true, order: 2,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p2-front-before', 312, 389, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p2-front-after', 318, 398, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p2-side-before', 522, 373, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p2-side-after', 687, 491, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p3", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Neck Lift, Earlobe Reduction", patient: 'Patient 3', age: 69, postop: "1 year post-op", visible: true, order: 3,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p3-front-before', 393, 313, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p3-front-after', 479, 384, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p3-side-before', 346, 346, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p3-side-after', 396, 396, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p4", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Upper and Lower Blepharoplasty", patient: 'Patient 4', age: 68, postop: "3 months post-op", visible: true, order: 4,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p4-front-before', 473, 663, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p4-front-after', 472, 663, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p4-side-before', 663, 663, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p4-side-after', 662, 664, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p5", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Upper and Lower Blepharoplasty, Laser Resurfacing", patient: 'Patient 5', age: 63, postop: "1 month post-op", visible: true, order: 5,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p5-front-before', 502, 626, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p5-front-after', 500, 626, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p5-side-before', 663, 530, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p5-side-after', 662, 533, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p6", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Upper and Lower Blepharoplasty, Brow Lift", patient: 'Patient 6', age: 65, postop: "8 months post-op", visible: true, order: 6,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p6-front-before', 663, 530, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p6-front-after', 662, 529, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p6-side-before', 663, 530, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p6-side-after', 662, 529, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p7", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Upper and Lower Blepharoplasty", patient: 'Patient 7', age: 51, postop: "7 months post-op", visible: true, order: 7,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p7-front-before', 663, 531, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p7-front-after', 662, 532, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p7-side-before', 663, 531, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p7-side-after', 662, 529, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p8", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Neck Lift, Fat Grafting and TCA peel", patient: 'Patient 8', age: 64, postop: "4 months post-op", visible: true, order: 8,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p8-front-before', 384, 308, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p8-front-after', 662, 531, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p8-side-before', 290, 364, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p8-side-after', 520, 649, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p9", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Upper and Lower Blepharoplasty, TCA peel", patient: 'Patient 9', age: 54, postop: "6 months post-op", visible: true, order: 9,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p9-front-before', 663, 531, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p9-front-after', 662, 531, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p9-side-before', 500, 628, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p9-side-after', 500, 628, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p10", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Fat Grafting and TCA peel", patient: 'Patient 10', age: 71, postop: "2 months post-op", visible: true, order: 10,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p10-front-before', 382, 304, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p10-front-after', 386, 306, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p10-side-before', 305, 382, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p10-side-after', 302, 378, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p11", procedures: ["facelift"], primary: "facelift", title: "Facelift", patient: 'Patient 11', age: 60, postop: "5 years post-op", visible: true, order: 11,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p11-front-before', 265, 332, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p11-front-after', 321, 401, 'After: facelift patient, front view', 50, 35) }, { label: 'Side', before: ph('facelift-p11-side-before', 428, 341, 'Before: facelift patient, side view', 50, 35), after: ph('facelift-p11-side-after', 468, 375, 'After: facelift patient, side view', 50, 35) } ] },
    { id: "facelift-p12", procedures: ["facelift"], primary: "facelift", title: "Facelift", patient: 'Patient 12', age: 66, postop: "1 year post-op", visible: true, order: 12,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p12-front-before', 657, 526, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p12-front-after', 447, 358, 'After: facelift patient, front view', 50, 35) } ] },
    { id: "facelift-p13", procedures: ["facelift"], primary: "facelift", title: "Facelift", addOn: "with Liposuction", patient: 'Patient 13', age: 27, postop: "2 months post-op", visible: true, order: 13,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('facelift-p13-front-before', 506, 632, 'Before: facelift patient, front view', 50, 35), after: ph('facelift-p13-front-after', 504, 632, 'After: facelift patient, front view', 50, 35) } ] },
    { id: "breast-aug-p2", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 2', age: 29, height: '5′4″', weight: '130 lbs', implant: "Smooth Round Moderate Profile Silicone, 325 cc", visible: true, order: 2,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p2-front-before', 373, 280, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p2-front-after', 373, 280, 'After: breast augmentation patient, front view', 50, 40) }, { label: 'Side', before: ph('breast-aug-p2-side-before', 373, 280, 'Before: breast augmentation patient, side view', 50, 40), after: ph('breast-aug-p2-side-after', 373, 280, 'After: breast augmentation patient, side view', 50, 40) } ] },
    { id: "breast-aug-p3", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 3', age: 39, height: '5′9″', weight: '129 lbs', implant: "Smooth Round High Profile Silicone, R 375 cc, L 325 cc", visible: true, order: 3,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p3-front-before', 373, 280, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p3-front-after', 373, 280, 'After: breast augmentation patient, front view', 50, 40) }, { label: 'Side', before: ph('breast-aug-p3-side-before', 373, 280, 'Before: breast augmentation patient, side view', 50, 40), after: ph('breast-aug-p3-side-after', 373, 280, 'After: breast augmentation patient, side view', 50, 40) } ] },
    { id: "breast-aug-p5", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", addOn: "with Circum-areolar Mastopexy", patient: 'Patient 5', age: 36, height: '5′4″', weight: '133 lbs', implant: "Smooth Round Moderate Profile Silicone, R 286 cc, L 304 cc", visible: true, order: 5,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p5-front-before', 373, 280, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p5-front-after', 373, 280, 'After: breast augmentation patient, front view', 50, 40) }, { label: 'Side', before: ph('breast-aug-p5-side-before', 373, 280, 'Before: breast augmentation patient, side view', 50, 40), after: ph('breast-aug-p5-side-after', 373, 280, 'After: breast augmentation patient, side view', 50, 40) } ] },
    { id: "breast-aug-p6", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 6', age: 21, implant: "Smooth Round Moderate Profile Saline 250 cc, inflated to R 275 cc, L 280 cc", visible: true, order: 6,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p6-front-before', 373, 280, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p6-front-after', 373, 280, 'After: breast augmentation patient, front view', 50, 40) }, { label: 'Side', before: ph('breast-aug-p6-side-before', 373, 280, 'Before: breast augmentation patient, side view', 50, 40), after: ph('breast-aug-p6-side-after', 373, 280, 'After: breast augmentation patient, side view', 50, 40) } ] },
    { id: "breast-aug-p8", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 8', age: 29, implant: "Moderate Profile Saline 330 cc, inflated to R 370 cc, L 340 cc", visible: true, order: 8,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p8-front-before', 800, 533, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p8-front-after', 800, 533, 'After: breast augmentation patient, front view', 50, 40) }, { label: 'Side', before: ph('breast-aug-p8-side-before', 800, 533, 'Before: breast augmentation patient, side view', 50, 40), after: ph('breast-aug-p8-side-after', 800, 533, 'After: breast augmentation patient, side view', 50, 40) } ] },
    { id: "breast-aug-p11", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 11', age: 35, height: '5′2″', weight: '105 lbs', implant: "High Profile Silicone Gel 375 cc", visible: true, order: 11,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p11-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p11-front-after', 625, 439, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p12", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 12', age: 20, height: '5′6″', weight: '112 lbs', implant: "High Profile Saline 280 cc, inflated to R 310 cc, L 290 cc", visible: true, order: 12,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p12-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p12-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p13", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 13', age: 26, height: '5′1″', weight: '115 lbs', implant: "Full Profile Silicone, R 345 cc, L 325 cc", visible: true, order: 13,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p13-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p13-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p15", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 15', age: 36, height: '5′6″', weight: '140 lbs', implant: "Extra Full Profile Silicone, R 470 cc, L 445 cc", visible: true, order: 15,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p15-front-before', 625, 413, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p15-front-after', 625, 421, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p16", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", addOn: "with Circum-areolar Mastopexy", patient: 'Patient 16', age: 39, height: '5′1″', weight: '105 lbs', implant: "Smooth Round Moderate Profile Silicone, R 330 cc, L 310 cc", visible: true, order: 16,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p16-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p16-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p18", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 18', age: 40, height: '5′5″', weight: '124 lbs', implant: "Smooth Round moderate profile silicone, 240 cc", visible: true, order: 18,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p18-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p18-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p19", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 19', age: 30, height: '5′5″', weight: '125 lbs', implant: "Smooth Round Moderate Profile Silicone, 304 cc", visible: true, order: 19,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p19-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p19-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p20", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", addOn: "with Areola Reduction", patient: 'Patient 20', age: 39, height: '5′6″', weight: '138 lbs', implant: "Smooth Round Full Profile Silicone, 385 cc", visible: true, order: 20,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p20-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p20-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p21", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 21', age: 63, height: '5′2″', weight: '123 lbs', implant: "Smooth Round Moderate Profile Silicone, 310 cc", visible: true, order: 21,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p21-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p21-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p22", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 22', age: 27, height: '5′4″', weight: '175 lbs', implant: "Smooth Round Full Profile Silicone, 560 cc", visible: true, order: 22,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p22-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p22-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p24", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", patient: 'Patient 24', age: 33, height: '5′0″', weight: '135 lbs', implant: "Smooth Round full profile Silicone, 365 cc", visible: true, order: 24,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p24-front-before', 625, 447, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p24-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p26", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", addOn: "with Left Circum-areolar Mastopexy", patient: 'Patient 26', age: 49, height: '5′1″', weight: '167 lbs', implant: "Silicone Round Ultra-High Profile. R 650 cc, L 615 cc", visible: true, order: 26,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p26-front-before', 625, 435, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p26-front-after', 625, 447, 'After: breast augmentation patient, front view', 50, 40) } ] },
    { id: "breast-aug-p27", procedures: ["breast-augmentation"], primary: "breast-augmentation", title: "Breast augmentation", addOn: "following Mastopexy and Areola Reduction (2 stages)", patient: 'Patient 27', age: 46, height: '5′4″', weight: '200 lbs', visible: true, order: 27,
      show: { age: true, height: true, weight: true, implant: true, postop: true },
      views: [ { label: 'Front', before: ph('breast-aug-p27-front-before', 625, 417, 'Before: breast augmentation patient, front view', 50, 40), after: ph('breast-aug-p27-front-after', 625, 417, 'After: breast augmentation patient, front view', 50, 40) } ] },
    /* IMPORT-END */
  ] };

  /* 18+ CONFIRMATION: Admin ("Galleries") chooses which procedures need it.
     A case is locked when ANY procedure it belongs to is in this list.
     Today only the breast procedures require it. */
  NPS.library.ageGate = { procedures: ['breast-augmentation', 'breast-lift', 'breast-reduction', 'breast-reconstruction', 'male-breast-reduction', 'implant-exchange'] };
})();

/* ---------------------------------------------------------------
   ADMIN OVERRIDES (Library admin). Visible / order / corrected text
   chosen in Admin are layered over the cases above. In this preview
   they are kept in this browser (localStorage "nps.library"); in the
   real Admin, Publish saves them for every visitor.
   --------------------------------------------------------------- */
(function () {
  var NPS = window.NPS, FIELDS = ['title', 'addOn', 'patient', 'age', 'height', 'weight', 'postop', 'implant'];
  NPS.library.original = JSON.parse(JSON.stringify(NPS.library.cases.map(function (c) { return { id: c.id, visible: c.visible, order: c.order, title: c.title, addOn: c.addOn, patient: c.patient, age: c.age, height: c.height, weight: c.weight, postop: c.postop, implant: c.implant, show: c.show }; })));
  NPS.library.fields = FIELDS;
  NPS.library.overrides = function () { try { return JSON.parse(localStorage.getItem('nps.library') || '{}') || {}; } catch (e) { return {}; } };
  var ov = NPS.library.overrides();
  NPS.library.cases.forEach(function (c) {
    var o = ov[c.id]; if (!o) return;
    Object.keys(o).forEach(function (k) { if (k === 'show') c.show = Object.assign({}, c.show, o.show); else if (o[k] === '' || o[k] == null) delete c[k]; else c[k] = o[k]; });
  });
})();
