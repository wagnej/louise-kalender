import { useMemo, useState } from 'react'
import type { ConnectionsGame as Config } from '../../types'

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

export function ConnectionsGame({ config, onComplete }: Props) {
  const answerMap = useMemo(() => {
    const map = new Map<string, string>()
    config.groups.forEach((g) => g.items.forEach((item) => map.set(item, g.label)))
    return map
  }, [config.groups])

  const [board, setBoard] = useState(() =>
    shuffle(config.groups.flatMap((g) => g.items)),
  )
  const [selected, setSelected] = useState<string[]>([])
  const [solved, setSolved] = useState<typeof config.groups>([])
  const [message, setMessage] = useState('')
  const [mistakes, setMistakes] = useState(0)

  function toggle(item: string) {
    setMessage('')
    setSelected((prev) => {
      if (prev.includes(item)) return prev.filter((x) => x !== item)
      if (prev.length >= 4) return prev
      return [...prev, item]
    })
  }

  function submit() {
    if (selected.length !== 4) {
      setMessage('Select exactly 4 items')
      return
    }

    const labels = selected.map((s) => answerMap.get(s))
    const allSame = labels.every((l) => l === labels[0])

    if (allSame) {
      const group = config.groups.find((g) => g.label === labels[0])!
      const nextSolved = [...solved, group]
      setSolved(nextSolved)
      setBoard((b) => b.filter((item) => !selected.includes(item)))
      setSelected([])
      setMessage(`Found: ${group.label}`)
      if (nextSolved.length === config.groups.length) {
        setTimeout(onComplete, 600)
      }
    } else {
      setMistakes((m) => m + 1)
      setMessage('Not a group — try a different four')
      setSelected([])
    }
  }

  return (
    <div>
      {solved.map((g) => (
        <div key={g.label} className={`connections-solved ${g.colour}`}>
          {g.label.toUpperCase()}
          <div style={{ fontWeight: 400, marginTop: 4, fontSize: '0.78rem' }}>
            {g.items.join(' · ')}
          </div>
        </div>
      ))}

      <div className="connections-board">
        {board.map((item) => (
          <button
            key={item}
            type="button"
            className={`connections-tile ${selected.includes(item) ? 'selected' : ''}`}
            onClick={() => toggle(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="btn-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={submit}
          disabled={selected.length !== 4}
        >
          Submit group
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setSelected([])}
        >
          Deselect
        </button>
      </div>

      <p className="game-feedback">
        {message}
        {mistakes > 0 && !message.includes('Found') && (
          <span> · Mistakes: {mistakes}</span>
        )}
      </p>
    </div>
  )
}
