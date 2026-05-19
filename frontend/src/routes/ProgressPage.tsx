import { useState } from 'react'
import { LESSONS } from '@/content/manifest'
import { MODULES } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'
import { BADGE_CATALOG, BADGES_BY_ID } from '@/utils/progress'

export function ProgressPage() {
  const { state, resetAll } = useProgress()
  const [confirming, setConfirming] = useState(false)

  const totalLessons = LESSONS.length
  const completedCount = Object.values(state.lessonsViewed).filter(
    (v) => v?.quickCheckScore !== undefined,
  ).length
  const earnedBadges = state.badges.map((id) => BADGES_BY_ID[id]).filter(Boolean)

  return (
    <div>
      <h1 className="page-title">I tuoi progressi</h1>
      <p className="page-subtitle">
        XP, badge e completamento per modulo. Tutto è salvato nel tuo browser
        (localStorage).
      </p>

      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--accent-soft), transparent)',
          borderColor: 'var(--accent-soft)',
          marginBottom: 24,
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div className="text-soft" style={{ fontSize: 13 }}>XP totali</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>⭐ {state.xp}</div>
          </div>
          <div>
            <div className="text-soft" style={{ fontSize: 13 }}>Lezioni completate</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>
              {completedCount}
              <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>
                {' '}/ {totalLessons}
              </span>
            </div>
          </div>
          <div>
            <div className="text-soft" style={{ fontSize: 13 }}>Badge sbloccati</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>
              🎖 {earnedBadges.length}
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Per modulo</h2>
      <div className="stack">
        {MODULES.map((mod) => {
          const lessons = LESSONS.filter((l) => l.moduleId === mod.id)
          const opened = lessons.filter(
            (l) => state.lessonsViewed[l.slug]?.quickCheckScore !== undefined,
          ).length
          const quiz = state.moduleQuizzes[mod.id]
          return (
            <div key={mod.id} className="card">
              <div
                className="row"
                style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}
              >
                <div>
                  <strong style={{ color: mod.color }}>Modulo {mod.num}</strong>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{mod.title}</div>
                </div>
                <div className="muted" style={{ fontSize: 13, textAlign: 'right' }}>
                  {opened}/{lessons.length} lezioni
                  {quiz ? (
                    <div>
                      Quiz: <strong>{Math.round(quiz.score * 100)}%</strong>
                      {' '}({quiz.attempts} tent.)
                    </div>
                  ) : (
                    <div>Quiz non svolto</div>
                  )}
                </div>
              </div>
              <div className="progress" style={{ marginTop: 12 }}>
                <div
                  className="progress__fill"
                  style={{
                    width: `${(opened / lessons.length) * 100}%`,
                    background: mod.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="section-title">Badge</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {BADGE_CATALOG.map((b) => {
          const earned = state.badges.includes(b.id)
          return (
            <div
              key={b.id}
              className="card"
              style={{
                opacity: earned ? 1 : 0.45,
                textAlign: 'center',
                padding: 16,
                filter: earned ? 'none' : 'grayscale(0.7)',
              }}
            >
              <div style={{ fontSize: 36 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, marginTop: 4, fontSize: 14 }}>{b.title}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                {b.description}
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="section-title">Zona pericolo</h2>
      <div
        className="card"
        style={{
          borderColor: 'rgba(239,68,68,0.4)',
          background: 'rgba(239,68,68,0.05)',
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <strong>Reset progressi</strong>
            <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              Cancella XP, badge, lezioni viste e risultati dei quiz. Non
              recuperabile.
            </p>
          </div>
          {!confirming ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setConfirming(true)}
              style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.4)' }}
            >
              Reset…
            </button>
          ) : (
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setConfirming(false)}
              >
                Annulla
              </button>
              <button
                type="button"
                className="btn btn--primary"
                style={{ background: '#ef4444' }}
                onClick={() => {
                  resetAll()
                  setConfirming(false)
                }}
              >
                Conferma reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
