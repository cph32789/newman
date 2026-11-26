# Design system (Redesign v1)

One system for every page, so every section looks and feels the same.
Source of truth: `redesign-v1/assets/css/styles.css`.

## Color
| Token | Value | Use |
|---|---|---|
| `--teal-900` / `-950` | #0A2A2F / #06191D | Hero, dark sections, buttons |
| `--ivory` / `--paper` | #F8F2E8 / #FFFBF4 | Page and card backgrounds |
| `--sand` / `--sand-2` | #EEE3D0 / #E2D3B9 | Warm bands, feed |
| `--champagne` | #EBD3A9 | Accent on dark |
| `--clay` / `--clay-ink` | #B26A45 / #86472A | Accent on light (use `-ink` for text) |
| `--ink` / `--muted` | #13282B / #4B5C5E | Text |

## Type
- Display and UI: **DM Sans** (self-hosted). Italic accent words: **Cormorant Garamond Italic**.
- Body 18 px, never below 14 px anywhere. Eyebrows 13 px uppercase.
- Headlines use `.display` / `.h2` / `.h3`; an `<em>` inside a headline becomes the serif italic accent.

## Shape and space
- Radii: 12 / 18 / 26 / 32 px. Pills are fully round.
- Section padding `var(--section)`, side gutter `var(--gutter)`.
- Touch targets 44 px or more.

## Components
`.btn` (ink, champagne, ghost, line) · `.link` · `.chip` · `.cat` card · `.fc` feed card (procedure, insight, guide, social, quote) · `.post` · `.sheet` (slide-up on phones, panel or modal on desktop) · `.tabbar` (phone only) · `.rrow` / `.xrow` / `.rr` rows · `.form`.

## Mobile "app" layer
Sticky tab bar (Home, Explore, Search, Discover, Book), slide-up sheets,
full-screen menu, swipe rails, large type, safe-area aware. Not a native app.

## Images
`.frame` + `.fit`. Never stretch. Focus, zoom and cover/contain per slot. See
`docs/PROJECT-GOALS.md` (Image rule).

## Content model (what Admin will manage)
`data/site.js` (contact, social) · `data/procedures.js` (procedures, alternate
names, goals) · `data/feed.js` (Discover cards, social posts, patient voices) ·
`data/images.js` (image library, slots, saved fit).
