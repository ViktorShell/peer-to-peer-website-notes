import { useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  LESSONS_BY_SLUG,
  neighbourLessons,
  type ModuleId,
} from '@/content/manifest'
import { MODULES_BY_ID } from '@/data/modules'
import { getLessonMarkdown } from '@/content/loader'
import { MarkdownReader } from '@/components/MarkdownReader'
import { LabBanner } from '@/components/LabBanner'
import { QuickCheck } from '@/components/QuickCheck'
import { QUICK_CHECKS } from '@/data/quickChecks'
import { useProgress } from '@/hooks/useProgress'

export function LessonPage() {
  const { moduleId, lessonSlug } = useParams<{
    moduleId: ModuleId
    lessonSlug: string
  }>()
  const lesson = lessonSlug ? LESSONS_BY_SLUG[lessonSlug] : undefined
  const { markLessonViewed } = useProgress()
  const contentRef = useRef<HTMLDivElement>(null)

  // Mark as viewed when the user scrolls past 80% of the content
  useEffect(() => {
    if (!lesson || !moduleId) return
    function onScroll() {
      if (!contentRef.current) return
      const rect = contentRef.current.getBoundingClientRect()
      const total = rect.height
      const scrolled = -rect.top + window.innerHeight
      if (total > 0 && scrolled / total >= 0.8) {
        markLessonViewed(lesson!.slug, moduleId!)
        window.removeEventListener('scroll', onScroll)
      }
    }
    // Also flag short pages where scrolling isn't possible
    const fitsInViewport =
      (contentRef.current?.getBoundingClientRect().height ?? 0) <
      window.innerHeight * 0.9
    if (fitsInViewport) {
      const t = setTimeout(() => markLessonViewed(lesson.slug, moduleId), 3000)
      return () => clearTimeout(t)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lesson, moduleId, markLessonViewed])

  // Scroll to top when navigating between lessons
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [lessonSlug])

  if (!lesson || !moduleId || lesson.moduleId !== moduleId) {
    return <Navigate to="/" replace />
  }
  const md = getLessonMarkdown(lesson.slug)
  if (!md) return <p>Contenuto non disponibile.</p>

  const mod = MODULES_BY_ID[lesson.moduleId]
  const { prev, next } = neighbourLessons(lesson.slug)
  const quickItems = QUICK_CHECKS[lesson.slug]

  return (
    <div ref={contentRef}>
      <div className="lesson-toolbar">
        <div className="text-soft" style={{ fontSize: 13, fontWeight: 600 }}>
          <Link to={`/modulo/${mod.id}`} style={{ color: mod.color }}>
            Modulo {mod.num} · {mod.title}
          </Link>
        </div>
      </div>

      <MarkdownReader source={md} />

      {lesson.labSlug && <LabBannerWrapper slug={lesson.labSlug} />}

      {quickItems && quickItems.length > 0 && (
        <div style={{ maxWidth: 'var(--content-max-width)', margin: '32px auto 0' }}>
          <QuickCheck slug={lesson.slug} items={quickItems} />
        </div>
      )}

      <nav className="lesson-nav">
        {prev ? (
          <Link
            to={`/modulo/${prev.moduleId}/lezione/${prev.slug}`}
            className="lesson-nav__btn"
          >
            <small>← Precedente</small>
            <strong>{prev.title}</strong>
          </Link>
        ) : (
          <div className="lesson-nav__btn" style={{ opacity: 0.5, pointerEvents: 'none' }}>
            <small>Inizio del corso</small>
            <strong>—</strong>
          </div>
        )}
        {next ? (
          <Link
            to={`/modulo/${next.moduleId}/lezione/${next.slug}`}
            className="lesson-nav__btn lesson-nav__btn--next"
          >
            <small>Successiva →</small>
            <strong>{next.title}</strong>
          </Link>
        ) : (
          <Link
            to={`/modulo/${moduleId}/quiz`}
            className="lesson-nav__btn lesson-nav__btn--next"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}
          >
            <small>Fine modulo →</small>
            <strong>Vai al quiz</strong>
          </Link>
        )}
      </nav>
    </div>
  )
}

function LabBannerWrapper({ slug }: { slug: string }) {
  return (
    <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>
      <LabBanner slug={slug} />
    </div>
  )
}
