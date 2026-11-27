/* ------------------------------------------------------------------
   Patient reviews and testimonials.
   Managed in Admin ("Reviews"): add, edit, reorder, hide, delete.
   "Show on the home page" puts a review in the Patient voices strip.

   Fields
     id        web-safe key
     text      what the patient said (use their own words; shared with permission)
     title     optional short heading ("Great care!")
     who       how the name is shown ("Ilka Z. V." or "Patient review")
     source    optional ("Google", "RealSelf", "In our office")
     procedure optional ("Facelift")
     link      optional web address of the original review
     home      true = also shown on the home page
------------------------------------------------------------------- */
window.NPS = window.NPS || {};
NPS.reviews = {
  intro: 'Kind words from people we have had the privilege of caring for, shared with their permission.',
  items: [
    { id: 'ilka', text: 'I love coming here. Dr. Newman and Dzi Newman are so personal and just fantastic.', who: 'Ilka Z. V.', home: true },
    { id: 'great-care', title: 'Great care!', text: 'Well informed, understanding, and attentive.', who: 'Patient review', home: true },
    { id: 'always-a-pleasure', title: 'Always a pleasure coming for my appointments', text: 'Very pleasant, caring, and friendly.', who: 'Patient review', home: true }
  ]
};
