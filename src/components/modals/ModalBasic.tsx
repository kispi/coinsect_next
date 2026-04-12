'use client'

import React from 'react'
import { X } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import type { ModalButton } from '@/store/useUIStore'

interface Props {
  options: {
    title?: string
    body?: string | React.ReactNode
    buttons?: ModalButton[]
    style?: React.CSSProperties
    bodyClass?: string
    titleClass?: string
  }
  onClose: (value?: any) => void
}

export default function ModalBasic({ options, onClose }: Props) {
  const { i18n } = useI18n()
  const buttons = options.buttons || []

  return (
    <div
      className="modal-basic bg-background-base border border-border-base rounded shadow-2xl w-full max-w-[480px] overflow-hidden"
      style={options.style}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-base bg-background-light/30">
        <h3 className={`font-bold text-text-stress ${options.titleClass || ''}`}>
          {options.title ? i18n(options.title) : ''}
        </h3>
        <button
          onClick={() => onClose()}
          className="p-1 hover:bg-background-light rounded transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      {/* Modal Body */}
      <div className={`p-6 text-sm text-text-base whitespace-pre-line ${options.bodyClass || ''}`}>
        {typeof options.body === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: options.body }} />
        ) : (
          options.body
        )}
      </div>

      {/* Modal Buttons */}
      {buttons.length > 0 && (
        <div className="flex justify-center gap-4 p-4 mb-4">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => {
                if (btn.onClick) btn.onClick()
                onClose(i)
              }}
              className={`min-w-[120px] px-10 py-3 rounded font-bold transition-all cursor-pointer ${
                btn.class?.includes('primary')
                  ? 'bg-brand-primary text-white hover:opacity-90 shadow-sm'
                  : 'bg-background-light text-text-base hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-border-base'
              } ${btn.class || ''}`}
            >
              {i18n(btn.text)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
