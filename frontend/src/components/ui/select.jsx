import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'

function normalizeOptions(options) {
  return (options || []).map((option) => (
    typeof option === 'string' ? { value: option, label: option } : option
  ))
}

const Select = React.forwardRef(function Select(
  { value, onValueChange, options = [], placeholder = 'Select option', className, triggerClassName, contentClassName, disabled = false },
  ref
) {
  const normalized = useMemo(() => normalizeOptions(options), [options])
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState({})
  const rootRef = useRef(null)
  const triggerRef = useRef(null)

  const active = normalized.find((opt) => String(opt.value) === String(value))
  const label = active?.label || placeholder

  useEffect(() => {
    const handleOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const syncPosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setMenuStyle({
        position: 'fixed',
        top: `${rect.bottom + 7}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      })
    }

    syncPosition()
    window.addEventListener('resize', syncPosition)
    window.addEventListener('scroll', syncPosition, true)
    return () => {
      window.removeEventListener('resize', syncPosition)
      window.removeEventListener('scroll', syncPosition, true)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn('kino-select', open && 'is-open', className)}>
      <button
        ref={(node) => {
          triggerRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        type="button"
        disabled={disabled}
        className={cn('kino-select-trigger', triggerClassName, open && 'is-open')}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn('kino-select-label', !active && 'is-placeholder')}>{label}</span>
        <span className="kino-select-chevron" aria-hidden="true" />
      </button>

      {open && createPortal(
        <div className={cn('kino-select-content', contentClassName)} role="listbox" style={menuStyle}>
          {normalized.map((option) => {
            const isSelected = String(option.value) === String(value)
            return (
              <button
                key={option.value}
                type="button"
                className={cn('kino-select-item', isSelected && 'is-selected')}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onValueChange?.(option.value)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        ,
        document.body
      )}
    </div>
  )
})

export { Select }
