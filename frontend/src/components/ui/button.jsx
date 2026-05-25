import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[11px] text-sm font-medium transition-all duration-200 ease-kino focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'border border-[rgba(212,165,116,0.45)] bg-[linear-gradient(180deg,rgba(212,165,116,0.92),rgba(183,138,94,0.9))] text-[var(--background)] shadow-[0_10px_26px_rgba(212,165,116,0.28)] hover:-translate-y-[1px] hover:brightness-105',
        secondary: 'border border-[var(--border-color)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] text-[var(--foreground)] hover:border-[rgba(212,165,116,0.38)] hover:bg-[rgba(255,255,255,0.08)]',
        ghost: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.06)]',
        danger: 'bg-[var(--danger)] text-white hover:brightness-110',
        cinematic: 'border border-[rgba(212,165,116,0.5)] bg-[linear-gradient(180deg,rgba(16,19,28,0.96),rgba(10,12,18,0.9))] text-[var(--kino-gold)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_34px_rgba(0,0,0,0.4)] hover:-translate-y-[1px] hover:border-[rgba(212,165,116,0.85)] hover:text-[#f0c691]',
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
