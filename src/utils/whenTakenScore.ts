/** When Taken scoring — place and date each worth up to 5000 (total 10000). */

export const WHEN_TAKEN_MAX_SCORE = 10000
const HALF = WHEN_TAKEN_MAX_SCORE / 2

/**
 * Location: steep falloff — you need to be close.
 * ~full at 0 km, ~half around 30 km, little left past ~100 km.
 */
export function scoreLocation(km: number): number {
  return Math.round(HALF * Math.exp(-km / 30))
}

/**
 * Date: exact month = full; drops fast per month off.
 * ~half at 1 month wrong, almost gone by ~4–5 months.
 */
export function scoreDate(monthDiff: number): number {
  return Math.round(HALF * Math.exp(-monthDiff / 1.4))
}

export function formatWhenTakenScore(total: number): string {
  return `${total.toLocaleString('sv-SE')} / ${WHEN_TAKEN_MAX_SCORE.toLocaleString('sv-SE')}`
}
