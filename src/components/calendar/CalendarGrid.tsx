import { useNavigate } from 'react-router-dom'
import { calendarConfig } from '../../config/calendar'
import { isDayUnlockedByDate } from '../../utils/date'
import { House } from './House'

interface CalendarGridProps {
  completedDays: number[]
}

/** Cosy winter village — each cottage is one advent day */
export function CalendarGrid({ completedDays }: CalendarGridProps) {
  const navigate = useNavigate()

  return (
    <section className="village" aria-label="Advent village">
      <div className="village-glow" aria-hidden="true" />

      <div className="village-grid" role="list">
        {calendarConfig.days.map((day, index) => {
          const available = isDayUnlockedByDate(day.day)
          const completed = completedDays.includes(day.day)

          return (
            <div
              key={day.day}
              role="listitem"
              className="village-plot"
              style={{ marginTop: `${(index % 3) * 8}px` }}
            >
              <House
                day={day}
                available={available}
                completed={completed}
                index={index}
                onOpen={() => navigate(`/day/${day.day}`)}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
