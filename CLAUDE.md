# CLAUDE.md — Maison Masque

Luxury K-beauty e-commerce at **maisonmasque.com** — "The House of Masks." 17 curated Korean SKUs, cream-and-gold editorial aesthetic. HK-based solo operator, cross-border Y01 DDP fulfilment.

## Stack

- Shopify Hydrogen (Remix + React + TS), deployed to Shopify Oxygen
- Tailwind CSS v4, theme tokens in `app/styles/tailwind.css`
- Fonts: **Cormorant Garamond** (display) · **Italiana** (wordmark only) · **Manrope** (body/UI)
- Analytics: GA4 `G-78D06T2CLG`. Meta Pixel placeholder (no ID yet)
- Repo: `github.com/itsulla/MaisonMasque` · branch `master`

## Design tokens

```
cream      #FAF8F3    page bg
ivory      #F3EFE6    subtle hovers, featured cards
ink        #1A1714    primary text, dark sections
espresso   #2C2722    dark hover
walnut     #4A433A    secondary text
stone      #8A8279    tertiary text
sand       #E8E2D6    borders
gold       #C5A55A    decorative only (lines, fills, icons)
gold-deep  #876319    text-colour gold (WCAG AA on cream)
gold-light #D4BA7A    italic emphasis on ink bg
rose       #C9928A    product gradient
sage       #8FA68E    product gradient
```

**Rule:** `gold-deep` for any gold text. `gold` only for decoration. Never a solid-green "save" pill — use `.badge-save` (gold-deep outline).

### Typography

- `--font-display: "Cormorant Garamond", Georgia, serif` — all headings + display copy
- `--font-logo: "Italiana", "Cormorant Garamond", serif` — **only** the "MAISON MASQUE" wordmark + "MM" seal
- `--font-body: "Manrope", sans-serif` — everything else
- Italic display needs `font-weight: 500` to read equal to roman (rule already in `app.css`)
- Hero h1: `clamp(64px, 9.5vw, 112px)` with `-0.015em` tracking
- Label: 11px / 600 / uppercase / tracking 4px / `gold-deep`

### Voice

"ritual" not "routine" · "ceremony" · "veil" · "complimentary" (never "free") · Roman numerals I–V · footer sign-off "Curated in Hong Kong · Shipped with reverence"

## Catalogue (17 — source of truth: `app/lib/products.ts`)

| # | Handle | Retail |
|---|---|---:|
| Ritual I | `medicube-pdrn-gel-mask` | $22 |
| Ritual II | `medicube-wrapping-mask` | $26 |
| Ritual III | `abib-heartleaf-gummy-mask` | $30 |
| Ritual IV | `numbuzin-no3-pore-mask` | $22 |
| Ritual V | `skin1004-centella-sleeping-pack` | $23 |
| Mask | `medicube-pdrn-tension-mask` | $17.99 |
| Mask | `medicube-pdrn-caffeine-wrapping` | $17.99 |
| Elixir I | `medicube-pdrn-peptide-serum` | $24 |
| Elixir III | `medicube-pdrn-milky-toner` | $22 |
| Elixir | `anua-pdrn-ha-capsule-serum` | $23.99 |
| Elixir | `centellian24-madeca-pdrn` | $21.99 |
| Cleanse | `medicube-pdrn-whip-cleanser` | $18.99 |
| Cleanse | `mixsoon-bean-cleansing-oil` | $15.99 |
| Veil | `beauty-of-joseon-relief-sun` | $22 |
| Veil | `medicube-pdrn-sun-cream` | $19.99 |
| Bundle | `the-medicube-bundle` | $94 |
| Bundle | `the-complete-ritual` | $129 |

Plus the virtual `the-evening-ritual` bundle (composed client-side).

**Handle must match 4 places:** Shopify product · `app/lib/products.ts` · `shopifyCart.ts` VARIANT_MAP · `maison-dashboard/{data,competitors}.mjs`.

## Page structure

Homepage (8 sections): Hero · TrustBar · ◆ · FiveRituals · ◆ · Philosophy · ◆ · RitualGuide · ◆ · Subscription.

- **PDP** (`products.$handle.tsx`) → renders `ProductPage` + `ElixirsPromo` (all PDPs) + `MorningVeilPromo` (ritual PDPs only).
- **Quiz result** (`QuizResult.tsx`) → renders `ChooseYourRitual` below the recommendation.
- **Nav** — left: "The Rituals" (mega-menu: 5 rituals + 4 collections) · "The Practice". Right: "Subscribe" (`#subscription` anchor) · "Quiz". Mobile hamburger opens `MobileMenu`.
- **Subscribe & Save** on every PDP — default-selected toggle, `gid://shopify/SellingPlan/12358353207` (10% off every 2 months, "La Cérémonie" group, all 16 single-SKU products attached).

## Build + deploy

```bash
npm run build
npm run preview                                  # MiniOxygen locally
CI=1 npx shopify hydrogen deploy --force \
    --no-verify --token "$OXYGEN_DEPLOY_TOKEN"   # prod push
```

Deploy token lives in `maison-dashboard/.shopify-admin.env`, expires 2027-04.

**Do not touch:**

- `vite.config.ts` — `oxygen()` plugin from `@shopify/mini-oxygen/vite` (pinned at 3.0.6).
- `server.ts` — uses `createRequestHandler({build, mode, getLoadContext})` **options-object** form. Positional args break Vite tree-shaking.

## Ops dashboard — `mask.lekker.design`

Express + PM2 on VPS at `/home/muffinman/maison-dashboard/`. Not in the Hydrogen repo.

| Route | What |
|---|---|
| `/` | Margin matrix per SKU × market, cost breakdown, bundle economics |
| `/competitors` | Live scraper prices, 30-day sparklines (daily auto-refresh) |
| `/bulk` | AWB bulk-pricing scenarios (A: all bulk, B: starter singles, C: hybrid) |
| `/invest` | Interactive P&L calculator — sliders for spend, sell-through, ad eff, bulk %, horizon |
| `/oauth/shopify` | Admin API OAuth callback capture |

## Live commerce state

- **Shipping zones** (live on Shopify via `push-shipping-rates.mjs`):
  - HK: free always · SG/JP: $5 under $45 free · UAE: $6 under $45 · MY/TH/PH/UK: $7 under $55 · AU/NZ/CA/US: $9 under $65 · EU: $12 under $75 · RoW: $14.99 flat.
- **Selling plan** "La Cérémonie" has 4 plans; the 10%/2-month plan is the PDP default.
- **Brand images** live under `public/images/products/brand/<handle>/` — tracked in git, deployed to Oxygen CDN. Manifest in `app/lib/productMedia.ts`.
- **Shipping bar copy** in `ShippingBar.tsx` must stay aligned with the Shopify delivery profile.

## Unit economics (reference — see `/invest` for live numbers)

Constants in `maison-dashboard/data.mjs`:

- `PAYMENT_PCT = 0.039` (Stripe HK international blend)
- `PACKAGING_USD = 0.75`
- `DROP_OFF_SURCHARGE_USD = 0` (batch ≥5 parcels/day)
- `RETURNS_RESERVE_PCT = 0.015`
- `AD_SPEND_PCT = 0.15` (contribution-margin view only)
- `HKD_TO_USD = 0.12853`
- EU VAT is **inclusive**: `retail × vat / (100 + vat)`

## Known debt

- **Shopify Markets** — only HK configured. Add AU/UK/EU/ZA in admin → delete `currencyContext.tsx` hardcoded rates (AUD 1.55 / GBP 0.79 / EUR 0.92 / ZAR 18.2).
- **Storefront API publications** — Admin token lacks `write_publications`; 8 products + 3 smart collections aren't published to the Hydrogen sales channel. Reinstall the custom app with the scope to fix.
- **Legal pages** — drafted HTML in `maison-dashboard/policies-output/`; paste into Shopify Admin manually (API scope didn't include `write_legal_policies`).
- **Bundle photography** — Medicube Bundle + Complete Ritual use component stills as placeholders.
- **Meta Pixel ID** — placeholder; wire up when paid social launches.
- **_index.tsx description copy** — TODO comments mark the two description fields; update once the brand list is final.
- **UK VAT assumption** — `data.mjs` assumes E-Fulfill Y01 DDP covers HMRC remittance. **Verify in writing with E-Fulfill before scaling UK ads** — if false, every UK sale owes HMRC 20%.

## Conventions

- **Never destructive** (`push --force`, `reset --hard`, `-D`, skip hooks) without asking.
- **Commit before large refactors.** Preserve rollback.
- **Respect `prefers-reduced-motion`** on every new animation.
- **Keep `products.ts` synced** with Shopify + `data.mjs` + `VARIANT_MAP` + mega-menu in `Navigation.tsx`.
- **Mega-menu handles must exist** — `Navigation.tsx` has a comment warning; check with a curl sweep before shipping.
- **`gold-deep` for text, `gold` for decoration.**
- **Italiana exclusively** on "MAISON MASQUE" and the MM seal — nowhere else.
- **Hero reveal timeline is compressed** — last animation ends at 1.2s, CTAs clickable from t=0. Don't re-introduce the old 3-second choreography.

## Reference paths

| What | Where |
|---|---|
| Admin API write token | `maison-dashboard/.shopify-admin.env` |
| Storefront API read token | `app/lib/shopifyCart.ts:9` |
| Oxygen deploy JWT | same env file, long-lived |
| Brand-image manifest | `app/lib/productMedia.ts` |
| Competitor scraper | `maison-dashboard/competitors.mjs` (JSON-LD + Playwright fallback) |
| Shipping-zone pusher | `maison-dashboard/push-shipping-rates.mjs` |
| Sub-plan attacher | `maison-dashboard/attach-subscription-plans.mjs` |
| Price updater (Shopify) | `maison-dashboard/sync-price-fix.mjs` |
