'use client'

import React, { useEffect, useRef } from 'react'
import { useUIStore, ModalConfig, ToastConfig, SnackbarConfig } from '@/store/useUIStore'
import { X, Info, AlertTriangle } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'

/**
 * ModalRenderer: Replicates ModalBasic.vue
 */
const ModalRenderer = ({ modal }: { modal: ModalConfig }) => {
  const removeModal = useUIStore((state) => state.removeModal)
  const { i18n } = useI18n()

  const handleClose = (value?: any) => {
    if (modal.resolve) modal.resolve(value)
    removeModal(modal.id)
  }

  const buttons = modal.buttons || []

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-background-base border border-border-base rounded shadow-2xl w-full max-w-[480px] overflow-hidden animate-in zoom-in-95 duration-200"
        style={modal.style}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-base bg-background-light/30">
          <h3 className={`font-bold text-text-stress ${modal.titleClass || ''}`}>
            {modal.title ? i18n(modal.title) : ''}
          </h3>
          <button
            onClick={() => handleClose()}
            className="p-1 hover:bg-background-light rounded transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Modal Body */}
        <div className={`p-6 text-sm text-text-base whitespace-pre-line ${modal.bodyClass || ''}`}>
          {typeof modal.body === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: modal.body }} />
          ) : (
            modal.body
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
                  handleClose(i)
                }}
                className={`min-w-[120px] px-10 py-3 rounded font-bold transition-all ${
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
    </div>
  )
}

/**
 * ToastRenderer: Replicates AppToast.vue
 */
const ToastRenderer = ({ toast }: { toast: ToastConfig }) => {
  const setToast = useUIStore((state) => state.setToast)
  const { i18n } = useI18n()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (toast.show && (toast.duration ?? 0) >= 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setToast(null)
      }, toast.duration || 3000)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [toast.show, toast.duration, setToast])

  if (!toast.show || !toast.html) return null

  const typeStyles = {
    success: 'bg-zinc-700 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-sky-600 text-white',
    warning: 'bg-amber-600 text-white',
  }

  const handleAction = () => {
    if (toast.action?.handler) {
      toast.action.handler()
      setToast(null)
    }
  }

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[110] w-full max-w-[480px] px-4 animate-in slide-in-from-bottom-8 duration-300">
      <div
        className={`
        flex items-center gap-4 px-6 py-4 rounded shadow-2xl border border-white/10
        ${typeStyles[toast.type || 'success']}
      `}
      >
        <div
          className="flex-1 text-sm font-medium whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: i18n(toast.html) }}
        />
        {toast.action?.label && (
          <button
            onClick={handleAction}
            className="px-3 py-1.5 border border-white rounded font-bold text-xs hover:bg-white/10 transition-colors"
          >
            {i18n(toast.action.label)}
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * SnackbarRenderer: Replicates AppSnackbar.vue
 */
const SnackbarRenderer = ({ snackbar }: { snackbar: SnackbarConfig }) => {
  const removeSnackbar = useUIStore((state) => state.removeSnackbar)

  return (
    <div
      className={`
      flex items-center justify-between gap-3 px-4 py-3 rounded shadow-xl border border-white/10
      bg-zinc-800/95 text-white min-w-[320px] animate-in slide-in-from-right-full duration-500
      ${snackbar.type === 'warning' ? 'bg-amber-600/95' : ''}
    `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {snackbar.type === 'info' && <Info className="w-4 h-4 flex-shrink-0" />}
        {snackbar.type === 'warning' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
        <div
          className="text-xs font-medium truncate"
          dangerouslySetInnerHTML={{ __html: snackbar.html }}
        />
      </div>
      <button
        onClick={() => removeSnackbar(snackbar.id)}
        className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function UIRoot() {
  const modals = useUIStore((state) => state.modals)
  const toast = useUIStore((state) => state.toast)
  const snackbars = useUIStore((state) => state.snackbars)

  return (
    <div className="ui-root">
      {/* Dynamic Modals */}
      {modals.map((modal) => (
        <ModalRenderer key={modal.id} modal={modal} />
      ))}

      {/* Single Global Toast */}
      <ToastRenderer toast={toast} />

      {/* Stacked Snackbars */}
      <div className="fixed bottom-6 right-6 z-[105] flex flex-col gap-2">
        {snackbars.map((sb) => (
          <SnackbarRenderer key={sb.id} snackbar={sb} />
        ))}
      </div>
    </div>
  )
}
