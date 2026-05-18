import { Navigate, useParams } from 'react-router-dom'
import { QuizRunner } from '@/components/QuizRunner'
import { QUIZZES } from '@/data/quizzes'
import { MODULES_BY_ID } from '@/data/modules'
import type { ModuleId } from '@/content/manifest'

export function QuizPage() {
  const { moduleId } = useParams<{ moduleId: ModuleId }>()
  const mod = moduleId ? MODULES_BY_ID[moduleId] : undefined
  if (!moduleId || !mod) return <Navigate to="/" replace />
  const questions = QUIZZES[moduleId]

  return (
    <div>
      <div className="text-soft" style={{ fontSize: 13, fontWeight: 600 }}>
        Modulo {mod.num} · Quiz finale
      </div>
      <h1 className="page-title" style={{ marginTop: 4 }}>
        {mod.title}
      </h1>
      <p className="page-subtitle">
        {questions.length} domande tra scelta multipla e vero/falso. Devi
        rispondere a tutte per ottenere il punteggio finale.
      </p>
      <QuizRunner
        moduleId={moduleId}
        questions={questions}
        backTo={`/modulo/${moduleId}`}
      />
    </div>
  )
}
