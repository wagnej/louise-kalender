/**
 * localStorage helpers — progress survives refresh and return visits.
 * Data never leaves the browser (no backend).
 */

import type { ProgressState } from '../types'

const STORAGE_KEY = 'louise-advent-progress-v1'

const EMPTY: ProgressState = { completedDays: [], dayScores: {} }

function normalise(parsed: Partial<ProgressState>): ProgressState {
  const completedDays = Array.isArray(parsed.completedDays)
    ? parsed.completedDays.map(Number)
    : []
  const dayScores =
    parsed.dayScores && typeof parsed.dayScores === 'object'
      ? Object.fromEntries(
          Object.entries(parsed.dayScores).map(([k, v]) => [k, Number(v)]),
        )
      : {}
  return { completedDays, dayScores }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY, completedDays: [], dayScores: {} }
    return normalise(JSON.parse(raw) as Partial<ProgressState>)
  } catch {
    return { ...EMPTY, completedDays: [], dayScores: {} }
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function markDayCompleted(
  day: number,
  score?: number,
): ProgressState {
  const current = loadProgress()
  const completedDays = current.completedDays.includes(day)
    ? current.completedDays
    : [...current.completedDays, day].sort((a, b) => a - b)

  const dayScores = { ...current.dayScores }
  if (score != null && Number.isFinite(score)) {
    // Keep the best score if they somehow replay
    const prev = dayScores[String(day)]
    dayScores[String(day)] =
      prev == null ? score : Math.max(prev, score)
  }

  const next = { completedDays, dayScores }
  saveProgress(next)
  return next
}

export function isDayCompleted(day: number): boolean {
  return loadProgress().completedDays.includes(day)
}

export function getDayScore(day: number): number | undefined {
  const score = loadProgress().dayScores[String(day)]
  return score == null ? undefined : score
}

/** Useful while testing — call from the browser console if needed */
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}
