import { useState, type FormEvent } from 'react'
import type { GameResult, MusicQuizGame as Config } from '../../types'

interface Props {
  config: Config
  onComplete: (result?: GameResult) => void
}

function normalise(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[!?.'']/g, '')
    .replace(/\s+/g, ' ')
}

export function MusicQuizGame({ config, onComplete }: Props) {
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [showHint, setShowHint] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = config.answers.some((a) => normalise(a) === normalise(guess))
    if (ok) {
      setMessage('That\'s the one!')
      setTimeout(onComplete, 500)
    } else {
      setMessage('Hmm, not that song — try again')
    }
  }

  return (
    <div>
      <div className="clue-box">“{config.clue}”</div>
      {config.audioUrl && (
        <p style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
          <a href={config.audioUrl} target="_blank" rel="noreferrer">
            Optional listen link
          </a>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          className="text-input"
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value)
            setMessage('')
          }}
          placeholder="Song title…"
          autoComplete="off"
        />
        <div className="btn-row">
          <button type="submit" className="btn btn-primary">
            Guess
          </button>
          {config.hint && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowHint(true)}
            >
              Hint
            </button>
          )}
        </div>
      </form>
      {showHint && config.hint && <p className="hint">{config.hint}</p>}
      <p className={`game-feedback ${message.includes('not') ? 'game-feedback--error' : ''}`}>
        {message}
      </p>
    </div>
  )
}
