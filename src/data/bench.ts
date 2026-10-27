/**
 * The measurements the site quotes: the means of bench/phase-10-fresh.md in
 * the product repository, section "The release candidate on the purged box"
 * (v0.1.0, three runs each). Change them only together with that file; never
 * type a number here that is not in it. The home and the features page read
 * them from here.
 */
export type MeasureKey = 'cachedMany' | 'cachedOne' | 'static' | 'browsers' | 'uncached';

export const MEASURES: {key: MeasureKey; rps: number; reference?: boolean}[] = [
  {key: 'cachedMany', rps: 9710},
  {key: 'cachedOne', rps: 6347},
  {key: 'static', rps: 15478},
  {key: 'browsers', rps: 9641},
  {key: 'uncached', rps: 6.82, reference: true},
];

/** A figure as the tables print it: grouped, two decimals under 100. */
export function formatRps(n: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: n < 100 ? 2 : 0,
    // Italian leaves four-digit numbers ungrouped by default; the column
    // reads better when 9.710 and 15.478 look alike.
    useGrouping: 'always',
  } as unknown as Intl.NumberFormatOptions).format(n);
}
