import { useEffect } from 'react'
import type { ReactNode } from 'react'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export function Drawer({
  open,
  title,
  children,
  footer,
  onClose,
  widthClassName = 'max-w-md',
}: {
  open: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  widthClassName?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Tutup"
        className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <section
        className={cx(
          'relative w-full h-full bg-surface-bright shadow-2xl flex flex-col',
          widthClassName,
        )}
        role="dialog"
        aria-modal="true"
      >
        <header className="px-6 py-5 bg-surface-container-lowest flex items-center justify-between ghost-border border-x-0 border-t-0">
          <h3 className="font-headline text-lg font-semibold tracking-editorial text-on-surface">
            {title}
          </h3>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">{children}</div>

        {footer ? (
          <footer className="p-6 bg-surface-container-lowest ghost-border border-x-0 border-b-0">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  )
}

