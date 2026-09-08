# Bay Eight Studios — landing page

Static landing page for Bay Eight Studios (Miami recording studio).
Built section by section from Canva designs, with <https://bayeight.com/> as the
reference for brand, copy and structure.

## Stack

Plain **HTML + CSS + JavaScript** with **Bootstrap 5.3**. No build step, no
framework, no bundler — open the file and it runs.

- Bootstrap 5.3.3 **CSS only** + Bootstrap Icons 1.11.3 (jsDelivr CDN).
  The JS bundle is deliberately not loaded: the slide-in menu was the only
  component in use, so `main.js` toggles Bootstrap's offcanvas classes itself.
- Google Fonts: **Montserrat** (headings and body) + **Dancing Script**
  (the "Miami" script in the header and footer lockups).
- Vanilla JS in `js/main.js`, ~380 lines.

## Structure

```
bayeight/
├── index.html        the whole page — one <section> per design section
├── css/style.css     design tokens in :root, then section-by-section styles
├── js/main.js        every interaction on the page (see below)
└── assets/
    ├── img/          artists/, studios/, sessions/, engineers/, logos/
    └── video/        hero background video (not supplied yet)
```

What `main.js` drives, in order:

1. Header background once the page is scrolled
2. Hero video fallback (hides the `<video>` if the file isn't there)
3. Artists marquee — tracks which portrait is centred and names it
4. Rail arrows for the suite and engineer carousels
5. Click-to-play video facade (no YouTube payload until you press play)
6. Session builder — live quote from room + add-ons × hours
7. Contact form validation and inline success state
8. Slide-in menu: backdrop, scroll lock, Escape, focus return
9. Back-to-top button
10. Scroll reveal + footer year

## Running it

```bash
cd /home/coder/bayeight
python3 -m http.server 8080
# → http://localhost:8080
```

(Opening `index.html` directly in the browser also works.)

## Conventions

- **Design tokens first.** Colors, fonts and spacing are CSS custom properties in
  `:root` (`css/style.css`). Use `var(--accent)`, not a hard-coded hex.
  `--accent` `#e82276` is the brand pink; `--lime` `#c8ff00` is the secondary.
  The footer scopes its own brighter `--pink` to match the live site.
- **One `<section>` per design section**, each with a stable `id` used by the
  menu anchors.
- **Every section shares one left edge.** Content sits in a Bootstrap
  `.container`. Blocks that bleed off an edge (the welcome card, the studios
  carousel) pull out with a negative margin and pad the same amount back in, so
  their copy still lands on the container line at any width.
- **Bootstrap utilities for layout**, custom CSS only for what Bootstrap can't
  express. Override Bootstrap through its CSS variables (`--bs-*`) rather than
  fighting it with `!important`.
- **Motion**: add `class="reveal"` to fade a block up on entry, or
  `class="reveal-group"` to a container to stagger its children. Both are driven
  by the observer in `main.js` and skip to the end state under
  `prefers-reduced-motion`.
- **Cache busting**: the `<link>` and `<script>` tags carry `?v=N`. Bump it when
  a browser keeps serving a stale stylesheet.
- Images go in `assets/img/`, referenced with relative paths.

## Status

Every section from the Canva mock is built.

| Section | State |
|---|---|
| Header / menu | logo left, slide-in menu right |
| Hero + Trusted By | grayscale still until the video lands; 11 label logos |
| Artists (`#clients`) | auto-scrolling strip of 18 portraits, name card follows |
| Welcome (`#about`) | copy + click-to-play video facade (YouTube `uGhjHFJnfww`) |
| Our Studios | stats, Google rating, perks marquees, suite carousel |
| Our Services | full-bleed poster strip + All Services link |
| Our Reviews | two counter-scrolling marquee rows of Google review cards |
| How to Book | 4 step cards over a studio backdrop, full-viewport section |
| Our Engineers | 3-across carousel, arrows outside the container |
| Build Your Session | live quote calculator (room + add-ons) × hours |
| Ready to Record | details panel + validating form, inline success only |
| FAQ | `<details>` accordion, full-viewport section |
| Footer | full-viewport, palette matched to bayeight.com |

## Still to come from the client

| What | Where it goes |
|---|---|
| Hero background video | `assets/video/hero.mp4` — the still is already wired as its poster |
| Abbey Jo and Jeronimo "J Gross" Hernandez portraits | `assets/img/engineers/`, transparent PNG to match the GeeFlow cut-out |
| The mock's Trusted By brands (Def Jam, Aveeno, Nike, Toronto, OVO Sound, Puma) | `assets/img/logos/` — the record-label logos the live site uses are standing in |
| Full text of the Google reviews | `index.html`, reviews section — the mock only showed truncated snippets |
| BEMP partner logo | footer "Our Partners", currently a text wordmark |
| Platinum-record and Grammy icons | studios stat strip, currently hand-drawn inline SVG |

Copy that needs sign-off: the **FAQ answers** were drafted from facts already on
bayeight.com (rates, minimums, opening hours, what's included) because the mock
only carried placeholder text.

## Known gaps

- The contact form has no backend. It validates and shows an inline
  confirmation, but nothing is submitted anywhere. The mock also shows a
  Cloudflare Turnstile widget; that needs a real site key once a submission
  endpoint exists.
- Two phone numbers appear in the mock — `305-705-2405` throughout and
  `(305) 901-4913` in the footer — and two spellings of the address
  (`Miami, FL 33162` vs `North Miami Beach, FL 33162`). Both are reproduced as
  designed and need a decision.

## Assets

Photography and logos were pulled from bayeight.com, then resized to roughly
twice their rendered size and recompressed — 4.9 MB down to 2.3 MB. Files that
were already smaller than the re-encode were left untouched.
`assets/img/artists/` holds 18 portraits, so more names can be added to the
strip without another download.
