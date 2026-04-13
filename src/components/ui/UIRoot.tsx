'use client'

import React from 'react'
import { useUIStore, ModalConfig, ToastConfig, SnackbarConfig } from '@/store/StoreProvider'
import { X, Info, AlertTriangle } from 'lucide-react'
import { useT } from '@/hooks/useT'
import AppInitializer from '@/components/app/AppInitializer'

/**
 * ModalRenderer: Replicates Modal system with animations and backdrop support
 */
const ModalRenderer = ({ modal }: { modal: ModalConfig }) => {
  const removeModal = useUIStore((state) => state.removeModal)

  const handleClose = (value?: any) => {
    if (modal.resolve) modal.resolve(value)
    removeModal(modal.id)
  }

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!modal.component) return null
  const Component = modal.component

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-backdrop-in"
      onClick={onBackdropClick}
    >
      <div className="animate-modal-in w-full flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Component options={modal.options} onClose={handleClose} />
        </div>
      </div>
    </div>
  )
}

/**
 * ToastRenderer: Replicates AppToast.vue with top-center stacking and animations
 */
const ToastRenderer = ({ toast, index }: { toast: ToastConfig; index: number }) => {
  const removeToast = useUIStore((state) => state.removeToast)
  const { t } = useT()

  const typeStyles = {
    success: 'bg-zinc-800 text-white border-green-500/30',
    error: 'bg-rose-900/90 text-white border-rose-500/30',
    info: 'bg-sky-900/90 text-white border-sky-500/30',
    warning: 'bg-amber-900/90 text-white border-amber-500/30',
  }

  const handleAction = () => {
    if (toast.action?.handler) {
      toast.action.handler()
      removeToast(toast.id)
    }
  }

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[110] w-full max-w-[400px] px-4 animate-toast-in pointer-events-auto"
      style={{ top: `${24 + index * 60}px` }}
    >
      <div
        className={`
        flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl border backdrop-blur-md
        ${typeStyles[toast.type || 'success']}
      `}
      >
        <div
          className="flex-1 text-sm font-medium whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: t(toast.html) }}
        />
        {toast.action?.label && (
          <button
            onClick={handleAction}
            className="btn-outline btn-sm border-white/20 hover:bg-white/10 text-white"
          >
            {t(toast.action.label)}
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
      flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-xl border border-white/10
      bg-zinc-900/95 text-white min-w-[320px] animate-in slide-in-from-right-full duration-500
      ${snackbar.type === 'warning' ? 'bg-amber-700/95' : ''}
    `}
    >
      <div className="flex items-center gap-3 overflow-hidden text-sm">
        {snackbar.type === 'info' && <Info className="w-4 h-4 flex-shrink-0" />}
        {snackbar.type === 'warning' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
        <div
          className="text-xs font-medium truncate"
          dangerouslySetInnerHTML={{ __html: snackbar.html }}
        />
      </div>
      <button onClick={() => removeSnackbar(snackbar.id)} className="btn-ghost p-1 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function UIRoot() {
  const modals = useUIStore((state) => state.modals)
  const toasts = useUIStore((state) => state.toasts)
  const snackbars = useUIStore((state) => state.snackbars)

  return (
    <div className="ui-root">
      {/* Dynamic Modals */}
      {modals.map((modal) => (
        <ModalRenderer key={modal.id} modal={modal} />
      ))}

      {/* Stacked Toasts at Top Center */}
      <div className="fixed inset-0 pointer-events-none z-[110]">
        {toasts.map((toast, index) => (
          <ToastRenderer key={toast.id} toast={toast} index={index} />
        ))}
      </div>

      {/* Stacked Snackbars */}
      <div className="fixed bottom-6 right-6 z-[105] flex flex-col gap-2">
        {snackbars.map((sb) => (
          <SnackbarRenderer key={sb.id} snackbar={sb} />
        ))}
      </div>

      {/* Core Initializer */}
      <AppInitializer />
    </div>
  )
}
