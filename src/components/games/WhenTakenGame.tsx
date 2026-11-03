import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { GameResult, WhenTakenGame as Config } from '../../types'
import {
  formatWhenTakenScore,
  scoreDate,
  scoreLocation,
  WHEN_TAKEN_MAX_SCORE,
} from '../../utils/whenTakenScore'

interface Props {
  config: Config
  onComplete: (result?: GameResult) => void
}

interface LatLng {
  lat: number
  lng: number
}

const MONTHS_SV = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'oktober',
  'november',
  'december',
]

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

function monthsApart(
  yearA: number,
  monthA: number,
  yearB: number,
  monthB: number,
) {
  return Math.abs(yearA * 12 + monthA - (yearB * 12 + monthB))
}

function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 100) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

const guessIcon = L.divIcon({
  className: 'when-taken-marker when-taken-marker--guess',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const answerIcon = L.divIcon({
  className: 'when-taken-marker when-taken-marker--answer',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

export function WhenTakenGame({ config, onComplete }: Props) {
  const yearMin = config.yearMin ?? 2010
  const yearMax = config.yearMax ?? 2025
  const midYear = Math.round((yearMin + yearMax) / 2)

  const [year, setYear] = useState(midYear)
  const [month, setMonth] = useState(6)
  const [pin, setPin] = useState<LatLng | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{
    km: number
    monthDiff: number
    placeScore: number
    dateScore: number
    total: number
  } | null>(null)

  const mapHostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const guessMarkerRef = useRef<L.Marker | null>(null)
  const answerMarkerRef = useRef<L.Marker | null>(null)
  const lineRef = useRef<L.Polyline | null>(null)
  const submittedRef = useRef(false)
  const pinRef = useRef<LatLng | null>(null)

  submittedRef.current = submitted
  pinRef.current = pin

  const imageSrc = `${import.meta.env.BASE_URL}${config.image.replace(/^\//, '')}`

  useEffect(() => {
    const host = mapHostRef.current
    if (!host) return

    // Fresh container avoids React Strict Mode / remount glitches with Leaflet
    host.replaceChildren()
    const container = document.createElement('div')
    container.className = 'when-taken-map-leaflet'
    host.appendChild(container)

    const map = L.map(container, {
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: true,
    }).setView([54, 14], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (submittedRef.current) return
      const next = { lat: e.latlng.lat, lng: e.latlng.lng }
      setPin(next)
      if (guessMarkerRef.current) {
        guessMarkerRef.current.setLatLng(next)
      } else {
        guessMarkerRef.current = L.marker(next, { icon: guessIcon }).addTo(map)
      }
    })

    mapRef.current = map

    const resize = () => map.invalidateSize()
    const t1 = window.setTimeout(resize, 50)
    const t2 = window.setTimeout(resize, 300)
    window.addEventListener('resize', resize)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('resize', resize)
      map.remove()
      mapRef.current = null
      guessMarkerRef.current = null
      answerMarkerRef.current = null
      lineRef.current = null
      host.replaceChildren()
    }
  }, [])

  function handleSubmit() {
    if (!pin || submitted || !mapRef.current) return

    const km = haversineKm(pin, { lat: config.lat, lng: config.lng })
    const monthDiff = monthsApart(year, month, config.year, config.month)
    const placeScore = scoreLocation(km)
    const dateScoreVal = scoreDate(monthDiff)
    const total = placeScore + dateScoreVal

    setResult({ km, monthDiff, placeScore, dateScore: dateScoreVal, total })
    setSubmitted(true)

    const map = mapRef.current
    const answer = L.latLng(config.lat, config.lng)
    const guess = L.latLng(pin.lat, pin.lng)

    if (!answerMarkerRef.current) {
      answerMarkerRef.current = L.marker(answer, { icon: answerIcon }).addTo(map)
    }
    if (!lineRef.current) {
      lineRef.current = L.polyline([guess, answer], {
        color: '#e2b65c',
        weight: 2,
        dashArray: '6 8',
        opacity: 0.95,
      }).addTo(map)
    }

    map.fitBounds(L.latLngBounds([guess, answer]).pad(0.4), {
      maxZoom: 14,
      animate: true,
    })
    window.setTimeout(() => map.invalidateSize(), 200)
  }

  function openGift() {
    if (!result) return
    onComplete({ score: result.total, maxScore: WHEN_TAKEN_MAX_SCORE })
  }

  return (
    <div className="when-taken">
      <div className="when-taken-photo">
        <img src={imageSrc} alt="Foto att datera och placera" />
      </div>

      <div className="when-taken-controls">
        <label className="when-taken-slider">
          <span className="when-taken-slider-label">
            År <strong>{year}</strong>
          </span>
          <input
            type="range"
            min={yearMin}
            max={yearMax}
            value={year}
            disabled={submitted}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </label>

        <label className="when-taken-slider">
          <span className="when-taken-slider-label">
            Månad <strong>{MONTHS_SV[month - 1]}</strong>
          </span>
          <input
            type="range"
            min={1}
            max={12}
            value={month}
            disabled={submitted}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
        </label>
      </div>

      <p className="when-taken-map-hint">
        {submitted
          ? 'Zooma och jämför din nål med rätt plats'
          : 'Zooma in på kartan och tryck för att placera nålen så exakt du kan'}
      </p>

      <div className="when-taken-map-shell">
        <div ref={mapHostRef} className="when-taken-map-host" />
      </div>

      {!submitted && (
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!pin}
            onClick={handleSubmit}
          >
            Gissa
          </button>
        </div>
      )}

      {result && (
        <div className="when-taken-result" role="status">
          <p className="when-taken-score-total">
            Poäng:{' '}
            <strong>{formatWhenTakenScore(result.total)}</strong>
          </p>
          <div className="when-taken-score-grid">
            <div>
              <span className="when-taken-score-label">Plats</span>
              <strong>{result.placeScore} / 5&nbsp;000</strong>
              <small>{formatKm(result.km)} ifrån</small>
            </div>
            <div>
              <span className="when-taken-score-label">Datum</span>
              <strong>{result.dateScore} / 5&nbsp;000</strong>
              <small>
                {result.monthDiff === 0
                  ? 'exakt månad'
                  : `${result.monthDiff} mån fel`}
              </small>
            </div>
          </div>
          <p>
            <strong>Rätt datum:</strong> {config.day}{' '}
            {MONTHS_SV[config.month - 1]} {config.year}
            {config.placeLabel ? (
              <>
                <br />
                <strong>Plats:</strong> {config.placeLabel}
              </>
            ) : null}
          </p>
          <div className="when-taken-legend">
            <span>
              <i className="when-taken-dot when-taken-dot--guess" /> Din gissning
            </span>
            <span>
              <i className="when-taken-dot when-taken-dot--answer" /> Rätt plats
            </span>
          </div>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={openGift}>
              Öppna present
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
