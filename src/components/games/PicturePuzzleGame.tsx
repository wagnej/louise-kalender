import { useEffect, useMemo, useState } from 'react'
import type { PicturePuzzleGame as Config } from '../../types'

interface Props {
  config: Config
  onComplete: () => void
}

function isSolved(tiles: number[]) {
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] !== i) return false
  }
  return true
}

function neighbours(empty: number, size: number) {
  const r = Math.floor(empty / size)
  const c = empty % size
  const list: number[] = []
  if (r > 0) list.push(empty - size)
  if (r < size - 1) list.push(empty + size)
  if (c > 0) list.push(empty - 1)
  if (c < size - 1) list.push(empty + 1)
  return list
}

/** Fisher–Yates shuffle that guarantees solvability for sliding puzzles */
function shuffleSolvable(size: number): number[] {
  const n = size * size
  let tiles = Array.from({ length: n }, (_, i) => i)

  // Make random valid moves from solved state so the puzzle is always solvable
  let empty = n - 1
  for (let i = 0; i < size * size * 12; i++) {
    const opts = neighbours(empty, size)
    const pick = opts[Math.floor(Math.random() * opts.length)]
    ;[tiles[empty], tiles[pick]] = [tiles[pick], tiles[empty]]
    empty = pick
  }

  // Avoid starting already solved
  if (isSolved(tiles)) {
    const swapWith = empty - 1 >= 0 ? empty - 1 : empty + 1
    ;[tiles[empty], tiles[swapWith]] = [tiles[swapWith], tiles[empty]]
  }

  return tiles
}

export function PicturePuzzleGame({ config, onComplete }: Props) {
  const size = config.size ?? 3
  const [tiles, setTiles] = useState(() => shuffleSolvable(size))
  const [done, setDone] = useState(false)

  const src = useMemo(
    () => `${import.meta.env.BASE_URL}${config.image.replace(/^\//, '')}`,
    [config.image],
  )

  useEffect(() => {
    if (!done && isSolved(tiles)) {
      setDone(true)
      const t = setTimeout(onComplete, 550)
      return () => clearTimeout(t)
    }
  }, [done, onComplete, tiles])

  function move(index: number) {
    if (done) return
    const empty = tiles.indexOf(size * size - 1)
    if (!neighbours(empty, size).includes(index)) return
    setTiles((prev) => {
      const next = [...prev]
      ;[next[empty], next[index]] = [next[index], next[empty]]
      return next
    })
  }

  return (
    <div>
      <div
        className="puzzle-board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {tiles.map((piece, index) => {
          const isEmpty = piece === size * size - 1
          const row = Math.floor(piece / size)
          const col = piece % size
          const bgSize = `${size * 100}%`
          const bgPos = `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`

          return (
            <button
              key={`${piece}-${index}`}
              type="button"
              className={`puzzle-tile ${isEmpty ? 'empty' : ''}`}
              onClick={() => move(index)}
              aria-label={isEmpty ? 'Empty space' : `Tile ${piece + 1}`}
              style={
                isEmpty
                  ? undefined
                  : {
                      backgroundImage: `url(${src})`,
                      backgroundSize: bgSize,
                      backgroundPosition: bgPos,
                    }
              }
            />
          )
        })}
      </div>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setDone(false)
            setTiles(shuffleSolvable(size))
          }}
        >
          Shuffle again
        </button>
      </div>
      {done && <p className="game-feedback">Picture restored!</p>}
    </div>
  )
}
