/**
 * Date helpers using Swedish time (Europe/Stockholm).
 * Advent days unlock at midnight Stockholm time on that calendar date.
 */

import { calendarConfig } from '../config/calendar'

const TIME_ZONE = 'Europe/Stockholm'

/** Today's date parts in Stockholm (year, month 1–12, day) */
export function getStockholmToday(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date())

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0)

  return { year: get('year'), month: get('month'), day: get('day') }
}

/**
 * Is this advent day available to open?
 * - previewMode → always yes
 * - Otherwise: unlocked once Stockholm date is Dec {day} of the advent year (or later that year)
 * - After Dec 24, all days stay available for the rest of the year
 * - Before December (or wrong year), days stay locked
 */
export function isDayUnlockedByDate(adventDay: number): boolean {
  if (calendarConfig.previewMode) return true

  const today = getStockholmToday()
  const { year } = calendarConfig

  if (today.year < year) return false
  if (today.year > year) return true // after the advent year, keep calendar open

  // Same year as advent
  if (today.month < 12) return false
  // December: unlock days 1..today.day (capped at 24)
  return adventDay <= Math.min(today.day, 24)
}

/** Friendly label for debugging / UI */
export function formatStockholmDate(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: TIME_ZONE,
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date())
}
