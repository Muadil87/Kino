import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 ease-kino focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent-primary)] text-[var(--background)] hover:bg-[var(--accent-primary-hover)] shadow-accent',
        secondary: 'bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border-color)] hover:bg-[var(--surface-elevated)]',
        ghost: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]',
        danger: 'bg-[var(--danger)] text-white hover:brightness-110',
        unstyled: '',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-5 text-base',
        icon: 'h-9 w-9 p-0',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? 'span' : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})

export { Button }
