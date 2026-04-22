import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export function Button({
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}) {
  return (
    <button
      {...props}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-label font-medium transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'md' ? 'px-5 py-2.5 text-sm rounded-xl' : 'px-3 py-2 text-sm rounded-lg',
        variant === 'primary' &&
          'text-on-primary bg-gradient-to-br from-primary to-primary-container hover:from-primary-container hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary',
        variant === 'ghost' &&
          'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary/30',
        variant === 'danger' &&
          'text-on-error bg-error hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error/30',
        className,
      )}
    />
  )
}

