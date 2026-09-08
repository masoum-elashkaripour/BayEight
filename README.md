# Bay Eight Studios — landing page

Static landing page for Bay Eight Studios (Miami recording studio).
Built section by section from Canva designs, with <https://bayeight.com/> as the
reference for brand, copy and structure.

## Stack

Plain **HTML + CSS + JavaScript** with **Bootstrap 5.3** (CDN). No build step,
no framework, no bundler — open the file and it runs.

- Bootstrap 5.3.3 + Bootstrap Icons 1.11.3 (jsDelivr CDN)
- Google Fonts: Inter (body) + Bebas Neue (display)
- Vanilla JS in `js/main.js` (sticky nav, scrollspy, scroll reveal)

## Structure

```
bayeight/
├── index.html        the whole page — one <section> per design section
├── css/style.css     design tokens in :root, then component styles
├── js/main.js        navbar state, scrollspy, reveal-on-scroll
└── assets/
    ├── img/          images exported from Canva
    └── video/        background / showreel video
```

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
- **One `<section>` per design section**, each with a stable `id` used by the
  navbar anchors and the scrollspy.
- **Bootstrap utilities for layout**, custom CSS only for what Bootstrap can't
  express. Override Bootstrap through its CSS variables (`--bs-*`) rather than
  fighting it with `!important`.
- **Fade-ups**: add `class="reveal"` to any element — `main.js` reveals it when
  it scrolls into view, and respects `prefers-reduced-motion`.
- Images go in `assets/img/`, referenced with relative paths.

## Status

| Section | State |
|---|---|
| Header / navbar | done — logo left, slide-in menu right |
| Hero + Trusted By | done — needs `assets/video/hero.mp4`, `assets/img/hero-poster.jpg`, and the real client logos |
| Artists (`#clients`) | done — portrait strip with hover-to-swap name card |
| Welcome (`#about`) | done — copy + click-to-play video facade (YouTube `uGhjHFJnfww`) |
| Our Studios | done — stats, Google rating, perks marquees, suite carousel |
| Our Services | done — full-bleed poster strip + All Services link |
| Our Reviews | done — two counter-scrolling marquee rows of Google review cards |
| How to Book | done — 4 step cards over a darkened studio backdrop |
| Our Engineers | done — carousel of engineer cards (2 of 3 photos still needed) |
| Build Your Session | done — live quote calculator (room + add-ons) × hours |
| Ready to Record (contact) | done — details panel + validating form, inline success only |
| FAQ | done — `<details>` accordion; **copy drafted, needs client sign-off** |
| Footer | done — sign-off band, link grid, address/partners/rating, legal bar |

Every section from the Canva mock is now built. Images throughout were pulled
from bayeight.com; `assets/img/artists/` holds 18 portraits, so extra names can
be added to the strip without another download.

## Pending assets

Drop these in and they wire up with no code change:

| File | Used by |
|---|---|
| `assets/video/hero.mp4` | hero background video |
| `assets/img/hero-poster.jpg` | poster frame shown before the video plays |
| `assets/img/logos/*.svg` | Trusted By marquee (currently text wordmarks) |

Still to source from Canva:

- Photos for **Abbey Jo** and **Jeronimo "J Gross" Hernandez** (transparent PNG,
  to match the GeeFlow cut-out)
- The hero's Trusted By brands (Def Jam, Aveeno, Nike, Toronto, OVO Sound, Puma)
  — not on bayeight.com. `assets/img/logos/` holds the record-label logos the
  live site uses instead.
- Full text of the Google reviews (the mock only shows truncated snippets)
- Platinum-record and Grammy icons in the studios stat strip (currently inline SVG)

## Known gaps

- `assets/img/engineers/geeflow.png` is ~2 MB straight from bayeight.com and
  should be compressed before launch.
- The contact form has no backend and no captcha. The mock shows a Cloudflare
  Turnstile widget; that needs a real site key once a submission endpoint exists.
