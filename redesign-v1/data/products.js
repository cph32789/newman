/* ------------------------------------------------------------------
   Skin care products sold or recommended by the practice.
   Managed in Admin ("Skin care"): the intro, the online-ordering box, and each brand.

   brands: id, name, text (what the line is for; no medical promises), image (logo or product picture), w, h, link (optional)
   The brand descriptions are from the previous website. Alastin, NPS Signature and Cyspera had
   only a logo there: add a short description in Admin.
------------------------------------------------------------------- */
window.NPS = window.NPS || {};
NPS.products = {
  intro: 'We offer a wide range of skin care products, and skin care services from our licensed aesthetician.',
  shop: {
    title: 'Order online',
    text: 'Your favorite skin care products are available for online ordering. Free 2-day shipping on all orders.',
    label: 'Shop online',
    link: 'https://newmanplasticsurgery.brilliantconnections.com/',
    image: 'assets/img/products/brilliant.jpg', w: 600, h: 321
  },
  brands: [
    { id: 'skinmedica', name: 'SkinMedica®', image: 'assets/img/products/skinmedica.png', w: 308, h: 132,
      text: 'SkinMedica® products aim to let each patient enjoy naturally radiant skin through a customized skin care regimen. The line uses the skin’s own healing abilities to restore elasticity and regenerate the health of the skin, for a smooth, youthful appearance. These products help patients achieve and maintain even, soft, blemish-free, moisturized and vibrant skin.\n\nSkinMedica products can be used on any skin type or condition, including the most sensitive skin. Their wide range allows each patient to build a personalized regimen to enhance their individual skin and produce the best possible results.' },
    { id: 'eltamd', name: 'EltaMD®', image: 'assets/img/products/eltamd.png', w: 400, h: 267,
      text: 'EltaMD sunscreens help prevent sunburn and decrease the risk of skin cancer and early skin aging caused by the sun, when used with other sun protection measures. They are formulated with transparent zinc oxide and are noncomedogenic, sensitivity-free, fragrance-free and paraben-free.' },
    { id: 'alastin', name: 'Alastin Skincare®', image: 'assets/img/products/alastin.png', w: 600, h: 314, text: '' },
    { id: 'nps-signature', name: 'NPS Signature', image: 'assets/img/products/nps-signature.jpg', w: 400, h: 455, text: '' },
    { id: 'cyspera', name: 'Cyspera® Pigment Correction', image: 'assets/img/products/cyspera.png', w: 275, h: 183, text: 'From Scientis.' }
  ]
};
