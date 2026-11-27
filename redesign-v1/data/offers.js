/* ------------------------------------------------------------------
   Special offers and events.
   Managed in Admin ("Offers"). An offer appears on its start date and disappears after its end date,
   with no need to take it down by hand. With no current offers the page says to check back.

   items: id, title, text, fine (small print), image, w, h, start, end (YYYY-MM-DD, both optional),
          ctaLabel, ctaLink (optional button)
------------------------------------------------------------------- */
window.NPS = window.NPS || {};
NPS.offers = {
  intro: 'Seasonal specials and events from Newman Plastic Surgery.',
  empty: 'Check back for new specials and events!',
  items: []
};
