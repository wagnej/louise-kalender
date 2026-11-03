import { useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  BackgroundMusicProvider,
  MusicToggle,
} from './components/lock/BackgroundMusic'
import { LetterLockScreen } from './components/lock/LetterLockScreen'
import { Snowfall } from './components/layout/Snowfall'
import { DayPage } from './pages/DayPage'
import { HomePage } from './pages/HomePage'

/**
 * HashRouter works reliably on GitHub Pages (no server rewrite rules needed).
 * URLs look like: https://you.github.io/repo/#/day/1
 *
 * Unlock is only kept in memory — refresh shows the letter lock screen again.
 */
export default function App() {
  const [unlocked, setUnlocked] = useState(false)

  return (
    <BackgroundMusicProvider>
      <div className="app-shell">
        <Snowfall />

        {!unlocked ? (
          <LetterLockScreen onUnlocked={() => setUnlocked(true)} />
        ) : (
          <HashRouter>
            <MusicToggle />
            <main className="app-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/day/:dayNumber" element={<DayPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </HashRouter>
        )}
      </div>
    </BackgroundMusicProvider>
  )
}
