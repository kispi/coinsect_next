'use client'

import React from 'react'

interface Props {
  value: boolean
  onChange: (val: boolean) => void
  small?: boolean
  className?: string
}

export default function AppToggler({ value, onChange, small = false, className = '' }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(!value)
  }

  // Toggler dimensions (matches Vue's SCSS)
  // Default: width 48px, height 24px, handle 18px (gap 3px)
  // Small: width 32px, height 16px, handle 10px (gap 3px)
  const width = small ? 'w-8' : 'w-12'
  const height = small ? 'h-4' : 'h-6'
  const handleSize = small ? 'h-2.5 w-2.5' : 'h-4.5 w-4.5'
  const translate = value ? (small ? 'translate-x-4' : 'translate-x-6') : 'translate-x-0'

  return (
    <div
      onClick={handleClick}
      className={`
        app-toggler relative inline-flex items-center rounded-full cursor-pointer transition-colors duration-250 ease-in-out
        ${width} ${height}
        ${value ? 'bg-brand-primary' : 'bg-zinc-400 dark:bg-zinc-600'}
        ${className}
      `}
    >
      <div
        className={`
          handle absolute left-[3px] rounded-full bg-white shadow-md transition-transform duration-250 ease-in-out
          ${handleSize} ${translate}
        `}
      />
    </div>
  )
}
