import { useState, type FormEvent } from 'react'
import type { EmojiRiddleGame as Config } from '../../types'

interface Props {
  config: Config
  onComplete: () => void
}

function normalise(s: string) {
  return s.trim().toLowerCase().replace(/[!?.']/g, '')
}

export function EmojiRiddleGame({ config, onComplete }: Props) {
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [showHint, setShowHint] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = config.answers.some((a) => normalise(a) === normalise(guess))
    if (ok) {
      setMessage('Yes!')
      setTimeout(onComplete, 500)
    } else {
      setMessage('Not quite — try again')
    }
  }

  return (
    <div>
      <div className="emoji-display" aria-label="Emoji clue">
        {config.emojis}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="text-input"
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value)
            setMessage('')
          }}
          placeholder="Your answer…"
          autoComplete="off"
          aria-label="Your answer"
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
      <p className={`game-feedback ${message && message !== 'Yes!' ? 'game-feedback--error' : ''}`}>
        {message}
      </p>
    </div>
  )
}
