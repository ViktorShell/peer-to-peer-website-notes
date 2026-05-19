import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { LESSONS, type ModuleId } from '@/content/manifest'
import { MODULES } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'

type Props = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: Props) {
  const location = useLocation()
  const { state } = useProgress()
  const initialOpenModule = deriveOpenModule(location.pathname)
  const [openModules, setOpenModules] = useState<Set<ModuleId>>(
    () => new Set(initialOpenModule ? [initialOpenModule] : ['p2p-dht']),
  )

  function toggleModule(id: ModuleId) {
    setOpenModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={clsx('sidebar', { open })}>
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">P2P</span>
          <div>
            <div className="sidebar__brand-title">P2P & Blockchain</div>
            <div className="sidebar__brand-subtitle">Sito di studio · UniPi</div>
          </div>
        </div>

        <div className="sidebar__nav-section">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              clsx('sidebar__nav-link', { active: isActive })
            }
            onClick={onClose}
          >
            🏠 Home
          </NavLink>
          <NavLink
            to="/progressi"
            className={({ isActive }) =>
              clsx('sidebar__nav-link', { active: isActive })
            }
            onClick={onClose}
          >
            📊 Progressi
          </NavLink>
          <NavLink
            to="/lab"
            className={({ isActive }) =>
              clsx('sidebar__nav-link', { active: isActive })
            }
            onClick={onClose}
          >
            🧪 Laboratori
          </NavLink>
        </div>

        {MODULES.map((mod) => {
          const lessons = LESSONS.filter((l) => l.moduleId === mod.id)
          // "Completed" = quick check at the end of the lesson submitted.
          // Scrolling alone is not enough; we want a positive action.
          const completedCount = lessons.filter(
            (l) => state.lessonsViewed[l.slug]?.quickCheckScore !== undefined,
          ).length
          const isOpen = openModules.has(mod.id)
          return (
            <div className="sidebar__module" key={mod.id}>
              <button
                type="button"
                className="sidebar__module-header"
                onClick={() => toggleModule(mod.id)}
                aria-expanded={isOpen}
              >
                <span
                  className="sidebar__module-bullet"
                  style={{ background: mod.color }}
                />
                <span>{mod.title}</span>
                <span className="sidebar__module-count">
                  {completedCount}/{lessons.length}
                </span>
                <span aria-hidden="true" style={{ marginLeft: 6 }}>
                  {isOpen ? '▾' : '▸'}
                </span>
              </button>
              {isOpen && (
                <div className="sidebar__lessons">
                  {lessons.map((lesson) => {
                    const isCompleted =
                      state.lessonsViewed[lesson.slug]?.quickCheckScore !==
                      undefined
                    return (
                      <NavLink
                        key={lesson.slug}
                        to={`/modulo/${mod.id}/lezione/${lesson.slug}`}
                        className={({ isActive }) =>
                          clsx('sidebar__lesson', {
                            active: isActive,
                            completed: isCompleted,
                          })
                        }
                        onClick={onClose}
                      >
                        <span className="sidebar__lesson-num">
                          {lesson.num === 'P' ? 'P' : String(lesson.num).padStart(2, '0')}
                        </span>
                        <span>{shortTitle(lesson.title)}</span>
                      </NavLink>
                    )
                  })}
                  <NavLink
                    to={`/modulo/${mod.id}/quiz`}
                    className={({ isActive }) =>
                      clsx('sidebar__lesson', { active: isActive })
                    }
                    style={{ marginTop: 4, fontWeight: 600 }}
                    onClick={onClose}
                  >
                    <span className="sidebar__lesson-num">★</span>
                    <span>Quiz finale</span>
                  </NavLink>
                </div>
              )}
            </div>
          )
        })}
      </aside>
    </>
  )
}

function shortTitle(title: string): string {
  // Drop leading "(Lab)" marker if present, trim length
  const trimmed = title.replace(/^\(Lab\)\s*/i, '').replace(/^Lab\s+\d+\s+—\s*/i, '')
  if (trimmed.length <= 36) return trimmed
  return trimmed.slice(0, 34) + '…'
}

function deriveOpenModule(pathname: string): ModuleId | null {
  const match = pathname.match(/^\/modulo\/(p2p-dht|bitcoin|ethereum|apps)/)
  return (match?.[1] as ModuleId | undefined) ?? null
}
