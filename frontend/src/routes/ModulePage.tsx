import { Link, useParams, Navigate } from 'react-router-dom'
import { LESSONS, type ModuleId } from '@/content/manifest'
import { MODULES_BY_ID } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: ModuleId }>()
  const mod = moduleId ? MODULES_BY_ID[moduleId] : undefined
  const { state } = useProgress()

  if (!mod || !moduleId) {
    return <Navigate to="/" replace />
  }

  const lessons = LESSONS.filter((l) => l.moduleId === moduleId)
  const completed = lessons.filter(
    (l) => state.lessonsViewed[l.slug]?.quickCheckScore !== undefined,
  ).length
  const quizResult = state.moduleQuizzes[moduleId]
  const quizUnlocked = completed >= Math.max(1, Math.floor(lessons.length * 0.5))

  return (
    <div>
      <div className="text-soft" style={{ fontSize: 13, fontWeight: 600 }}>
        Modulo {mod.num}
      </div>
      <h1 className="page-title" style={{ marginTop: 4 }}>
        {mod.title}
      </h1>
      <p className="page-subtitle">{mod.description}</p>

      <div className="card" style={{ marginBottom: 24, borderTop: `3px solid ${mod.color}` }}>
        <div
          className="row"
          style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
        >
          <div>
            <strong>Progresso</strong>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              {completed} / {lessons.length} lezioni completate ·{' '}
              {quizResult
                ? `Quiz: ${Math.round(quizResult.score * 100)}%`
                : 'Quiz non ancora svolto'}
            </div>
          </div>
          <Link
            to={`/modulo/${mod.id}/quiz`}
            className={`btn ${quizUnlocked ? 'btn--primary' : 'btn--ghost'}`}
            title={quizUnlocked ? 'Quiz finale' : 'Apri almeno metà delle lezioni per sbloccare'}
          >
            {quizResult ? 'Rifai quiz' : 'Quiz finale'} →
          </Link>
        </div>
        <div className="progress" style={{ marginTop: 14 }}>
          <div
            className="progress__fill"
            style={{
              width: `${Math.round((completed / lessons.length) * 100)}%`,
              background: mod.color,
            }}
          />
        </div>
      </div>

      <h2 className="section-title">Lezioni</h2>
      <div className="stack">
        {lessons.map((lesson) => {
          const isCompleted =
            state.lessonsViewed[lesson.slug]?.quickCheckScore !== undefined
          return (
            <Link
              key={lesson.slug}
              to={`/modulo/${mod.id}/lezione/${lesson.slug}`}
              className="card card--module"
              style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: mod.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {lesson.num === 'P' ? 'P' : lesson.num}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {lesson.title}
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                  {lesson.kind === 'progetto' ? 'Progetto' : `Lezione ${lesson.num}`}
                  {lesson.labSlug ? ' · 🧪 Lab disponibile' : ''}
                </div>
              </div>
              {isCompleted && (
                <span
                  style={{
                    color: 'var(--mod-apps)',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  ✓ Completata
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
