import { Link } from 'react-router-dom'
import { LESSONS, type LessonMeta } from '@/content/manifest'
import { MODULES, MODULES_BY_ID, LABS } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'

export function Home() {
  const { state } = useProgress()
  const totalLessons = LESSONS.length
  const completedCount = Object.values(state.lessonsViewed).filter(
    (v) => v?.quickCheckScore !== undefined,
  ).length
  const last = state.lastVisited

  return (
    <div>
      <h1 className="page-title">Studio del corso Peer-to-Peer & Blockchain</h1>
      <p className="page-subtitle">
        27 lezioni, 4 macro-moduli, quiz di autovalutazione e laboratori
        interattivi sui protocolli fondamentali.
      </p>

      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--accent-soft), transparent)',
          borderColor: 'var(--accent-soft)',
          marginBottom: 32,
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <strong>Progresso complessivo</strong>
            <p className="muted" style={{ marginTop: 4 }}>
              Completate {completedCount} / {totalLessons} lezioni · ⭐ {state.xp} XP ·
              🎖 {state.badges.length} badge
            </p>
          </div>
          {last ? (
            <Link
              to={`/modulo/${last.moduleId}/lezione/${last.lessonSlug}`}
              className="btn btn--primary"
            >
              Riprendi da dove eri →
            </Link>
          ) : (
            <Link to="/modulo/p2p-dht/lezione/lezione-01" className="btn btn--primary">
              Inizia dal Modulo 1 →
            </Link>
          )}
        </div>
        <div className="progress" style={{ marginTop: 16 }}>
          <div
            className="progress__fill"
            style={{ width: `${Math.round((completedCount / totalLessons) * 100)}%` }}
          />
        </div>
      </div>

      <h2 className="section-title">Macro-moduli</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {MODULES.map((mod) => {
          const lessonsCount = LESSONS.filter((l) => l.moduleId === mod.id).length
          const completed = LESSONS.filter(
            (l) => l.moduleId === mod.id && state.lessonsViewed[l.slug],
          ).length
          return (
            <Link
              key={mod.id}
              to={`/modulo/${mod.id}`}
              className="card card--module"
              style={{ borderTop: `4px solid ${mod.color}` }}
            >
              <div className="text-soft" style={{ fontSize: 12, fontWeight: 600 }}>
                Modulo {mod.num}
              </div>
              <h3 style={{ margin: '4px 0 8px', fontSize: 18 }}>{mod.title}</h3>
              <p style={{ color: 'var(--text-soft)', fontSize: 14, margin: 0 }}>
                {mod.description}
              </p>
              <div
                className="muted"
                style={{ marginTop: 12, fontSize: 13 }}
              >
                {completed}/{lessonsCount} lezioni · Quiz finale disponibile
              </div>
            </Link>
          )
        })}
      </div>

      <h2 className="section-title">Laboratori interattivi</h2>
      <div className="lab-card-grid">
        {LABS.map((lab) => {
          const lesson = LESSONS.find((l) => l.slug === lab.lessonSlug) as LessonMeta | undefined
          const mod = lesson ? MODULES_BY_ID[lesson.moduleId] : null
          return (
            <Link key={lab.slug} to={`/lab/${lab.slug}`} className="card card--module">
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: mod?.color ?? 'var(--text-soft)',
                  marginBottom: 4,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}
              >
                {mod ? `Modulo ${mod.num} · ${mod.title}` : 'Lab'}
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>{lab.title}</h3>
              <p style={{ color: 'var(--text-soft)', fontSize: 13.5, margin: 0 }}>
                {lab.blurb}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
