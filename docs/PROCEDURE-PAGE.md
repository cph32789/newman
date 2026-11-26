# The standard procedure page

Every procedure uses **one format**. Adding a procedure means adding its
information, not designing a page. This keeps the site cohesive and means every
procedure's before-and-after photos are managed the same way, in one place.

## The sections (only what is unique to the procedure is shown)

Anything identical across procedures lives **once** on the shared **Your visit**
page (`your-visit/`) and is linked, never repeated.

| Section | Shown when | Source |
|---|---|---|
| **Hero** | always | Procedure record + image slot |
| **Sticky tabs** | 2+ sections (tabs adapt: Overview, Recovery, Results, Questions) | Automatic |
| **Overview** + At a glance (+ "May be a good fit if") | always (glance/fit list only if written, else Type/Area/Also called) | `procOverrides[id]` |
| **Recovery & timeline** | the procedure has its own `timeline`; otherwise a one-line "Your path" strip linking to Your visit | `procOverrides[id].timeline` |
| **Results** (dark) | the Library has cases whose `primary` is this procedure; otherwise a slim line: "See results for X" (related case) or "Photos are shared in the office" | Library |
| **Questions** | the procedure has its own 3-4 `faq`; general answers live on Your visit | `procOverrides[id].faq` |
| **Next steps** | always: links to Your visit and Common questions | Shared |
| **Related + Previous/Next**, **Consultation form** | always | Procedure record / shared |

Shared content (journey, what we cover at a consult, common questions incl.
insurance and payment) is in `NPS.visit` and builds `your-visit/`.

## Mobile
- Hero text and buttons first, photo below; back arrow returns to the category.
- The section tabs stay pinned under the header and all fit on screen (no
  sideways swiping). They highlight as you scroll.
- Results cards, FAQ and related cards stack in one column. Photos keep their
  true proportions at every size.
- The phone tab bar and slide-up sheets work exactly as on the home page.

## Before & After and the Library
- A case in the Library has a **primary** procedure and may list others. It shows in full on its primary page; other pages link to it ("See results for X").
- Admin controls per case: **Visible / Hidden**, **order** (drag), which
  **details are public** (age, height, weight, implants, time since surgery,
  add-on procedures), and extra **views** (front, side, three-quarter).
- **Breast cases are always behind the 18+ confirmation.**
- If a procedure has no visible cases, the page shows a friendly "photos are
  shared in the office" message instead of an empty box.
- A single case shows as a large featured card; two or three adapt to the grid.
- Photos use the same never-stretch fit model as every other image.

## Social and sharing
- Every procedure has its **own address**, for example `procedures/facelift/`.
- Every procedure has its **own share card**, a 1200 x 630 picture with the
  procedure's name, so a post or message that links to the page looks great.
- Each page also carries its search-engine description and structured data.
- Posts can point to a procedure page; the page's Share button uses the phone's
  native share sheet.

## How to add a procedure
1. In Admin ("Procedures"), add the **name, category, surgical/non-surgical,
   one-line promise, a short description, "also known as" names, the words
   people use to describe the goal, a photo (and its fit), and related
   procedures.** Leave the rest blank to use the defaults.
2. Optionally add its own overview, "good fit" list, at-a-glance facts, steps
   or FAQ answers.
3. Press **Publish**. The site builds the new page, its share card, and adds it
   to search, the procedure explorer, related lists and previous/next.
4. In the Library, attach any before-and-after cases to it.

*(Today this is done by editing `data/procedures.js` and running
`node redesign-v1/tools/build-procedures.js` then
`node redesign-v1/tools/share-cards.js`. Admin will do this for the team.)*

## Content status
All procedure wording is **draft**. The practice's own text was used where it
existed (facelift, breast augmentation, tummy tuck, and the standard questions);
everything else uses careful general wording. **Dr. Newman must review all
procedure text, "at a glance" facts and FAQ answers before launch.** Library
case details were copied from the current website's gallery ordering and must
be verified against the original records.
