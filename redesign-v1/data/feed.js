/* ------------------------------------------------------------------
   "Discover" feed + social posts.
   Both are SAMPLE content for the design review. In the finished site
   the team adds and reorders these in Admin ("Discover" and "Social"),
   and each card can be linked to a procedure and to a social post.

   Feed card types
     procedure  a spotlight on one procedure (ref = procedure id)
     insight    a short, useful read (no promises, no medical claims)
     guide      a goal-based starting point (ref = topic id)
     social     a social post linked to website content (ref = procedure id)
     quote      a patient voice (shared with permission)
   tags: face, breast, body, skin, nonsurgical, surgical, learn
------------------------------------------------------------------- */
window.NPS = window.NPS || {};

NPS.social = [
  { id:'s1', platform:'instagram', img:'f-glow',  ref:'halo-laser',    caption:'Glow season. Ask us how Halo and SaltFacial fit your calendar.' },
  { id:'s2', platform:'instagram', img:'f-eyes2', ref:'botox',         caption:'Soft, natural, still you. A quick refresh before the weekend.' },
  { id:'s3', platform:'instagram', img:'f-poise', ref:'body-contouring', caption:'Confidence is quiet. Explore body contouring after weight loss.' },
  { id:'s4', platform:'facebook',  img:'f-hand',  ref:'nose-surgery',  caption:'Thinking about nose surgery? Our first step is always a conversation.' },
  { id:'s5', platform:'youtube',   img:'cat-body',ref:'miradry',       caption:'Watch: what to expect from miraDry, step by step.' },
  { id:'s6', platform:'instagram', img:'f-eyes',  ref:'fillers',       caption:'Volume, restored subtly. Ask about fillers and Sculptra.' }
];

NPS.feed = [
  { id:'d1',  type:'procedure', ref:'halo-laser',  tags:['skin','nonsurgical'], eyebrow:'Skin & glow',      title:'Radiant skin, with minimal downtime', img:'f-hand' },
  { id:'d2',  type:'insight',   tags:['learn'], eyebrow:'A gentle guide', title:'Surgical or non-surgical? A calm way to decide',
    text:'Injectables and lasers refresh with little or no downtime and can be repeated over time. Surgery offers longer-lasting change for concerns treatments can’t reach. Many people combine both, and a consultation helps you choose what fits your goals, schedule and comfort.', cta:'Begin your conversation', tone:'sand' },
  { id:'d3',  type:'procedure', ref:'eyelid-surgery', tags:['face','surgical'], eyebrow:'Face', title:'Eyes that look as rested as you feel', img:'f-eyes' },
  { id:'d4',  type:'social',    soc:'s1', tags:['skin','nonsurgical'] },
  { id:'d5',  type:'procedure', ref:'fillers',     tags:['face','nonsurgical'], eyebrow:'Face', title:'Volume, restored subtly', img:'f-eyes2' },
  { id:'d6',  type:'quote',     tags:['learn'], text:'I love coming here. Dr. Newman and Dzi Newman are so personal and just fantastic.', who:'Ilka Z. V.', tone:'teal' },
  { id:'d7',  type:'procedure', ref:'breast-lift', tags:['breast','surgical'], eyebrow:'Breast', title:'A more youthful position and contour', img:'cat-breast' },
  { id:'d8',  type:'guide',     ref:'midlife-refresh', tags:['learn','face','skin'], eyebrow:'Guide', title:'Midlife refresh: where to begin', img:'cat-skin' },
  { id:'d9',  type:'procedure', ref:'tummy-tuck',  tags:['body','surgical'], eyebrow:'Body', title:'A flatter, firmer midsection', img:'cat-body' },
  { id:'d10', type:'insight',   tags:['learn'], eyebrow:'Before you book', title:'Five questions worth bringing to your consultation',
    list:['What are my options for this goal?','What does recovery look like for my life?','What are the risks, honestly?','Can I see results for people with goals like mine?','What will it cost, and how can I pay?'], cta:'Request a consultation', tone:'ivory' },
  { id:'d11', type:'procedure', ref:'miradry',     tags:['skin','nonsurgical'], eyebrow:'Skin & aesthetics', title:'Tired of planning outfits around sweat?', img:'cat-body' },
  { id:'d12', type:'social',    soc:'s4', tags:['face','surgical'] },
  { id:'d13', type:'procedure', ref:'facelift',    tags:['face','surgical'], eyebrow:'Face', title:'Naturally rested, entirely you', img:'cat-face' },
  { id:'d14', type:'insight',   tags:['learn'], eyebrow:'Recovery', title:'Recovery, honestly',
    text:'Plan for rest, help at home and a little patience. Swelling and bruising fade gradually, and everyone heals differently. Your team will give you a clear plan, and you’ll always have a number to call.', cta:'Begin your conversation', tone:'sand' },
  { id:'d15', type:'procedure', ref:'microneedling', tags:['skin','nonsurgical'], eyebrow:'Skin & glow', title:'Renewal for texture, tone and fine lines', img:'f-glow' },
  { id:'d16', type:'procedure', ref:'sculptra',    tags:['face','nonsurgical'], eyebrow:'Face', title:'Gradual, natural-looking volume', img:'f-eyes' },
  { id:'d17', type:'guide',     ref:'after-baby',  tags:['learn','body','breast'], eyebrow:'Guide', title:'After pregnancy and breastfeeding', img:'cat-body' },
  { id:'d18', type:'social',    soc:'s3', tags:['body','surgical'] },
  { id:'d19', type:'quote',     tags:['learn'], text:'Well informed, understanding, and attentive.', who:'Patient review', tone:'sand' },
  { id:'d20', type:'procedure', ref:'botox',       tags:['face','nonsurgical'], eyebrow:'Face', title:'A considered approach to expression', img:'f-eyes2' },
  { id:'d21', type:'procedure', ref:'breast-augmentation', tags:['breast','surgical'], eyebrow:'Breast', title:'Balance and proportion, chosen by you', img:'f-silk' },
  { id:'d22', type:'insight',   tags:['learn','skin'], eyebrow:'Protect your results', title:'The five-minute routine that does the most',
    text:'Daily sunscreen and a simple, clinical-grade routine help extend the results of skin treatments. Our aesthetician can build one around your skin.', cta:'Explore skin care', ref:'skin-care', tone:'ivory' },
  { id:'d23', type:'social',    soc:'s6', tags:['face','nonsurgical'] },
  { id:'d24', type:'guide',     ref:'glow',        tags:['learn','skin'], eyebrow:'Guide', title:'Glow and skin renewal', img:'f-glow' }
];

/* Patient voices (shared with permission) */
NPS.voices = [
  { text:'I love coming here. Dr. Newman and Dzi Newman are so personal and just fantastic.', who:'Ilka Z. V.' },
  { text:'Well informed, understanding, and attentive.', who:'Patient review' },
  { text:'Very pleasant, caring, and friendly.', who:'Patient review' }
];
