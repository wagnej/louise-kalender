import { useMemo, useState, type KeyboardEvent } from 'react'
import type { CrosswordGame as Config } from '../../types'

interface Props {
  config: Config
  onComplete: () => void
}

export function CrosswordGame({ config, onComplete }: Props) {
  const rows = config.solution.length
  const cols = config.solution[0]?.length ?? 0

  const [grid, setGrid] = useState<string[][]>(() =>
    config.solution.map((row) =>
      row.split('').map((ch) => (ch === '#' ? '#' : '')),
    ),
  )
  const [active, setActive] = useState<{ r: number; c: number } | null>(null)
  const [message, setMessage] = useState('')

  const isBlocked = (r: number, c: number) => config.solution[r][c] === '#'

  const filledCorrect = useMemo(() => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const sol = config.solution[r][c]
        if (sol === '#') continue
        if (grid[r][c].toUpperCase() !== sol.toUpperCase()) return false
      }
    }
    return true
  }, [cols, config.solution, grid, rows])

  function typeLetter(letter: string) {
    if (!active) return
    const { r, c } = active
    if (isBlocked(r, c)) return

    setGrid((g) => {
      const next = g.map((row) => [...row])
      next[r][c] = letter.toUpperCase()
      return next
    })
    setMessage('')

    // Move to next open cell in row
    for (let nc = c + 1; nc < cols; nc++) {
      if (!isBlocked(r, nc)) {
        setActive({ r, c: nc })
        return
      }
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!active) return
    if (e.key === 'Backspace') {
      e.preventDefault()
      setGrid((g) => {
        const next = g.map((row) => [...row])
        next[active.r][active.c] = ''
        return next
      })
      return
    }
    if (/^[a-zA-ZåäöÅÄÖ]$/.test(e.key)) {
      e.preventDefault()
      typeLetter(e.key)
    }
  }

  function check() {
    if (filledCorrect) {
      setMessage('Crossword complete!')
      setTimeout(onComplete, 500)
    } else {
      setMessage('Not quite finished — keep going')
    }
  }

  return (
    <div onKeyDown={onKeyDown} tabIndex={0} style={{ outline: 'none' }}>
      <div
        className="crossword-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 2.2rem)` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            if (isBlocked(r, c)) {
              return <div key={`${r}-${c}`} className="crossword-cell blocked" />
            }
            const num = config.numbers[`${r}-${c}`]
            const isActive = active?.r === r && active?.c === c
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={`crossword-cell ${isActive ? 'active' : ''}`}
                onClick={() => setActive({ r, c })}
              >
                {num != null && <span className="crossword-num">{num}</span>}
                {cell}
              </button>
            )
          }),
        )}
      </div>

      <div className="crossword-clues">
        <div>
          <h4>Across</h4>
          <ul>
            {config.clues.across.map((clue) => (
              <li key={`a-${clue.number}`}>
                <strong>{clue.number}.</strong> {clue.clue}
              </li>
            ))}
          </ul>
        </div>
        {config.clues.down.length > 0 && (
          <div>
            <h4>Down</h4>
            <ul>
              {config.clues.down.map((clue) => (
                <li key={`d-${clue.number}`}>
                  <strong>{clue.number}.</strong> {clue.clue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={check}>
          Check crossword
        </button>
      </div>
      <p className={`game-feedback ${message.includes('Not') ? 'game-feedback--error' : ''}`}>
        {message || (active ? 'Type letters on your keyboard' : 'Tap a cell to start')}
      </p>
    </div>
  )
}
