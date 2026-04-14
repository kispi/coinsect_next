'use client'

import React from 'react'

interface BadgeUnreadsProps {
  numUnreads?: number
  small?: boolean
  className?: string
}

export default function BadgeUnreads({
  numUnreads = 0,
  small = false,
  className = '',
}: BadgeUnreadsProps) {
  if (numUnreads <= 0) return null

  const displayValue = numUnreads > 49 ? '49+' : numUnreads

  return (
    <div
      className={`
        badge-unreads flex items-center justify-center pointer-events-none rounded-full
        bg-red-500 text-white font-bold shadow-lg ring-1 ring-white/20
        ${small ? 'min-w-[16px] min-h-[16px] px-1 text-[8px]' : 'min-w-[24px] min-h-[24px] p-1 text-[11px]'}
        ${className}
      `}
    >
      {displayValue}
    </div>
  )
}
