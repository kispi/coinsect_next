import { useUIStore, ToastConfig } from '@/store/useUIStore'
import ModalBasic from '@/components/modals/ModalBasic'

export const ui = {
  modal: {
    custom: (component: React.ComponentType<any>, options?: any) => {
      return new Promise((resolve) => {
        useUIStore.getState().addModal({
          component,
          options,
          resolve,
        })
      })
    },
    basic: (options: any) => ui.modal.custom(ModalBasic, options),
    alert: (body: string, title: string = 'COMMON.NOTICE') => {
      return ui.modal.confirm({
        body,
        title,
        buttons: [{ text: 'COMMON.OK', class: 'btn-primary' }],
      })
    },
    confirm: (options: { title?: string; body: string; class?: string; buttons?: any[] }) => {
      const mergedOptions = {
        title: options.title || 'COMMON.NOTICE',
        body: options.body,
        buttons: options.buttons || [
          { text: 'COMMON.CANCEL', class: 'btn-default' },
          {
            text: 'COMMON.CONFIRM',
            class: options.class ? `btn-${options.class}` : 'btn-primary',
          },
        ],
      }
      return ui.modal.basic(mergedOptions)
    },
  },
  toast: {
    show: (html: string, options: Partial<ToastConfig> = {}) => {
      useUIStore.getState().addToast({
        html,
        type: options.type || 'success',
        duration: options.duration || 3000,
        action: options.action,
      })
    },
    success: (html: string, duration?: number) => {
      ui.toast.show(html, { type: 'success', duration })
    },
    error: (html: string, duration?: number) => {
      ui.toast.show(html, { type: 'error', duration })
    },
  },
  snackbar: {
    info: (html: string, duration?: number) => {
      useUIStore.getState().addSnackbar({ html, class: 'info', type: 'info', duration })
    },
    warning: (html: string, duration?: number) => {
      useUIStore.getState().addSnackbar({ html, class: 'warning', type: 'warning', duration })
    },
  },
}
