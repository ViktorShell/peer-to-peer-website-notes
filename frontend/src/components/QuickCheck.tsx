import { useState } from 'react'
import clsx from 'clsx'
import type { TFItem } from '@/data/quickChecks'
import { useProgress } from '@/hooks/useProgress'

type Props = {
  slug: string
  items: TFItem[]
}

type AnswerMap = Record<number, boolean>

export function QuickCheck({ slug, items }: Props) {
  const { recordQuickCheck, state } = useProgress()
  const prev = state.lessonsViewed[slug]?.quickCheckScore
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [submitted, setSubmitted] = useState(false)

  function pick(idx: number, value: boolean) {
    if (submitted) return
    setAnswers((p) => ({ ...p, [idx]: value }))
  }

  function submit() {
    const correct = items.reduce(
      (acc, item, idx) => (answers[idx] === item.answer ? acc + 1 : acc),
      0,
    )
    recordQuickCheck(slug, correct, items.length)
    setSubmitted(true)
  }

  const answeredAll = items.every((_, i) => i in answers)
  const correctCount = submitted
    ? items.reduce(
        (acc, item, idx) => (answers[idx] === item.answer ? acc + 1 : acc),
        0,
      )
    : 0

  return (
    <div className="quick-check">
      <h3 className="quick-check__title">✓ Check rapido</h3>
      <p className="quick-check__sub">
        Vero o falso · {items.length} affermazioni
        {prev !== undefined && !submitted ? ` · risultato precedente: ${prev}/${items.length}` : ''}
      </p>
      {items.map((item, idx) => {
        const userAnswer = answers[idx]
        const isCorrect = submitted && userAnswer === item.answer
        const isWrong = submitted && userAnswer !== undefined && userAnswer !== item.answer
        return (
          <div className="quick-check__item" key={idx}>
            <div className="quick-check__statement">
              {item.statement}
              {submitted && item.explanation && (
                <div
                  className="text-soft"
                  style={{ fontSize: 13, marginTop: 6 }}
                >
                  <strong>{isCorrect ? '✓ Corretto.' : '✗ Falso.'}</strong>{' '}
                  {item.explanation}
                </div>
              )}
              {submitted && !item.explanation && (
                <div
                  className="text-soft"
                  style={{ fontSize: 13, marginTop: 6 }}
                >
                  <strong>
                    Risposta: {item.answer ? 'Vero' : 'Falso'}.{' '}
                    {isCorrect ? '✓ Corretto.' : '✗'}
                  </strong>
                </div>
              )}
            </div>
            <div className="quick-check__tf">
              <button
                type="button"
                disabled={submitted}
                onClick={() => pick(idx, true)}
                className={clsx('quick-check__tf-btn', {
                  'quick-check__tf-btn--correct':
                    submitted && item.answer === true,
                  'quick-check__tf-btn--wrong':
                    submitted && userAnswer === true && !isCorrect,
                })}
                style={
                  !submitted && userAnswer === true
                    ? { background: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                    : undefined
                }
              >
                Vero
              </button>
              <button
                type="button"
                disabled={submitted}
                onClick={() => pick(idx, false)}
                className={clsx('quick-check__tf-btn', {
                  'quick-check__tf-btn--correct':
                    submitted && item.answer === false,
                  'quick-check__tf-btn--wrong':
                    submitted && userAnswer === false && isWrong,
                })}
                style={
                  !submitted && userAnswer === false
                    ? { background: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                    : undefined
                }
              >
                Falso
              </button>
            </div>
          </div>
        )
      })}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        {submitted ? (
          <span className="muted">
            Risultato: <strong style={{ color: 'var(--text)' }}>{correctCount}/{items.length}</strong>{' '}
            corrette · +{correctCount * 5} XP guadagnati
            {prev !== undefined ? ' (XP solo al primo tentativo)' : ''}
          </span>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            disabled={!answeredAll}
            onClick={submit}
          >
            Verifica risposte
          </button>
        )}
      </div>
    </div>
  )
}
