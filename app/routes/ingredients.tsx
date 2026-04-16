import {type MetaFunction} from '@remix-run/react';
import {Link} from '@remix-run/react';
import {SectionLabel} from '~/components/shared/SectionLabel';
import {canonicalLink} from '~/lib/seo';

export const meta: MetaFunction = ({location}) => [
  {title: 'Ingredient Glossary | Maison Masque'},
  {name: 'description', content: 'Every hero ingredient in the Maison Masque collection — what it is, what it does, and which products contain it.'},
  canonicalLink(location.pathname),
];

interface IngredientEntry {
  name: string;
  aka?: string;
  what: string;
  why: string;
  found: string[];
}

const INGREDIENTS: IngredientEntry[] = [
  {
    name: 'PDRN (Polydeoxyribonucleotide)',
    aka: 'Sodium DNA, c-PDRN\u00AE, Salmon DNA',
    what: 'A bioactive compound derived from salmon DNA, widely used in Korean dermatology clinics. Low-molecular PDRN is absorbed into the skin to stimulate natural repair processes.',
    why: 'Supports collagen and elastin production, improves skin elasticity and firmness, helps restore a healthy barrier function.',
    found: ['Medicube PDRN Pink Collagen Gel Mask', 'Medicube PDRN Pink Peptide Serum', 'CELDYQU\u00C9 PDRN 12% + EGF Serum', 'Medicube PDRN Milky Toner', 'Rejuran Turnover Ampoule', 'Anua PDRN HA 100 Cream'],
  },
  {
    name: 'Hyaluronic Acid',
    aka: 'Sodium Hyaluronate, HA',
    what: 'A humectant naturally present in the skin that holds up to 1,000\u00D7 its weight in water. Multi-molecular HA complexes deliver moisture at multiple depths.',
    why: 'Intense hydration, plumps the skin, reduces the appearance of fine lines, and improves skin texture.',
    found: ['Anua PDRN HA 100 Cream (10 types of HA)', 'SKIN1004 Hyalu-Cica Sleeping Pack (triple HA)', 'Rejuran Turnover Ampoule'],
  },
  {
    name: 'Heartleaf (Houttuynia Cordata)',
    aka: 'Dokudami, Fish Mint',
    what: 'A traditional East Asian herb with natural soothing and antibacterial properties. Used for centuries in Korean folk medicine for irritated, sensitive skin.',
    why: 'Calms redness and irritation, soothes sensitive or acne-prone skin, supports the skin\u2019s natural barrier.',
    found: ['Abib Heartleaf Gummy Sheet Mask'],
  },
  {
    name: 'Centella Asiatica',
    aka: 'Cica, Tiger Grass, Madecassoside, Asiaticoside',
    what: 'A medicinal herb sourced from Madagascar (in SKIN1004\u2019s case). Contains four key actives: asiaticoside, asiatic acid, madecassic acid, and madecassoside.',
    why: 'Calms inflammation, supports wound healing, strengthens the skin barrier, and provides antioxidant protection.',
    found: ['SKIN1004 Madagascar Centella Hyalu-Cica Sleeping Pack (40.9%)', 'Abib Heartleaf Gummy Sheet Mask (Micro TECA cica complex)'],
  },
  {
    name: 'Collagen',
    aka: 'Hydrolyzed Collagen, Low-Molecular Collagen',
    what: 'A structural protein that gives skin its firmness and elasticity. Low-molecular collagen is broken down to improve absorption through the skin\u2019s surface.',
    why: 'Improves skin elasticity, hydration, and firmness. Supports a plumper, more bouncy texture.',
    found: ['Medicube PDRN Pink Collagen Gel Mask', 'Medicube Collagen Night Wrapping Mask', 'Anua PDRN HA 100 Cream'],
  },
  {
    name: 'Niacinamide',
    aka: 'Vitamin B3',
    what: 'A water-soluble vitamin that works across multiple skin concerns simultaneously. One of the most well-studied actives in skincare.',
    why: 'Brightens skin tone, reduces the appearance of pores, strengthens the skin barrier, and reduces the look of irritated skin.',
    found: ['Medicube PDRN Pink Collagen Gel Mask', 'Medicube PDRN Pink Peptide Serum', 'Medicube PDRN Milky Toner', 'CELDYQU\u00C9 PDRN 12% + EGF Serum (20,000 ppm)'],
  },
  {
    name: 'EGF (Epidermal Growth Factor)',
    aka: 'rh-Oligopeptide-1',
    what: 'A growth factor that supports skin cell renewal and regeneration. In skincare, recombinant human EGF (rh-EGF) is used to support the natural turnover process.',
    why: 'Supports firmness, improves skin density, and accelerates recovery after procedures.',
    found: ['CELDYQU\u00C9 PDRN 12% + EGF Serum'],
  },
  {
    name: 'Ceramide NP',
    aka: 'Ceramides',
    what: 'A lipid naturally found in the skin\u2019s moisture barrier. Ceramides fill the spaces between skin cells, preventing water loss.',
    why: 'Maintains the skin\u2019s natural barrier function, prevents moisture loss, and supports healthy skin structure.',
    found: ['Medicube Collagen Night Wrapping Mask', 'SKIN1004 Hyalu-Cica Sleeping Pack', 'CELDYQU\u00C9 PDRN 12% + EGF Serum'],
  },
  {
    name: 'Adenosine',
    aka: undefined,
    what: 'A naturally occurring nucleoside present in every cell. In skincare, it\u2019s classified as a functional anti-wrinkle ingredient under Korean cosmetics regulation (KFDA).',
    why: 'Smooths fine lines and wrinkles, supports healthy skin structure and renewal.',
    found: ['Medicube Collagen Night Wrapping Mask', 'Medicube PDRN Pink Peptide Serum', 'Beauty of Joseon Relief Sun'],
  },
  {
    name: 'Bifida Ferment Lysate',
    aka: 'Fermented Probiotic Extract',
    what: 'A fermented lysate derived from Bifida bacteria. Fermentation produces bioactive compounds that support skin strength and resilience.',
    why: 'Boosts skin strength, enhances texture and tone, and provides long-lasting hydration.',
    found: ['Numbuzin No.3 Tingle-Pore Softening Sheet Mask (42%)'],
  },
  {
    name: 'Volufiline\u2122',
    aka: undefined,
    what: 'A trademarked cosmetic active based on Anemarrhena asphodeloides root extract combined with squalane. Developed to provide a volumising effect on the skin.',
    why: 'Adds volume to aging or thinning skin, improves elasticity and firmness.',
    found: ['CELDYQU\u00C9 PDRN 12% + EGF Serum'],
  },
  {
    name: 'Rice Extract',
    aka: 'Oryza Sativa Extract',
    what: 'A traditional Korean beauty staple dating back to the Joseon dynasty. Rice water is rich in vitamins, amino acids, and minerals.',
    why: 'Moisturises and brightens the skin, delivering the traditional "rice water glow" prized in Korean beauty heritage.',
    found: ['Beauty of Joseon Relief Sun (30% Oryza Sativa Extract)'],
  },
  {
    name: 'Melatonin',
    aka: undefined,
    what: 'An antioxidant hormone most commonly associated with sleep regulation, but also used topically as a potent free-radical scavenger.',
    why: 'Increases antioxidant levels to help restore and improve skin tone while combating signs of aging.',
    found: ['SKIN1004 Madagascar Centella Hyalu-Cica Sleeping Pack'],
  },
  {
    name: 'c-PDRN\u00AE + DOT\u00AE Technology',
    aka: 'Cosmetic-PDRN, Rejuran\u2019s proprietary delivery system',
    what: 'Rejuran\u2019s patented cosmetic PDRN platform, clinically optimised with proprietary DOT\u00AE (Delivery Optimising Technology) for superior absorption and biocompatibility.',
    why: 'The highest level of c-PDRN\u00AE available in Rejuran\u2019s consumer line. Supports natural collagen production and boosts moisture.',
    found: ['Rejuran Healer Turnover Ampoule'],
  },
];

export default function IngredientsPage() {
  return (
    <div className="py-24 lg:py-32 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-px h-[60px] bg-sand mx-auto mb-8" aria-hidden="true" />
        <SectionLabel>Discover</SectionLabel>
        <h1 className="font-display text-[clamp(32px,5vw,52px)] mt-4">
          Ingredient Glossary
        </h1>
        <div className="w-[60px] h-px bg-gold mx-auto mt-5" aria-hidden="true" />
        <p className="text-[15px] text-walnut mt-8 leading-[1.8] max-w-xl mx-auto">
          Every hero ingredient in the Maison Masque collection &mdash; what it is,
          what it does, and which products contain it. All claims are sourced from
          the brands themselves.
        </p>
      </div>

      <div className="space-y-0 border-t border-sand">
        {INGREDIENTS.map((ing) => (
          <details key={ing.name} className="group border-b border-sand">
            <summary className="flex items-baseline justify-between cursor-pointer list-none select-none py-6 px-2">
              <div className="pr-6">
                <span className="font-display text-[clamp(16px,2vw,20px)] text-ink">
                  {ing.name}
                </span>
                {ing.aka && (
                  <span className="block text-[12px] text-stone mt-0.5">
                    Also known as: {ing.aka}
                  </span>
                )}
              </div>
              <span
                className="text-gold font-display text-xl flex-shrink-0 transition-transform duration-300 group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className="px-2 pb-6 space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-[3px] text-stone font-semibold font-body mb-1">
                  What it is
                </p>
                <p className="text-[14px] text-walnut leading-relaxed">{ing.what}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[3px] text-stone font-semibold font-body mb-1">
                  Why we use it
                </p>
                <p className="text-[14px] text-walnut leading-relaxed">{ing.why}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[3px] text-stone font-semibold font-body mb-1">
                  Found in
                </p>
                <ul className="space-y-1">
                  {ing.found.map((product) => (
                    <li key={product} className="text-[13px] text-walnut flex items-start gap-2">
                      <span className="text-gold mt-0.5 flex-shrink-0">&middot;</span>
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="text-center mt-16 border-t border-sand pt-10">
        <p className="text-[14px] text-walnut">
          Full INCI lists are available on each product&apos;s detail page.
        </p>
        <Link
          to="/collections/all"
          className="inline-block mt-4 text-[11px] uppercase tracking-[3px] font-semibold font-body text-gold hover:text-ink transition-colors"
        >
          Browse all products
        </Link>
      </div>
    </div>
  );
}
