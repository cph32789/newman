/* ------------------------------------------------------------------
   Site-wide settings. In the finished site these are edited in Admin
   (Settings), never in code.
------------------------------------------------------------------- */
window.NPS = window.NPS || {};
NPS.site = {
  name: 'Newman Plastic Surgery',
  phone: '407.481.9505',
  phoneHref: 'tel:+14074819505',
  address: ['444 North Mills Avenue', 'Orlando, Florida 32803'],
  /* Contact form. The address is NEVER written into the page. When the form
     service is connected (see docs/FORM-SECURITY.md), set `endpoint` and the
     Cloudflare Turnstile `turnstileSiteKey`. Both are public values; secrets
     stay on the server. */
  form: { endpoint: '', turnstileSiteKey: '', minSeconds: 4, cooldownSeconds: 90, maxPerHour: 3 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Newman+Plastic+Surgery+444+North+Mills+Avenue+Orlando+FL',
  social: {
    instagram: { label: 'Instagram', handle: '@newmanplasticsurgery', url: 'https://www.instagram.com/newmanplasticsurgery/' },
    facebook:  { label: 'Facebook',  handle: 'NewmanPlasticSurgery',  url: 'https://www.facebook.com/NewmanPlasticSurgery/' },
    youtube:   { label: 'YouTube',   handle: 'Newman Plastic Surgery', url: 'http://www.youtube.com/channel/UCwtsEnjalS_yFDs0IAo2SNw' },
    pinterest: { label: 'Pinterest', handle: 'dnewman0566',           url: 'https://www.pinterest.com/dnewman0566/' }
  }
};
