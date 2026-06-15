# Serendipity — marketing site

Static HTML/CSS/JS recreation of the signed-off "Editorial + Evidence" redesign for
**[createserendipity.com](https://createserendipity.com)** (HubSpot Platinum Solutions Partner).
Built to run as-is on **GitHub Pages** today and to port cleanly to **HubSpot Content Hub** later.

Positioning: *make the move, make it stick, grow on it.* The client is the hero; Serendipity is
the guide with a plan (the 30/90 Method). Warm, editorial, human — deliberately not dark-SaaS and
not HubSpot orange.

## Run it locally

No build step. Any static server works:

```bash
cd serendipity-website
python3 -m http.server 8190
# open http://localhost:8190
```

## Structure

```
index.html            Home (hero, trust, problem gauge, services, certs, 30/90 method,
                      stakes, pull-quote, Perricone results, assessment preview, FAQ, CTA)
case-studies.html     Perricone featured + "publishing soon" + what we measure + CTA
about.html            Meet Luke + founder story + SCALE values + verify + stats + CTA
contact.html          Hero + lead form (styled, inert for now)
assessment.html       The HubSpot Readiness Score quiz (full flow, real scoring)

css/
  tokens.css          Design tokens (:root custom properties) → maps to a HubSpot theme
  base.css            Reset, type, buttons, eyebrow, .hl-gold/.hl-teal, reveal, header
  sections.css        Homepage sections + textures + all built data-viz
  pages.css           Inner-page components (case studies / about / contact)
  assessment.css      The quiz, re-skinned in the brand language
  site.css            Production overrides + the mobile pass (loaded last)

js/
  main.js             Scroll-reveal, count-up, mobile nav, poster video
  assessment.js       Quiz logic (questions, scoring, 6-path recommendation engine, radar)

assets/
  logo/ badges/ press/ clients/ certs/ screenshots/ case/ portrait/ imagery/ favicon.png
```

## Design system

- **Colors:** navy `#0B2233`, gold `#E9B44C` (single primary accent), teal `#0E7C86`
  (growth/win moments only), cream `#F8F6F1`, brand-blue `#175477`. All in `css/tokens.css`.
- **Type:** Newsreader (display/numerals), Archivo (headings/UI), Source Sans 3 (body) — Google Fonts.
- **Accent discipline:** gold is the only chroma for brand/proof/CTA; teal appears only on growth
  moments. Section rhythm alternates cream / white / cool / navy; navy is reserved for anchors.
- **All charts are built in CSS/SVG, never images:** adoption gauge, 30/90 timeline, lead-scoring
  pyramid, certification stats, the assessment score dial / radar / category bars.

## The assessment (Readiness Score)

`assessment.html` runs the full signed-off quiz end to end: intro → 3 business qualifiers →
21 scored questions (7 areas × 3) → score + named stage → email gate → full scorecard.

- Scoring: category = sum/12 as %; Leadership & Adoption weighted 1.25×; overall = weighted avg.
  Stages: Flying Blind ≤45 · Foundations 46–65 · Ready to Build 66–85 · Ready to Scale 86+.
  3+ red-flag answers cap the verdict at Foundations.
- **Route, don't gate:** the result is a *recommendation* (6 deterministic paths keyed on current
  CRM + data score + leadership/adoption), not a pass/fail.
- **Preview build behavior:** nothing is sent or stored. Enter any valid work email (e.g.
  `test@test.com`) at the gate to see your real, scored results. `assessment.html#sample` auto-loads
  a sample manufacturing-on-Salesforce scorecard.

## Assets

- **Real / load-bearing (kept, do not regenerate):** HubSpot pipeline + report screenshots, the 5
  certification badges, Luke's portrait (shown full/uncropped on About), the Perricone/Natalie's
  logo, press logos (Yahoo, Business Insider, MarketWatch, AP, Cision, RD), client logos. Press +
  client logos were pulled from the live site's `hubfs/brand-assets/serendipity/`.
- **Atmosphere only:** the AI-photoreal lifestyle photos (hero, FAQ, final-CTA backgrounds). Never
  used as proof.

## Known placeholders / open items for Luke

- **Contact form** is styled but inert (no submission yet) — wire to a HubSpot form at launch.
- **`href="#"` placeholders** (intentional, pending real URLs): "Verify Platinum status", the About
  verify cards (HubSpot Directory / certs / LinkedIn), case-study "Read the full story", and the
  footer Privacy / Terms.
- **Service-card images for CRM Migration & Portal Rescue** currently resolve to tinted lifestyle
  photos (that's what the referenced design assets are), not HubSpot UI like the other two cards.
  Swap in real Migration/Rescue screenshots when available.
- **[CONFIRM] copy:** Perricone quote + Natalie's exact title; the ~3-month migration and 10-day
  audit timelines; guarantee remedy language (legal); the assessment question set/stage names.

## Mobile

Desktop was the design source of truth; the mobile pass lives in `css/site.css` and refines the
handoff's breakpoints. Notable mobile treatments: vertical hero scrim for contrast, stacked
service cards with larger screenshots, and the 30/90 timeline reflowed to a vertical rail.
Verified at 375 / 768 / 1280px.

## Deploying to GitHub Pages

Push to a GitHub repo, then Settings → Pages → deploy from `main` / root. `.nojekyll` is included
so every file is served verbatim. Keep `createserendipity.com` on its current host until you're
ready to cut the domain over.

## Later: HubSpot Content Hub

Designed to port cleanly. `tokens.css` → theme fields (Colors/Typography). Header + footer → global
partials. Each section → a custom module (heading/body/CTA/image fields, repeaters for cards/FAQ/
phases). Contact form + assessment gate → HubSpot Forms; "Book a call" → a HubSpot Meetings link.
FAQ → emit FAQPage JSON-LD. The assessment → a custom module with client-side scoring + Forms API.
