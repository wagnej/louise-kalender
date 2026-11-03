import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { calendarConfig } from '../../config/calendar'

interface MusicContextValue {
  playing: boolean
  muted: boolean
  ready: boolean
  /** Call after a user gesture (opening the letter) to start playback */
  start: () => void
  toggleMute: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function useBackgroundMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useBackgroundMusic must be used within BackgroundMusicProvider')
  return ctx
}

function resolveSrc(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const audio = new Audio(resolveSrc(calendarConfig.lock.musicSrc))
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = calendarConfig.lock.musicVolume ?? 0.45
    audioRef.current = audio

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('canplaythrough', () => setReady(true), { once: true })

    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audioRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    void audio.play().catch(() => {
      // Autoplay blocked or missing file — UI still works
    })
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const nextMuted = !audio.muted
    audio.muted = nextMuted
    setMuted(nextMuted)
    if (!nextMuted) {
      void audio.play().catch(() => undefined)
    }
  }, [])

  return (
    <MusicContext.Provider value={{ playing, muted, ready, start, toggleMute }}>
      {children}
    </MusicContext.Provider>
  )
}

/** Small control shown after unlock */
export function MusicToggle() {
  const { muted, toggleMute, playing } = useBackgroundMusic()

  return (
    <button
      type="button"
      className="music-toggle"
      onClick={toggleMute}
      aria-label={muted ? 'Slå på musik' : 'Tysta musik'}
      title={muted ? 'Slå på musik' : 'Tysta musik'}
    >
      {muted || !playing ? '♪' : '♫'}
    </button>
  )
}
