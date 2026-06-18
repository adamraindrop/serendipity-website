# Serendipity — marketing site (handoff)

Static HTML/CSS/JS build of the signed-off "Editorial + Evidence" site for
**[createserendipity.com](https://createserendipity.com)** (HubSpot Platinum Solutions Partner).
Runs as-is on **GitHub Pages** today; built to port cleanly to **HubSpot Content Hub**.

No framework, no build step, no dependencies. Plain HTML + CSS custom properties + vanilla JS.
Every section is authored to map 1:1 to a future HubSpot module.

Positioning: *make the move, make it stick, grow on it.* The customer is the hero; Serendipity is
the guide with a plan. Warm, editorial, human — deliberately not dark-SaaS and not HubSpot orange.

---

## ⚠️ Read before you push live

1. **`noindex` is on every page** (`<meta name="robots" content="noindex">`). This is a preview/staging
   build. **Remove the noindex tag site-wide at launch.**
2. **Unconfirmed client figures are flagged in the source.** Run `grep -rn "\[VERIFY\]" *.html` — the
   **Solheim** (~$20M, 80%→100% capacity / waitlist) and **Expedient** (~$2M, tripled in 18 months)
   numbers and industries are pending Luke's sign-off. They appear on `case-studies.html`, `revops.html`,
   `demand-gen.html`, and `alignment.html`. We intentionally added **no review schema** for those two
   until confirmed. Verify or remove before publishing.
3. **`[CONFIRM-with-Luke]` faith line** in `about.html` is a draft — replace with Luke's own words.
4. **Still placeholder (`href="#"`):** footer Privacy / Terms. The contact form is styled but **inert**
   (wire to a HubSpot form at launch). Careers page carries a **[LEGAL] hiring-language review** note in
   source.

---

## Run it locally

```bash
cd serendipity-website
python3 -m http.server 8190
# open http://localhost:8190
```

---

## Pages (14)

```
index.html                 Home — hero, trust bar, problem/gauge, services (5 "ways in" cards →
                           deep pages), engineered-serendipity manifesto, Grow Better Blueprint
                           section, certs, "where HubSpot is going", 30/90 Method, stakes,
                           pull-quote, case result, assessment, FAQ, final CTA
grow-better-blueprint.html The owned framework page (flagship). The signature graphic, the
                           4 differentiators, the 3-step "how it works", the assessment on-ramp,
                           Solheim + Expedient proof, the partnership beat, CTA
services.html              Services index — 6 cards, each a step within the Blueprint
implementation.html        HubSpot Implementation  ─┐
migration.html             CRM Migration            │  6 service pages on one customer-as-hero
portal-rescue.html         Portal Rescue            │  template, each built to the AEO spec
revops.html                Ongoing RevOps           │  (see "Service pages" below)
demand-gen.html            Inbound & Demand Gen      │  (the teal "growth" page)
alignment.html             Sales & Marketing Alignment ┘ (the third-pillar page)
case-studies.html          Four studies, one format: Perricone, Affordable Blinds, Solheim,
                           Expedient (Problem / Build / Outcome + a metrics panel)
about.html                 Meet Luke (cropped portrait) + founder's letter + faith line [draft]
contact.html               Hero + lead form (styled, inert)
careers.html               [SCAFFOLD] "Be a blessing" — values/culture (legal note in source)
assessment.html            The Readiness Score quiz (full flow, real scoring)
```

```
css/
  tokens.css      Design tokens (:root) + friendly --navy/--gold/--teal aliases → HubSpot theme
  base.css        Reset, type, buttons, .eyebrow, .hl-gold/.hl-teal, scroll-reveal, header
  sections.css    Homepage sections, textures, all built data-viz, the Blueprint homepage section
  pages.css       Inner-page components (case studies / about / contact / Blueprint page)
  service.css     The 6 service pages + services index (hero, what's-included, adoption gauge,
                  comparison table, the balanced Problem/How-we-help splits)
  assessment.css  The quiz, re-skinned in the brand language
  site.css        Production overrides, signature CSS, the mobile pass
                  (load order, every page: tokens → base → sections → pages → [service] → site)

js/
  main.js         Scroll-reveal, count-up, mobile nav (+ aria-expanded)
  assessment.js   Quiz logic (questions, scoring, 6-path recommendation engine)

assets/
  brand/          grow-better-blueprint.svg (the signature graphic) + -mark.svg (compact) +
                  convergence-mark-{dark,light}.svg + serendipity-engine.svg (the 26-touches motif)
  imagery/        hero.png + lifestyle/01-10 (AI-photoreal, atmosphere only) + team-group
  screenshots/    Real HubSpot UI: deal_pipeline, deal_report, portal, records, user-view
  certs/ badges/ logo/ press/ clients/ case/ portrait/ favicon.png
```

---

## The framework hierarchy (the spine of the site)

Three nested layers, deliberately consistent across every page:

1. **Brand thread — "Create Serendipity."** The *why/story*: we reverse-engineer the conditions for
   growth so the right buyer meets the right message at the right moment (the 26-emails origin). Its
   visual device is the **"engineered convergence"** motif. Used sparingly (homepage manifesto, About,
   the Demand Gen page).
2. **Owned framework — the Grow Better Blueprint.** The *journey/model* and the recurring anchor:
   Build momentum → Begin with the end in mind → "you are here" → a 6–12 month plan → the
   **Attract / Engage / Convert / Delight** flywheel across Marketing, Sales, Service Hubs with RevOps
   at the center. Rendered as **one signature SVG** (`assets/brand/grow-better-blueprint.svg`), reused
   on the homepage, its own page, and RevOps. The assessment is its on-ramp ("you are here").
3. **Delivery method — the 30/90 Method.** *How the first build runs*: live in 30 days, adopted in 90.
   Nests inside the Blueprint as the first momentum step; it is the "The path" section on the service
   pages.

---

## Service pages (AEO spec)

The five "ways in" homepage cards deep-link to their pages; Sales & Marketing Alignment is the
third-pillar page linked from the homepage positioning beat. Every service page follows one
customer-as-hero arc: **hero** (the buyer's outcome as H1 + a real HubSpot screenshot) → **the problem,
in their words** (empathy copy + a "what it's costing you" stakes card) → **how we help** (the plan +
a lifestyle photo) → **what's included** → **the path** (the 30/90 Method) → **proof** → **FAQ** →
**CTA band**.

Built to be cited by AI engines: an **answer-first** hero subhead, a **plain definition** near the top
("X is …"), a **service-specific FAQ with FAQPage JSON-LD**, and a **comparison table**. Each page is
its own indexable URL with a unique title, meta description, and schema.

**Proof mapping (never forced):** Implementation → Expedient + Perricone · RevOps → Perricone + Solheim ·
Demand Gen → Solheim + Expedient + the origin story · Alignment → Solheim + Expedient. **Migration** and
**Portal Rescue** are intentionally credentials-led (method + certifications), with no client case study
until Luke can name a real one.

---

## Design system

- **Colors:** navy `#0B2233`, gold `#E9B44C` (single primary accent), teal `#0E7C86`
  (growth/win moments only), cream `#F8F6F1`, cool-gray `#F4F7F9`, brand-blue `#175477`. In
  `css/tokens.css`.
- **Type:** Newsreader (display/numerals), Archivo (headings/UI), Source Sans 3 (body) — Google Fonts.
- **Accent discipline:** gold is the only chroma for brand/proof/CTA; teal appears only on growth
  moments. Section rhythm alternates cream / white / cool-gray / navy.
- **No em dashes in rendered copy** (a house rule throughout).
- **All charts are built in CSS/SVG, never images:** the Blueprint graphic, adoption gauge, 30/90
  timeline, lead-scoring pyramid, the assessment dial / radar / bars, the service comparison tables.
- **Real screenshots / logos = proof; AI lifestyle photos = atmosphere only.**

---

## The assessment (Readiness Score)

`assessment.html` runs the full signed-off quiz end to end: intro → business qualifiers → 21 scored
questions (7 areas × 3) → score + named stage → email gate → full scorecard.

- Scoring: category = sum/12 as %; Leadership & Adoption weighted 1.25×; overall = weighted avg.
  Stages: Flying Blind ≤45 · Foundations 46–65 · Ready to Build 66–85 · Ready to Scale 86+.
- **Route, don't gate:** the result is a *recommendation* (6 deterministic paths), not a pass/fail.
- **Preview behavior:** nothing is sent or stored. Enter any valid work email (e.g. `test@test.com`)
  at the gate to see real scored results. `assessment.html#sample` auto-loads a sample scorecard.

---

## Mobile

Desktop was the design source of truth; the mobile pass lives mostly in `css/site.css` and
`css/service.css`. Verified at 390 / 768 / 1280px across every page. Notable treatments: the 2-column
service heroes and Problem/How-we-help splits stack (media first), the 30/90 timeline reflows to a
vertical rail, comparison tables scroll inside their own container.

---

## Deploying to GitHub Pages (current host)

Push to a repo, then Settings → Pages → deploy from `main` / root. `.nojekyll` is included so every
file is served verbatim. The live preview is at
`https://adamraindrop.github.io/serendipity-website/`. Keep `createserendipity.com` on its current
host until you cut the domain over (and remember to strip `noindex` first).

---

## Porting to HubSpot Content Hub

Designed for a clean port:

- **`tokens.css` → theme fields** (Colors / Typography). The `:root` variables are the single source
  of truth, so theme fields map almost 1:1.
- **Header + footer → global partials.** Nav and footer are byte-identical across all 14 pages.
- **Each section → a custom module** with heading / body / CTA / image fields, and repeaters for the
  card rows, FAQ items, 30/90 phases, comparison-table rows, and case-study metrics.
- **The Grow Better Blueprint graphic** is a self-contained inline SVG — drop it into a module as-is or
  expose its labels as fields.
- **Forms:** the contact form and the assessment email gate → HubSpot Forms; "Book a call" → a HubSpot
  Meetings link.
- **SEO/AEO:** keep each page's `<title>`, meta description, canonical, and the FAQPage / Service
  JSON-LD. They are the AEO engine — one query family per page, no cannibalization.
- **The assessment** → a custom module with the client-side scoring in `assessment.js` + Forms API for
  the gate.
```
