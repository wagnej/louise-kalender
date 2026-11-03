import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GameRenderer } from '../components/games/GameRenderer'
import { GiftReveal } from '../components/gift/GiftReveal'
import { getDayConfig } from '../config/calendar'
import { useProgress } from '../hooks/useProgress'
import type { GameResult } from '../types'
import { isDayUnlockedByDate } from '../utils/date'
import { giftTiersAscending, resolveGift } from '../utils/gifts'

export function DayPage() {
  const { dayNumber } = useParams()
  const day = Number(dayNumber)
  const config = getDayConfig(day)
  const { isCompleted, completeDay, getScore, ready } = useProgress()
  const [justCompleted, setJustCompleted] = useState(false)
  const [sessionScore, setSessionScore] = useState<number | undefined>()

  const alreadyDone = ready && isCompleted(day)
  const showGift = alreadyDone || justCompleted
  const score = sessionScore ?? getScore(day)
  const gift = config ? resolveGift(config, score) : null

  const handleComplete = useCallback(
    (result?: GameResult) => {
      completeDay(day, result?.score)
      setSessionScore(result?.score)
      setJustCompleted(true)
    },
    [completeDay, day],
  )

  if (!config) {
    return (
      <div className="day-page">
        <Link to="/" className="back-link">
          ← Tillbaka till kalendern
        </Link>
        <div className="day-card locked-message">
          <h1>Dagen finns inte</h1>
          <p>Den luckan finns inte i den här kalendern.</p>
        </div>
      </div>
    )
  }

  if (!isDayUnlockedByDate(day)) {
    return (
      <div className="day-page">
        <Link to="/" className="back-link">
          ← Tillbaka till kalendern
        </Link>
        <div className="day-card locked-message">
          <h1>Fortfarande låst</h1>
          <p>
            Dag {day} öppnas den {day} december (Stockholmstid). Kom tillbaka
            då!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="day-page">
      <Link to="/" className="back-link">
        ← Tillbaka till kalendern
      </Link>

      <div className="day-card">
        {showGift && gift ? (
          <GiftReveal
            gift={gift}
            score={score}
            maxScore={config.giftTiers ? 10000 : undefined}
            levelLabel={gift.levelLabel}
            tiers={giftTiersAscending(config)}
          />
        ) : (
          <>
            <p className="day-label">Day {config.day}</p>
            <h1>{config.game.title}</h1>
            <p className="instructions">{config.game.instructions}</p>
            <GameRenderer game={config.game} onComplete={handleComplete} />
          </>
        )}
      </div>
    </div>
  )
}
