# dakshsuthar.com

Personal founder site for Daksh Suthar. Multi-page static site — every page is real HTML, no build step, no framework, no lock-in.

## What's here

```
site/
├── index.html                            Homepage
├── about.html                            Longer version — story, timeline, beliefs
├── now.html                              What Daksh is doing right now (weekly)
├── book.html                             Book a meeting — topic gate + Cal.com embed
├── ask.html                              Ask Daksh anything
├── contact.html                          Categorized contact — meeting/speaking/media
├── 404.html                              Not found page
│
├── work/
│   ├── index.html                        Work overview — all three products
│   ├── extuter.html                      Extuter launch page (featured)
│   ├── genartml.html                     Genartml studio page
│   └── evoluter.html                     Evoluter product page
│
├── journal/
│   ├── index.html                        Journal listing
│   └── why-ai-startups-shouldnt-build-models.html   Sample article
│
├── assets/
│   ├── css/main.css                      Full design system (all tokens + components)
│   └── js/
│       ├── main.js                       Nav, palette, clock, reveals, forms, countdown
│       └── booking.js                    Topic gate + Cal.com embed loader
│
├── README.md                             You are here
└── DEPLOY.md                             How to deploy
```

## Tech stack

- **Zero dependencies at build time.** Plain HTML, CSS, JavaScript.
- **Two runtime scripts loaded from CDN:**
  - Google Fonts (Instrument Serif, Inter, JetBrains Mono)
  - Cal.com embed script (loaded only on the booking page, and only when the user reaches step 3)
- **Persistent state via `localStorage`** for the Ask form, waitlist, and question history.

## How the booking flow works

1. User lands on `/book.html`.
2. They pick a topic (chip select). Continue button unlocks.
3. They write context (required). See available times button.
4. Cal.com inline embed loads at `daksh-suthar-9u1moo/founder-chat`.
5. Cal.com auto-detects timezone, shows blocked slots from Daksh's Google Calendar, offers 30/45/60 min options.
6. Topic + context are prefilled into the booking notes so Daksh sees them when the meeting comes through.

Google Calendar sync is handled by Cal.com (already connected in Daksh's Cal.com account). Every timezone in the world works out of the box — no code needed on our end.

## Editing content

- **Update &ldquo;Right now&rdquo;:** edit `now.html`. Change the &ldquo;Last updated&rdquo; date at the bottom.
- **New journal entry:** copy `journal/why-ai-startups-shouldnt-build-models.html`, rename, replace content, add card to `journal/index.html` and to the preview grid on `index.html`.
- **New product:** copy `work/extuter.html` or `work/genartml.html`, edit, add a row to `work/index.html` and to `#building` on `index.html`.
- **Change what appears in ⌘K:** edit the `.cmd__list` block on every page (yes, currently duplicated on each — trade-off for zero build step).

## Design tokens

Every color, font, spacing value lives at the top of `assets/css/main.css` as CSS custom properties. Change them once, everything updates.

- Palette: `#0A0A0A` background through to `#FAFAFA` ink, grayscale between.
- Accent: `--live: #7FE7A4` — reserved only for the &ldquo;live/building&rdquo; indicator pulse.
- Fonts: Instrument Serif (display) · Inter (UI) · JetBrains Mono (labels &amp; timestamps).

## Local preview

Any static server works. Simplest:

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use `npx serve`, `live-server`, or drag `index.html` straight into a browser.

## Deploying

See `DEPLOY.md` — recommended stack is Vercel or Netlify (zero config), or GitHub Pages if you prefer.

---

Built by Daksh Suthar (with help). Handcrafted in Ahmedabad. Built to evolve.
