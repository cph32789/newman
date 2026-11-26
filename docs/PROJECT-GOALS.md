# Newman Plastic Surgery — Website rebuild: project goals

These goals guide every page we build. When two goals pull in different
directions, **style and look-and-feel win** (goal 9).

## The goals

1. **Rebuild one page / section at a time.** Each page is designed, built,
   reviewed and approved before the next one starts. Home page first.
2. **Mobile first, stunning on desktop.** Every page is optimized for phones
   and looks stunning in a desktop browser. On a phone it should look and feel
   like a bespoke app (tab bar, slide-up sheets, thumb-friendly) — but we are
   **not** building a native app.
3. **Every section of every page looks and feels the same.** One design
   system, a clean and concise experience. No section invents its own colors,
   type sizes, spacing or components (see `DESIGN-SYSTEM.md`).
4. **It must look like a $100k redesign and branding.** This is a very upscale
   plastic surgeon. The site is also our showcase and a launching pad for more
   client design work, so it has to look uber-professional.
5. **The admin experience is as good as the user experience.** The doctor and
   his wife will upload images and content themselves. It must be very easy to
   use and manage, with no code and no AI tools.
6. **Social is key.** Social posts link to website content, and website content
   links to social. This is considered in every page design (see "Social
   linking" below).
7. **Search is key.** Visitors can type "nose job", "breast augmentation" or any
   procedure or goal and get a very precise answer (see "Search" below).
8. **Middle-aged and peri/pre-menopausal women can "doom scroll" the site** and
   find ways to look and feel better (see "Discover feed" below).
9. **Style and look-and-feel rule all else.** Everything is elegant and
   beautiful.
10. **Images are never stretched, squished or force-filled.** Whenever an image
    is placed or replaced, the user sizes it for the space available (focus
    point, zoom, cover or whole image) and those settings are **saved** so the
    image displays exactly as they chose (see "Image rule" below).

11. **Stop bot spam.** The doctor and his wife must not be flooded with bot
    email. We use as many protections as possible, in layers (see
    `FORM-SECURITY.md`). The practice's email address is never published.

## Image rule (goal 10)

- Every image is drawn inside a frame at its true proportions. Distortion is
  not possible: the only fit modes are **cover** (crop) and **contain** (show
  the whole image).
- Each image slot stores its own saved fit: `fx`, `fy` (focus point, 0–100%),
  `zoom` (1–3), `fit` (cover/contain), and optional **phone** overrides.
- Admin shows the exact frame (desktop and phone) when an image is replaced,
  lets the user drag the focus point and set zoom, then saves it.
- Implemented in the rendering layer (`redesign-v1/data/images.js` + the
  `.fit` class). Admin's **Image Fit tool** writes the same settings.
- Automated check: a test confirms no `<img>` on the page renders with
  `object-fit: fill` at phone and desktop sizes.

## Search (goal 7)

- Understands everyday names ("nose job" → Nose surgery), goals ("droopy
  eyelids", "sweaty armpits"), topics ("menopause", "after kids") and typos
  ("rhinoplsty").
- Returns a short, precise list: **Best match** first, then **Also relevant**.
- Powered by the procedure catalog (`data/procedures.js`): every procedure has
  its alternate names and goal phrases, which Admin lets the team edit.
- Instagram-style: a **Search** button in the desktop header and a **Search** tab on phones open a dedicated search screen (not a box on the page) with **Recent**, **Suggested** and an **Explore** tile grid. Typing shows round-avatar results; recent searches are remembered and can be cleared. Also opens with the `/` key.

## Social linking (goal 6)

- **Website → social:** social buttons in the header area, footer and menu; a
  "Follow along" section; every procedure can show its related posts.
- **Social → website:** every procedure has its own shareable link
  (`#procedure/nose-surgery`), so a post can point to exactly that content.
  Share buttons on every card use the phone's native share sheet.
- **Linked content:** each social post is attached to a procedure, so the post
  and the page point to each other.
- Next: connect real feeds (Instagram, Facebook, YouTube, Pinterest) and let
  Admin choose which procedure a post belongs to.

## Discover feed (goal 8) — recommendation

**Yes, build a feed.** A continuous, filterable "Discover" feed gives people a
relaxed, low-pressure way to browse everything — procedures, injectables,
rejuvenation, skin, surgical and non-surgical — the way they browse social.

- It sits on the home page and will also be its own page.
- Card types: procedure spotlights, short educational reads, goal-based guides
  ("Midlife refresh: where to begin"), patient voices and social posts.
- Filters: Face, Breast, Body, Skin & glow, Non-surgical, Surgical, Learn.
- **Save to "My list"** (heart) — saved ideas travel into the consultation
  request, turning browsing into a warm conversation starter.
- Always calm, never pushy, no medical promises; every card ends in a soft next
  step (learn more, save, share, begin a conversation).

## Spam protection (goal 11)

- Live now: no published email address, honeypot, time trap, human-activity
  check, link/junk filter, cooldown and hourly cap, and silent traps.
- Next: connect Turnstile and the form service (needs the practice's Cloudflare
  account and an email-handling decision, including HIPAA). Full plan in
  `docs/FORM-SECURITY.md`; starter code in `server/form-worker.js`.

## Procedures (one standard format)

Every procedure uses the same page format so the site stays cohesive and
before-and-after photos are managed once, in the Library. See
`PROCEDURE-PAGE.md`. Each procedure page has its own address and share card,
supporting goal 6.

## Working agreement

- One page at a time. We show it, collect feedback, then move on.
- Earlier concepts (1, 2, 3) remain online for comparison.
- All content on pages is sample/draft until approved by the client and (for
  anything medical) reviewed by Dr. Newman.
