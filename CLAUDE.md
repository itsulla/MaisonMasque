# CLAUDE.md — Maison Masque
## Project overview
**Maison Masque** — maisonmasque.com — "The House of Masks"
A luxury K-beauty sheet mask e-commerce store built on Shopify Hydrogen. We curate five Korean sheet masks ("The Five Rituals") sourced from Hong Kong and sell them worldwide, with primary focus on Australia, UK, Europe, and South Africa.
**Brand positioning:** French luxury house aesthetic applied to Korean skincare. Think Byredo meets Olive Young. Editorial serif typography, cream and ink palette with gold accents, generous whitespace. The language frames sheet masking as ceremony, not routine.
**Operator context:** Solo founder, no team. Customer service handled personally via Shopify Inbox. Photography is DIY (iPhone + natural light). Blog/journal deferred to post-launch. Inventory is sourced by a partner in Hong Kong, batch-shipped to the operator, then fulfilled locally.
---
## Tech stack
- **Storefront:** Shopify Hydrogen (headless React/Remix with TypeScript)
- **Hosting:** Shopify Oxygen (edge deployment)
- **Payments:** Shopify Payments (primary), Stripe (fallback)
- **Currency:** USD base with Shopify Markets multi-currency (GBP, AUD, EUR, ZAR)
- **Subscriptions:** Shopify native selling plans (not third-party)
- **Styling:** Tailwind CSS v4 with custom theme tokens
- **Fonts:** Playfair Display (display/headings), Manrope (body/UI) via Google Fonts
- **Analytics:** Google Analytics 4, Meta Pixel
---
## Design system
### Colors
```
cream:      #FAF8F3   — page background
ivory:      #F3EFE6   — hover states, subtle surfaces
ink:        #1A1714   — primary text, dark sections
espresso:   #2C2722   — dark hover states
walnut:     #4A433A   — secondary text
stone:      #8A8279   — tertiary text, descriptions
sand:       #E8E2D6   — borders, dividers, subtle lines
gold:       #C5A55A   — accents, labels, highlights
gold-light: #D4BA7A   — italic emphasis on dark backgrounds
gold-pale:  rgba(197,165,90,.08) — featured tier backgrounds
rose:       #C9928A   — product image gradients (warm)
sage:       #8FA68E   — product image gradients (green)
```
### Typography
```
Display/headings:  Playfair Display — weights 400, 500, 600, italic
Body/UI:           Manrope — weights 300, 400, 500, 600
Scale:
- Hero h1:       clamp(42px, 6vw, 80px), Playfair 400, -1px tracking
- Section h2:    clamp(28px, 3.5vw, 42px), Playfair 400
- Product name:  17px, Playfair 500
- Body:          14-16px, Manrope 300/400, line-height 1.7
- Labels:        11px, Manrope 600, uppercase, letter-spacing 4px
- Fine print:    9-10px, Manrope 500, uppercase, letter-spacing 3-5px
```
### UI patterns
- **Borders:** 1px solid sand (`#E8E2D6`), used extensively for grids and containers
- **Buttons:** Two variants — `dark` (ink bg, cream text, 12px uppercase tracking-widest) and `outline` (transparent bg, 1px sand border, gold on hover). Both 14px vertical × 36px horizontal padding.
- **Section labels:** Gold text, 11px uppercase, letter-spacing 4px, font-weight 600. Always above section headings.
- **Dividers:** Centered 8px gold diamond (rotated 45deg) between major sections.
- **Grid layout:** Products and steps use border-separated grids (no gap, shared borders) rather than cards with gaps.
- **Animations:** Staggered fadeUp (translate 30px, opacity 0→1, 0.8s ease) with 0.1s incremental delays. Gold line grows from center (lineGrow keyframe). Hover transitions at 0.3-0.6s ease.
- **Product hover:** Background cream→ivory, image scale 1.03, transition 0.6s ease.
### Brand voice
- Frame masking as "ritual" not "routine"
- Use words: ceremony, veil, intention, stillness, reveal, curated, practice
- Subscription tiers have French/literary names: La Cérémonie, The Introduction, The Collection, The Archive
- Steps use Roman numerals (I, II, III, IV, V)
- Shipping described as "complimentary" not "free"
- Customer service is "Contact the maison"
- Footer sign-off: "Curated in Hong Kong · Shipped with reverence"
---
## File structure
```
app/
  components/
    layout/
      AnnouncementBar.tsx
      Navigation.tsx
      MobileMenu.tsx
      CartDrawer.tsx
      Footer.tsx
      ShippingBar.tsx
    home/
      Hero.tsx
      FiveRituals.tsx
      RitualCard.tsx
      Philosophy.tsx
      RitualGuide.tsx
      Subscription.tsx
    product/
      ProductPage.tsx
      ProductGallery.tsx
      AddToCart.tsx
      PriceDisplay.tsx
      TrustBadges.tsx
    quiz/
      SkinQuiz.tsx
      QuizStep.tsx
      QuizResult.tsx
    shared/
      Button.tsx
      Divider.tsx
      SectionLabel.tsx
      Seal.tsx
      CurrencySelector.tsx
  routes/
    _index.tsx              — homepage
    products.$handle.tsx    — product detail page
    collections.$handle.tsx — collection page
    cart.tsx                — cart page (fallback for no-JS)
    quiz.tsx                — skin ritual quiz
    policies.$handle.tsx    — legal pages
  lib/
    fragments.ts            — GraphQL fragments for products, collections, variants, images
    queries.ts              — Storefront API queries
    ritualConfig.ts         — ritual numbers, names, themes, descriptions mapped to product handles
    currency.ts             — multi-currency helpers, locale detection
  styles/
    app.css                 — global styles, keyframes, base typography
    tailwind.css            — Tailwind imports and custom theme
```
---
## Product data
### Collection: "The Five Rituals"
Handle: `the-five-rituals`
| Ritual | Brand | Product | GBP | USD | Qty | Handle | Theme |
|--------|-------|---------|-----|-----|-----|--------|-------|
| I — Restore | Biodance | Bio-Collagen Real Deep Mask | £19 | $24 | 4pc | `biodance-collagen` | Overnight hydrogel, turns transparent as collagen absorbs |
| II — Drench | Torriden | DIVE-IN Hyaluronic Acid Mask | £32 | $38 | 10pc | `torriden-dive-in` | 5 molecular weights of HA, vegan cellulose |
| III — Calm | Abib | Heartleaf Gummy Sheet Mask | £28 | $32 | 10pc | `abib-heartleaf` | Microfibre gummy seal, heartleaf soothes redness |
| IV — Replenish | Mediheal | N.M.F Ampoule Mask | £14 | $18 | 10pc | `mediheal-nmf` | 2 billion sold, NMF floods parched skin, logo reveals timing |
| V — Illuminate | Numbuzin | No.3 Skin Softening Mask | £22 | $26 | 5pc | `numbuzin-no3` | Galactomyces ferment for glass skin, gentle daily use |
### Bundle product
"The Complete Ritual" — all five masks in a curated gift box. Price: £99 / $120 USD. Handle: `the-complete-ritual`. Tags: `bundle`, `featured`.
### Recommended metafields
```
custom.ritual_number       — "I", "II", "III", "IV", "V"
custom.ritual_name         — "Restore", "Drench", "Calm", "Replenish", "Illuminate"
custom.ritual_description  — poetic one-liner for the card
custom.key_ingredient      — e.g. "Ultra-low molecular collagen (243 daltons)"
```
### Subscription tiers (Shopify selling plans)
| Tier | Name | Masks | Frequency | Discount | Price |
|------|------|-------|-----------|----------|-------|
| 1 | The Introduction | 5 | Monthly | 10% | £22/mo |
| 2 | The Collection | 10 | Monthly | 15% | £38/mo |
| 3 | The Archive | 20 | Bi-monthly | 20% | £68/2mo |
Create as a selling plan group called "La Cérémonie" in Shopify Subscriptions app.
---
## Page-by-page build specs
### Homepage (`_index.tsx`)
Build these sections in order, top to bottom:
**1. Announcement bar**
- Ink background, cream text, 11px uppercase
- Text: "Complimentary shipping on orders over £45 / $60 AUD / €50 / R750 — Worldwide from Hong Kong"
- Gold color on the currency amounts
**2. Navigation**
- Sticky, cream bg with `backdrop-filter: blur(24px)` on scroll
- 1px sand bottom border
- Centered logo: "Maison Masque" in Playfair 28px uppercase, tracking 4px
- Subtitle: "The House of Masks · Est. 2026" in 9px uppercase stone
- Left links: The Rituals, Skin Quiz
- Right links: Subscribe, Account, Bag (with cart count badge)
- Mobile: hamburger, slide-out drawer
**3. Hero**
- Decorative 1px sand vertical line, 60px tall, centered above content
- Overline: "Collection I" in gold section label style
- H1: "The Five *Rituals*" — "Rituals" in italic gold
- Animated gold line: 60px wide, grows from center (CSS keyframe, 0.5s delay)
- Subtext: "Five masks. Five intentions. Each chosen from Korea's most revered houses and delivered from Hong Kong to your door. This is skincare as ceremony."
- CTAs: "Explore the collection" (dark) + "Take the skin ritual quiz" (outline)
- Staggered fadeUp animations, 0.1s incremental delays
- 100px top padding, 80px bottom
**4. Divider**
- Centered gold diamond
**5. The Five Rituals (product grid)**
- Header: gold label "The Five Rituals", Playfair h2 "One mask for every intention", stone subtext
- 5-column grid with 1px sand borders between columns (not gaps)
- Each card: 280px image area (product image from Storefront API, gradient fallback), ritual number ("Ritual I — Restore" in 11px uppercase), brand (10px uppercase stone), product name (Playfair 17px), description (12px stone), price (Playfair 20px via Money component), + add button (32px square)
- Below grid: "The Complete Ritual — All five for £99" centered dark CTA
- Responsive: 2-col tablet, 1-col mobile
- Fetch via Storefront API collection query for handle `the-five-rituals`
- Add-to-cart via Hydrogen CartForm
**6. Philosophy section**
- Ink (dark) background
- Two columns: text left, seal right
- Left: gold label "Our Philosophy", Playfair h2 "We believe a mask is not *skincare.* It is a *moment.*" (italic gold on "skincare" and "moment"), two brand story paragraphs at 14px cream/45% opacity, 3-stat row (5 Curated brands / 40+ Countries / 100% Authenticated) with Playfair gold numbers
- Right: Seal component — three concentric circles with decreasing gold border opacity, "MM" monogram in Playfair 36px gold, "Hong Kong · MMXXVI", "The House of Masks" in italic
- Decorative low-opacity gold circles in background
**7. Ritual guide ("The Practice")**
- Header: gold label "The Practice", Playfair h2 "How to perform a ritual"
- 4-column bordered grid (same style as product grid)
- Roman numerals in Playfair 48px sand, Playfair 16px heading, 12px stone description
- Steps: I Cleanse, II Apply, III Rest, IV Reveal
**8. Subscription ("La Cérémonie")**
- 1px sand-bordered container, two columns
- Left: gold label, Playfair heading, stone body text, dark CTA
- Right: three stacked tier cards with Playfair names, prices, save percentages
- Featured tier ("The Collection"): gold border + gold-pale background
- Wire to Shopify selling plans via Storefront API sellingPlanGroups
**9. Shipping bar**
- 1px sand borders top/bottom
- 4-column grid: flag emoji, Playfair country name, stone delivery/threshold text
- AU (5-8 days, free $60+), UK (7-12 days, free £45+), EU (8-14 days, free €50+), ZA (10-16 days, free R750+)
**10. Footer**
- 4-column grid (2fr 1fr 1fr 1fr)
- Brand col: logo, subtitle, description paragraph
- Shop: The Five Rituals, All masks, The Complete Ritual, Subscribe
- Discover: Skin ritual quiz, Ingredient glossary, The practice, Journal
- Care: Shipping & returns, Contact the maison, FAQ, Privacy
- Bottom bar: copyright + "Curated in Hong Kong · Shipped with reverence"
### Product page (`products.$handle.tsx`)
- Two columns: image left (large, zoomable on hover), details right
- Breadcrumb: Home > The Five Rituals > [Product]
- Ritual label from metafield ("Ritual I — Restore")
- Brand name (10px uppercase stone, from product.vendor)
- Title (Playfair 28px)
- Price (Money component, auto multi-currency)
- Description (14px stone)
- Quantity selector (minimal, sand border)
- "Add to ritual" button (dark, full width)
- Trust badges: Authentic · Ships from HK · Free returns
- Ingredients accordion
- How-to-use section
### Cart drawer
- Slide-out from right, triggered by Bag click
- Cream bg, ink text
- Header: "Your Ritual" in Playfair 20px + item count + close X
- Line items: thumbnail, title, ritual label, quantity adjuster, price, remove
- Subtotal, shipping notice, gold divider, "Proceed to checkout" dark button
- Empty state: "Your ritual awaits" + CTA to browse
- CartForm for updates/removal, translateX animation
### Skin quiz (`quiz.tsx`)
- 5-step client-side quiz, no backend needed
- Steps: skin type → concerns → mask frequency → texture preference → priority
- UI: bordered option cards, gold border on select, progress bar (thin gold line)
- Result: recommended ritual product card + email capture ("Join the Maison for 10% off")
- Map answers to the 5 ritual products via local config logic
---
## Multi-currency
- Use `@inContext(country: $country)` directive on all Storefront API queries
- Auto-detect buyer country from request headers via Hydrogen buyer identity
- CurrencySelector in footer: dropdown for USD, GBP, AUD, EUR, ZAR. Persist in cookie.
- PriceDisplay wrapper around Hydrogen Money component for consistent styling
- Cart and checkout must respect selected currency context
- Use Hydrogen's createCartHandler with buyerIdentity country code
---
## Shopify Admin setup (manual, not code)
Complete before connecting the Hydrogen storefront:
1. Create store on Basic+ plan
2. Enable Shopify Payments in Settings > Payments
3. Add Stripe as additional payment method
4. Enable Shopify Markets: add AU, UK, EU, ZA markets with auto currency conversion
5. Create Storefront API app: Settings > Apps > Develop apps. Scopes: unauthenticated_read_product_listings, unauthenticated_read_product_inventory, unauthenticated_write_checkouts, unauthenticated_read_checkouts
6. Add all products with images, descriptions, prices (see product data above)
7. Create "The Five Rituals" collection
8. Install Shopify Subscriptions app, create "La Cérémonie" selling plan group with 3 tiers
9. Set up shipping zones with rates and free thresholds for AU, UK, EU, ZA, Rest of World
10. Connect maisonmasque.com domain
11. Create legal pages: Privacy Policy, Terms, Refund Policy, Shipping Policy
---
## Shipping configuration
Zones and rates to set in Shopify Admin > Settings > Shipping:
```
Australia:
  Standard: 5-8 days, $8 AUD (under $60), free over $60 AUD
  Express:  2-4 days, $15 AUD
United Kingdom:
  Standard: 7-12 days, £4 (under £45), free over £45
  Express:  3-5 days, £8
European Union:
  Standard: 8-14 days, €5 (under €50), free over €50
South Africa:
  Standard: 10-16 days, R80 (under R750), free over R750
Rest of World:
  Standard: 10-21 days, $12 USD
```
HS code for all products: `3304.99` (beauty/skincare preparations)
---
## SEO configuration
- Title: "Maison Masque | Korean Sheet Masks | The House of Masks"
- Description: "Curated Korean sheet masks from Biodance, Torriden, Abib, Mediheal and Numbuzin. Sourced in Hong Kong, shipped worldwide to Australia, UK, Europe and South Africa."
- OpenGraph + Twitter Card meta on all pages
- Dynamic sitemap.xml via Hydrogen
- JSON-LD structured data: Product, Organization, BreadcrumbList schemas
- Image alt convention: "[Brand] [Product] - Korean Sheet Mask - Maison Masque"
- Lazy load below-fold images
- Preload display fonts
- Target: Lighthouse 90+ all categories, LCP <2.5s, CLS <0.1
---
## Deployment
1. Connect GitHub repo to Shopify via Hydrogen app
2. Set env vars in Oxygen: PUBLIC_STOREFRONT_API_TOKEN, PUBLIC_STORE_DOMAIN, SESSION_SECRET
3. Deploy main branch
4. Connect maisonmasque.com, verify SSL
5. Test full checkout in each currency (USD, GBP, AUD, EUR, ZAR)
6. Enable preview deployments for feature branches
---
## Go-live checklist
- [ ] All 5 products + bundle created with images and prices
- [ ] Selling plans configured for subscription tiers
- [ ] Shipping zones and rates set for all markets
- [ ] Shopify Payments activated and tested
- [ ] Stripe fallback configured
- [ ] Custom domain connected, SSL verified
- [ ] Test order completed in each target currency
- [ ] Cart drawer: add, update, remove, checkout all working
- [ ] Multi-currency selector works correctly
- [ ] Mobile responsive on iPhone, Android, iPad
- [ ] Email notifications configured (order confirm, shipping, delivery)
- [ ] Legal pages: Privacy, Terms, Refunds, Shipping
- [ ] GA4 connected
- [ ] Meta Pixel installed
- [ ] Favicon + social share images uploaded
- [ ] 404 page styled to match brand
- [ ] Lighthouse 90+ verified
- [ ] Skin quiz functional with correct product recommendations
---
## Post-launch roadmap
**Month 1:** Email flows (welcome, abandoned cart, post-purchase), "Join the Maison" popup with 10% off, begin TikTok/Instagram (1-2x/week), add product reviews via Judge.me
**Month 2-3:** Launch Journal (blog) with SEO articles, ingredient glossary page, customer before/after gallery
**Month 3-6:** Google Shopping ads (AU + UK), TikTok Shop integration, expand product range, seasonal limited-edition boxes
**Month 6+:** Evaluate UK/AU fulfilment centre, wholesale partnerships, multi-language (French), referral programme, consider launching Peel Good Inc. as second brand targeting Gen Z segment
---
## Reference files
- `maisonmasque.html` — the complete homepage mockup with exact styling to match
- `maison_masque_build_guide.docx` — detailed build guide with expanded Claude Code prompts
- `mask_margins.xlsx` — margin calculator spreadsheet for pricing decisions
