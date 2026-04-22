import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV } from './nav'
import type { NavGroup, NavItem } from './nav'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function isGroup(x: NavItem | NavGroup): x is NavGroup {
  return (x as NavGroup).items !== undefined
}

function groupHasActive(group: NavGroup, pathname: string) {
  return group.items.some((it) => pathname === it.to || pathname.startsWith(it.to + '/'))
}

export function Sidebar({
  footer,
}: {
  footer?: ReactNode
}) {
  const { pathname } = useLocation()
  const autoExpanded = useMemo(() => {
    const expanded: Record<string, boolean> = {}
    for (const entry of NAV) {
      if (isGroup(entry)) expanded[entry.key] = groupHasActive(entry, pathname)
    }
    return expanded
  }, [pathname])

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => autoExpanded)

  return (
    <nav className="h-screen w-72 fixed left-0 top-0 hidden lg:flex flex-col bg-surface-container-low z-50 ghost-border border-y-0 border-l-0">
      <div className="p-6">
        <h1 className="font-headline font-black tracking-tighter text-primary text-xl">
          The Academic Atelier
        </h1>
        <p className="font-label text-sm font-medium text-on-surface-variant mt-1">School Management</p>
      </div>

      <div className="flex flex-col h-full p-4 space-y-2 overflow-y-auto">
        {NAV.map((entry) => {
          if (!isGroup(entry)) {
            return (
              <NavLink
                key={entry.key}
                to={entry.to}
                className={({ isActive }) =>
                  cx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl font-label text-sm font-medium transition-all duration-200 relative',
                    isActive
                      ? 'bg-secondary-container/40 text-primary before:content-[\'\'] before:absolute before:left-0 before:w-1 before:h-6 before:bg-primary before:rounded-full before:top-1/2 before:-translate-y-1/2'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-primary',
                  )
                }
              >
                {entry.icon ? <span className="material-symbols-outlined">{entry.icon}</span> : null}
                {entry.label}
              </NavLink>
            )
          }

          const isOpen = !!expanded[entry.key] || !!autoExpanded[entry.key]
          const active = groupHasActive(entry, pathname)

          return (
            <div key={entry.key} className="space-y-1">
              <button
                type="button"
                onClick={() => setExpanded((p) => ({ ...p, [entry.key]: !p[entry.key] }))}
                className={cx(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl font-label text-sm font-medium transition-all duration-200 relative',
                  active
                    ? 'bg-secondary-container/25 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary',
                )}
              >
                <span className="flex items-center gap-3">
                  {entry.icon ? (
                    <span
                      className="material-symbols-outlined"
                      style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {entry.icon}
                    </span>
                  ) : null}
                  {entry.label}
                </span>
                <span className="material-symbols-outlined text-lg">
                  {isOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isOpen ? (
                <div className="flex flex-col ml-4 pl-4 space-y-1">
                  {entry.items.map((it) => (
                    <NavLink
                      key={it.key}
                      to={it.to}
                      className={({ isActive }) =>
                        cx(
                          'px-4 py-2 text-sm rounded-lg transition-colors font-label font-medium relative',
                          isActive
                            ? 'text-primary bg-surface-container-highest/50 before:content-[\'\'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary before:rounded-full'
                            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container',
                        )
                      }
                    >
                      {it.label}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {footer ? <div className="p-6 mt-auto">{footer}</div> : null}
    </nav>
  )
}

