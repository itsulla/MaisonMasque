import {products, type Product} from '~/lib/products';

// Gradient mapping by heroColor for card fallback backgrounds
const GRADIENT_MAP: Record<string, string> = {
  '#C9928A': 'from-rose/30 to-ivory',
  '#D4BA7A': 'from-gold/20 to-ivory',
  '#8FA68E': 'from-sage/30 to-ivory',
  '#C5A55A': 'from-gold/20 to-ivory',
};

export interface RitualInfo {
  number: string;
  numeral: string;
  name: string;
  theme: string;
  gradient: string;
  keyIngredient: string;
}

function toRitualInfo(p: Product): RitualInfo {
  return {
    number: p.ritualNumber ?? '',
    numeral: p.ritualNumber ?? '',
    name: p.ritualName,
    theme: p.description,
    gradient: GRADIENT_MAP[p.heroColor] ?? 'from-sand/30 to-ivory',
    keyIngredient: p.keyIngredient ?? '',
  };
}

export const ritualConfig: Record<string, RitualInfo> = Object.fromEntries(
  products
    .filter((p) => p.ritualNumber !== null)
    .map((p) => [p.handle, toRitualInfo(p)]),
);

export const RITUAL_ORDER: string[] = products
  .filter((p) => p.ritualNumber !== null)
  .map((p) => p.handle);

export function getRitualByHandle(handle: string): RitualInfo | null {
  return ritualConfig[handle] ?? null;
}
