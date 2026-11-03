import { CalendarGrid } from '../components/calendar/CalendarGrid'
import { calendarConfig } from '../config/calendar'
import { useProgress } from '../hooks/useProgress'
import { formatStockholmDate } from '../utils/date'

export function HomePage() {
  const { progress, ready, clearAll } = useProgress()
  const hasOpened = progress.completedDays.length > 0

  return (
    <div className="home-page">
      <header className="home-header home-header--village">
        <p className="eyebrow">Advent {calendarConfig.year}</p>
        <h1 className="sparkle-text">
          {calendarConfig.recipientName}&apos;s Village
        </h1>
        <p className="lede">
          A little winter village, made for you. Find today&apos;s cottage — warm
          light means it&apos;s ready to open.
        </p>
        {calendarConfig.previewMode && (
          <div className="preview-banner" role="status">
            Preview mode — every cottage is open for testing
          </div>
        )}
      </header>

      {ready ? (
        <CalendarGrid completedDays={progress.completedDays} />
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--frost)' }}>Loading…</p>
      )}

      <div className="home-actions">
        <button
          type="button"
          className="btn btn-secondary reset-progress-btn"
          disabled={!hasOpened}
          onClick={clearAll}
        >
          Återställ öppnade hus
        </button>
      </div>

      <p className="footer-note">
        Cottages unlock in Swedish time · {formatStockholmDate()}
      </p>
    </div>
  )
}
