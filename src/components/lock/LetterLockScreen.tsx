import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { calendarConfig } from '../../config/calendar'
import { useBackgroundMusic } from './BackgroundMusic'

interface Props {
  onUnlocked: () => void
}

export function LetterLockScreen({ onUnlocked }: Props) {
  const { start } = useBackgroundMusic()
  const [opened, setOpened] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [exiting, setExiting] = useState(false)

  function openLetter() {
    if (opened) return
    setOpened(true)
    // Browsers only allow audio after a user gesture — opening the letter counts
    start()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const expected = calendarConfig.lock.password.trim().toLowerCase()
    const given = password.trim().toLowerCase()

    if (!given) {
      setError('Skriv lösenordet…')
      return
    }

    if (given !== expected) {
      setError('Fel lösenord — försök igen')
      return
    }

    setError('')
    setExiting(true)
  }

  return (
    <AnimatePresence onExitComplete={onUnlocked}>
      {!exiting && (
        <motion.div
          key="lock-screen"
          className="lock-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lock-stage">
            <motion.div
              className={`envelope ${opened ? 'envelope--open' : ''}`}
              role={opened ? undefined : 'button'}
              tabIndex={opened ? undefined : 0}
              aria-label={opened ? undefined : 'Öppna brevet'}
              onClick={openLetter}
              onKeyDown={(e) => {
                if (!opened && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  openLetter()
                }
              }}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Paper body + classic envelope folds */}
              <div className="envelope__body" aria-hidden="true" />
              <div className="envelope__side envelope__side--left" aria-hidden="true" />
              <div className="envelope__side envelope__side--right" aria-hidden="true" />
              <div className="envelope__bottom" aria-hidden="true" />

              {/* Top flap opens upward */}
              <div className="envelope__flap-wrap" aria-hidden="true">
                <div className="envelope__flap">
                  <div className="envelope__flap-face envelope__flap-face--front" />
                  <div className="envelope__flap-face envelope__flap-face--back" />
                </div>
              </div>

              {/* Wax seal — hides when open */}
              <div className="wax-seal" aria-hidden="true">
                <motion.img
                  src={`${import.meta.env.BASE_URL}assets/wax-seal.png`}
                  alt=""
                  animate={{ opacity: opened ? 0 : 1, scale: opened ? 0.6 : 1 }}
                  transition={{ duration: 0.45 }}
                />
              </div>

              {/* Letter sheet slides up as flap opens */}
              <motion.div
                className="letter-sheet"
                initial={false}
                animate={
                  opened
                    ? { y: 0, opacity: 1 }
                    : { y: 72, opacity: 0 }
                }
                transition={{
                  duration: 0.85,
                  delay: opened ? 0.2 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="letter-cursive">
                  Skriv in lösenordet för att komma till kalendern.
                </p>

                <form className="letter-form" onSubmit={handleSubmit}>
                  <label className="visually-hidden" htmlFor="advent-password">
                    Lösenord
                  </label>
                  <input
                    id="advent-password"
                    className="letter-input"
                    type="password"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="Lösenord"
                    autoFocus={opened}
                  />
                  <button type="submit" className="letter-submit">
                    Öppna kalendern
                  </button>
                  {error && <p className="letter-error">{error}</p>}
                </form>

                <p className="letter-signoff">
                  Med värme,
                  <br />
                  {calendarConfig.senderName}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
