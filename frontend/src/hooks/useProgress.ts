import { useCallback, useMemo } from 'react'
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

export function useProgress() {
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
              viewedAt: new Date().toISOString(),
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
        const xpGain = isBest ? xpForQuiz(score) : 5  // small re-attempt bonus
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
        const allPassed = (['p2p-dht', 'bitcoin', 'ethereum', 'apps'] as const).every(
          (m) => (moduleQuizzes[m]?.score ?? 0) >= 0.8,
        )
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

  const lessonsByModule = useMemo(() => {
    const out: Record<string, number> = {}
    for (const slug of Object.keys(state.lessonsViewed)) {
      // we don't store moduleId per lesson — caller can compute from manifest
      out[slug] = 1
    }
    return out
  }, [state.lessonsViewed])

  return {
    state,
    markLessonViewed,
    recordQuickCheck,
    recordQuizResult,
    recordLabUse,
    unlockBadge,
    resetAll,
    lessonsByModule,
  }
}
