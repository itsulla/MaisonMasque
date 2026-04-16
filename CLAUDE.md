# CLAUDE.md — Maison Masque

## What this is
Luxury K-beauty e-commerce at **maisonmasque.com** — "The House of Masks". Curated Korean skincare (17 products), French-luxury aesthetic, cream-and-gold palette, editorial serif typography. Masking as ceremony, not routine.

**Markets:** USD base, Shopify Markets for GBP/AUD/EUR/ZAR. Primary: AU, UK, EU, ZA, NZ, SG.
**Operator:** solo founder. Inventory batched from a HK supplier (AWB) through an E-Fulfill HK reshipper (Y01 DDP).

## Tech stack
- **Storefront:** Shopify Hydrogen (Remix + React + TypeScript)
- **Hosting:** Shopify Oxygen (edge workerd)
- **Styling:** Tailwind CSS v4 via custom theme tokens in `app/styles/tailwind.css`
- **Fonts:** Playfair Display (display), Manrope (body) — Google Fonts
- **Payments:** Shopify Payments; Stripe fallback
- **Analytics:** GA4 (`G-78D06T2CLG`) live; Meta Pixel wired but ID not populated
- **Repo:** `github.com/itsulla/MaisonMasque`
- **Ops dashboard:** `mask.lekker.design` (PM2 on VPS, separate from repo)

## Design system

### Colors (Tailwind theme tokens)
```
cream      #FAF8F3                     page background
ivory      #F3EFE6                     subtle hovers
ink        #1A1714                     primary text, dark sections
espresso   #2C2722                     dark hover
walnut     #4A433A                     secondary text
stone      #8A8279                     tertiary text
sand       #E8E2D6                     borders, dividers
gold       #C5A55A                     DECORATIVE only (lines, numerals, fills)
gold-deep  #876319                     TEXT colour (WCAG AA 5.1:1 on cream)
gold-light #D4BA7A                     italic emphasis on ink bg
gold-pale  rgba(197,165,90,.08)        featured tier backgrounds
rose       #C9928A                     warm product gradients
sage       #8FA68E                     green product gradients
```

**Rule:** use `gold-deep` for labels/headings/body gold; use `gold` only for decorative elements where contrast doesn't apply (lines, icons, fills, backgrounds).

### Typography
- Display: Playfair Display — 400/500/600/italic
- Body: Manrope — 300/400/500/600
- Hero h1: clamp(42px, 6vw, 80px), 400, -1px
- Section h2: clamp(28px, 3.5vw, 42px), 400
- Product name: 17px, 500
- Body: 14-16px, 300/400, line-height 1.7
- Label: 11px, 600, uppercase, tracking 4px, gold-deep
- Fine print: 9-10px, 500, uppercase, tracking 3-5px

### UI primitives
- **Borders:** 1px `sand` for structure (dividers, containers)
- **Buttons:** `dark` (ink bg, cream text) or `outline` (sand border, gold on hover). See `~/components/shared/Button.tsx`
- **Save-X% badge:** `.badge-save` class — 1px gold-deep outline on transparent (NOT solid green)
- **Easing:** motion curves use `cubic-bezier(0.16, 1, 0.3, 1)` throughout
- **Reveal animations:** respect `prefers-reduced-motion`
- **Dividers:** centred 8px gold diamond between major sections
- **Product grids:** airy (gap-based, no rigid borders), `ritual-soft-card` hover shadow

### Voice
- "ritual" not "routine", "ceremony", "veil", "intention", "stillness"
- Roman numerals for step numbers (I-V)
- "Complimentary" not "free" shipping
- "Curated in Hong Kong · Shipped with reverence" footer sign-off

## Current catalogue (17 products)
Source of truth: `app/lib/products.ts`. Handles match Shopify + VARIANT_MAP + competitors.mjs dashboard.

| Collection | Handle | Price |
|---|---|---|
| Ritual I | `medicube-pdrn-gel-mask` | $22 |
| Ritual II | `medicube-wrapping-mask` | $26 |
| Ritual III | `abib-heartleaf-gummy-mask` | $28 |
| Ritual IV | `numbuzin-no3-pore-mask` | $22 |
| Ritual V | `skin1004-centella-sleeping-pack` | $20 |
| Mask | `medicube-pdrn-tension-mask` | $17.99 |
| Mask | `medicube-pdrn-caffeine-wrapping` | $17.99 |
| Elixir I | `medicube-pdrn-peptide-serum` | $24 |
| Elixir III | `medicube-pdrn-milky-toner` | $22 |
| Elixir | `anua-pdrn-ha-capsule-serum` | $23.99 |
| Elixir | `centellian24-madeca-pdrn` | $21.99 |
| Cleanse | `medicube-pdrn-whip-cleanser` | $18.99 |
| Cleanse | `mixsoon-bean-cleansing-oil` | $15.99 |
| Morning Veil | `beauty-of-joseon-relief-sun` | $22 |
| Morning Veil | `medicube-pdrn-sun-cream` | $19.99 |
| Bundle | `the-complete-ritual` | $129 |
| Bundle | `the-medicube-bundle` | $94 |

**Pricing rule:** sell price = cheapest competitor × 0.85; compare-at = highest competitor (outlier-capped at 3× cheapest). See `mask.lekker.design/competitors` for live data.

## File structure
```
app/
  components/
    layout/   AnnouncementBar, Navigation, MobileMenu, CartDrawer, Footer, BottomNav
    home/     Hero, FiveRituals, RitualCard, Philosophy, RitualGuide, Subscription,
              BundleBuilder, ChooseYourRitual, ElixirsPromo, MorningVeilPromo, QuickView
    product/  ProductPage, ProductBrandStory, StickyAddToCart, AddToCart, TrustBadges
    shared/   Button, Divider, SectionLabel, Price, RitualNumeral, Seal, QuizDrawer,
              CurrencySelector, Analytics, EmailPopup, SocialProofToast, BackToTop,
              ElixirCrossSell, MorningVeilCrossSell, GiftTierNudge, Skeleton
  routes/
    _index.tsx, $.tsx (404), [sitemap.xml].tsx, [robots.txt].tsx
    collections.$handle.tsx, products.$handle.tsx
    products.the-complete-ritual.tsx, products.the-evening-ritual.tsx
    the-morning-veil.tsx, the-practice.tsx, philosophy.tsx, ingredients.tsx
    build-your-own.tsx, quiz.tsx, cart.tsx, contact.tsx, faq.tsx, policies.$handle.tsx
  lib/
    products.ts            17-product catalogue (retail/compare/copy)
    bundles.ts             Bundle slot definitions (Evening Ritual, Complete Ritual)
    shopifyCart.ts         Storefront API cart mutations + VARIANT_MAP
    cartContext.tsx        Cart state provider
    currencyContext.tsx    Currency picker + USD→local rates (hardcoded, see known debt)
    quizDrawerContext.tsx  Side-drawer open/close state
    ritualConfig.ts        Ritual metadata derived from products.ts
    productMedia.ts        Brand asset manifests per handle
    giftTiers.ts           Gift-with-purchase tier thresholds
  styles/
    app.css, tailwind.css
scripts/
  populate-shopify.mjs, curate-products-ts.mjs, download-phase2-images.mjs,
  download-brand-assets.mjs, update-products-ts.mjs, wrap-worker.mjs (deprecated)
public/
  images/products/              local mirrors of brand CDN images
  images/products/brand/{handle}/  hi-res brand marketing assets
```

## Build + deploy
```bash
npm run build      # shopify hydrogen build --codegen → dist/
npm run preview    # local Oxygen workerd preview
```

**Deploy to production:**
```bash
npx shopify hydrogen deploy --no-verify --force --env production \
  --token "$OXYGEN_DEPLOY_TOKEN"
```

Oxygen token (base64-encoded) is stored as `OXYGEN_DEPLOY_TOKEN` GitHub Action secret; also in `maison-dashboard/.shopify-admin.env` locally. Token is long-lived (expires April 2027).

**Critical config (don't break):**
- `vite.config.ts` — `oxygen()` plugin from `@shopify/mini-oxygen/vite` is required. Pinned to `@shopify/mini-oxygen@3.0.6` for Vite 5 compatibility (4.x needs Vite 6).
- `server.ts` — uses `createRequestHandler({build, mode, getLoadContext})` OPTIONS-OBJECT form (not positional args — positional causes Vite to tree-shake the server build).

## Shipping
E-Fulfill HK Y01 DDP rates live in `maison-dashboard/data.mjs`. Key markets:

| Market | Per kg | Per parcel | Transit | Shipping model |
|---|---|---|---|---|
| AU | HK$128 | HK$34 | 9-13 d | linear |
| NZ | HK$140 | HK$34 | 8-15 d | linear |
| SG | HK$51 | HK$19 | 6-9 d | linear |
| MY/TH | HK$77 first 0.5kg + HK$32 each +0.5kg | — | 4-9 d | **step** |
| PH | HK$83 first 0.5kg + HK$39 each +0.5kg | — | 4-9 d | **step** |
| JP | HK$49 first 0.5kg + HK$13 each +0.5kg | — | 6-9 d | **step** |
| UAE | HK$59 | HK$33 | 5-10 d | linear |
| CA | HK$135 | HK$33 | 8-14 d | linear |
| UK | HK$85 | HK$32 | 5-8 d | linear |

HS code: `3304.99` (beauty/skincare). Fuel surcharge included in base rate. HK$40/trip local drop-off when batch <5.

## Ops dashboard (mask.lekker.design)
Internal-only PM2-managed Express app at `/home/muffinman/maison-dashboard/`. Routes:
- `/` — margin matrix, cost breakdown, bundle economics, free-shipping thresholds by market
- `/competitors` — live scraper vs AWB cost, opportunity scores, listing-play calc, 30d sparklines
- `/bulk` — 3 bulk-order scenarios (A: full bulk, B: starter, C: hybrid)
- `/oauth/shopify` — OAuth callback capture for Admin API tokens

Not in git — state preserved via `pm2 save`.

## Known debt + roadmap

### Deferred (blocks nothing urgent)
- **Storefront API refactor (Path B)** — `products.ts` hardcoded; Shopify data not fetched at runtime. Blocks real multi-currency at checkout, live inventory, Shopify Markets languages. See chat history for the 5-stage plan (~4 h).
- **Meta Pixel ID** — placeholder; activate when running paid social.
- **Dead editorial keys** in `productMedia.ts`, `the-morning-veil.tsx` — unreachable, harmless, clean up when touching those files.
- **Real bundle photography** — Medicube Bundle + Complete Ritual currently use component product images as placeholders.
- **Legal pages** — drafted HTML sits in `maison-dashboard/policies-output/`; must be pasted into Shopify Admin → Settings → Policies (Admin API scope didn't include `write_legal_policies`).
- **Shipping zones** — spec in `maison-dashboard/SHIPPING-SETUP.md`; set up manually in Shopify Admin → Shipping (API too complex for conditional free-over-X).

### Done (don't undo)
- Oxygen deploy pipeline fully working (took weeks to unblock — read `scripts/wrap-worker.mjs` NOT — it's deprecated, keep it deleted)
- Curated catalogue: 25 → 17 products + Medicube Bundle
- GA4 live, SEO basics (sitemap, robots, JSON-LD Product/Breadcrumb/Organization)
- Quiz drawer, sticky ATC, WCAG AA contrast, soft-404 fix

## Conventions for code changes
- **No destructive git commands without asking** (push --force, reset --hard, branch -D)
- **Commit before large refactors** so rollback is clean
- **Keep `products.ts` the source of truth** until the Storefront API refactor lands — changes here must sync to Shopify and `maison-dashboard/data.mjs`
- **Match handle everywhere:** Shopify product, `products.ts`, `VARIANT_MAP`, `competitors.mjs` COMPETITOR_URLS, `data.mjs` PRODUCTS
- **Respect `prefers-reduced-motion`** on every new animation
- **`badge-save` class** for any "Save $/%" chip — never inline green pill
- **`gold-deep` for text, `gold` for decoration** — AA contrast matters

## Reference paths
- Admin API token (write scope): `maison-dashboard/.shopify-admin.env`
- Storefront API token (read-only, in repo): `app/lib/shopifyCart.ts:9`
- Oxygen deploy token: same env file, base64-encoded
- Brand images source manifest: `scripts/download-brand-assets.mjs`
- Landing cost calculator: `maison-dashboard/landing-cost.mjs`
- Competitor scraper: `maison-dashboard/competitors.mjs` (JSON-LD + Playwright fallback for YS/SV/SK)
