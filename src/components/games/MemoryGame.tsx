import { useEffect, useMemo, useState } from 'react'
import type { MemoryGame as Config } from '../../types'

interface Card {
  id: number
  face: string
  flipped: boolean
  matched: boolean
}

interface Props {
  config: Config
  onComplete: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function MemoryGame({ config, onComplete }: Props) {
  const initial = useMemo(() => {
    const doubled = config.cards.flatMap((face, i) => [
      { id: i * 2, face, flipped: false, matched: false },
      { id: i * 2 + 1, face, flipped: false, matched: false },
    ])
    return shuffle(doubled)
  }, [config.cards])

  const [cards, setCards] = useState<Card[]>(initial)
  const [picked, setPicked] = useState<number[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      const t = setTimeout(onComplete, 500)
      return () => clearTimeout(t)
    }
  }, [cards, onComplete])

  function flip(index: number) {
    if (busy) return
    const card = cards[index]
    if (card.flipped || card.matched) return
    if (picked.length >= 2) return

    const next = cards.map((c, i) => (i === index ? { ...c, flipped: true } : c))
    const nextPicked = [...picked, index]
    setCards(next)
    setPicked(nextPicked)

    if (nextPicked.length === 2) {
      const [a, b] = nextPicked
      if (next[a].face === next[b].face) {
        setBusy(true)
        setTimeout(() => {
          setCards((cur) =>
            cur.map((c, i) =>
              i === a || i === b ? { ...c, matched: true } : c,
            ),
          )
          setPicked([])
          setBusy(false)
        }, 350)
      } else {
        setBusy(true)
        setTimeout(() => {
          setCards((cur) =>
            cur.map((c, i) =>
              i === a || i === b ? { ...c, flipped: false } : c,
            ),
          )
          setPicked([])
          setBusy(false)
        }, 750)
      }
    }
  }

  return (
    <div
      className="memory-grid"
      style={{
        gridTemplateColumns: `repeat(${Math.min(4, Math.ceil(Math.sqrt(cards.length * 2)))}, 1fr)`,
      }}
    >
      {cards.map((card, i) => (
        <button
          key={card.id}
          type="button"
          className={`memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
          onClick={() => flip(i)}
          disabled={card.matched}
          aria-label={card.flipped || card.matched ? card.face : 'Hidden card'}
        >
          {card.flipped || card.matched ? card.face : '❄'}
        </button>
      ))}
    </div>
  )
}
