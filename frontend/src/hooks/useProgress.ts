import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocalStorage } from './useLocalStorage'
import {
  BADGES_BY_ID,
  INITIAL_PROGRESS,
  MODULE_BADGE,
  STORAGE_KEY,
  xpForQuiz,
  type ProgressState,
} from '@/utils/progress'
import type { ModuleId } from '@/content/manifest'

// React Context so every component shares ONE progress state and re-renders
// when any action mutates it. Without this, each call to `useProgress()`
// instantiates its own useLocalStorage hook → updates in one component never
// reach the others until a full page reload.

type ProgressApi = {
  state: ProgressState
  markLessonViewed: (slug: string, moduleId: ModuleId) => void
  recordQuickCheck: (slug: string, correct: number, total: number) => void
  recordQuizResult: (moduleId: ModuleId, score: number) => void
  recordLabUse: (slug: string, badgeToUnlock?: string, minUses?: number) => void
  unlockBadge: (badgeId: string) => void
  resetAll: () => void
}

const ProgressContext = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<ProgressState>(
    STORAGE_KEY,
    INITIAL_PROGRESS,
  )

  const markLessonViewed = useCallback(
    (slug: string, moduleId: ModuleId) => {
      setState((prev) => {
        const already = prev.lessonsViewed[slug]
        const next: ProgressState = {
          ...prev,
          lessonsViewed: {
            ...prev.lessonsViewed,
            [slug]: {
              viewedAt: already?.viewedAt ?? new Date().toISOString(),
              quickCheckScore: already?.quickCheckScore,
              quickCheckTotal: already?.quickCheckTotal,
            },
          },
          lastVisited: { moduleId, lessonSlug: slug },
          xp: already ? prev.xp : prev.xp + 10,
          badges:
            prev.badges.length === 0 && !already
              ? ['first-step']
              : prev.badges,
        }
        return next
      })
    },
    [setState],
  )

  const recordQuickCheck = useCallback(
    (slug: string, correct: number, total: number) => {
      setState((prev) => {
        const prevEntry = prev.lessonsViewed[slug]
        const wasScored = prevEntry?.quickCheckScore !== undefined
        return {
          ...prev,
          lessonsViewed: {
            ...prev.lessonsViewed,
            [slug]: {
              viewedAt: prevEntry?.viewedAt ?? new Date().toISOString(),
              quickCheckScore: correct,
              quickCheckTotal: total,
            },
          },
          xp: prev.xp + (wasScored ? 0 : correct * 5),
        }
      })
    },
    [setState],
  )

  const recordQuizResult = useCallback(
    (moduleId: ModuleId, score: number) => {
      setState((prev) => {
        const existing = prev.moduleQuizzes[moduleId]
        const isBest = !existing || score > existing.score
        const xpGain = isBest ? xpForQuiz(score) : 5
        const newBadges = new Set(prev.badges)
        if (score >= 0.8) newBadges.add(MODULE_BADGE[moduleId])
        const moduleQuizzes = {
          ...prev.moduleQuizzes,
          [moduleId]: {
            score: isBest ? score : existing!.score,
            attempts: (existing?.attempts ?? 0) + 1,
            bestAt: isBest ? new Date().toISOString() : existing!.bestAt,
          },
        }
        const allPassed = (
          ['p2p-dht', 'bitcoin', 'ethereum', 'apps'] as const
        ).every((m) => (moduleQuizzes[m]?.score ?? 0) >= 0.8)
        if (allPassed) newBadges.add('completionist')
        return {
          ...prev,
          moduleQuizzes,
          xp: prev.xp + xpGain,
          badges: Array.from(newBadges),
        }
      })
    },
    [setState],
  )

  const recordLabUse = useCallback(
    (slug: string, badgeToUnlock?: string, minUses = 1) => {
      setState((prev) => {
        const prevStat = prev.labStats[slug]
        const uses = (prevStat?.uses ?? 0) + 1
        const badges = new Set(prev.badges)
        if (badgeToUnlock && uses >= minUses) badges.add(badgeToUnlock)
        const isFirst = !prevStat
        return {
          ...prev,
          labStats: {
            ...prev.labStats,
            [slug]: { uses, lastAt: new Date().toISOString() },
          },
          xp: prev.xp + (isFirst ? 30 : 2),
          badges: Array.from(badges),
        }
      })
    },
    [setState],
  )

  const unlockBadge = useCallback(
    (badgeId: string) => {
      if (!BADGES_BY_ID[badgeId]) return
      setState((prev) => {
        if (prev.badges.includes(badgeId)) return prev
        return { ...prev, badges: [...prev.badges, badgeId] }
      })
    },
    [setState],
  )

  const resetAll = useCallback(() => {
    setState(INITIAL_PROGRESS)
  }, [setState])

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      markLessonViewed,
      recordQuickCheck,
      recordQuizResult,
      recordLabUse,
      unlockBadge,
      resetAll,
    }),
    [
      state,
      markLessonViewed,
      recordQuickCheck,
      recordQuizResult,
      recordLabUse,
      unlockBadge,
      resetAll,
    ],
  )

  return createElement(ProgressContext.Provider, { value: api }, children)
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext)
  if (!ctx) {
    throw new Error('useProgress must be used inside <ProgressProvider>')
  }
  return ctx
}
