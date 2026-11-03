/**
 * Shared TypeScript types for the advent calendar.
 * Edit day content in src/config/calendar.ts — not here.
 */

/** The kinds of mini-games you can assign to a day */
export type GameType =
  | 'wordGuess'
  | 'emojiRiddle'
  | 'memory'
  | 'quiz'
  | 'connections'
  | 'photoGuess'
  | 'musicQuiz'
  | 'songClip'
  | 'crossword'
  | 'picturePuzzle'
  | 'whenTaken'

/** Visual style variants for each door on the calendar grid */
export type DoorTheme =
  | 'snowflake'
  | 'pine'
  | 'star'
  | 'candle'
  | 'gift'
  | 'bell'
  | 'holly'
  | 'ornament'
  | 'mitten'
  | 'cookie'
  | 'lantern'
  | 'deer'

/** Visual item shown on the gift page (perfume, Geisha, …) */
export interface GiftRewardItem {
  /** Path in public/, e.g. "/gifts/geisha.png" */
  image: string
  label?: string
  /** How many to show (default 1) */
  count?: number
}

export interface GiftConfig {
  /** Short title shown on the gift reveal */
  title: string
  /** Personal message to your friend */
  message: string
  /** Optional image path, e.g. "/gifts/day-1.jpg" (put files in public/gifts/) */
  image?: string
  /** Optional product icons that explain the unlocked gift */
  rewardItems?: GiftRewardItem[]
  /** Optional external link (Spotify, letter, etc.) */
  link?: {
    url: string
    label: string
  }
  /** Optional note about a physical gift you'll give in person */
  physicalGift?: string
}

/** Score-gated gift — highest tier whose minScore the player meets wins */
export interface GiftTier extends GiftConfig {
  /** Minimum total score required (When Taken = 0–10000) */
  minScore: number
  /** Short label, e.g. "Nivå 4" */
  levelLabel?: string
}

/** Optional result passed when a game finishes */
export interface GameResult {
  score?: number
  maxScore?: number
}

/** Wordle-style word guessing */
export interface WordGuessGame {
  type: 'wordGuess'
  title: string
  instructions: string
  /** The secret word (uppercase letters A–Z, or Swedish ÅÄÖ). Length = grid width. */
  word: string
  maxAttempts?: number
}

/** Guess the phrase from emojis */
export interface EmojiRiddleGame {
  type: 'emojiRiddle'
  title: string
  instructions: string
  emojis: string
  /** Accepted answers (case-insensitive). Include common variants. */
  answers: string[]
  hint?: string
}

/** Flip cards and find matching pairs */
export interface MemoryGame {
  type: 'memory'
  title: string
  instructions: string
  /** Even number of emoji/strings used as card faces (each appears twice) */
  cards: string[]
}

/** Multiple-choice personal quiz — must get all correct */
export interface QuizGame {
  type: 'quiz'
  title: string
  instructions: string
  questions: {
    question: string
    options: string[]
    /** Index of the correct option (0-based) */
    correctIndex: number
  }[]
}

/** Connections-style: group items into categories */
export interface ConnectionsGame {
  type: 'connections'
  title: string
  instructions: string
  groups: {
    label: string
    items: string[]
    /** Soft colour key for the solved group */
    colour: 'red' | 'yellow' | 'green' | 'blue'
  }[]
}

/** Guess what a blurred / zoomed photo is */
export interface PhotoGuessGame {
  type: 'photoGuess'
  title: string
  instructions: string
  /** Image in public/, e.g. "/gifts/mystery-1.jpg" */
  image: string
  answers: string[]
  hint?: string
  /** Starting blur in px (reduces as they guess wrong) */
  startBlur?: number
}

/** Guess the song from a lyric snippet or clue */
export interface MusicQuizGame {
  type: 'musicQuiz'
  title: string
  instructions: string
  clue: string
  /** Optional embed / preview URL shown after solving (or as a playable hint) */
  audioUrl?: string
  answers: string[]
  hint?: string
}

/**
 * Guess the song from a growing audio clip.
 * First only a short intro plays; “hear more” unlocks longer clips but lowers the score.
 */
export interface SongClipGame {
  type: 'songClip'
  title: string
  instructions: string
  /** Audio in public/, e.g. "/audio/dont-you-worry-child.m4a" */
  audio: string
  answers: string[]
  /**
   * Seconds unlocked at each step (from the start of the track).
   * e.g. [3, 6, 12, 20, 35]
   */
  clipSeconds: number[]
  /** Max points if guessed on the first clip (default 5000) */
  maxScore?: number
  hint?: string
}

/** Tiny crossword (fixed grid of letters + clues) */
export interface CrosswordGame {
  type: 'crossword'
  title: string
  instructions: string
  /**
   * Grid rows as strings. Use '#' for blocked cells, letters for solution.
   * Player fills letter cells; empty display until typed.
   */
  solution: string[]
  clues: {
    across: { number: number; clue: string }[]
    down: { number: number; clue: string }[]
  }
  /** Cell numbers to show on the grid, keyed "row-col" */
  numbers: Record<string, number>
}

/** Sliding picture puzzle */
export interface PicturePuzzleGame {
  type: 'picturePuzzle'
  title: string
  instructions: string
  image: string
  /** Grid size, e.g. 3 = 3×3 */
  size?: number
}

/** Guess when & where a photo was taken (year + month + map pin) */
export interface WhenTakenGame {
  type: 'whenTaken'
  title: string
  instructions: string
  /** Image in public/, e.g. "/gifts/when-taken-day2.jpg" */
  image: string
  /** Correct year */
  year: number
  /** Correct month 1–12 */
  month: number
  /** Correct day of month (shown after guess) */
  day: number
  /** Correct coordinates */
  lat: number
  lng: number
  /** Optional place name revealed after guess */
  placeLabel?: string
  /** Year slider range */
  yearMin?: number
  yearMax?: number
}

export type GameConfig =
  | WordGuessGame
  | EmojiRiddleGame
  | MemoryGame
  | QuizGame
  | ConnectionsGame
  | PhotoGuessGame
  | MusicQuizGame
  | SongClipGame
  | CrosswordGame
  | PicturePuzzleGame
  | WhenTakenGame

export interface DayConfig {
  day: number
  doorTheme: DoorTheme
  /** Short label under the door number */
  teaser: string
  game: GameConfig
  /** Default gift (also fallback if no tier matches) */
  gift: GiftConfig
  /**
   * Optional score-based gifts (e.g. When Taken).
   * Highest tier with score >= minScore is shown.
   */
  giftTiers?: GiftTier[]
}

export interface LockConfig {
  /** Password to open the calendar (checked in the browser — fine for a personal gift) */
  password: string
  /**
   * Audio file in public/, e.g. "/audio/fairytale-of-new-york.mp3"
   * Add the file yourself (copyrighted music cannot be bundled in the repo).
   */
  musicSrc: string
  /** Starting volume 0–1 */
  musicVolume?: number
}

export interface CalendarConfig {
  /** Friend's name shown on the home page */
  recipientName: string
  /** Your name (optional signature on gifts) */
  senderName: string
  /** Advent year — days unlock Dec 1–24 of this year */
  year: number
  /**
   * When true, every day is unlockable (for testing).
   * Set to false before sharing with your friend!
   */
  previewMode: boolean
  /** Letter lock screen before the calendar */
  lock: LockConfig
  days: DayConfig[]
}

/** What we store in localStorage */
export interface ProgressState {
  /** Day numbers whose gifts have been unlocked */
  completedDays: number[]
  /** Optional scores keyed by day number as string */
  dayScores: Record<string, number>
}
