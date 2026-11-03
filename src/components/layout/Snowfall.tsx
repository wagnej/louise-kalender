import { useMemo, type CSSProperties } from 'react'

/** Soft CSS snowfall layered behind the calendar */
export function Snowfall({ count = 42 }: { count?: number }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const left = Math.random() * 100
        const duration = 12 + Math.random() * 18
        const delay = Math.random() * -25
        const drift = `${(Math.random() - 0.5) * 80}px`
        const size = 0.45 + Math.random() * 0.7
        const glyphs = ['❄', '❅', '✦', '·']
        const glyph = glyphs[i % glyphs.length]
        return { id: i, left, duration, delay, drift, size, glyph }
      }),
    [count],
  )

  return (
    <div className="snowfall" aria-hidden="true">
      {flakes.map((f) => {
        const style = {
          left: `${f.left}%`,
          fontSize: `${f.size}rem`,
          animationDuration: `${f.duration}s`,
          animationDelay: `${f.delay}s`,
          '--drift': f.drift,
        } as CSSProperties

        return (
          <span key={f.id} className="snowflake" style={style}>
            {f.glyph}
          </span>
        )
      })}
    </div>
  )
}
