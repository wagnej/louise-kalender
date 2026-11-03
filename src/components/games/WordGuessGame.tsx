import { useCallback, useEffect, useMemo, useState } from 'react'
import type { WordGuessGame as WordGuessConfig } from '../../types'

type CellStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent'

interface Props {
  config: WordGuessConfig
  onComplete: () => void
}

function scoreGuess(guess: string, answer: string): CellStatus[] {
  const result: CellStatus[] = Array(answer.length).fill('absent')
  const remaining = answer.split('')

  // First pass: exact matches
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct'
      remaining[i] = ''
    }
  }

  // Second pass: present letters
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue
    const idx = remaining.indexOf(guess[i])
    if (idx !== -1) {
      result[i] = 'present'
      remaining[idx] = ''
    }
  }

  return result
}

const ROWS_KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

export function WordGuessGame({ config, onComplete }: Props) {
  const answer = config.word.toUpperCase()
  const maxAttempts = config.maxAttempts ?? 6
  const len = answer.length

  const [guesses, setGuesses] = useState<string[]>([])
  const [statuses, setStatuses] = useState<CellStatus[][]>([])
  const [current, setCurrent] = useState('')
  const [message, setMessage] = useState('')
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)

  const keyColors = useMemo(() => {
    const map: Record<string, CellStatus> = {}
    guesses.forEach((g, gi) => {
      statuses[gi]?.forEach((s, i) => {
        const letter = g[i]
        const prev = map[letter]
        if (s === 'correct' || (s === 'present' && prev !== 'correct') || !prev) {
          map[letter] = s
        }
      })
    })
    return map
  }, [guesses, statuses])

  const submit = useCallback(() => {
    if (won || lost) return
    if (current.length !== len) {
      setMessage(`Need ${len} letters`)
      return
    }

    const scored = scoreGuess(current, answer)
    const nextGuesses = [...guesses, current]
    const nextStatuses = [...statuses, scored]
    setGuesses(nextGuesses)
    setStatuses(nextStatuses)
    setCurrent('')
    setMessage('')

    if (current === answer) {
      setWon(true)
      setMessage('Wonderful!')
      setTimeout(onComplete, 700)
      return
    }

    if (nextGuesses.length >= maxAttempts) {
      setLost(true)
      setMessage(`The word was ${answer}. Try again!`)
    }
  }, [answer, current, guesses, len, lost, maxAttempts, onComplete, statuses, won])

  const onKey = useCallback(
    (key: string) => {
      if (won || lost) return
      setMessage('')
      if (key === 'ENTER') {
        submit()
        return
      }
      if (key === '⌫' || key === 'BACKSPACE') {
        setCurrent((c) => c.slice(0, -1))
        return
      }
      if (/^[A-ZÅÄÖ]$/i.test(key) && current.length < len) {
        setCurrent((c) => c + key.toUpperCase())
      }
    },
    [current.length, len, lost, submit, won],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onKey('ENTER')
      else if (e.key === 'Backspace') onKey('⌫')
      else if (e.key.length === 1) onKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onKey])

  const rows = Array.from({ length: maxAttempts }, (_, i) => {
    if (i < guesses.length) return { letters: guesses[i], status: statuses[i] }
    if (i === guesses.length) return { letters: current.padEnd(len), status: null }
    return { letters: ' '.repeat(len), status: null }
  })

  return (
    <div>
      <div className="word-grid" style={{ gridTemplateRows: `repeat(${maxAttempts}, auto)` }}>
        {rows.map((row, ri) => (
          <div key={ri} className="word-row" style={{ gridTemplateColumns: `repeat(${len}, auto)` }}>
            {Array.from({ length: len }, (_, ci) => {
              const letter = row.letters[ci]?.trim() ?? ''
              const status = row.status?.[ci]
              const cls = [
                'word-cell',
                letter && !status ? 'filled' : '',
                status ?? '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <div key={ci} className={cls}>
                  {letter}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="keyboard">
        {ROWS_KEYS.map((row) => (
          <div key={row.join('')} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                className={`key ${key.length > 1 ? 'wide' : ''} ${keyColors[key] ?? ''}`}
                onClick={() => onKey(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {lost && (
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setGuesses([])
              setStatuses([])
              setCurrent('')
              setLost(false)
              setMessage('')
            }}
          >
            Try again
          </button>
        </div>
      )}

      <p className={`game-feedback ${message && !won ? 'game-feedback--error' : ''}`}>
        {message}
      </p>
    </div>
  )
}
