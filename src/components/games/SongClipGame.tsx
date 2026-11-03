import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { GameResult, SongClipGame as Config } from '../../types'

interface Props {
  config: Config
  onComplete: (result?: GameResult) => void
}

function normalise(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[!?.'",]/g, '')
    .replace(/\s+/g, ' ')
}

function scoreForStep(step: number, steps: number, maxScore: number) {
  if (steps <= 1) return maxScore
  return Math.round(maxScore * ((steps - step) / steps))
}

export function SongClipGame({ config, onComplete }: Props) {
  const clips = config.clipSeconds
  const maxScore = config.maxScore ?? 5000
  const audioSrc = `${import.meta.env.BASE_URL}${config.audio.replace(/^\//, '')}`

  const [step, setStep] = useState(0)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [playing, setPlaying] = useState(false)
  const [solved, setSolved] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const clipEndRef = useRef(clips[0])
  const stopTimerRef = useRef<number | null>(null)

  clipEndRef.current = clips[Math.min(step, clips.length - 1)]

  useEffect(() => {
    const audio = new Audio(audioSrc)
    audio.preload = 'auto'
    audioRef.current = audio

    const onTimeUpdate = () => {
      if (audio.currentTime >= clipEndRef.current) {
        stopClip()
      }
    }
    const onEnded = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)

    return () => {
      if (stopTimerRef.current != null) window.clearTimeout(stopTimerRef.current)
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
    // stopClip is stable enough via refs for this mount lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSrc])

  function stopClip() {
    if (stopTimerRef.current != null) {
      window.clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setPlaying(false)
  }

  async function playClip() {
    const audio = audioRef.current
    if (!audio || solved) return
    try {
      if (stopTimerRef.current != null) window.clearTimeout(stopTimerRef.current)
      audio.currentTime = 0
      setPlaying(true)
      await audio.play()
      // Backup for very short clips (timeupdate can miss 0.1s)
      const endMs = Math.max(40, clipEndRef.current * 1000 + 30)
      stopTimerRef.current = window.setTimeout(() => stopClip(), endMs)
    } catch {
      setPlaying(false)
      setMessage('Kunde inte spela upp — tryck igen')
    }
  }

  function hearMore() {
    if (solved || step >= clips.length - 1) return
    stopClip()
    setStep((s) => s + 1)
    setMessage('Nu hör du lite mer — men poängen blir lägre')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (solved) return

    const ok = config.answers.some((a) => normalise(a) === normalise(guess))
    if (!ok) {
      setMessage('Inte den låten — gissa igen eller hör mer')
      return
    }

    stopClip()
    const score = scoreForStep(step, clips.length, maxScore)
    setFinalScore(score)
    setSolved(true)
    setMessage('Rätt!')
  }

  function openGift() {
    if (finalScore == null) return
    onComplete({ score: finalScore, maxScore })
  }

  const clipLen = clips[step]
  const potential = scoreForStep(step, clips.length, maxScore)
  const canHearMore = !solved && step < clips.length - 1

  return (
    <div className="song-clip">
      <div className="song-clip-meter" aria-hidden>
        {clips.map((sec, i) => (
          <span
            key={sec}
            className={`song-clip-step${i <= step ? ' is-active' : ''}${i === step ? ' is-current' : ''}`}
            title={`${sec}s`}
          />
        ))}
      </div>

      <p className="song-clip-status">
        {solved
          ? `Du klarade det efter ${clipLen}s`
          : `Du hör de första ${clipLen}s · max ${potential.toLocaleString('sv-SE')} poäng`}
      </p>

      <div className="song-clip-controls">
        <button
          type="button"
          className="btn btn-primary"
          onClick={playing ? stopClip : playClip}
          disabled={solved}
        >
          {playing ? 'Stoppa' : 'Spela tonen'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={hearMore}
          disabled={!canHearMore}
        >
          Hör mer (−poäng)
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="text-input"
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value)
            if (!solved) setMessage('')
          }}
          placeholder="Låttitel…"
          autoComplete="off"
          disabled={solved}
        />
        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={solved}>
            Gissa
          </button>
          {config.hint && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowHint(true)}
              disabled={solved}
            >
              Tips
            </button>
          )}
        </div>
      </form>

      {showHint && config.hint && <p className="hint">{config.hint}</p>}

      <p
        className={`game-feedback${message.includes('Inte') || message.includes('Kunde') ? ' game-feedback--error' : ''}`}
      >
        {message}
      </p>

      {solved && finalScore != null && (
        <div className="song-clip-result" role="status">
          <p>
            Poäng:{' '}
            <strong>
              {finalScore.toLocaleString('sv-SE')} / {maxScore.toLocaleString('sv-SE')}
            </strong>
          </p>
          <button type="button" className="btn btn-primary" onClick={openGift}>
            Öppna present
          </button>
        </div>
      )}
    </div>
  )
}
