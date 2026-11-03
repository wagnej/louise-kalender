import { motion } from 'framer-motion'
import { calendarConfig } from '../../config/calendar'
import type { GiftConfig, GiftRewardItem, GiftTier } from '../../types'

interface Props {
  gift: GiftConfig & { levelLabel?: string; minScore?: number }
  score?: number
  maxScore?: number
  levelLabel?: string
  /** All score tiers for this day (to show the ladder) */
  tiers?: GiftTier[]
}

function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

function RewardRow({
  items,
  compact = false,
}: {
  items: GiftRewardItem[]
  compact?: boolean
}) {
  const expanded = items.flatMap((item) =>
    Array.from({ length: Math.max(1, item.count ?? 1) }, (_, i) => ({
      ...item,
      key: `${item.image}-${i}`,
    })),
  )

  return (
    <div className={`gift-reward-row${compact ? ' gift-reward-row--compact' : ''}`}>
      {expanded.map((item) => (
        <figure key={item.key} className="gift-reward-item">
          <img src={assetUrl(item.image)} alt={item.label ?? ''} />
          {!compact && item.label ? <figcaption>{item.label}</figcaption> : null}
        </figure>
      ))}
    </div>
  )
}

export function GiftReveal({
  gift,
  score,
  maxScore,
  levelLabel,
  tiers = [],
}: Props) {
  const imageSrc = gift.image ? assetUrl(gift.image) : null
  const unlockedMin = gift.minScore ?? 0
  const label = levelLabel ?? gift.levelLabel

  return (
    <motion.div
      className="gift-reveal"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {label && (
        <p className="gift-level" role="status">
          {label}
          {score != null && maxScore != null
            ? ` · ${score.toLocaleString('sv-SE')} / ${maxScore.toLocaleString('sv-SE')} poäng`
            : null}
        </p>
      )}

      <h2 className="sparkle-text">{gift.title}</h2>
      <p className="gift-message">{gift.message}</p>

      {gift.rewardItems && gift.rewardItems.length > 0 && (
        <div className="gift-reward-showcase" aria-label="Din present">
          <p className="gift-reward-heading">Du fick</p>
          <RewardRow items={gift.rewardItems} />
        </div>
      )}

      {imageSrc && (
        <motion.img
          className="gift-image"
          src={imageSrc}
          alt={gift.title}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        />
      )}

      {tiers.length > 0 && (
        <div className="gift-tier-ladder" aria-label="Presentnivåer">
          <p className="gift-reward-heading">Nivåer</p>
          <ol className="gift-tier-list">
            {tiers.map((tier) => {
              const unlocked = score != null && score >= tier.minScore
              const current = tier.minScore === unlockedMin && unlocked
              return (
                <li
                  key={tier.minScore}
                  className={`gift-tier-card${unlocked ? ' is-unlocked' : ' is-locked'}${current ? ' is-current' : ''}`}
                >
                  <div className="gift-tier-card-top">
                    <span className="gift-tier-card-label">
                      {tier.levelLabel ?? `Nivå`}
                    </span>
                    <span className="gift-tier-card-status">
                      {current ? 'Din nivå' : unlocked ? 'Upplåst' : 'Låst'}
                    </span>
                  </div>
                  {tier.rewardItems && tier.rewardItems.length > 0 ? (
                    <RewardRow items={tier.rewardItems} compact />
                  ) : null}
                  {tier.physicalGift ? (
                    <p className="gift-tier-card-gift">{tier.physicalGift}</p>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {gift.link && (
        <a
          className="btn btn-primary gift-link"
          href={gift.link.url}
          target="_blank"
          rel="noreferrer"
        >
          {gift.link.label}
        </a>
      )}

      <p className="gift-signature">— {calendarConfig.senderName}</p>
    </motion.div>
  )
}
