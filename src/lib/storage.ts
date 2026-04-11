/**
 * Interface to match the 'meta' stringified JSON logic from the original Vue 3 codebase.
 * Everything is stored under a single 'meta' key in localStorage.
 */
export const metaStorage = {
  getItem: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const metaStr = window.localStorage.getItem('meta');
      if (!metaStr) return null;
      const meta = JSON.parse(metaStr);
      return (meta[key] as T) ?? null;
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      const metaStr = window.localStorage.getItem('meta');
      let meta: Record<string, any> = {};
      
      if (metaStr) {
        try {
          meta = JSON.parse(metaStr);
        } catch {
          meta = {};
        }
      }
      
      meta[key] = value;
      window.localStorage.setItem('meta', JSON.stringify(meta));
    } catch {
      // Ignore
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const metaStr = window.localStorage.getItem('meta');
      if (!metaStr) return;
      const meta = JSON.parse(metaStr);
      delete meta[key];
      window.localStorage.setItem('meta', JSON.stringify(meta));
    } catch {
      // Ignore
    }
  }
};
