import { useState, type FormEvent } from 'react'
import type { PhotoGuessGame as Config } from '../../types'

interface Props {
  config: Config
  onComplete: () => void
}

function normalise(s: string) {
  return s.trim().toLowerCase().replace(/[!?.']/g, '')
}

export function PhotoGuessGame({ config, onComplete }: Props) {
  const startBlur = config.startBlur ?? 26
  const [guess, setGuess] = useState('')
  const [blur, setBlur] = useState(startBlur)
  const [message, setMessage] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [solved, setSolved] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = config.answers.some((a) => normalise(a) === normalise(guess))
    if (ok) {
      setBlur(0)
      setSolved(true)
      setMessage('You see it!')
      setTimeout(onComplete, 700)
    } else {
      setBlur((b) => Math.max(0, b - 5))
      setMessage('Not yet — the picture clears a little…')
    }
  }

  // Vite base path aware asset URL
  const src = `${import.meta.env.BASE_URL}${config.image.replace(/^\//, '')}`

  return (
    <div>
      <div className="photo-guess-frame">
        <img
          src={src}
          alt={solved ? 'Revealed photo' : 'Blurred mystery photo'}
          style={{ filter: `blur(${blur}px)` }}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="text-input"
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value)
            setMessage('')
          }}
          placeholder="What is it?"
          autoComplete="off"
          disabled={solved}
        />
        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={solved}>
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
      <p className="game-feedback">{message}</p>
    </div>
  )
}
