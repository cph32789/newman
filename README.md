# Newman Plastic Surgery — site mirror and redesign concept

This repository holds two things, both published with GitHub Pages:

| What | Live URL |
|---|---|
| Landing page | https://cph32789.github.io/newman/ |
| **Current site** (offline mirror of newmanplasticsurgery.com) | https://cph32789.github.io/newman/original/ |
| **Redesign Concept 1** (mockup — not the final design) | https://cph32789.github.io/newman/redesign/ |
| **Redesign Concept 2** (mockup — not the final design) | https://cph32789.github.io/newman/redesign-2/ |

```
/index.html           landing page linking to both
/original/            the mirrored current website (PAGES.md lists every page)
/redesign/index.html  redesign mockup
/redesign/images/     every image concept 1 uses (self-contained)
/redesign-2/          second redesign concept (index.html, gallery.html, images/)
/.nojekyll            lets GitHub Pages serve underscore folders as-is
```

## How the mirror was made (captured 2026-11-21)

1. Page list taken from `https://newmanplasticsurgery.com/sitemap.xml` (328 pages; `/sitemap_index.xml` and `/wp-sitemap.xml` only redirect).
2. Crawled with `wget -r -l inf --page-requisites --adjust-extension --no-parent --restrict-file-names=windows -e robots=on -nH`, seeded with every sitemap URL plus the home page, run as 8 parallel workers. Only `newmanplasticsurgery.com` was fetched.
3. Links were rewritten by a script instead of `--convert-links` (needed for parallel runs): every `newmanplasticsurgery.com` URL (href, src, srcset, `data-src` / lazy-load attributes, inline styles, CSS `url()`) became a relative path to the local file, so it works under `/original/`.
4. Missing assets referenced only in markup or CSS were fetched separately.
5. Dropped on purpose: WordPress `?p=ID` shortlink duplicates, `wp-json`, oEmbed and feed endpoints. External embeds (YouTube, maps, social widgets) remain links.

**Result:** 328/328 sitemap pages captured, plus 55 extra pages found by crawling (e.g. paginated galleries), about 3,100 images. See [`original/PAGES.md`](original/PAGES.md).

### Known gaps in the mirror
- A handful of theme icon fonts, two video-library files and one link are already 404 on the live site, so they are missing here too (details in PAGES.md).
- Forms, search, comments and `admin-ajax.php` need WordPress and don't work on static hosting.

## Redesign Concept 2

Built from a second, fully-coded mockup supplied by the project owner. Its embedded images were extracted into `redesign-2/images/` and the page otherwise left as designed (procedure explorer, team and profile dialogs, FAQ, mobile dock). Changes made to follow the same rules as concept 1:
- No before/after photos on the main page; the "Results" section now links to `redesign-2/gallery.html` instead of the live site's galleries.
- The gallery keeps breast photos locked and unloaded until the viewer confirms they are 18+.
- Its portraits and model photos are the mockup's own (the model images are marked "illustrative"); the consultation form is a preview and sends nothing.

## Redesign Concept 1 images

The mockup's gradient/SVG placeholders were replaced with real images copied from the mirror into `redesign/images/` (the gradients remain underneath as fallbacks, and the dark overlays were kept so text stays readable):

| Mockup element | Image used |
|---|---|
| Hero | Practice exterior photo, 444 N. Mills Ave |
| Surgeon portrait | Dr. Newman's photo from "Meet Dr. Newman" |
| Procedure cards | The Face / Breast / Body / Non-Surgical category images from the current site |
| Before & After | Real facelift, breast augmentation and tummy tuck pairs — on `redesign/gallery.html` only (none on the main page). Breast photos stay unloaded until the viewer confirms they are 18+ |
| Logo (nav) | Actual NPS logo PNG |

Each image has alt text (`aria-label` for CSS backgrounds).

### Images still needed
- **High-resolution imagery of every kind.** The current site's photos are small (category images ≈ 280 px, portrait 341 px, hero 1348 px wide); the card, portrait and hero images will look soft on high-DPI screens. Professional photography is recommended.
- **Dr. Newman portrait:** only a 341 px circular crop exists; a full-size portrait is needed.
- **Logo on dark backgrounds:** no light/reversed logo exists, so the footer keeps the typographic wordmark.
- **Surgeon section** is fine, but **testimonial** has no imagery by design.

## Requirements for the real build (from the project owner)
The redesign is a mockup only. The production site should also provide:
- **Library (admin):** upload photos/videos per procedure category, with metadata per item like the current site, and a per-item toggle for what is visible on the public site.
- **Easy image management (admin):** replace any image on the site, resize/crop it to fit the layout, and save — no code changes.
- **App-like mobile experience:** very responsive, highly navigable, modern mobile UX.

These need a backend or CMS; GitHub Pages is static hosting and can't provide them.
