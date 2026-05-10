# Pink Papaya Stays — Design Spec

Source: Figma exports (`1920w light.pdf`, `Stays Page.pdf`, `Contact Us.pdf`, `Per Interior Page.png`, `Group 25/26/27`). Boutique-stay marketing site. Goa-based. Brand voice: warm, editorial, coastal-luxury.

---

## 1. Brand & Tone

- **Name:** Pink Papaya Stays
- **Sub-brand seen in copy:** Mariven (a stay name)
- **Voice:** lowercase taglines + Title Case display headings. Editorial, sun-warm, not corporate.
- **Locale signals:** ₹ pricing, "Goa" copy, India phone format optional.

---

## 2. Color Tokens

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

---

## 3. Typography

- **Display serif:** "Cormorant Garamond" 500/600 (or Playfair Display fallback). H1/H2/stay-card titles.
- **Body sans:** "Inter" 400/500. All paragraphs, nav, labels, buttons.
- **Script accent:** "Allura" or "Pinyon Script". One-off italic taglines (e.g., "Neutral, airy, and organic design"). Use sparingly.
- **Eyebrow:** Inter 12px UPPERCASE letter-spacing 0.12em color `--muted`.

Scale (desktop):
```
H1 hero        72px / 1.05 / serif 500
H2 section     56px / 1.1  / serif 500
H3 subsection  36px / 1.15 / serif 500
Card title     28px / 1.2  / serif 500
Body lg        18px / 1.6  / sans 400
Body           16px / 1.65 / sans 400
Small          14px / 1.5  / sans 400
Eyebrow        12px / 1    / sans 500 uppercase tracked
```

Mobile: H1→44px, H2→36px, H3→28px.

---

## 4. Layout Grid

- Max content width: **1280px** centered, gutter 24–48px.
- Hero & full-bleed images: 100vw.
- Section vertical padding: **96px** desktop / 56px mobile.
- Cards rounded-md (8px). Hero/large images square corners or 4px.
- Asymmetric collages: free placement on a 12-col grid, generous negative space.

---

## 5. Components

### 5.1 Top Nav (sticky, transparent over hero, solid cream after scroll)
- Left: nav links — `home`, `explore stays`, `about us`, `contact us` (lowercase, sans 14px, color white-on-hero / ink-on-scroll).
- Right: `Get In Touch` pill button (1px border, transparent bg, rounded-full, 12×24 padding) + circular WhatsApp icon button.
- Logo absent on hero (per design); footer shows wordmark "Logo" placeholder.

### 5.2 Hero
- Full-bleed background photo (interior shot).
- Soft dark gradient bottom-up for text legibility.
- Centered stack: H1 "Your Home By The Ocean" → subtitle 2 lines → white pill CTA "Explore Stays" (cream bg, ink text, rounded-full, 14×32 padding).

### 5.3 Stay Card  (`Group 25.png` reference)
- White surface, 1px line border `--line`, rounded-md.
- **Top:** image (4:3) full-width inside card.
- **Body padding 24px:**
  - "Stay Name" — serif 28px ink.
  - "Location of stay" — sans 14px `--accent` (or muted teal).
  - Right side of body: 3 amenity icon-labels in a row (Rain Shower etc.). Icon 24px above 10px caption.
  - Price line: "From ₹8,999 / night + taxes" — sans 14px bold ink.
- **Footer button:** full-width "View Stay", 1px top border separating, 14px sans, ink, hover→ ink fill + cream text.
- Grid: 2-up on desktop in homepage section; **2×2 = 4 cards** in Group 26/27 hero variants. Stays page = 2-col 3-row (6 cards) with **dark image-overlay variant**: title + meta row sit ON the photo at bottom-left, white text, no card chrome.

### 5.4 Section Heading (centered)
- Optional eyebrow above (e.g., "Welcome to Pink Papaya", "FAQ's", "Rooms & Stays").
- H2 serif centered.
- Optional 2–3 line body below, max-width 520px.

### 5.5 "no average stays" / Image Collage Section
- 12-col grid, 4 photos placed asymmetrically (top-left, top-right, mid-right, bottom-left) at varying widths/heights.
- Centered text block sits in middle, vertically anchored between rows.
- Use rectangular images, no rounding, modest drop-shadow none.

### 5.6 Rooms Accordion ("Stay your Way")
- Two-column: left 5/12, right 7/12.
- Left column eyebrow "Rooms & Suites" → H2 "Stay your Way" → body copy → outline pill button "Explore All Rooms" pushed right.
- Below: vertical list of room names. Active item: serif 28px ink, with thin underline extending to a small badge row showing sqft / beds / guests icons + "Starting at $XXX / night" + small "Book" outline pill on right.
- Inactive items: serif 28px **muted** color, no detail row. Click to expand swaps active.
- Right column: large room photo (4:3) with caption strip overlay at bottom describing the active room (white text, dark-tinted gradient).

### 5.7 Three-feature row ("leisure, not logistics")
- Centered H2 + tiny tagline.
- 3 columns below: each = portrait image + lowercase serif headline (e.g., "wheels for every mood", "always there, never in the way", "goa, beyond the guidebooks") + 2-line sans body.
- Generous gap 48px.

### 5.8 Interior Talks Gallery
- Centered eyebrow-less H2 "Our Interior talks" + 3-line body.
- Below: 4-cell grid (2×2). Tiles alternate `--bg-mist` and a real photo. Inside mist tiles: small eyebrow "Lorem ipsum", a small thumbnail centered, 3 lines of caption. Photo tiles bleed full.

### 5.9 FAQ
- Two-column. Left: eyebrow "FAQ's" + H2 "Frequently Asked Questions" + body.
- Right: vertical list, each item a row with a hairline bottom border, 18px ink question on left, `+` icon on right. Click expands answer below; rotate `+` to `−`.

### 5.10 Testimonials ("What they say")
- Centered H2.
- 3 cards in a row (slight scale variance — the middle card sits visually slightly raised). Each card: white, rounded-md, soft shadow, padding 32px. Top: 5 dark stars centered. Body italic 15px ink. Footer: small avatar circle + name (sans bold) + role (sans muted small).

### 5.11 Footer
- Cream bg, top hairline.
- Centered serif wordmark "Logo" (placeholder).
- 4-column row: `Navigation`, `Pages`, `Pages`, `Stay up to date`. First three are link lists. Fourth: 4 round social icons (FB, IG, YT, TikTok) above newsletter input + dark-fill "Subscribe" button (ink bg, white text).
- Decorative palm-leaf SVG in bottom-left and bottom-right corners (low opacity).
- Bottom line: "2025 © All right reserved" centered small.

### 5.12 Contact Us page (`Contact Us.pdf`)
- Centered eyebrow "Contact Us" → H2 "Get In Touch" → 3-line subhead.
- Two-column block:
  - **Left:** H3 serif "Pink Papaya Stays" + label/value stacks for Location, Phone (Reservations, Concierge), Email (General/Bookings/Events).
  - **Right:** Form card — 1px line border, padding 32px. Fields: Name + Email (2-col), Subjects (select), Message (textarea). Dark "Submit" button below, right-aligned-ish or centered per design.
- Below: same FAQ block as homepage.

### 5.13 Per-Stay Interior Page (`Per Interior Page.png`)
- Two-column hero: left = large square photo (1:1), right = text block:
  - Eyebrow "JUMEIRAH PARKS" (location/category in caps).
  - H2 serif "THE SOFT EDIT" (uppercase tracked).
  - Script-italic tagline "Neutral, airy, and organic design".
  - 2 paragraphs body.
  - Hairline divider.
  - Small label "What we did - Furnish, Full Interior".
- Section "All Photos": centered H3 + 4-col × 2-row image grid (8 thumbs, square, gap 16px).
- Section "Before and After": centered H3 + 2 large before/after sliders side-by-side. Each is two images stitched with a draggable vertical handle and circular knob in the center.

---

## 6. Buttons

```
Primary CTA (hero)       cream bg / ink text / rounded-full / 14×32 / serif? no — sans 14 medium
Outline pill (nav, list) transparent / 1px ink border / ink text / rounded-full / 12×24
Card button (View Stay)  full-width inside card / no fill / 1px top border only / 14 sans bold ink
Submit (contact)         ink fill / white text / rounded-md / 12×40
Hover (all)              200ms ease; outline → ink fill+cream text; ink → ~10% lighten
```

---

## 7. Iconography

- Line icons, 1.5px stroke, ink color, ~24px.
- Custom amenity icons (rain shower etc.) match the line style.
- Social icons: solid filled circle ink-on-cream variant in footer.

---

## 8. Imagery

- Warm coastal interiors, beachfront vistas, soft daylight.
- All images full-color, no filters; preserve natural warmth.
- Aspect ratios: hero 16:9 wide, stay cards 4:3, collage tiles 3:4 portrait, interior gallery 1:1.

---

## 9. Motion

- Section reveals: fade-up 12px, 400ms, stagger 80ms.
- Card hover: lift -2px + shadow softening 200ms.
- Accordion: 250ms ease.
- Hero overlay text: settle-in on load.
- Respect `prefers-reduced-motion`.

---

## 10. Pages to Build

1. **Home** — full long-scroll per `1920w light.pdf` (sections 5.2 → 5.3 → 5.5 → 5.6 → 5.7 → 5.8 → 5.9 → 5.10 → 5.11).
2. **Stays / Explore Stays** — per `Stays Page.pdf`. Hero (image with centered eyebrow "Rooms & Stays" + H1 "Stay Your Way" + 3-line body) → 2-col grid of 6 image-overlay stay cards → footer.
3. **Stay Detail (Per Interior)** — per `Per Interior Page.png`. Section 5.13 → footer.
4. **Contact Us** — per `Contact Us.pdf`. Section 5.12 → footer.

Group 26 / Group 27 = same homepage hero + 2×2 stays grid; treat as alternative crops of Home top — do not build as separate pages.

---

## 11. Responsive Rules

- Breakpoints: ≥1280 desktop, 768–1279 tablet, <768 mobile.
- 2-col grids → 1-col on mobile.
- 3-col feature row → 1-col stacked, image full-width.
- Rooms accordion: list collapses to dropdown above image on mobile.
- Footer 4-col → 2-col tablet → 1-col mobile.
- Hero H1 scales as in §3.

---

## 12. Accessibility

- Color contrast AA: ink on cream = pass; muted text only for non-essential labels.
- All buttons reachable by keyboard, focus ring 2px `--accent` offset 2px.
- FAQ + accordion use `<button aria-expanded>` + `<region>`.
- Form fields have associated `<label>`.
- Alt text on every image.

---

## 13. Tech Stack (for build)

- **Framework:** Next.js (App Router) + React + TypeScript.
- **Styling:** Tailwind CSS with the tokens above mapped in `tailwind.config.js` `theme.extend.colors` + custom font families.
- **Fonts:** `next/font/google` for Cormorant Garamond, Inter, Allura.
- **Icons:** `lucide-react` for nav + amenity + social where built-ins exist; inline SVG for custom amenity glyphs.
- **Images:** `next/image`, placeholder `/public/img/...` paths, lazy by default.
- **Routes:** `/`, `/stays`, `/stays/[slug]`, `/contact`.
- **No backend:** form `POST` posts to a stub `/api/contact` route returning 200.
