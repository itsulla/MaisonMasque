export const ritualConfig: Record<
  string,
  {
    number: string;
    numeral: string;
    name: string;
    theme: string;
    gradient: string;
  }
> = {
  'biodance-collagen': {
    number: '1',
    numeral: 'I',
    name: 'Restore',
    theme: 'Overnight hydrogel, turns transparent as collagen absorbs',
    gradient: 'from-rose/30 to-ivory',
  },
  'torriden-dive-in': {
    number: '2',
    numeral: 'II',
    name: 'Drench',
    theme: '5 molecular weights of HA, vegan cellulose',
    gradient: 'from-sage/30 to-ivory',
  },
  'abib-heartleaf': {
    number: '3',
    numeral: 'III',
    name: 'Calm',
    theme: 'Microfibre gummy seal, heartleaf soothes redness',
    gradient: 'from-sage/25 to-ivory',
  },
  'mediheal-nmf': {
    number: '4',
    numeral: 'IV',
    name: 'Replenish',
    theme: '2 billion sold, NMF floods parched skin',
    gradient: 'from-rose/25 to-ivory',
  },
  'numbuzin-no3': {
    number: '5',
    numeral: 'V',
    name: 'Illuminate',
    theme: 'Galactomyces ferment for glass skin, gentle daily use',
    gradient: 'from-gold/20 to-ivory',
  },
};

export const RITUAL_ORDER: string[] = [
  'biodance-collagen',
  'torriden-dive-in',
  'abib-heartleaf',
  'mediheal-nmf',
  'numbuzin-no3',
];

export function getRitualByHandle(handle: string) {
  return ritualConfig[handle] ?? null;
}
