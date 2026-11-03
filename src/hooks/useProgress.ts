import { useCallback, useEffect, useState } from 'react'
import type { ProgressState } from '../types'
import { loadProgress, markDayCompleted, resetProgress } from '../utils/storage'

/** React hook wrapping localStorage progress */
export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>({
    completedDays: [],
    dayScores: {},
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setProgress(loadProgress())
    setReady(true)
  }, [])

  const completeDay = useCallback((day: number, score?: number) => {
    const next = markDayCompleted(day, score)
    setProgress(next)
  }, [])

  const isCompleted = useCallback(
    (day: number) => progress.completedDays.includes(day),
    [progress.completedDays],
  )

  const getScore = useCallback(
    (day: number) => progress.dayScores[String(day)],
    [progress.dayScores],
  )

  const clearAll = useCallback(() => {
    resetProgress()
    setProgress({ completedDays: [], dayScores: {} })
  }, [])

  return { progress, ready, completeDay, isCompleted, getScore, clearAll }
}
