/* ------------------------------------------------------------------
   The team, in the order shown on "Our team".
   Managed in Admin ("Team"): add, edit, reorder, hide, delete, change photos.
   The two principals (Dr. Newman and Dzi Newman) are shown first and link to
   "Meet Dr. Newman"; their photos are set in Admin > Pages & images.

   Fields
     id        web-safe key
     name, role
     bio       optional short line(s) shown under the role
     photo     path from the site root ("assets/img/team/x.jpg") or a full web path ("/uploads/x.jpg")
     w, h      the photo's real size in pixels (so it is never stretched)
     fx, fy    focus point 0-100 (which part stays in view when the frame crops)
     zoom      1 to 3
   Photos are small copies from the previous website. Replace them with new portraits.
------------------------------------------------------------------- */
window.NPS = window.NPS || {};
NPS.team = {
  intro: 'We are proud to introduce the people you will meet at Newman Plastic Surgery. Each has a strong background in the medical field and shares our commitment to your having the best possible experience. Each of them has a heart for patient care.',
  principals: [
    { id: 'dr-newman', name: 'Charles E. Newman, Jr., MD', role: 'Plastic & reconstructive surgeon', slot: 'surgeon', href: 'meet-dr-newman/' },
    { id: 'dzi-newman', name: 'Dzi-Long Newman, MPAS, PA-C', role: 'Physician assistant', slot: 'dzi', href: 'meet-dr-newman/#dzi' }
  ],
  members: [
    { id: 'joanne-dyl',     name: 'Joanne Dyl',      role: 'Financial Administrator',            photo: 'assets/img/team/joanne-dyl.jpg',     w: 200, h: 300, fx: 50, fy: 30, zoom: 1 },
    { id: 'rena-pierpont',  name: 'Rena Pierpont',   role: 'Patient Care Coordinator',           photo: 'assets/img/team/rena-pierpont.jpg',  w: 200, h: 300, fx: 50, fy: 30, zoom: 1 },
    { id: 'beth-green',     name: 'Beth Green',      role: 'Patient Care Coordinator',           photo: 'assets/img/team/beth-green.jpg',     w: 264, h: 300, fx: 50, fy: 30, zoom: 1 },
    { id: 'alma-ortiz',     name: 'Alma Ortiz',      role: 'Lead Medical Assistant',             photo: 'assets/img/team/alma-ortiz.jpg',     w: 200, h: 300, fx: 50, fy: 30, zoom: 1 },
    { id: 'suzanna-suto',   name: 'Suzanna Suto',    role: 'Medical Esthetician / Medical Assistant', photo: 'assets/img/team/suzanna-suto.jpg', w: 212, h: 300, fx: 50, fy: 30, zoom: 1 },
    { id: 'cara-kravetz',   name: 'Cara Kravetz',    role: 'Medical Assistant' },
    { id: 'georgia-walker', name: 'Georgia Walker',  role: 'Medical Assistant' }
  ]
};
