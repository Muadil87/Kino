import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

export function DropdownMenu({ trigger, align = 'right', className, contentClassName, children }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const handleOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <div ref={rootRef} className={cn('kino-dropdown', className)}>
      <span onClick={() => setOpen((v) => !v)}>
        {trigger}
      </span>
      {open && (
        <div className={cn('kino-dropdown-content', align === 'left' ? 'align-left' : 'align-right', contentClassName)}>
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  )
}
