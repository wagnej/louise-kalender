/**
 * Picks the right game component based on day config.
 * To add a new game type: create the component, add a type in types/,
 * then add a case here.
 */
import type { GameConfig, GameResult } from '../../types'
import { ConnectionsGame } from './ConnectionsGame'
import { CrosswordGame } from './CrosswordGame'
import { EmojiRiddleGame } from './EmojiRiddleGame'
import { MemoryGame } from './MemoryGame'
import { MusicQuizGame } from './MusicQuizGame'
import { PhotoGuessGame } from './PhotoGuessGame'
import { PicturePuzzleGame } from './PicturePuzzleGame'
import { QuizGame } from './QuizGame'
import { SongClipGame } from './SongClipGame'
import { WhenTakenGame } from './WhenTakenGame'
import { WordGuessGame } from './WordGuessGame'

interface Props {
  game: GameConfig
  onComplete: (result?: GameResult) => void
}

export function GameRenderer({ game, onComplete }: Props) {
  switch (game.type) {
    case 'wordGuess':
      return <WordGuessGame config={game} onComplete={onComplete} />
    case 'emojiRiddle':
      return <EmojiRiddleGame config={game} onComplete={onComplete} />
    case 'memory':
      return <MemoryGame config={game} onComplete={onComplete} />
    case 'quiz':
      return <QuizGame config={game} onComplete={onComplete} />
    case 'connections':
      return <ConnectionsGame config={game} onComplete={onComplete} />
    case 'photoGuess':
      return <PhotoGuessGame config={game} onComplete={onComplete} />
    case 'musicQuiz':
      return <MusicQuizGame config={game} onComplete={onComplete} />
    case 'songClip':
      return <SongClipGame config={game} onComplete={onComplete} />
    case 'crossword':
      return <CrosswordGame config={game} onComplete={onComplete} />
    case 'picturePuzzle':
      return <PicturePuzzleGame config={game} onComplete={onComplete} />
    case 'whenTaken':
      return <WhenTakenGame config={game} onComplete={onComplete} />
    default: {
      const _exhaustive: never = game
      return <p>Unknown game type: {JSON.stringify(_exhaustive)}</p>
    }
  }
}
