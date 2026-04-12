import { useUIStore, ToastConfig } from '@/store/useUIStore'

export const ui = {
  modal: {
    alert: (body: string, title: string = '알림') => {
      return new Promise((resolve) => {
        useUIStore.getState().addModal({
          title,
          body,
          buttons: [{ text: 'COMMON.OK', class: 'btn-primary', onClick: () => resolve(true) }],
          resolve,
        })
      })
    },
    confirm: (options: { title?: string; body: string; class?: string }) => {
      return new Promise((resolve) => {
        useUIStore.getState().addModal({
          title: options.title || 'COMMON.NOTICE',
          body: options.body,
          buttons: [
            { text: 'COMMON.CANCEL', class: 'btn-default', onClick: () => resolve(0) },
            {
              text: 'COMMON.CONFIRM',
              class: options.class ? `btn-${options.class}` : 'btn-primary',
              onClick: () => resolve(1),
            },
          ],
          resolve,
        })
      })
    },
    custom: (component: React.ComponentType<any>, options?: any) => {
      return new Promise((resolve) => {
        useUIStore.getState().addModal({
          component,
          body: '',
          options,
          resolve,
        })
      })
    },
  },
  toast: {
    show: (html: string, options: Partial<ToastConfig> = {}) => {
      useUIStore.getState().setToast({
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
