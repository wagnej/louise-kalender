import { useState } from 'react'
import type { QuizGame as Config } from '../../types'

interface Props {
  config: Config
  onComplete: () => void
}

export function QuizGame({ config, onComplete }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => config.questions.map(() => null),
  )
  const [checked, setChecked] = useState(false)
  const [message, setMessage] = useState('')

  function select(qi: number, oi: number) {
    if (checked) return
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))
    setMessage('')
  }

  function check() {
    if (answers.some((a) => a === null)) {
      setMessage('Please answer every question')
      return
    }
    setChecked(true)
    const allCorrect = config.questions.every(
      (q, i) => answers[i] === q.correctIndex,
    )
    if (allCorrect) {
      setMessage('Perfect!')
      setTimeout(onComplete, 600)
    } else {
      setMessage('Some answers need another look — try again')
    }
  }

  function reset() {
    setAnswers(config.questions.map(() => null))
    setChecked(false)
    setMessage('')
  }

  return (
    <div>
      {config.questions.map((q, qi) => (
        <div key={qi} className="quiz-question">
          <h3>
            {qi + 1}. {q.question}
          </h3>
          <div className="quiz-options">
            {q.options.map((opt, oi) => {
              let cls = 'quiz-option'
              if (answers[qi] === oi) cls += ' selected'
              if (checked) {
                if (oi === q.correctIndex) cls += ' correct'
                else if (answers[qi] === oi) cls += ' wrong'
              }
              return (
                <button
                  key={oi}
                  type="button"
                  className={cls}
                  onClick={() => select(qi, oi)}
                  disabled={checked && message === 'Perfect!'}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="btn-row">
        {!checked || message === 'Perfect!' ? (
          <button type="button" className="btn btn-primary" onClick={check}>
            Check answers
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={reset}>
            Try again
          </button>
        )}
      </div>

      <p className={`game-feedback ${message && message !== 'Perfect!' ? 'game-feedback--error' : ''}`}>
        {message}
      </p>
    </div>
  )
}
