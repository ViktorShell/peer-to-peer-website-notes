import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { Question } from '@/data/quizzes/types'
import { useProgress } from '@/hooks/useProgress'
import type { ModuleId } from '@/content/manifest'

type Props = {
  moduleId: ModuleId
  questions: Question[]
  backTo: string
}

export function QuizRunner({ moduleId, questions, backTo }: Props) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(string | boolean | null)[]>(() =>
    questions.map(() => null),
  )
  const [done, setDone] = useState(false)
  const { recordQuizResult, state } = useProgress()

  const current = questions[idx]
  const userAnswer = answers[idx]
  const isAnswered = userAnswer !== null
  const isLast = idx === questions.length - 1

  function selectAnswer(value: string | boolean) {
    setAnswers((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  function next() {
    if (isLast) {
      const correctCount = questions.reduce((acc, q, i) => {
        const a = answers[i]
        if (q.kind === 'mc') return a === q.correctId ? acc + 1 : acc
        return a === q.answer ? acc + 1 : acc
      }, 0)
      const score = correctCount / questions.length
      recordQuizResult(moduleId, score)
      setDone(true)
    } else {
      setIdx(idx + 1)
    }
  }

  if (done) {
    const correctCount = questions.reduce((acc, q, i) => {
      const a = answers[i]
      if (q.kind === 'mc') return a === q.correctId ? acc + 1 : acc
      return a === q.answer ? acc + 1 : acc
    }, 0)
    const score = correctCount / questions.length
    const stored = state.moduleQuizzes[moduleId]
    return (
      <div className="quiz">
        <div className="quiz-result">
          <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>
            Risultato quiz
          </div>
          <div className="quiz-result__score">
            {Math.round(score * 100)}%
          </div>
          <div className="quiz-result__detail">
            {correctCount} su {questions.length} risposte corrette
            {stored ? ` · tentativi totali: ${stored.attempts}` : ''}
          </div>
          {score >= 1 && (
            <p style={{ color: 'var(--mod-apps)', fontWeight: 600 }}>
              🏆 Perfetto! +150 XP
            </p>
          )}
          {score >= 0.8 && score < 1 && (
            <p style={{ color: 'var(--accent)', fontWeight: 600 }}>
              ✨ Ottimo! +100 XP — badge sbloccato
            </p>
          )}
          {score >= 0.6 && score < 0.8 && (
            <p style={{ color: 'var(--text-soft)' }}>+50 XP — buon lavoro</p>
          )}
          {score < 0.6 && (
            <p style={{ color: 'var(--text-soft)' }}>
              +10 XP — rivedi le lezioni e riprova!
            </p>
          )}
          <div className="row" style={{ justifyContent: 'center', marginTop: 24, gap: 12 }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setIdx(0)
                setAnswers(questions.map(() => null))
                setDone(false)
              }}
            >
              Rifai il quiz
            </button>
            <Link to={backTo} className="btn btn--primary">
              Torna al modulo
            </Link>
          </div>
        </div>

        <h2 className="section-title">Revisione</h2>
        {questions.map((q, i) => {
          const a = answers[i]
          const isCorrect =
            q.kind === 'mc' ? a === q.correctId : a === q.answer
          return (
            <div
              key={i}
              className="quiz-card"
              style={{
                borderColor: isCorrect ? 'rgba(34,160,107,0.5)' : 'rgba(239,68,68,0.5)',
              }}
            >
              <div className="quiz-card__kind">
                {isCorrect ? '✓ Corretta' : '✗ Sbagliata'} ·{' '}
                {q.kind === 'mc' ? 'Risposta multipla' : 'Vero o falso'}
              </div>
              <h3 className="quiz-card__question">{q.question}</h3>
              {q.kind === 'mc' ? (
                <div className="quiz-options">
                  {q.choices.map((c) => {
                    const selected = a === c.id
                    const correct = q.correctId === c.id
                    return (
                      <div
                        key={c.id}
                        className={clsx('quiz-option', {
                          'quiz-option--correct': correct,
                          'quiz-option--wrong': selected && !correct,
                        })}
                      >
                        <span className="quiz-option__bullet">{c.id.toUpperCase()}</span>
                        <span>{c.text}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="quiz-options">
                  {[true, false].map((opt) => {
                    const selected = a === opt
                    const correct = q.answer === opt
                    return (
                      <div
                        key={String(opt)}
                        className={clsx('quiz-option', {
                          'quiz-option--correct': correct,
                          'quiz-option--wrong': selected && !correct,
                        })}
                      >
                        <span className="quiz-option__bullet">
                          {opt ? 'V' : 'F'}
                        </span>
                        <span>{opt ? 'Vero' : 'Falso'}</span>
                      </div>
                    )
                  })}
                </div>
              )}
              {q.explanation && (
                <div className="quiz-card__explanation">{q.explanation}</div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="quiz">
      <div className="quiz__progress">
        <span>Domanda {idx + 1} di {questions.length}</span>
        <div className="progress">
          <div
            className="progress__fill"
            style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="quiz-card">
        <div className="quiz-card__kind">
          {current.kind === 'mc' ? 'Risposta multipla' : 'Vero o falso'}
        </div>
        <h3 className="quiz-card__question">{current.question}</h3>
        {current.kind === 'mc' ? (
          <div className="quiz-options">
            {current.choices.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectAnswer(c.id)}
                className={clsx('quiz-option', {
                  'quiz-option--selected': userAnswer === c.id,
                })}
              >
                <span className="quiz-option__bullet">{c.id.toUpperCase()}</span>
                <span>{c.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="quiz-options">
            {[true, false].map((opt) => (
              <button
                key={String(opt)}
                type="button"
                onClick={() => selectAnswer(opt)}
                className={clsx('quiz-option', {
                  'quiz-option--selected': userAnswer === opt,
                })}
              >
                <span className="quiz-option__bullet">{opt ? 'V' : 'F'}</span>
                <span>{opt ? 'Vero' : 'Falso'}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="quiz-actions">
        {idx > 0 && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setIdx(idx - 1)}
          >
            ← Indietro
          </button>
        )}
        <button
          type="button"
          className="btn btn--primary"
          disabled={!isAnswered}
          onClick={next}
        >
          {isLast ? 'Termina' : 'Avanti'} →
        </button>
      </div>
    </div>
  )
}
