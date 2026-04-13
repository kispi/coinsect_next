import { UIStore, ToastConfig } from '@/store/StoreProvider'
import ModalBasic from '@/components/modals/ModalBasic'

let uiStore: UIStore | null = null

export const setUIStore = (store: UIStore) => {
  uiStore = store
}

export const ui = {
  modal: {
    custom: (component: React.ComponentType<any>, options?: any) => {
      return new Promise((resolve) => {
        if (!uiStore) {
          console.warn(
            '[UI Bridge] ui.modal called before store was attached to the bridge. Ensure StoreProvider is mounted.'
          )
          return
        }
        uiStore.getState().addModal({
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
      if (!uiStore) return
      uiStore.getState().addToast({
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
      if (!uiStore) return
      uiStore.getState().addSnackbar({ html, class: 'info', type: 'info', duration })
    },
    warning: (html: string, duration?: number) => {
      if (!uiStore) return
      uiStore.getState().addSnackbar({ html, class: 'warning', type: 'warning', duration })
    },
  },
}
