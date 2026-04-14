'use client'

import { createStore } from 'zustand'
import { metaStorage } from '@/lib/storage'
import { setCookie } from '@/lib/cookie'

export type CoinsectSetting = {
  locale: string
  dockFolded: boolean
  sort: {
    column: string
    direction: string
  }
  sortInterval: number
  theme: string
  documentTitleTicker: string
  currency: string
  filter: string
  tradingview: boolean
  chartFullWidth: boolean
  chartTool: boolean
  baseExchange: string
  baseExchangeMarket: string
  targetExchange: string
  favorites: Record<string, any>
  portfolio: Record<string, any>
  salary: {
    symbol: string
    preTax: number | null
    numFamily: number | null
    nonTax: number | null
  }
}

export interface AppState {
  settings: CoinsectSetting
  messages: any
  isMobile: boolean
  showNavigation: boolean
  setMessages: (messages: any) => void
  setSettings: (settings: Partial<CoinsectSetting>) => void
  setIsMobile: (isMobile: boolean) => void
  setShowNavigation: (show: boolean) => void
}

export const DEFAULT_SETTINGS: CoinsectSetting = {
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
}

export type AppStore = ReturnType<typeof createAppStore>

export const createAppStore = (initProps: Partial<AppState> = {}) => {
  return createStore<AppState>()((set) => ({
    settings: initProps.settings || DEFAULT_SETTINGS,
    messages: initProps.messages || {},
    isMobile: false,
    showNavigation: true,

    setMessages: (messages) => set({ messages }),

    setIsMobile: (isMobile) => set({ isMobile }),
    setShowNavigation: (showNavigation) => set({ showNavigation }),

    setSettings: (newSettings) => {
      set((state) => {
        const updatedSettings = { ...state.settings, ...newSettings }

        // localStorage is client-only
        if (typeof window !== 'undefined') {
          metaStorage.setItem('settings', updatedSettings)
        }

        // Sync settings to cookies if needed for SSR
        if (newSettings.locale) {
          setCookie('NEXT_LOCALE', newSettings.locale)
        }
        if (newSettings.theme) {
          setCookie('NEXT_THEME', newSettings.theme)
        }

        return { settings: updatedSettings }
      })
    },
  }))
}
