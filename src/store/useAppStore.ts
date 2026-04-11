'use client';

import { create } from 'zustand';
import { metaStorage } from '@/lib/storage';
import { setCookie } from '@/lib/cookie';

export type CoinsectSetting = {
  blockedUsers: Record<string, any>;
  locale: string;
  dockFolded: boolean;
  sort: {
    column: string;
    direction: string;
  };
  sortInterval: number;
  theme: string;
  documentTitleTicker: string;
  currency: string;
  filter: string;
  tradingview: boolean;
  chartFullWidth: boolean;
  chartTool: boolean;
  baseExchange: string;
  baseExchangeMarket: string;
  targetExchange: string;
  favorites: Record<string, any>;
  portfolio: Record<string, any>;
  salary: {
    symbol: string;
    preTax: number | null;
    numFamily: number | null;
    nonTax: number | null;
  };
  chatFolded: boolean | null;
  chatSizeMax: boolean | null;
  chatDing: boolean | null;
  chatTransparent: boolean | null;
  chatOverlayNewMessage: boolean | null;
  chatSkin: string | null;
};

interface AppState {
  settings: CoinsectSetting;
  messages: any;
  setMessages: (messages: any) => void;
  setSettings: (settings: Partial<CoinsectSetting>) => void;
  loadMessages: (locale: string) => Promise<void>;
}

const DEFAULT_SETTINGS: CoinsectSetting = {
  blockedUsers: {},
  locale: 'ko',
  dockFolded: false,
  sort: {
    column: '$$vol24HBase',
    direction: 'desc',
  },
  sortInterval: 5000,
  theme: 'dark',
  documentTitleTicker: 'BTC',
  currency: 'krw',
  filter: 'all',
  tradingview: true,
  chartFullWidth: false,
  chartTool: true,
  baseExchange: 'upbit',
  baseExchangeMarket: 'krw',
  targetExchange: 'binance',
  favorites: {},
  portfolio: {},
  salary: {
    symbol: 'BTC',
    preTax: 22000000,
    numFamily: 1,
    nonTax: 1200000,
  },
  chatFolded: false,
  chatSizeMax: false,
  chatDing: false,
  chatTransparent: false,
  chatOverlayNewMessage: true,
  chatSkin: 'basic',
};

// Module-level i18n message cache - survives BFCache restoration and
// is available synchronously before React effects run.
let messagesCache: Record<string, string> = {};

export const useAppStore = create<AppState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  messages: messagesCache,
  
  setMessages: (messages) => set({ messages }),

  setSettings: (newSettings) => {
    // If locale is changing, we handle it through loadMessages for atomic update
    if (newSettings.locale && newSettings.locale !== get().settings.locale) {
      get().loadMessages(newSettings.locale);
      // Remove locale from this batch update to prevent race condition
      const { locale, ...otherSettings } = newSettings;
      if (Object.keys(otherSettings).length === 0) return;
      newSettings = otherSettings;
    }

    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };
      metaStorage.setItem('settings', updatedSettings);
      
      // Sync basic settings to cookies if needed for SSR (currently focusing on locale)
      if (newSettings.theme) {
        // Option to sync theme to cookie too if needed
      }

      return { settings: updatedSettings };
    });
  },

  loadMessages: async (locale: string) => {
    try {
      const response = await fetch(`/locales/${locale}.json`);
      if (!response.ok) throw new Error('Failed to load locale');
      const messages = await response.json();

      // Update module-level cache so BFCache restorations
      // can seed the store synchronously before effects run.
      messagesCache = messages;

      set((state) => {
        const updatedSettings = { ...state.settings, locale };
        metaStorage.setItem('settings', updatedSettings);
        setCookie('NEXT_LOCALE', locale);
        return { messages, settings: updatedSettings };
      });
    } catch (e) {
      console.error('i18n load error:', e);
    }
  }
}));

// Initialize store from localStorage on client side
if (typeof window !== 'undefined') {
  const savedSettings = metaStorage.getItem<CoinsectSetting>('settings');
  if (savedSettings) {
    useAppStore.setState({ settings: savedSettings });
    // Ensure cookie is in sync with localStorage on load
    setCookie('NEXT_LOCALE', savedSettings.locale);
  }
}
