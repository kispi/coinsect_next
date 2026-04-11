import { create } from 'zustand';
import { metaStorage } from '@/lib/storage';

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
  setSettings: (settings: Partial<CoinsectSetting>) => void;
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

export const useAppStore = create<AppState>((set) => ({
  settings: DEFAULT_SETTINGS,
  setSettings: (newSettings) =>
    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };
      // Sync to localStorage manually to match Vue behavior (no 'state' wrapper)
      metaStorage.setItem('settings', updatedSettings);
      return { settings: updatedSettings };
    }),
}));

// Initialize store from localStorage on client side
if (typeof window !== 'undefined') {
  const savedSettings = metaStorage.getItem<CoinsectSetting>('settings');
  if (savedSettings) {
    useAppStore.setState({ settings: savedSettings });
  }
}
