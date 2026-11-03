import { motion } from 'framer-motion'
import type { DayConfig } from '../../types'
import {
  HOUSE_BLUEPRINTS,
  type ChimneyStyle,
  type HouseBlueprint,
  type RoofStyle,
  type WindowStyle,
} from './houseBlueprints'

interface HouseProps {
  day: DayConfig
  available: boolean
  completed: boolean
  onOpen: () => void
  index: number
}

/** Shared geometry so roof, walls and chimney meet cleanly */
const W = {
  left: 34,
  right: 86,
  top: 72,
  bottom: 118,
  mid: 60,
  width: 52,
  height: 46,
}

function roofOutline(style: RoofStyle): { main: string; eavesY: number; dormer?: string } {
  const eavesY = 80
  switch (style) {
    case 'steep':
      return { main: `M22 ${eavesY} L${W.mid} 20 L98 ${eavesY} Z`, eavesY }
    case 'wide':
      return { main: `M16 ${eavesY + 2} L${W.mid} 32 L104 ${eavesY + 2} Z`, eavesY: eavesY + 2 }
    case 'dormer':
      return {
        main: `M20 ${eavesY} L${W.mid} 24 L100 ${eavesY} Z`,
        eavesY,
        dormer: 'M50 54 L60 38 L70 54 Z',
      }
    case 'asymmetric':
      return { main: `M18 ${eavesY + 2} L38 22 L102 ${eavesY + 2} Z`, eavesY: eavesY + 2 }
    case 'barn':
      return {
        main: `M20 ${eavesY + 2} L20 56 L${W.mid} 26 L100 56 L100 ${eavesY + 2} Z`,
        eavesY: eavesY + 2,
      }
    case 'cottage':
    default:
      return {
        main: `M24 ${eavesY} C34 48 46 28 ${W.mid} 28 C74 28 86 48 96 ${eavesY} Z`,
        eavesY,
      }
  }
}

/** Staggered shingle / tile lines clipped to the roof shape */
function RoofShingles({
  clipId,
  dark,
  top,
  bottom,
}: {
  clipId: string
  dark: string
  top: number
  bottom: number
}) {
  const rows: number[] = []
  for (let y = top + 6; y < bottom - 1; y += 5) rows.push(y)

  return (
    <g clipPath={`url(#${clipId})`} opacity="0.55">
      {rows.map((y, i) => (
        <g key={y}>
          <path
            d={`M8 ${y} H112`}
            stroke={dark}
            strokeWidth="1.15"
            strokeOpacity="0.55"
          />
          {/* staggered vertical joints like shingles */}
          {Array.from({ length: 12 }, (_, j) => {
            const x = 14 + j * 8 + (i % 2 === 0 ? 0 : 4)
            return (
              <path
                key={j}
                d={`M${x} ${y} V${Math.min(y + 4.2, bottom - 0.5)}`}
                stroke={dark}
                strokeWidth="0.9"
                strokeOpacity="0.35"
              />
            )
          })}
        </g>
      ))}
      {/* fine grain */}
      {rows.map((y) => (
        <path
          key={`grain-${y}`}
          d={`M10 ${y + 2.2} H110`}
          stroke={dark}
          strokeWidth="0.5"
          strokeOpacity="0.2"
        />
      ))}
    </g>
  )
}

function Roof({
  style,
  fill,
  dark,
  uid,
}: {
  style: RoofStyle
  fill: string
  dark: string
  uid: string
}) {
  const { main, eavesY, dormer } = roofOutline(style)
  const clipId = `${uid}-roof-clip`
  const topY = style === 'steep' ? 20 : style === 'wide' ? 32 : style === 'asymmetric' ? 22 : 24

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={main} />
          {dormer && <path d={dormer} />}
        </clipPath>
      </defs>

      <path d={main} fill={fill} />
      {dormer && <path d={dormer} fill={fill} />}

      <RoofShingles clipId={clipId} dark={dark} top={topY} bottom={eavesY} />

      {style === 'dormer' && (
        <>
          <rect x="53" y="54" width="14" height="11" fill="#ebe2d4" />
          <rect x="55.5" y="56.5" width="9" height="6" rx="0.8" fill="#c9a24a" />
        </>
      )}

      <path
        d={`M16 ${eavesY} L104 ${eavesY}`}
        stroke={dark}
        strokeWidth="2"
        strokeOpacity="0.4"
      />
    </g>
  )
}

function Chimney({
  style,
  brick,
  cap,
  smoking,
}: {
  style: ChimneyStyle
  brick: string
  cap: string
  smoking: boolean
}) {
  const smoke = smoking ? (
    <g opacity="0.35">
      <circle cx="0" cy="-4" r="2.8" fill="#d8e0e6">
        <animate attributeName="cy" values="-4;-18;-4" dur="3.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0;0.45" dur="3.8s" repeatCount="indefinite" />
      </circle>
    </g>
  ) : null

  const stack = (x: number, y: number, w: number, h: number) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} fill={brick} />
      <rect x={-2} y={-3} width={w + 4} height={4} fill={cap} />
      <g transform={`translate(${w / 2} 0)`}>{smoke}</g>
    </g>
  )

  switch (style) {
    case 'left':
      return stack(30, 36, 10, 36)
    case 'double':
      return (
        <g>
          {stack(28, 40, 8, 32)}
          {stack(82, 40, 8, 32)}
        </g>
      )
    case 'stout':
      return stack(74, 40, 14, 32)
    case 'thin':
      return stack(84, 32, 7, 40)
    case 'right':
    default:
      return stack(80, 36, 10, 36)
  }
}

function Windows({
  style,
  lit,
  frame,
}: {
  style: WindowStyle
  lit: boolean
  frame: string
}) {
  const glass = lit ? '#c9963a' : '#1a222c'

  const pane = (x: number, y: number, w: number, h: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={w} height={h} fill={glass} />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={frame}
        strokeWidth="1.3"
        strokeOpacity="0.55"
      />
      <path
        d={`M${x + w / 2} ${y + 1} V${y + h - 1} M${x + 1} ${y + h / 2} H${x + w - 1}`}
        stroke={frame}
        strokeOpacity="0.28"
        strokeWidth="0.85"
      />
    </g>
  )

  switch (style) {
    case 'triple':
      return (
        <g>
          {pane(38, 82, 11, 11)}
          {pane(54.5, 80, 11, 13)}
          {pane(71, 82, 11, 11)}
        </g>
      )
    case 'tall':
      return (
        <g>
          {pane(40, 78, 12, 18)}
          {pane(68, 78, 12, 18)}
        </g>
      )
    case 'round':
      return (
        <g>
          <circle cx="60" cy="86" r="9" fill={glass} />
          <circle
            cx="60"
            cy="86"
            r="9"
            fill="none"
            stroke={frame}
            strokeWidth="1.3"
            strokeOpacity="0.55"
          />
          <path
            d="M60 79 V93 M53 86 H67"
            stroke={frame}
            strokeOpacity="0.28"
            strokeWidth="0.85"
          />
        </g>
      )
    case 'shutters':
      return (
        <g>
          <rect x="36" y="80" width="3.5" height="14" fill="#6a3a3a" />
          {pane(39.5, 80, 12, 14)}
          <rect x="51.5" y="80" width="3.5" height="14" fill="#6a3a3a" />
          <rect x="65" y="80" width="3.5" height="14" fill="#6a3a3a" />
          {pane(68.5, 80, 12, 14)}
          <rect x="80.5" y="80" width="3.5" height="14" fill="#6a3a3a" />
        </g>
      )
    case 'bay':
      return (
        <g>
          {pane(38, 82, 10, 12)}
          <rect x="50" y="78" width="20" height="16" fill={glass} />
          <rect
            x="50"
            y="78"
            width="20"
            height="16"
            fill="none"
            stroke={frame}
            strokeWidth="1.3"
            strokeOpacity="0.55"
          />
          <path
            d="M60 79.5 V92.5 M51.5 86 H68.5"
            stroke={frame}
            strokeOpacity="0.28"
            strokeWidth="0.85"
          />
          {pane(72, 82, 10, 12)}
        </g>
      )
    case 'twin':
    default:
      return (
        <g>
          {pane(40, 80, 13, 13)}
          {pane(67, 80, 13, 13)}
        </g>
      )
  }
}

function HouseIllustration({
  day,
  bp,
  available,
  completed,
}: {
  day: number
  bp: HouseBlueprint
  available: boolean
  completed: boolean
}) {
  const uid = `d${day}`

  return (
    <svg className="house-svg" viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bp.wallColor} />
          <stop offset="100%" stopColor={bp.wallDark} />
        </linearGradient>
        <linearGradient id={`${uid}-roof`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={bp.roofColor} />
          <stop offset="100%" stopColor={bp.roofDark} />
        </linearGradient>
        <linearGradient id={`${uid}-eave`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Wall body — tucked under roof eaves */}
      <rect
        x={W.left}
        y={W.top}
        width={W.width}
        height={W.height}
        fill={`url(#${uid}-wall)`}
      />
      {/* Soft side shading for depth */}
      <rect
        x={W.right - 7}
        y={W.top}
        width="7"
        height={W.height}
        fill="rgba(0,0,0,0.06)"
      />
      {/* Subtle wall texture */}
      {(day % 2 === 0) && (
        <path
          d={`M${W.left + 4} 84 H${W.right - 4} M${W.left + 4} 96 H${W.right - 4} M${W.left + 4} 108 H${W.right - 4}`}
          stroke={bp.trim}
          strokeOpacity="0.07"
          strokeWidth="1"
        />
      )}
      {(day % 2 === 1) && (
        <path
          d={`M46 ${W.top + 2} V${W.bottom - 2} M60 ${W.top + 2} V${W.bottom - 2} M74 ${W.top + 2} V${W.bottom - 2}`}
          stroke={bp.trim}
          strokeOpacity="0.06"
          strokeWidth="1.3"
        />
      )}

      {/* Foundation strip — connects wall to ground */}
      <rect
        x={W.left}
        y={W.bottom - 3}
        width={W.width}
        height="3"
        fill={bp.trim}
        opacity="0.45"
      />

      <Windows style={bp.windows} lit={available} frame={bp.trim} />

      {/* Door flush with wall — no knob */}
      <path
        d="M53 96 C53 91 67 91 67 96 V118 H53 Z"
        fill={bp.door}
      />
      <path
        d="M53 96 C53 91 67 91 67 96"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />
      <text
        x="60"
        y="112"
        textAnchor="middle"
        fill="#f2e8dc"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="12"
        fontWeight="700"
      >
        {day}
      </text>

      {/* Small door wreath only when completed — no props around the house */}
      {completed && (
        <g>
          <circle cx="60" cy="98" r="4.5" fill="none" stroke="#2a5c48" strokeWidth="2" />
          <circle cx="60" cy="98" r="1.5" fill="#a84848" />
        </g>
      )}

      {/* Eave shadow on the wall — sells the roof sitting on top */}
      <rect x={W.left} y={W.top} width={W.width} height="8" fill={`url(#${uid}-eave)`} />

      {/* Roof covers the wall top */}
      <Roof
        style={bp.roof}
        fill={`url(#${uid}-roof)`}
        dark={bp.roofDark}
        uid={uid}
      />

      {/* Chimney through the roof */}
      <Chimney
        style={bp.chimney}
        brick={bp.trim}
        cap={bp.roofDark}
        smoking={available}
      />
    </svg>
  )
}

export function House({ day, available, completed, onOpen, index }: HouseProps) {
  const bp = HOUSE_BLUEPRINTS[day.day] ?? HOUSE_BLUEPRINTS[1]

  return (
    <motion.div
      className="house-wrap"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        className={[
          'house',
          !available ? 'house--locked' : '',
          completed ? 'house--completed' : '',
          available ? 'house--lit' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onOpen}
        disabled={!available}
        aria-label={
          available
            ? `Open day ${day.day}${completed ? ', gift unlocked' : ''}`
            : `Day ${day.day} is still locked`
        }
      >
        <HouseIllustration
          day={day.day}
          bp={bp}
          available={available}
          completed={completed}
        />
      </button>
    </motion.div>
  )
}
