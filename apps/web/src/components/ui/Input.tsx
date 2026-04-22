import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={cx(
          'block w-full px-4 py-2.5 bg-surface-container-low border-0 rounded-lg text-sm text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-colors',
          className,
        )}
      />
    )
  },
)

