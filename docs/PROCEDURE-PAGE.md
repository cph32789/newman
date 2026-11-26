# The standard procedure page

Every procedure uses **one format**. Adding a procedure means adding its
information, not designing a page. This keeps the site cohesive and means every
procedure's before-and-after photos are managed the same way, in one place.

## The sections (same order on every page)

| # | Section | What it holds | Where the content comes from |
|---|---|---|---|
| 1 | **Hero** | Name, one-line promise, photo, Request / Save / Share, "also known as" | Procedure record + its image slot |
| 2 | **Sticky section tabs** | Overview · Process · Results · FAQ (always in view; shows where you are) | Automatic |
| 3 | **Overview** | What it is, "May be a good fit if", "Worth discussing", and an **At a glance** card | Procedure record (defaults fill anything blank) |
| 4 | **Process** | Four steps: what to expect | Defaults by surgical / non-surgical, editable per procedure |
| 5 | **Results** | Before-and-after cases for this procedure | **Library** (visible cases, in the order set in Admin) |
| 6 | **FAQ** | Six standard questions, editable | Shared questions, per-procedure overrides |
| 7 | **Related + Previous/Next** | Three related procedures; move through the category | Procedure record |
| 8 | **Request a consultation** | The same form as the home page | Shared |

## Mobile
- Hero text and buttons first, photo below; back arrow returns to the category.
- The four section tabs stay pinned under the header and all fit on screen (no
  sideways swiping). They highlight as you scroll.
- Results cards, FAQ and related cards stack in one column. Photos keep their
  true proportions at every size.
- The phone tab bar and slide-up sheets work exactly as on the home page.

## Before & After and the Library
- A case in the Library is attached to one or more procedures. It then appears
  on every page it is attached to, automatically.
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
