'use client'

import React from 'react'
import { X, ChevronLeft } from 'lucide-react'

interface ModalHeaderProps {
  title?: string
  titleClass?: string
  useBackButton?: boolean
  onClose: () => void
  onBack?: () => void
}

export default function ModalHeader({
  title,
  titleClass = '',
  useBackButton = false,
  onClose,
  onBack,
}: ModalHeaderProps) {
  return (
    <div className="modal-header relative flex items-center justify-center h-10 md:h-12 border-b border-border-base bg-background-light/30 select-none">
      {useBackButton && (
        <button
          onClick={onBack}
          className="absolute left-2 p-2 text-white hover:text-text-stress transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        className={`title text-sm md:text-base font-bold text-text-stress pointer-events-none ${titleClass}`}
        dangerouslySetInnerHTML={title ? { __html: title } : undefined}
      />

      <div
        onClick={() => onClose()}
        className="closer-container absolute top-0 right-0 bottom-0 w-10 md:w-12 flex items-center justify-center bg-gs-44 hover:bg-gs-66 cursor-pointer transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </div>
    </div>
  )
}
