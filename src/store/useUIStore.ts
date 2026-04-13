import { createStore } from 'zustand'

export type ModalButton = {
  text: string
  class?: string
  onClick?: () => void
}

export type ModalConfig = {
  id: string
  title?: string
  body?: string | React.ReactNode
  buttons?: ModalButton[]
  component?: React.ComponentType<any>
  options?: any
  resolve?: (value: any) => void
  style?: React.CSSProperties
  bodyClass?: string
  titleClass?: string
  closeOnBackdrop?: boolean
}

export type ToastConfig = {
  id: string
  html: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  action?: {
    label: string | null
    handler: (() => void) | null
  }
}

export type SnackbarConfig = {
  id: string
  html: string
  class?: string
  duration?: number
  type?: 'info' | 'warning'
}

export interface UIState {
  modals: ModalConfig[]
  toasts: ToastConfig[]
  snackbars: SnackbarConfig[]

  addModal: (modal: Omit<ModalConfig, 'id'>) => string
  removeModal: (id: string) => void
  removeAllModals: () => void

  addToast: (toast: Omit<ToastConfig, 'id'>) => string
  removeToast: (id: string) => void

  addSnackbar: (snackbar: Omit<SnackbarConfig, 'id'>) => string
  removeSnackbar: (id: string) => void
}

export type UIStore = ReturnType<typeof createUIStore>

export const createUIStore = () => {
  return createStore<UIState>((set) => ({
    modals: [],
    toasts: [],
    snackbars: [],

    addModal: (modal) => {
      const id = Math.random().toString(36).substring(7)
      set((state) => ({ modals: [...state.modals, { ...modal, id }] }))
      return id
    },
    removeModal: (id) =>
      set((state) => ({
        modals: state.modals.filter((m) => m.id !== id),
      })),
    removeAllModals: () => set({ modals: [] }),

    addToast: (toast) => {
      const id = Math.random().toString(36).substring(7)
      set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
      if ((toast.duration || 3000) > 0) {
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
        }, toast.duration || 3000)
      }
      return id
    },
    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),

    addSnackbar: (snackbar) => {
      const id = Math.random().toString(36).substring(7)
      set((state) => ({ snackbars: [...state.snackbars, { ...snackbar, id }] }))
      if (snackbar.duration !== -1) {
        setTimeout(() => {
          set((s) => ({ snackbars: s.snackbars.filter((sb) => sb.id !== id) }))
        }, snackbar.duration || 5000)
      }
      return id
    },
    removeSnackbar: (id) =>
      set((state) => ({
        snackbars: state.snackbars.filter((sb) => sb.id !== id),
      })),
  }))
}
