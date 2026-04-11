import { create } from 'zustand';

export type ModalButton = {
  text: string;
  class?: string;
  onClick?: () => void;
};

export type ModalConfig = {
  id: string;
  title?: string;
  body: string | React.ReactNode;
  buttons?: ModalButton[];
  component?: string;
  options?: any;
  resolve?: (value: any) => void;
  style?: any;
  bodyClass?: string;
  titleClass?: string;
};

export type ToastConfig = {
  show: boolean;
  html: string | null;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string | null;
    handler: (() => void) | null;
  };
};

export type SnackbarConfig = {
  id: string;
  html: string;
  class?: string;
  duration?: number;
  type?: 'info' | 'warning';
};

interface UIState {
  modals: ModalConfig[];
  toast: ToastConfig;
  snackbars: SnackbarConfig[];
  
  addModal: (modal: Omit<ModalConfig, 'id'>) => string;
  removeModal: (id: string) => void;
  removeAllModals: () => void;
  
  setToast: (toast: Partial<ToastConfig> | null) => void;
  
  addSnackbar: (snackbar: Omit<SnackbarConfig, 'id'>) => string;
  removeSnackbar: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  modals: [],
  toast: {
    show: false,
    html: null,
    action: {
      label: null,
      handler: null,
    },
  },
  snackbars: [],

  addModal: (modal) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({ modals: [...state.modals, { ...modal, id }] }));
    return id;
  },
  removeModal: (id) => set((state) => ({
    modals: state.modals.filter((m) => m.id !== id),
  })),
  removeAllModals: () => set({ modals: [] }),

  setToast: (payload) => {
    if (!payload) {
      set({
        toast: {
          show: false,
          html: null,
          action: { label: null, handler: null },
        },
      });
      return;
    }
    set((state) => ({
      toast: { ...state.toast, ...payload, show: true },
    }));
  },

  addSnackbar: (snackbar) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({ snackbars: [...state.snackbars, { ...snackbar, id }] }));
    if (snackbar.duration !== -1) {
      setTimeout(() => {
        set((s) => ({ snackbars: s.snackbars.filter((sb) => sb.id !== id) }));
      }, snackbar.duration || 5000);
    }
    return id;
  },
  removeSnackbar: (id) => set((state) => ({
    snackbars: state.snackbars.filter((sb) => sb.id !== id),
  })),
}));
