import type { DayConfig, GiftConfig, GiftTier } from '../types'

function tierToGift(tier: GiftTier): GiftConfig & { levelLabel?: string; minScore: number } {
  const { minScore, levelLabel, ...gift } = tier
  return { ...gift, levelLabel, minScore }
}

/** Pick the best gift for a score, or the day's default gift. */
export function resolveGift(
  day: DayConfig,
  score?: number | null,
): GiftConfig & { levelLabel?: string; minScore?: number } {
  if (score == null || !day.giftTiers?.length) {
    return day.gift
  }

  const sorted = [...day.giftTiers].sort((a, b) => b.minScore - a.minScore)
  const match = sorted.find((tier) => score >= tier.minScore)
  if (!match) return day.gift

  return tierToGift(match)
}

/** Tiers sorted low → high for the level ladder UI */
export function giftTiersAscending(day: DayConfig): GiftTier[] {
  if (!day.giftTiers?.length) return []
  return [...day.giftTiers].sort((a, b) => a.minScore - b.minScore)
}
