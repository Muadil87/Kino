import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  'flex w-full text-sm transition-colors duration-200 ease-kino disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'h-10 rounded-md border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
        unstyled: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Input = React.forwardRef(function Input({ className, type = 'text', variant, ...props }, ref) {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  )
})

export { Input }
