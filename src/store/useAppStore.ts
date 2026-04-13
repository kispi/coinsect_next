'use client'

import { createStore } from 'zustand'
import { metaStorage } from '@/lib/storage'
import { setCookie } from '@/lib/cookie'

export type CoinsectSetting = {
  blockedUsers: Record<string, any>
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
  chatFolded: boolean | null
  chatSizeMax: boolean | null
  chatDing: boolean | null
  chatTransparent: boolean | null
  chatOverlayNewMessage: boolean | null
  chatSkin: string | null
}

export interface AppState {
  settings: CoinsectSetting
  messages: any
  setMessages: (messages: any) => void
  setSettings: (settings: Partial<CoinsectSetting>) => void
}

export const DEFAULT_SETTINGS: CoinsectSetting = {
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
}

export type AppStore = ReturnType<typeof createAppStore>

export const createAppStore = (initProps: Partial<AppState> = {}) => {
  return createStore<AppState>()((set) => ({
    settings: initProps.settings || DEFAULT_SETTINGS,
    messages: initProps.messages || {},

    setMessages: (messages) => set({ messages }),

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
