'use client'

import React, { useRef } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'

interface Props {
  isOpen: boolean
  onClose: () => void
  align?: 'left' | 'right' | 'center'
  children: React.ReactNode
  triggerRef?: React.RefObject<HTMLElement | null>
  className?: string
}

/**
 * Dropdown
 *
 * Replaces Vue's WrapperDropdownOverlay.
 * Uses a simpler container-relative absolute positioning paired with click-outside detection,
 * which is the standard best practice in React (vs fixed mounting and coordinate calculations).
 *
 * Simply place this right next to your trigger element inside a `relative` container!
 */
export default function Dropdown({
  isOpen,
  onClose,
  align = 'right',
  children,
  triggerRef,
  className = '',
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  // If a triggerRef is provided, clicking the trigger won't instantly close the dropdown
  // just because it's considered "outside".
  useClickOutside(
    dropdownRef,
    () => {
      if (isOpen) onClose()
    },
    triggerRef ? [triggerRef] : undefined
  )

  if (!isOpen) return null

  const getAlignmentClasses = () => {
    switch (align) {
      case 'left':
        return 'left-0 origin-top-left'
      case 'right':
        return 'right-0 origin-top-right'
      case 'center':
        return 'left-1/2 -translate-x-1/2 origin-top'
      default:
        return 'right-0 origin-top-right'
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full mt-2 z-50 animate-in fade-in zoom-in-95 duration-200 ${getAlignmentClasses()} ${className}`}
    >
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg overflow-hidden">
        {children}
      </div>
    </div>
  )
}
