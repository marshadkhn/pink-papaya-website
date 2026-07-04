# Pink Papaya Stays — Project Documentation

---

## Table of Contents

1. [Project Overview & Tech Stack](#1-project-overview--tech-stack)
2. [Environment Variables](#2-environment-variables)
3. [Project Structure](#3-project-structure)
4. [Local Development](#4-local-development)
5. [API Notes](#5-api-notes)
6. [Performance Strategy](#6-performance-strategy)
7. [Deployment (Vercel)](#7-deployment-vercel)
8. [Build & Validation](#8-build--validation)
9. [Security Checklist](#9-security-checklist)
10. [Logging & Debugging Guide](#10-logging--debugging-guide)
11. [Design Spec](#11-design-spec)
12. [Property Content — 43 Properties](#12-property-content--43-properties)

---

## 1. Project Overview & Tech Stack

Production-ready web application built with Next.js App Router, optimized for Vercel deployment, MongoDB persistence, and local disk (VPS) media storage.

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Runtime | Node.js (Route Handlers + Server Utilities) |
| Database | MongoDB with Mongoose connection pooling |
| Storage | Local VPS disk (client uploads) |
| CDN | Vercel Edge + optional CloudFront/Cloudflare |
| Auth | Signed HTTP-only cookie session (HMAC SHA-256) |

**What was implemented:**
- Migrated backend data storage from local JSON files to MongoDB-backed repositories
- Added shared cache-aware data layer with revalidation tags for fast repeated reads
- Added centralized server environment validation
- Added image optimization and remote image support for CDN domains
- Added production-focused Next.js config for compression, bundle import optimization, and immutable static caching headers
- Added health endpoint at `/api/health` for runtime checks

---

## 2. Environment Variables

Copy `.env.example` to `.env` and fill in values.

**Required:**

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Minimum 24 chars — HMAC signing key |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB_NAME` | Database name (e.g. `pink-papaya`) |

**Optional:**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CDN_BASE_URL` | Cloudflare / CloudFront CDN base URL |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (default `http://localhost:3000`) |
| `SEED_ADMIN_EMAIL` | Seeds first admin if admins collection is empty |
| `SEED_ADMIN_PASSWORD` | Seeds first admin password |

> **Note:** Do not commit `.env*` files. `.gitignore` already excludes them.

---

## 3. Project Structure

```
pink-papaya-website/
  src/
    app/
      (main)/          # Web pages (mobile-first responsive)
      admin/           # Admin pages
      api/
        blog/
        interior/
        interior-feedback/
        locations/
        stays/
        upload/
        login/
        logout/
        health/
    components/        # UI and page components
    data/              # Seed data for first MongoDB bootstrap
    lib/
      auth.ts
      authStore.ts
      env.ts
      mongodb.ts
      contentStore.ts
      blogStore.ts
      interiorStore.ts
      interiorFeedbackStore.ts
      locationsStore.ts
      staysStore.ts
```

---

## 4. Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

First read auto-seeds MongoDB collections from files in `src/data/` if collections are empty.

---

## 5. API Notes

- Existing APIs are preserved; internals now persist to MongoDB.
- Upload endpoint returns a URL and object key:

```json
{
  "url": "/uploads/....jpg",
  "key": "uploads/...jpg"
}
```

---

## 6. Performance Strategy

- Mobile-first UI with App Router streaming and Server Components by default
- API GET routes export revalidate windows for ISR-friendly behavior
- Repository layer uses cache tags + `revalidateTag` after writes
- Next.js image optimization enabled with AVIF/WebP and CDN remote patterns
- Static assets served with long-lived immutable caching
- Bundle optimizations enabled for heavy icon packages

**Latency recommendations (India):**
- Keep MongoDB region near India users (Mumbai / `ap-south-1`)
- Use CloudFront/Cloudflare with India PoPs and set `NEXT_PUBLIC_CDN_BASE_URL`
- Configure Vercel function regions closest to users

---

## 7. Deployment (Vercel)

1. Push repository to Git provider.
2. Import project in Vercel.
3. In Vercel Project Settings → Environment Variables, add all variables from `.env.example`.
4. Set Production Node version compatible with Next.js 15 (Node 18+).
5. Deploy.

---

## 8. Build & Validation

```bash
npm run lint
npm run build
```

---

## 9. Security Checklist

- Do not commit `.env*` files
- Rotate auth secrets periodically
- Use HTTPS only in production
- Validate all user input at API boundaries

---

## 10. Logging & Debugging Guide

**Logger utility:** `src/lib/logger.ts` — lightweight structured logger with masking and environment-awareness.

**Usage:**
```ts
import { getLogger } from '@/lib/logger';
const logger = getLogger('API');
logger.info('message', { meta: 'value' });
logger.warn / logger.error / logger.debug(message, meta);
```

Use `logEnvironment(process.env)` to print a masked environment summary (development only).

**Integrations added:**
- `src/lib/mongodb.ts` — logs connection start/success/failure and mongoose query debug in development
- `src/app/api/log-example/route.ts` — example API route demonstrating request logging and error handling

**Masking rules:** Keys containing `KEY`, `SECRET`, `PASSWORD`, `TOKEN`, `URI`, `AUTH`, or `ACCESS` are masked (first 4 / last 4) in logs.

**Environment awareness:**
- Detailed, readable logs in development (`NODE_ENV !== production`)
- Compact JSON logs in production (easy to ship to log aggregation)

**How to test:**
```bash
npm run dev
# Hit /api/log-example
# Check terminal for prefixed logs: [ENV] [DB] [AWS] [API] [ERROR]
```

**Best practices:**
- Do not print full secrets in production — use `logEnvironment` only in development or controlled diagnostics
- Forward JSON logs to your log collector in production (e.g., CloudWatch, Datadog)

---

## 11. Design Spec

Source: Figma exports (`1920w light.pdf`, `Stays Page.pdf`, `Contact Us.pdf`, `Per Interior Page.png`, `Group 25/26/27`). Boutique-stay marketing site. Goa-based. Brand voice: warm, editorial, coastal-luxury.

### 11.1 Brand & Tone

- **Name:** Pink Papaya Stays
- **Voice:** lowercase taglines + Title Case display headings. Editorial, sun-warm, not corporate.
- **Locale signals:** ₹ pricing, "Goa" copy

### 11.2 Color Tokens

```
--bg-cream:    #F7F2EA   /* page bg, hero overlay rest */
--bg-mist:     #E6ECEC   /* alt section bg (interior gallery tiles) */
--ink:         #16323C   /* body text, headings (deep teal-navy) */
--ink-soft:    #4A6068   /* secondary text */
--muted:       #B8A892   /* eyebrow text, inactive list items, soft labels */
--line:        #D9D2C4   /* hairline borders */
--card:        #FFFFFF   /* card surface */
--accent:      #C97B63   /* coral/papaya accent — buttons hover, links (use sparingly) */
--btn-dark:    #16323C   /* dark CTA bg (Submit) */
--btn-dark-tx: #FFFFFF
--star:        #16323C   /* review stars */
```

Background hierarchy: cream → white card → mist (only for interior-talks gallery cells).

### 11.3 Typography

- **Display serif:** Cormorant Garamond 500/600 (or Playfair Display fallback). H1/H2/stay-card titles.
- **Body sans:** Inter 400/500. All paragraphs, nav, labels, buttons.
- **Script accent:** Allura or Pinyon Script. One-off italic taglines. Use sparingly.
- **Eyebrow:** Inter 12px UPPERCASE letter-spacing 0.12em color `--muted`.

Scale (desktop):

| Element | Size / Leading / Weight |
|---|---|
| H1 hero | 72px / 1.05 / serif 500 |
| H2 section | 56px / 1.1 / serif 500 |
| H3 subsection | 36px / 1.15 / serif 500 |
| Card title | 28px / 1.2 / serif 500 |
| Body lg | 18px / 1.6 / sans 400 |
| Body | 16px / 1.65 / sans 400 |
| Small | 14px / 1.5 / sans 400 |
| Eyebrow | 12px / 1 / sans 500 uppercase tracked |

Mobile: H1→44px, H2→36px, H3→28px.

### 11.4 Layout Grid

- Max content width: **1280px** centered, gutter 24–48px
- Hero & full-bleed images: 100vw
- Section vertical padding: **96px** desktop / 56px mobile
- Cards rounded-md (8px). Hero/large images square corners or 4px

### 11.5 Components

**Top Nav** — sticky, transparent over hero, solid cream after scroll. Left: nav links (home, explore stays, about us, contact us). Right: "Get In Touch" pill + circular WhatsApp icon.

**Hero** — full-bleed photo, soft dark gradient bottom-up, centered H1 → subtitle → white pill CTA "Explore Stays".

**Stay Card** — white surface, 1px border, 4:3 image top, 24px padding body, serif 28px title, 14px location, amenity icon-labels, price line, full-width "View Stay" footer button.

**Section Heading** — optional eyebrow, H2 serif centered, optional 2–3 line body (max-width 520px).

**Image Collage** — 12-col grid, 4 asymmetric photos, centered text block in middle.

**Rooms Accordion ("Stay your Way")** — 5/12 left column with eyebrow + H2 + body + pill button + vertical room list. Active item: 28px serif ink with detail row. Inactive: 28px serif muted. 7/12 right column: large room photo with bottom overlay caption.

**Three-feature Row** — centered H2 + tagline, 3 portrait image + lowercase serif headline + 2-line body, 48px gap.

**Interior Talks Gallery** — 2×2 grid, mist and photo tiles alternating.

**FAQ** — two-column, left: eyebrow + H2 + body; right: rows with hairline border, `+` expand icon.

**Testimonials** — 3 cards in a row, white + rounded-md + soft shadow + 5 dark stars + italic body + avatar/name/role.

**Footer** — cream bg, top hairline, centered wordmark, 4-column (Navigation, Pages, Pages, Newsletter), palm-leaf SVG decoration, "2025 © All right reserved" bottom.

**Contact Us Page** — eyebrow "Contact Us" → H2 "Get In Touch" → two-column: left = contact info stacks, right = form card (Name + Email, Subject select, Message textarea, dark Submit button). Below: FAQ block.

**Per-Stay Interior Page** — two-column hero (1:1 photo left, text right with eyebrow + H2 + script tagline + body + divider + "What we did"). "All Photos" 4×2 grid. "Before and After" 2 draggable sliders.

### 11.6 Buttons

| Type | Style |
|---|---|
| Primary CTA (hero) | cream bg / ink text / rounded-full / 14×32 / sans 14 medium |
| Outline pill (nav, list) | transparent / 1px ink border / ink text / rounded-full / 12×24 |
| Card button (View Stay) | full-width inside card / no fill / 1px top border only / 14 sans bold ink |
| Submit (contact) | ink fill / white text / rounded-md / 12×40 |
| Hover (all) | 200ms ease; outline → ink fill + cream text; ink → ~10% lighten |

### 11.7 Iconography

- Line icons, 1.5px stroke, ink color, ~24px
- Custom amenity icons match the line style
- Social icons: solid filled circle ink-on-cream variant in footer

### 11.8 Imagery

- Warm coastal interiors, beachfront vistas, soft daylight
- All images full-color, no filters; preserve natural warmth
- Aspect ratios: hero 16:9, stay cards 4:3, collage tiles 3:4 portrait, interior gallery 1:1

### 11.9 Motion

- Section reveals: fade-up 12px, 400ms, stagger 80ms
- Card hover: lift -2px + shadow softening 200ms
- Accordion: 250ms ease
- Hero overlay text: settle-in on load
- Respect `prefers-reduced-motion`

### 11.10 Pages to Build

1. **Home** — full long-scroll (Hero → Stay Cards → Collage → Rooms Accordion → Three-feature → Interior Talks → FAQ → Testimonials → Footer)
2. **Stays / Explore Stays** — Hero + 2-col grid of 6 image-overlay stay cards + footer
3. **Stay Detail (Per Interior)** — Per-stay hero + All Photos grid + Before/After sliders + footer
4. **Contact Us** — Contact info + form card + FAQ block + footer

### 11.11 Responsive Rules

- Breakpoints: ≥1280 desktop, 768–1279 tablet, <768 mobile
- 2-col grids → 1-col on mobile
- 3-col feature row → 1-col stacked
- Rooms accordion: collapses to dropdown above image on mobile
- Footer 4-col → 2-col tablet → 1-col mobile

### 11.12 Accessibility

- Color contrast AA: ink on cream = pass; muted text only for non-essential labels
- All buttons reachable by keyboard, focus ring 2px `--accent` offset 2px
- FAQ + accordion use `<button aria-expanded>` + `<region>`
- Form fields have associated `<label>`
- Alt text on every image

### 11.13 Tech Stack (for build)

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS with tokens mapped in `tailwind.config.js` `theme.extend.colors`
- **Fonts:** `next/font/google` for Cormorant Garamond, Inter, Allura
- **Icons:** `lucide-react` for nav + amenity + social; inline SVG for custom glyphs
- **Images:** `next/image`, lazy by default
- **Routes:** `/`, `/stays`, `/stays/[slug]`, `/contact`

---

## 12. Property Content — 43 Properties

**Pink Papaya Stays, Goa, India**

---

### 1. Sempre
**Area:** Aldona, North Goa | **Beds:** 4 | **Guests:** 12 | **Type:** Villa
**Collections:** Romantic Luxury Escapes, Expansive Views
**Airbnb:** https://www.airbnb.co.in/rooms/1584060007789227621
**Images:** https://drive.google.com/drive/folders/1eFRMW1qmhEUmlG-lWtP3fPBkLllZXRSg

**Short Description:** A 100+ year old Portuguese heritage villa in Aldona, lovingly curated by Pink Papaya Stays. Sempre is where history meets barefoot luxury in the quietest corner of North Goa.

**About:** Built in 1828, Sempre is a living testament to Goa's Portuguese legacy. Nestled in the slow-paced village of Aldona, this four-bedroom heritage home has been thoughtfully restored by Pink Papaya Stays to honour its past while welcoming modern comfort. Sun-dappled verandahs, hand-painted walls, heritage art, and a private pool create a setting unlike any other in Goa. The villa unfolds across two floors with two pool-facing bedrooms on the ground floor and two more private suites upstairs, each with ensuite bathrooms and balcony access. A reading library, open courtyard, and lush garden round off a space made for creative souls, families, and anyone seeking a true Goa slow-living experience. No TVs, by design. Just Goa, in its most authentic form.

**Nearby Places:** Aldona Village Market (5 min walk) · Corjuem Fort (10 min drive) · Mapusa Friday Market (20 min drive) · Chapora Fort & Vagator Beach (30 min drive) · Anjuna Flea Market (25 min drive) · Panjim City Centre (20 min drive) · Assagao Café District (20 min drive)

**FAQs:**
- Q: Is this an entire villa booking? A: Yes, Sempre is booked as a complete private villa for up to 12 guests across 4 bedrooms.
- Q: Is the property suitable for families with children? A: Absolutely. The garden, pool, and spacious common areas make Sempre ideal for multi-generation family stays.
- Q: Is there a minimum stay? A: We recommend a minimum of 2–3 nights to truly soak in the heritage atmosphere.
- Q: Are pets allowed? A: Please reach out to Pink Papaya Stays directly to discuss pet policies.

---

### 2. Bougainvillea Suite
**Area:** Aldona, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes | **Location:** Sempre Villa
**Airbnb:** https://www.airbnb.co.in/rooms/1595489908894597747

**Short Description:** A romantic pool suite tucked within the restored 1828 Sempre villa. The Bougainvillea Suite by Pink Papaya Stays is crafted for couples seeking heritage charm and intimate luxury in North Goa.

**About:** The Bougainvillea Suite is one of the signature rooms within Pink Papaya Stays' crown jewel — the Sempre Villa in Aldona. Designed for couples and solo travellers, this room is a canvas of Goa's colonial past: hand-painted walls, restored furniture, curated art, and direct access to the shared pool and lush villa garden. Wake up to the sound of birdsong, step into the garden for your morning coffee, and let Aldona's unhurried rhythm become yours.

**Nearby Places:** Aldona Village (walking distance) · Corjuem Fort (10 min drive) · Anjuna Beach (25 min drive) · Mapusa Market (20 min drive) · Assagao Restaurants (20 min drive)

**FAQs:**
- Q: Is the pool shared or private? A: The pool is shared within the Sempre villa complex, exclusively for guests staying at Sempre properties.
- Q: Is this suitable for a honeymoon stay? A: Yes! The Bougainvillea Suite is one of Pink Papaya Stays' most recommended romantic escapes in Goa.
- Q: Can I book just this suite independently? A: Yes, this suite can be booked independently or as part of an exclusive whole-villa booking of Sempre.

---

### 3. Gulmohar Suite
**Area:** Aldona, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes | **Location:** Sempre Villa
**Airbnb:** https://www.airbnb.co.in/rooms/1598397403621556633

**Short Description:** A serene heritage room in Goa's most characterful restored villa. The Gulmohar Suite at Sempre is where vintage soul meets quiet indulgence, curated by Pink Papaya Stays.

**About:** Named after the iconic flame tree of Goa, the Gulmohar Suite at Sempre is a serene sanctuary within a 100+ year old Portuguese villa in Aldona. This room speaks in soft tones, warm woods, heritage textiles, and thoughtful restorations that honour the villa's 1828 origins. Guests enjoy exclusive access to the villa pool, garden, and shared living areas, all within a setting that feels nothing like a hotel and everything like a lovingly maintained ancestral home.

**Nearby Places:** Aldona Village (walking distance) · Corjuem Fort (10 min drive) · Vagator & Anjuna (25 min drive) · Mapusa Market (20 min drive)

**FAQs:**
- Q: What makes this different from a regular hotel room? A: The Gulmohar Suite is inside a 200-year-old heritage villa — no hotel corridors, no crowds, just a living, breathing historic home.
- Q: Is breakfast included? A: Breakfast is not included but the villa kitchen is available. Pink Papaya Stays can also arrange catering on request.

---

### 4. Magnolia Suite
**Area:** Aldona, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes | **Location:** Sempre Villa
**Airbnb:** https://www.airbnb.co.in/rooms/1638490445142073681

**Short Description:** Soft, elegant, and deeply restful — the Magnolia Suite at Sempre is Pink Papaya Stays' ode to slow travel and refined heritage living in the heart of North Goa's Aldona village.

**About:** The Magnolia Suite is the newest addition to the storied rooms of Sempre, Pink Papaya Stays' prized 1828 heritage villa in Aldona. Like its floral namesake, this suite is refined in its understated beauty — calming, and memorable. Guests are treated to heritage architectural details, a considered colour palette, and access to the villa's private pool, reading library, and garden. Ideal for couples, solo creatives, or anyone who wants the real Goa.

**Nearby Places:** Aldona Village (walking distance) · Siolim (15 min drive) · Anjuna (25 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: When was this suite added? A: The Magnolia Suite was launched in early 2026 as part of Pink Papaya Stays' continued restoration of Sempre.
- Q: Can multiple suites be booked together? A: Yes, all four Sempre suites can be combined for an exclusive whole-villa booking for up to 12 guests.

---

### 5. Marigold Suite
**Area:** Aldona, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collections:** Romantic Luxury Escapes, Expansive Views | **Location:** Sempre Villa
**Airbnb:** https://www.airbnb.co.in/rooms/1639049283716888336

**Short Description:** A sun-drenched balcony suite inside one of Goa's most beloved heritage villas. The Marigold Suite at Sempre by Pink Papaya Stays is ideal for those who love waking up to views, birdsong, and slow mornings.

**About:** The Marigold Suite lives on the upper floor of Sempre, Pink Papaya Stays' century-old Portuguese villa in Aldona. It boasts a private balcony perfect for morning chai as the village stirs, or an evening read as the Goan sky turns gold. The suite features the same heritage charm that defines all of Sempre: restored art, natural materials, and a warmth that feels entirely personal.

**Nearby Places:** Aldona Market (5 min walk) · Corjuem Fort (10 min drive) · Morjim Beach (35 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Does the balcony have seating? A: Yes, the Marigold Suite balcony has seating for two, ideal for sunrise chai or evening sundowners.
- Q: Is this room suitable for solo travellers? A: Absolutely. The Marigold Suite is one of Pink Papaya Stays' most popular choices for solo travellers and writers.

---

### 6. The Manor
**Area:** Assagao, North Goa | **Beds:** 3 | **Guests:** 6 | **Type:** Villa
**Collections:** Romantic Luxury Escapes, Expansive Views
**Airbnb:** https://www.airbnb.co.in/rooms/1125162353408673658
**Images:** https://drive.google.com/drive/folders/1_dorVa7uf3UxPlgYywSBlMUZJYzsv8-U

**Short Description:** A luxury villa in the heart of Assagao — Pink Papaya Stays' The Manor delivers 3 bedrooms, a private pool, jacuzzi, and a pool table for the ultimate Goa villa experience.

**About:** Nestled in Assagao — Goa's coolest address, home to the best cafés, art galleries, and boutiques — The Manor is Pink Papaya Stays' flagship luxury villa offering. A generous private pool, an outdoor jacuzzi, a pool table, and expansive living spaces make The Manor as much a destination as the beaches around it. Every inch is styled with intention: warm palettes, statement furniture, and the kind of considered touches that make guests genuinely want to stay in. Whether you're here for a friends' trip, a family getaway, or a milestone celebration, The Manor delivers on every front.

**Nearby Places:** Assagao Café Strip (5 min walk) · Anjuna Flea Market (10 min drive) · Vagator & Chapora (10 min drive) · Baga Beach (15 min drive) · Panjim (25 min drive) · Mapusa Market (15 min drive)

**FAQs:**
- Q: Is The Manor suitable for a bachelorette or birthday celebration? A: Yes! With a pool, jacuzzi, and pool table, The Manor is one of Pink Papaya Stays' top picks for group celebrations in Goa.
- Q: Is catering available? A: Pink Papaya Stays can arrange a private chef or catering service at The Manor upon request.
- Q: What is the minimum stay? A: We recommend 2 nights minimum. For peak season, 3 nights minimum may apply.

---

### 7. Villa R&R
**Area:** Benaulim, South Goa | **Beds:** 3 | **Guests:** 6 | **Type:** Villa
**Collections:** Walk to the Beach, Romantic Luxury Escapes
**Airbnb:** https://www.airbnb.co.in/rooms/1294005683628541317
**Images:** https://drive.google.com/drive/folders/1ZjVIwltDJLoqecmMHK4MNjvL81zea9ze

**Short Description:** Escape to South Goa's quieter coast with Villa R&R, a 3BHK private pool villa by Pink Papaya Stays, minutes from Benaulim, Varca, and Colva Beach.

**About:** South Goa has a different energy — wider sands, fewer crowds, more space to breathe — and Villa R&R captures this perfectly. This 3-bedroom private pool villa in Benaulim is surrounded by lush paddy and coconut landscape, offering a peaceful base from which to explore the pristine beaches of Benaulim, Varca, and Colva. The interiors are styled with a breezy coastal sensibility: light tones, natural materials, and spaces that make you want to do absolutely nothing productive.

**Nearby Places:** Benaulim Beach (5 min drive) · Colva Beach (10 min drive) · Varca Beach (10 min drive) · Margao City (15 min drive) · Palolem Beach (45 min drive)

**FAQs:**
- Q: How far is the beach from Villa R&R? A: The nearest beach, Benaulim, is approximately a 5-minute drive from the villa.
- Q: Is South Goa busier or quieter than North Goa? A: South Goa is significantly quieter and less commercialised — ideal for families and those seeking a calmer holiday.
- Q: Can the villa accommodate more than 6 guests? A: Please contact Pink Papaya Stays for custom group arrangements.

---

### 8. Benaulim House
**Area:** Benaulim, South Goa | **Beds:** 3 | **Guests:** 6 | **Type:** Villa
**Collection:** Walk to the Beach
**Images:** https://drive.google.com/drive/folders/1-RgEAl7gwelsU9Yjd2g9lo6bDMeYCwrV

**Short Description:** A spacious 3BHK just a 5-minute walk from Benaulim Beach — Benaulim House by Pink Papaya Stays is South Goa's most convenient family-friendly getaway.

**About:** Benaulim House is a rare find in South Goa: a generous 3-bedroom property within walking distance of one of Goa's most tranquil beaches. Curated by Pink Papaya Stays, this is the perfect base for families or groups where the beach routine — morning walks, evening swims, lazy lunches at shacks — is the entire agenda. The house offers all the comforts of home with the ease of a well-managed holiday property: a fully equipped kitchen, bright airy rooms, and outdoor space.

**Nearby Places:** Benaulim Beach (5 min walk) · Colva Beach (10 min drive) · Varca Shack Strip (10 min drive) · Margao Market (15 min drive) · Palolem (50 min drive)

**FAQs:**
- Q: How close is the beach really? A: It is a genuine 5-minute walk to Benaulim Beach with no driving required.
- Q: Is Benaulim safe for families with young children? A: Benaulim Beach is one of Goa's calmer, less crowded beaches — excellent for families.

---

### 9. Casa Kai
**Area:** Candolim, North Goa | **Beds:** 3 | **Guests:** 6+2 | **Type:** Apartment
**Location:** Saipem, North Goa
**Airbnb:** https://www.airbnb.co.in/rooms/892448931318072803
**Images:** https://drive.google.com/drive/folders/1iuiJyo-bUulDRaL9iQf2xC-n7lKw2n6B

**Short Description:** A stunning 3BHK duplex penthouse with sweeping views near Candolim — Casa Kai by Pink Papaya Stays brings elevated living (literally) to one of North Goa's most loved areas.

**About:** Casa Kai is Pink Papaya Stays' answer to the question: what if a Goa apartment felt like a penthouse in Ibiza? Perched above the rooftops near Candolim, this 3-bedroom penthouse delivers sky-high views, a generous terrace, and interiors that blend Mediterranean breezy aesthetics with warm Goan character. The three bedrooms accommodate up to 8 guests comfortably, making it ideal for larger groups.

**Nearby Places:** Candolim Beach (10 min drive) · Baga & Calangute (10 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive) · Sinquerim Beach (10 min drive)

**FAQs:**
- Q: Is Casa Kai on the top floor? A: Yes, Casa Kai is a duplex penthouse-style apartment.
- Q: Is there parking? A: Yes, dedicated and covered parking spot is available at the property.

---

### 10. The Fieldhouse
**Area:** Candolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Collection:** Expansive Views | **Location:** Marra, North Goa
**Airbnb:** https://www.airbnb.co.in/rooms/1553441010980352073
**Images:** https://drive.google.com/drive/folders/1Mh7hsKHJlXplNXUIYUzuykJdQuASA_MP

**Short Description:** Two jacuzzis, a panoramic sky-meets-paddy view, and two bedrooms crafted for utter privacy. The Fieldhouse by Pink Papaya Stays is the most distinctive 2BHK stay in North Goa.

**About:** There's nothing quite like The Fieldhouse in Goa's holiday landscape. This signature 2BHK by Pink Papaya Stays sits amid the open paddy fields of North Goa with twin private jacuzzis — one per room — and panoramic views that stretch from green fields to Goa's famous open sky. Designed with a quietly luxurious sensibility, The Fieldhouse is built for couples and small groups who want seclusion without sacrifice.

**Nearby Places:** Candolim Beach (10 min drive) · Baga Beach (15 min drive) · Fort Aguada (15 min drive) · Calangute Market (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Are both jacuzzis private and separate? A: Yes, each bedroom at The Fieldhouse has its own dedicated private jacuzzi.
- Q: Is this good for a couple's anniversary trip? A: Absolutely, The Fieldhouse is one of Pink Papaya Stays' most popular romantic escapes.

---

### 11. The Green
**Area:** Candolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Location:** Saipem, Candolim, North Goa
**Airbnb:** https://www.airbnb.co.in/rooms/1571623573129478307
**Images:** https://drive.google.com/drive/folders/1NgNh11Dmu4XyGyAWWaqe9NtduZoDwx9M

**Short Description:** A lush 2BHK with a private jacuzzi, balcony, and leafy green outlook. The Green by Pink Papaya Stays is romance and relaxation in perfect proportion, just 10 minutes from Candolim Beach.

**About:** True to its name, The Green wraps you in a canopy of tropical foliage that makes Goa's sunshine filter through leaves rather than beat directly down. This 2-bedroom luxury apartment by Pink Papaya Stays features a private jacuzzi, a generous balcony and interiors styled with warmth and precision. With Candolim just 10 minutes away and pool access, The Green offers the sweet spot between vibrant North Goa and genuine private retreat.

**Nearby Places:** Candolim Beach (10 min drive) · Baga Beach (15 min drive) · Fort Aguada (15 min drive) · Calangute Market (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is the jacuzzi indoors or outdoors? A: The jacuzzi at The Green is in the ensuite attached to the master bedroom and offers complete privacy.
- Q: Is there a pool in addition to the jacuzzi? A: Yes, The Green also has access to the building's rooftop swimming pool.

---

### 12. Casa Tinu
**Area:** Saipem, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes | **Location:** Saipem, Candolim, North Goa
**Airbnb:** https://www.airbnb.co.in/rooms/1601475431116573357
**Images:** https://drive.google.com/drive/folders/1ZDvGrh_Q7txF1JjhuY_FwdeewBG-8_1P

**Short Description:** A chic 1BHK with a private jacuzzi in Candolim, Casa Tinu by Pink Papaya Stays is the ultimate couples' retreat, combining luxury amenities with Goa's most sought-after location.

**About:** Casa Tinu is a quietly glamorous 1BHK in the heart of Candolim, designed by Pink Papaya Stays for couples who want it all: a stylish space, a private jacuzzi, and easy access to Goa's best stretch of coast. The apartment's interiors are thoughtfully curated, each piece chosen with a discerning eye and a love for colour, texture, and comfort.

**Nearby Places:** Candolim Beach (10 min drive) · Fort Aguada (12 min drive) · Sinquerim Beach (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is Casa Tinu an entire apartment or a shared space? A: Casa Tinu is an entirely private 1BHK with no shared common areas with other guests.
- Q: Is it popular for honeymoons? A: Yes, Casa Tinu is one of Pink Papaya Stays' most frequently booked properties for honeymoon couples in Goa.

---

### 13. La Amore
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes | **Location:** Saipem, North Goa
**Airbnb:** https://www.airbnb.co.in/rooms/1254938866510280695
**Images:** https://drive.google.com/drive/folders/117gFRIeCynI9gszS4qbuyGjIQLF9XOBc

**Short Description:** Love is in the details at La Amore, a luxury 1BHK with private jacuzzi in Candolim, curated by Pink Papaya Stays for couples seeking romance in the heart of North Goa.

**About:** La Amore lives up to its name in every sense. Pink Papaya Stays has poured romance into every corner of this 1BHK Candolim apartment: rich tones, curated art, plush textiles, and a private jacuzzi that turns any evening into an occasion. Whether you're celebrating a honeymoon, an anniversary, or simply the joy of being in Goa, La Amore is a love letter to the good life.

**Nearby Places:** Candolim Beach (10 min drive) · Baga (10 min drive) · Sinquerim Beach (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Can Pink Papaya Stays arrange special decorations for anniversaries? A: Yes, Pink Papaya Stays offers personalised decoration packages for romantic celebrations at La Amore. Please contact us in advance.
- Q: Can guests use the private jacuzzi at any time? A: Yes, guests have exclusive access to the private jacuzzi throughout their stay.

---

### 14. La Solis
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes | **Location:** Saipem, North Goa
**Airbnb:** https://www.airbnb.co.in/rooms/1404824533410152585
**Images:** https://drive.google.com/drive/folders/1H4Fx4FrWAUtqdGCo1KPZ_u87n5jXhnyA

**Short Description:** La Solis by Pink Papaya Stays — a Candolim apartment with jacuzzi and steam — is a rare Goa stay offering full spa-at-home luxury, just 10 minutes from the beach.

**About:** La Solis is the wellness-forward jewel in Pink Papaya Stays' Candolim collection. What sets it apart is the addition of a private steam — making this the closest thing to a personal spa that Goa's holiday rental market has to offer. The 1-bedroom apartment is beautifully designed, with warm tones and thoughtful styling that creates an atmosphere of calm from the moment you arrive.

**Nearby Places:** Candolim Beach (10 min drive) · Baga (10 min drive) · Sinquerim Beach (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is La Solis good for a self-care holiday? A: Absolutely — with a jacuzzi and steam, La Solis is Pink Papaya Stays' most spa-like 1BHK offering in Goa.
- Q: Does the bathroom include a steam shower? A: Yes, the bathroom features a built-in steam shower for a spa-like wellness experience.

---

### 15. Casa de Pacato
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Walk to the Beach
**Airbnb:** https://www.airbnb.co.uk/rooms/1338926639572668772
**Images:** https://drive.google.com/drive/folders/1kazZi6alEoq4NttJRcPGOD6j9eIs2x4Q

**Short Description:** Wake up, walk to the beach — Casa de Pacato by Pink Papaya Stays is a charming 1BHK in Candolim designed for travellers who want the beach close and the noise far.

**About:** Casa de Pacato — meaning 'calm house' in Portuguese — is exactly that. This 1-bedroom Candolim apartment sits within easy walking distance of Candolim Beach. The apartment is styled with characteristic Pink Papaya warmth: thoughtful colours, comfortable furnishings, and everything you need for an independent, self-paced Goa holiday.

**Nearby Places:** Candolim Beach (5 min walk) · Baga (10 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive) · Calangute Market (10 min drive)

**FAQs:**
- Q: How far is Candolim Beach from the apartment? A: Candolim Beach is a short 5-minute walk from Casa de Pacato.
- Q: Is this suitable for a solo traveller? A: Yes, Casa de Pacato is a great option for solo travellers visiting Goa.

---

### 16. Casa Remi
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collections:** Walk to the Beach, Romantic Luxury Escapes
**Airbnb:** https://www.airbnb.co.in/rooms/786891485989228382
**Images:** https://drive.google.com/drive/folders/1xiuSUlL_7XwTrlYwnYAaUDHHwXyNJmTs

**Short Description:** A 1BHK with a private garden, 10 minutes' walk from Candolim Beach, Casa Remi by Pink Papaya Stays is Goa living at its most natural and unhurried.

**About:** Casa Remi is the garden apartment that Candolim deserves. Managed by Pink Papaya Stays, this 1BHK comes with a lush private garden that sets it apart from the typical holiday apartment. The apartment is styled with a nature-forward palette that flows seamlessly into the outdoor green space, creating a sense of continuity between inside and outside that feels very Goan.

**Nearby Places:** Candolim Beach (10 min walk) · Baga Beach (15 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is the garden fully private? A: Yes, the garden at Casa Remi is exclusively for the apartment's guests.
- Q: Are pets allowed at Casa Remi? A: Please contact Pink Papaya Stays directly regarding pet policies.

---

### 17. Candolim Bliss
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collections:** Walk to the Beach, Expansive Views
**Airbnb:** https://www.airbnb.co.in/rooms/1492702104227983422

**Short Description:** Verdant views, pool access, and a 10-minute walk to the sea — Candolim Bliss by Pink Papaya Stays is the ideal Goa bolt-hole for couples and solo travellers craving calm and convenience.

**About:** Candolim Bliss is a spacious, view-forward 1BHK retreat managed by Pink Papaya Stays in the heart of Candolim. The apartment looks out over a canopy of tropical green — a rarity in this bustling North Goa neighbourhood — giving it an almost resort-like sense of removal from the world. Stylish, light-filled, and generously sized, Candolim Bliss is the kind of property guests return to year after year.

**Nearby Places:** Candolim Beach (10 min walk) · Baga (10 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: What kind of views does Candolim Bliss offer? A: The apartment faces a lush green tree canopy — a calming, nature-facing outlook uncommon in central Candolim.
- Q: What amenities are available? A: Guests have access to shared amenities including a swimming pool and a well-equipped gym.

---

### 18. Belle Maison
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collections:** Walk to the Beach, Romantic Luxury Escapes
**Airbnb:** https://www.airbnb.co.in/rooms/1454864277989441438

**Short Description:** Beautiful by name, beautiful by nature — Belle Maison by Pink Papaya Stays is an elegantly styled 1BHK in Candolim, walking distance from one of North Goa's finest beaches.

**About:** Belle Maison — French for 'beautiful house' — and Pink Papaya Stays has made sure the name earns its keep. This 1-bedroom Candolim apartment is styled with a European-meets-tropical sensibility: clean lines, warm textures, and curated details that elevate the stay from comfortable to memorable. Walking distance from Candolim Beach, it's perfectly placed for the classic Goa beach holiday.

**Nearby Places:** Candolim Beach (5–10 min walk) · Calangute (10 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is Belle Maison good for a first trip to Goa? A: Absolutely — its central Candolim location means everything you'd want to experience in Goa is within easy reach.
- Q: Is self check-in available? A: Yes, Belle Maison supports flexible self check-in. Details provided upon booking confirmation.

---

### 19. Casa Sukriti
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collections:** Walk to the Beach, Romantic Luxury Escapes
**Airbnb:** https://www.airbnb.co.in/rooms/783630926435060967
**Images:** https://drive.google.com/drive/folders/1JlYdmGUO-uFKDYbNfAlIXp2i4AWmvuNp

**Short Description:** Luxury finishes and a 5-minute walk to the beach — Casa Sukriti by Pink Papaya Stays is Candolim's most refined 1BHK, designed for travellers who believe the details make all the difference.

**About:** Casa Sukriti is the luxury-forward 1BHK in Pink Papaya Stays' Candolim portfolio. Styled with premium finishes — marble textures, quality linen, designer touches — it delivers a hotel-like level of polish within an entirely private holiday home setting. Located just 5 minutes from Candolim Beach.

**Nearby Places:** Candolim Beach (5 min walk) · Baga (10 min drive) · Fort Aguada (15 min drive) · Calangute Market (10 min drive) · Panjim (25 min drive)

**FAQs:**
- Q: What makes Casa Sukriti 'luxury' compared to other 1BHKs? A: Premium interiors, high-quality furnishings, and a level of finish that sets it apart from standard holiday apartments in Candolim.
- Q: Is there pool access? A: Yes, guests at Casa Sukriti have pool access.

---

### 20. La Prana
**Area:** Siolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Airbnb:** https://www.airbnb.co.in/rooms/1610190226588887421
**Images:** https://drive.google.com/drive/folders/1stB1rMfUB-A1wDbTSYLxBVNaHFwuOu1U

**Short Description:** An airy 2BHK with a generous terrace and verdant views in Siolim — La Prana by Pink Papaya Stays puts you 10 minutes from the beach in one of North Goa's most charming villages.

**About:** La Prana breathes — quite literally, its name means life force — and this 2BHK in Siolim breathes that energy into your Goa holiday. Pink Papaya Stays has styled this terrace apartment to maximise the natural world around it. Siolim itself is one of North Goa's most characterful villages, with its iconic church, riverside walks, and proximity to Morjim and the markets of Anjuna.

**Nearby Places:** Uddo Beach (10 min drive) · Morjim Beach (15 min drive) · Anjuna (20 min drive) · Vagator (20 min drive) · Siolim Church (5 min walk) · Chapora River (10 min drive)

**FAQs:**
- Q: Is La Prana close to beaches? A: Yes, Uddo Beach is approximately 10 minutes by scooter or car.
- Q: Is Siolim a good base for North Goa? A: Siolim sits between the north (Morjim, Ashvem) and central (Anjuna, Vagator) belts, making it one of the most convenient bases.

---

### 21. The Green Window
**Area:** Siolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Expansive Views
**Airbnb:** https://www.airbnb.co.in/rooms/1561436729203752692

**Short Description:** A dreamy 1BHK in Siolim with a forest-framed view on one side and a pool view on the other — The Green Window by Pink Papaya Stays is where North Goa's nature lovers come to exhale.

**About:** The Green Window is exactly as it sounds: a window into Goa's lush natural world. This 1-bedroom apartment in Siolim, managed by Pink Papaya Stays, is designed around its extraordinary view: a thick forest canopy that frames the pool below, creating a visual experience unlike that of a typical Goa holiday apartment. Vagator, Anjuna, and Chapora are all within 20 minutes, but The Green Window may just make leaving feel optional.

**Nearby Places:** Uddo Beach (10 min drive) · Morjim Beach (15 min drive) · Vagator (20 min drive) · Anjuna (20 min drive) · Siolim Village (5 min drive) · Chapora Fort (20 min drive)

**FAQs:**
- Q: What is the view like at The Green Window? A: The apartment looks onto the pool on one side and forest on the other — a uniquely green and peaceful outlook.
- Q: Is the pool shared? A: Yes, pool access is shared within the building.

---

### 22. Siolim Dairies
**Area:** Siolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Airbnb:** https://www.airbnb.co.in/rooms/1470831462254610416
**Images:** https://drive.google.com/drive/folders/1rKqWHF5joCKhOmdXBiM-G8_aiETThS2z

**Short Description:** A stylishly designed 1BHK in the heart of Siolim — Siolim Dairies by Pink Papaya Stays is for creative travellers who want North Goa character with design-forward interiors.

**About:** Siolim Dairies is a love letter to Goa's village aesthetic, reinterpreted with a contemporary eye by Pink Papaya Stays. This 1BHK features some of the most photographed interiors in the portfolio: warm earthy tones, rattan accents, and a sensibility that balances local craft with global design confidence.

**Nearby Places:** Siolim Church (5 min walk) · Uddo Beach (10 min drive) · Chapora River (10 min drive) · Morjim (15 min drive) · Anjuna (20 min drive) · Vagator (20 min drive)

**FAQs:**
- Q: Is Siolim Dairies good for digital nomads? A: Yes, with high-speed WiFi and a calm village setting, it's a popular choice among remote workers and creatives.
- Q: What is Siolim like as a neighbourhood? A: A traditional Goan village with a Portuguese church, local markets, and a slower pace.

---

### 23. Casa Sol
**Area:** Siolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Airbnb:** https://www.airbnb.co.in/rooms/1419157625543834485
**Images:** https://drive.google.com/drive/folders/11N4vDJDEz1J3LtK9snjR7eGgiLOz-K-T

**Short Description:** Sun-soaked, warm, and full of life — Casa Sol by Pink Papaya Stays is a radiant 1BHK in Siolim for travellers who want North Goa's energy with the quiet of a village stay.

**About:** Casa Sol is aptly named. This 1BHK in Siolim by Pink Papaya Stays seems to capture sunlight at every angle — bright, open interiors, warm tones, and a cheerful energy that makes it feel perpetually summer inside. Located in the increasingly coveted village of Siolim, it puts guests close to the bohemian north (Morjim, Ashvem) and the lively centre (Anjuna, Vagator).

**Nearby Places:** Siolim Market (5 min walk) · Uddo Beach (10 min drive) · Morjim Beach (15 min drive) · Vagator Beach (20 min drive) · Anjuna (20 min drive)

**FAQs:**
- Q: Is Casa Sol suitable for a week-long Goa holiday? A: Yes, its central Siolim location makes it a great base for exploring all of North Goa over an extended stay.
- Q: Is the swimming pool private or common? A: Casa Sol offers access to a well-maintained common swimming pool within the complex.

---

### 24. Banyan Bliss
**Area:** North Goa | **Beds:** 1 | **Guests:** 2 | **Type:** Apartment
**Location:** Central North Goa
**Airbnb:** https://www.airbnb.co.uk/rooms/1419275858453353813
**Images:** https://drive.google.com/drive/folders/1JgnBLixe3H64h9PFNFf0-f-QVOfP1ryM

**Short Description:** In the heart of North Goa, Banyan Bliss by Pink Papaya Stays is a peaceful 1BHK surrounded by the kind of tropical green that makes you forget the world outside.

**About:** Named for the magnificent banyan trees that are synonymous with Goa's village character, Banyan Bliss is a tranquil 1-bedroom retreat managed by Pink Papaya Stays in central North Goa. The apartment's standout feature is its inviting pool, making it an ideal choice for travellers who want relaxation close at hand as well as easy access to the beach belts of Anjuna, Vagator and Morjim.

**Nearby Places:** Calangute & Candolim (15 min drive) · Anjuna (15 min drive) · Vagator (15 min drive) · Panjim (25 min drive)

**FAQs:**
- Q: Why is it called Banyan Bliss? A: It's named for the banyan tree in the complex; banyan trees are central to Goa village life.

---

### 25. Baga Abode
**Area:** Baga, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Walk to the Beach
**Airbnb:** https://www.airbnb.co.in/rooms/962734185238543546
**Images:** https://drive.google.com/drive/folders/18Nl64eXJpH3qbFapRgUyzTkZOTJM0BLa

**Short Description:** Two minutes from Baga Beach, Baga Abode by Pink Papaya Stays puts Goa's most vibrant beach town on your doorstep, with stylish modern interiors to come home to.

**About:** Baga is where Goa turns the volume up, and Baga Abode is the ideal home base to enjoy every minute of it. Managed by Pink Papaya Stays, this modern 1BHK is a 2-minute drive from Baga Beach, the heart of North Goa's famous nightlife, beach shacks, and water sports scene. The apartment itself is a calm contrast: stylishly fitted with contemporary interiors.

**Nearby Places:** Baga Beach (2 min drive) · Calangute (5 min drive) · Anjuna (15 min drive) · Tito's Lane (5 min walk) · Candolim (15 min drive)

**FAQs:**
- Q: Is Baga noisy at night? A: Baga is one of Goa's liveliest beach areas, particularly on weekends. Baga Abode is situated to balance proximity to the action with a degree of residential calm.
- Q: Is Baga Abode suitable for a solo traveller? A: Yes, its central Baga location makes it very convenient for solo exploration of North Goa.

---

### 26. La Mish
**Area:** Reis Magos, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Airbnb:** https://www.airbnb.co.in/rooms/13873522
**Images:** https://drive.google.com/drive/folders/1Oh54MiRTl2uz2vD8ixOkU9yyOJRzTy4C

**Short Description:** A villa-inspired 2BHK with a private pergola and lush garden in Reis Magos — La Mish by Pink Papaya Stays is the most characterful luxury apartment near Candolim.

**About:** La Mish by Pink Papaya Stays earns its reputation as a 'villa-like' apartment by delivering what most apartments cannot: a private pergola, a lush garden, pool access, and a generously proportioned layout. Located in Reis Magos — a village of charming character between Panjim and Candolim. Rated 4.9 by previous guests, La Mish is a consistent favourite in the Pink Papaya Stays portfolio.

**Nearby Places:** Coco Beach (5 min drive) · Reis Magos Fort (5 min drive) · Candolim Beach (10 min drive) · Panjim City Centre (15 min drive) · Calangute (15 min drive) · Sinquerim Beach (10 min drive)

**FAQs:**
- Q: What makes La Mish 'villa-like'? A: Private garden with a pergola, pool access, and spacious interior layout — features more commonly associated with a villa.
- Q: Is La Mish close to Panjim? A: Yes, Reis Magos is approximately 15 minutes from Panjim.
- Q: How many guests does La Mish accommodate? A: La Mish comfortably accommodates up to 6 guests across 2 bedrooms.

---

### 27. Umile Dimora
**Area:** Candolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Location:** Reis Magos, North Goa
**Airbnb:** https://www.airbnb.co.uk/rooms/1470132213218960497
**Images:** https://drive.google.com/drive/folders/1xswBfY9ZYxxTmtICuC1uwsX_gESUVAX3

**Short Description:** A spacious and serene 2BHK close to Candolim Beach — Umile Dimora by Pink Papaya Stays is understated elegance in one of Goa's most desirable coastal addresses.

**About:** Umile Dimora (Italian for 'humble home') is a beautifully modest name for a beautifully generous apartment. This spacious 2BHK by Pink Papaya Stays sits close to Candolim Beach, offering a calm, well-appointed base for couples or small groups who want space to spread out without the premium of a villa. The apartment's interiors carry a warm, considered aesthetic: nothing flashy, everything comfortable.

**Nearby Places:** Coco Beach (5 min drive) · Reis Magos Fort (5 min drive) · Candolim Beach (10 min drive) · Sinquerim Beach (10 min drive) · Panjim City Centre (15 min drive) · Calangute (15 min drive) · Fort Aguada (15 min drive)

**FAQs:**
- Q: Is Umile Dimora suitable for a family with children? A: Yes, the spacious layout makes it comfortable for families with young children.
- Q: Does Umile Dimora have access to a swimming pool? A: Yes, guests have access to a common swimming pool nestled in lush greenery within the complex.

---

### 28. Casa Hideaway
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Airbnb:** https://www.airbnb.co.in/rooms/1264417494020261335
**Images:** https://drive.google.com/drive/folders/1gF9FOLy0eqwTKdCVTc56DAY9k3GffCn-

**Short Description:** A tucked-away 1BHK with pool access in Candolim — Casa Hideaway by Pink Papaya Stays is the perfect Goa escape for those who want the coast close and the crowd far.

**About:** Casa Hideaway does what it says: it hides you away from the intensity of Goa's tourist belt while keeping you gloriously close to it. This 1-bedroom Candolim apartment by Pink Papaya Stays is nestled in a quiet pocket of one of North Goa's most popular areas, offering pool access and a restful environment for couples and solo travellers who want to dip into Goa's energy on their own terms.

**Nearby Places:** Candolim Beach (5–10 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is Casa Hideaway truly quiet despite being in Candolim? A: Yes, Casa Hideaway is positioned in a residential lane away from the main road, ensuring a quieter stay.
- Q: Is Casa Hideaway suitable for families with children? A: Yes, the complex offers a common swimming pool with a children's section, a play area, a games area, and a gym.

---

### 29. Ninho de Amor
**Area:** Reis Magos, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes
**Airbnb:** https://www.airbnb.co.in/rooms/903321622188158048
**Images:** https://drive.google.com/drive/folders/1-2ZBwT1djQWPZzWoruuiBUoEtH9Xx7mF

**Short Description:** Portuguese for 'love nest' — Ninho de Amor by Pink Papaya Stays is an elegant 1BHK near Candolim designed exclusively for two, where every detail is set to romance.

**About:** The name says it all. Ninho de Amor — Portuguese for 'love nest' — is Pink Papaya Stays' most romantically intentioned 1BHK near Candolim. Styled with an elegance that references Goa's Portuguese heritage, this apartment is a cocoon for couples: soft lighting, fine textiles, considered artwork, and a quiet setting near Candolim. A perfect choice for honeymoons, anniversaries, or any occasion where two people want Goa all to themselves.

**Nearby Places:** Candolim Beach (10 min drive) · Calangute (10 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Can Pink Papaya Stays arrange rose petals or romantic decorations? A: Yes, upon request, Pink Papaya Stays can coordinate with a vendor to arrange romantic décor. Please contact us in advance.

---

### 30. La Ruhe
**Area:** Reis Magos, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes
**Airbnb:** https://www.airbnb.co.in/rooms/699582488160499652
**Images:** https://drive.google.com/drive/folders/10tY-gMlp7UUU6n343kwDRmU70Xt0pMaS

**Short Description:** A chic 1BHK with a private patio near Candolim — La Ruhe by Pink Papaya Stays is designed for those who understand that the best Goa holidays are ones spent doing very little, very stylishly.

**About:** La Ruhe (German for 'the calm') is a fitting name for this quietly chic 1BHK near Candolim, curated by Pink Papaya Stays. The private patio is the centrepiece — a space for morning coffee in the Goa sun, evening sundowners, and those long afternoon naps that seem to come so naturally in this part of the world.

**Nearby Places:** Coco Beach (5 min drive) · Candolim Beach (10 min drive) · Calangute (10 min drive) · Baga (12 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is the patio sheltered from the sun? A: Absolutely, the patio is luxuriously covered, offering cool shade by day and elegant shelter from rain.
- Q: Is La Ruhe good for a yoga/wellness retreat in Goa? A: Yes, its calm setting and private patio make it an excellent base for a quiet, wellness-focused Goa holiday.

---

### 31. Juno
**Area:** Near Candolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Collection:** Expansive Views | **Location:** Marra, North Goa
**Images:** https://drive.google.com/drive/folders/1n33egeSAYwvU_u-bwl9a-k91YrYIMlt5

**Short Description:** Infinity pool, open field views, and two beautifully styled bedrooms near Candolim — Juno by Pink Papaya Stays is the apartment that makes Goa look like a painting.

**About:** Juno is named after the film, and much like its namesake, it has a charm that is a little unexpected, full of personality, and impossible not to remember. This 2BHK by Pink Papaya Stays near Candolim is built around two defining features: an infinity pool that seems to merge with the horizon, and expansive paddy field views. The stay also includes 100% power backup.

**Nearby Places:** Museum of Goa (4 min drive) · Candolim Beach (10 min drive) · Fort Aguada (15 min drive) · Calangute (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is the pool private or shared? A: The infinity pool is within the building complex and shared among residents, though typically very quiet.
- Q: Are the field views unobstructed? A: Yes, Juno's balcony and living spaces face open paddy fields with no obstructions.

---

### 32. Jigsaw
**Area:** Near Candolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Location:** Reis Magos, North Goa
**Airbnb:** https://www.airbnb.co.in/rooms/1112049163832086420
**Images:** https://drive.google.com/drive/folders/1JljzSGARAA8DzAjU1T2H7O5by1cuCERv

**Short Description:** Airy, bright, and beautifully put together — Jigsaw by Pink Papaya Stays is a 2BHK near Candolim where every element fits perfectly for an ideal Goa holiday.

**About:** Jigsaw is precisely what its name suggests: a property where every piece comes together just right. This light-filled 2BHK by Pink Papaya Stays near Candolim offers pool access, airy interiors, and a comfortable, stylish layout for couples or small groups. The décor plays with layered patterns and textures — eclectic, warm, and full of personality.

**Nearby Places:** Coco Beach (5 min drive) · Candolim Beach (10 min drive) · Baga (10 min drive) · Calangute (10 min drive) · Fort Aguada (15 min drive)

**FAQs:**
- Q: What is the vibe of Jigsaw? A: Jigsaw has a light, playful aesthetic — colourful textiles, eclectic art, and bright spaces that feel energising without being overwhelming.

---

### 33. The Blue Door
**Area:** Near Candolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Collections:** Expansive Views, Romantic Luxury Escapes
**Airbnb:** https://www.airbnb.co.in/rooms/1079392568718451139
**Images:** https://drive.google.com/drive/folders/1LnR8a4EYIJcB7V7uKgYMZAEhv2tu4Bbd

**Short Description:** Step through The Blue Door into a penthouse with panoramic views near Candolim — Pink Papaya Stays' signature 2BHK for those who want North Goa's scenery on full display.

**About:** The Blue Door is an entrance and a promise. Push through it and you find yourself in one of Pink Papaya Stays' most dramatic offerings: a 2BHK penthouse near Candolim with sweeping views from a large terrace and a sense of space that feels genuinely elevated — literally and figuratively. The terrace is the true living room: a place to watch Goa's legendary sunsets and share evening meals.

**Nearby Places:** Candolim Beach (10 min drive) · Fort Aguada (15 min drive) · Calangute (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is The Blue Door really a penthouse? A: Yes, The Blue Door occupies the top floor of its building with elevated, unobstructed views.

---

### 34. Le Bohemian
**Area:** Near Candolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Collection:** Romantic Luxury Escapes
**Airbnb:** https://www.airbnb.co.in/rooms/996178508081943916
**Images:** https://drive.google.com/drive/folders/1bwOWvbikzBpb9RiJBA8D9B7xyuKpnfdk

**Short Description:** Free-spirited and full of colour — Le Bohemian by Pink Papaya Stays is a vibrant 2BHK near Candolim for travellers who love Goa's creative, anything-goes energy.

**About:** Le Bohemian is Goa's spirit in apartment form. Think rattan and macramé, jewel tones and vintage prints, mismatched-on-purpose furniture that somehow works perfectly together — the kind of aesthetic that makes every photo look effortless. Ten minutes from Candolim Beach, it's ideally placed for the classic beach-café-market Goa circuit.

**Nearby Places:** Candolim Beach (10 min drive) · Calangute (10 min drive) · Baga (12 min drive) · Fort Aguada (15 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is Le Bohemian good for Instagram content creation? A: Absolutely — Le Bohemian's eclectic, colourful interiors make it one of the most photogenic apartments in the Pink Papaya Stays portfolio.

---

### 35. Casa Viva
**Area:** Near Candolim, North Goa | **Beds:** 2 | **Guests:** 4+2 | **Type:** Apartment
**Collection:** Expansive Views
**Airbnb:** https://www.airbnb.co.in/rooms/807025967748109131
**Images:** https://drive.google.com/drive/folders/1VTGaIRKQO6MOL2FKjHIzEw7Cta3304Vy

**Short Description:** Nestled deep in tropical greenery near Candolim — Casa Viva by Pink Papaya Stays is a serene 2BHK for those who want Goa's nature as their constant companion.

**About:** Casa Viva is where Goa's natural abundance becomes your daily backdrop. This 2-bedroom apartment by Pink Papaya Stays is nestled within dense, lush greenery — coconut palms, flowering shrubs, and the quiet sounds of nature replace the noise of the outside world. Paradoxically very close to Candolim, Calangute, and the North Goa coast.

**Nearby Places:** Candolim Beach (10 min drive) · Calangute (10 min drive) · Baga (12 min drive) · Fort Aguada (15 min drive)

**FAQs:**
- Q: Is Casa Viva in a residential area? A: Yes, it is set in a quiet, residential neighbourhood surrounded by tropical vegetation.

---

### 36. The Sage Door
**Area:** Calangute, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collections:** Expansive Views, Walk to the Beach
**Airbnb:** https://www.airbnb.co.in/rooms/1251943309043881377
**Images:** https://drive.google.com/drive/folders/1oGdYqCx5dOx4uXUyvj6m0bd-Sx9zAE5C

**Short Description:** Calangute's most photographed 1BHK — The Sage Door by Pink Papaya Stays combines pool access, lush views, and interiors designed to inspire, near Goa's Queen of Beaches.

**About:** The Sage Door is Pink Papaya Stays' most visual property in Calangute — a 1BHK styled with a calm, green-forward aesthetic. Sage greens, warm woods, and thoughtful plant placements create an environment that feels simultaneously serene and stylish. The pool and views complete a package that makes this apartment one of the most frequently shared on social media by guests.

**Nearby Places:** Calangute Beach (5 min drive) · Baga (5 min drive) · Candolim (10 min drive) · Anjuna Flea Market (15 min drive) · Panjim (25 min drive)

**FAQs:**
- Q: Why is it called 'gram worthy'? A: The Sage Door's unique sage-green palette, plant styling, and pool-view setting make it one of the most visually distinctive apartments in Goa.
- Q: Is Calangute Beach crowded? A: Calangute is one of Goa's busiest beaches, especially in peak season — ideal if you love the energy of a lively beach scene.

---

### 37. Vista Verde 002
**Area:** Calangute, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Expansive Views
**Airbnb:** https://www.airbnb.co.in/rooms/1396319118915748428

**Short Description:** A view-forward 1BHK in Calangute — Vista Verde 002 by Pink Papaya Stays delivers Goa's best pool-meets-green panorama from one of North Goa's most central locations.

**About:** Vista Verde means 'green view', and the 002 designation marks this as the second in a two-apartment building designed around that very concept. Pink Papaya Stays has styled Vista Verde 002 as an apartment that opens itself to the outdoors: pool views and lush greenery visible from the main living spaces, making the apartment feel connected to the Goa landscape.

**Nearby Places:** Calangute Beach (5 min drive) · Baga (5 min drive) · Anjuna Market (15 min drive) · Panjim (25 min drive)

**FAQs:**
- Q: Is Vista Verde 002 part of a complex? A: Yes, it is in a boutique residential complex managed by Pink Papaya Stays alongside other curated properties.

---

### 38. Casa Siesta
**Area:** Calangute, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Walk to the Beach
**Airbnb:** https://www.airbnb.co.in/rooms/1252041770450775087
**Images:** https://drive.google.com/drive/folders/1-9IWJ7z8qt9ZTHO2XhXrdlhF2jLxeJbB

**Short Description:** Near Calangute Beach, styled for rest — Casa Siesta by Pink Papaya Stays is the Goa apartment designed around the art of the afternoon siesta and the beauty of slow days.

**About:** Every great Goa holiday has at least one great siesta — and Casa Siesta by Pink Papaya Stays is built around that truth. This 1-bedroom Calangute apartment near the beach is styled in warm, sleep-inducing tones. Pool access, a proximity to Calangute Beach, and the laid-back energy of the neighbourhood complete the picture.

**Nearby Places:** Calangute Beach (5 min drive) · Baga (5 min drive) · Candolim (10 min drive) · Anjuna (15 min drive) · Panjim (25 min drive)

**FAQs:**
- Q: Is Casa Siesta in a noisy area? A: While Calangute is busy, Casa Siesta is situated away from the main commercial strip in a relatively quiet residential pocket.

---

### 39. Belo Nido 003
**Area:** Calangute, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Airbnb:** https://www.airbnb.co.in/rooms/1396280599772840704

**Short Description:** A cosy 1BHK with pool access in Calangute — Belo Nido 003 by Pink Papaya Stays is the Portuguese-named 'beautiful nest' that welcomes you into the warmth of North Goa.

**About:** Belo Nido — 'beautiful nest' in Portuguese — is Pink Papaya Stays' cosy offering in Calangute. Styled with warmth, colour, and that characteristically Goan sense of playful hospitality, Belo Nido 003 is the apartment that feels like a home from the moment you walk in. The pool access extends the living space outdoors.

**Nearby Places:** Calangute Beach (5 min drive) · Baga (5 min drive) · Anjuna Flea Market (15 min drive) · Candolim (10 min drive)

**FAQs:**
- Q: Is Belo Nido 003 part of a collection of apartments? A: Yes, it is one of a series of carefully curated Pink Papaya Stays apartments within the same Calangute building.

---

### 40. Lazy Turtle
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Walk to the Beach
**Airbnb:** https://www.airbnb.co.in/rooms/1043879671211125165

**Short Description:** Five minutes from Candolim Beach, no fuss — Lazy Turtle by Pink Papaya Stays is your budget-smart Goa base that proves a great holiday doesn't require overspending.

**About:** Named in the spirit of Goa itself — unhurried, easygoing, and happily on its own schedule — Lazy Turtle by Pink Papaya Stays is for the traveller who wants to be close to the beach without the luxury price tag. This comfortable 1BHK is a 5-minute walk from Candolim Beach and is managed with the same hospitality that Pink Papaya Stays brings to its entire portfolio.

**Nearby Places:** Candolim Beach (5 min walk) · Baga (10 min drive) · Fort Aguada (15 min drive) · Calangute (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Is Lazy Turtle a budget property? A: Lazy Turtle is Pink Papaya Stays' most affordable offering near Candolim Beach — excellent value without compromising on location or hosting quality.
- Q: Is it suitable for solo backpackers or budget travellers? A: Absolutely, Lazy Turtle is a popular choice for solo travellers and budget-conscious visitors to Goa.

---

### 42. Laziest Turtle
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Walk to the Beach
**Airbnb:** https://www.airbnb.co.in/rooms/1035933384425563119

**Short Description:** Slower than the Lazy Turtle, and proud of it — Laziest Turtle by Pink Papaya Stays is the ultimate no-pressure Goa base, five minutes from Candolim Beach.

**About:** If the Lazy Turtle is laid-back, the Laziest Turtle has fully committed to doing absolutely nothing in a hurry — and guests love it for that energy. This 1BHK near Candolim Beach by Pink Papaya Stays is a sister property to Lazy Turtle, sharing the same great location, budget-friendly approach, and Goa-appropriate attitude to time.

**Nearby Places:** Candolim Beach (5 min walk) · Baga (10 min drive) · Fort Aguada (15 min drive) · Calangute (10 min drive)

**FAQs:**
- Q: What's the difference between Lazy Turtle and Laziest Turtle? A: They are sister apartments in the same building at Candolim, both managed by Pink Papaya Stays. Ideal for two groups travelling together.
- Q: Can both Turtle apartments be booked together? A: Yes, Lazy Turtle and Laziest Turtle can be booked simultaneously for larger groups looking for affordable adjacent accommodation.

---

### 43. Super Lazy Turtle
**Area:** Candolim, North Goa | **Beds:** 1 | **Guests:** 2+1 | **Type:** Apartment
**Collection:** Walk to the Beach
**Airbnb:** https://www.airbnb.co.in/rooms/1206360742949399559
**Images:** https://drive.google.com/drive/folders/1AXR_x7DyUPNiZcxpHTxLMoArVUmUAfoM

**Short Description:** The third in the beloved Turtle trilogy — Super Lazy Turtle by Pink Papaya Stays is five minutes from Candolim Beach and commits fully to the Goa philosophy of taking it easy.

**About:** Three turtles, one philosophy. Super Lazy Turtle is the third in Pink Papaya Stays' beloved Candolim apartment trio — sharing the same excellent beach-close location, same easygoing hospitality ethos, and the same understanding that the best Goa holidays are the unhurried ones. Come for the beach. Stay for the pace. Leave wishing you'd booked longer.

**Nearby Places:** Candolim Beach (5 min walk) · Baga (10 min drive) · Fort Aguada (15 min drive) · Calangute (10 min drive) · Panjim (20 min drive)

**FAQs:**
- Q: Can all three Turtle properties be booked together? A: Yes, Lazy Turtle, Laziest Turtle, and Super Lazy Turtle can all be booked simultaneously by a larger group for an affordable shared Goa base.
- Q: Is this suitable for a budget group trip to Goa? A: Yes, the Turtle trio is Pink Papaya Stays' most popular combination for budget group travel to Candolim.
