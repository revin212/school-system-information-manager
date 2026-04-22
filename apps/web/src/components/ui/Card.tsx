import type { HTMLAttributes } from 'react'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx(
        'bg-surface-container-lowest rounded-xl shadow-sm shadow-on-surface/5',
        className,
      )}
    />
  )
}

