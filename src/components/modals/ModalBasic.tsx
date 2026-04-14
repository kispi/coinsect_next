'use client'

import React from 'react'
import ModalHeader from '@/components/common/modal/ModalHeader'
import { useT, ModalButton } from '@/store/StoreProvider'

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
  const { t } = useT()
  const buttons = options.buttons || []

  return (
    <div
      className="modal-basic bg-background-base border border-border-base rounded shadow-2xl w-[480px] max-w-[calc(100vw-32px)] overflow-hidden"
      style={options.style}
    >
      <ModalHeader
        title={options.title ? t(options.title) : ''}
        titleClass={options.titleClass}
        onClose={onClose}
      />

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
              className={`min-w-[120px] ${
                btn.class?.includes('primary') ? 'btn-primary' : 'btn-default'
              } btn-lg ${btn.class || ''}`}
            >
              {t(btn.text)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
