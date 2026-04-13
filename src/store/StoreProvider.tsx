'use client'

import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react'
import { useStore } from 'zustand'

import {
  createAppStore,
  AppStore,
  AppState,
  DEFAULT_SETTINGS,
  CoinsectSetting,
} from '@/store/useAppStore'
import { createUserStore, UserStore, UserState } from '@/store/useUserStore'
import { createMarketStore, MarketStore, MarketState, TickerData } from '@/store/useMarketStore'
import {
  createUIStore,
  UIStore,
  UIState,
  ModalButton,
  ModalConfig,
  ToastConfig,
  SnackbarConfig,
} from '@/store/useUIStore'

export type {
  AppStore,
  UserStore,
  MarketStore,
  UIStore,
  AppState,
  CoinsectSetting,
  UserState,
  MarketState,
  TickerData,
  UIState,
  ModalButton,
  ModalConfig,
  ToastConfig,
  SnackbarConfig,
}

import { metaStorage } from '@/lib/storage'
import { setCookie } from '@/lib/cookie'
import { setUIStore } from '@/lib/ui'

// 1. Contexts
export const AppStoreContext = createContext<AppStore | undefined>(undefined)
export const UserStoreContext = createContext<UserStore | undefined>(undefined)
export const MarketStoreContext = createContext<MarketStore | undefined>(undefined)
export const UIStoreContext = createContext<UIStore | undefined>(undefined)

// 2. Provider Props
export interface StoreProviderProps {
  children: ReactNode
  initialMessages?: any
  initialLocale?: string
  initialTheme?: string
}

// 3. Provider Component
export const StoreProvider = ({
  children,
  initialMessages,
  initialLocale,
  initialTheme,
}: StoreProviderProps) => {
  // Initialize each store only once using useState for render-safety
  const [appStore] = useState(() => {
    const initSettings = {
      ...DEFAULT_SETTINGS,
      ...(initialLocale ? { locale: initialLocale } : {}),
      ...(initialTheme ? { theme: initialTheme } : {}),
    }
    const store = createAppStore({
      messages: initialMessages || {},
      settings: initSettings,
    })

    if (typeof window !== 'undefined') {
      const savedSettings = metaStorage.getItem<any>('settings')
      if (savedSettings) {
        store.setState((state) => ({
          settings: {
            ...state.settings,
            ...savedSettings,
            locale: initialLocale || savedSettings.locale,
            theme: initialTheme || savedSettings.theme,
          },
        }))
        setCookie('NEXT_LOCALE', store.getState().settings.locale)
        setCookie('NEXT_THEME', store.getState().settings.theme)
      }
    }
    return store
  })

  // Other stores initialization
  const [userStore] = useState(() => createUserStore())
  const [marketStore] = useState(() => createMarketStore())
  const [uiStore] = useState(() => {
    const store = createUIStore()
    setUIStore(store)
    return store
  })

  // Handle dynamic prop updates for AppStore (locale change)
  const lastSync = useRef({
    locale: initialLocale,
    msgLen: initialMessages ? Object.keys(initialMessages).length : 0,
  })

  useEffect(() => {
    const currentMsgLen = initialMessages ? Object.keys(initialMessages).length : 0
    if (initialLocale !== lastSync.current.locale || currentMsgLen !== lastSync.current.msgLen) {
      appStore.setState((state) => ({
        settings: { ...state.settings, locale: initialLocale || state.settings.locale },
        messages: initialMessages || state.messages,
      }))
      lastSync.current = {
        locale: initialLocale,
        msgLen: currentMsgLen,
      }
    }
  }, [initialLocale, initialMessages, appStore])

  return (
    <AppStoreContext.Provider value={appStore}>
      <UserStoreContext.Provider value={userStore}>
        <MarketStoreContext.Provider value={marketStore}>
          <UIStoreContext.Provider value={uiStore}>{children}</UIStoreContext.Provider>
        </MarketStoreContext.Provider>
      </UserStoreContext.Provider>
    </AppStoreContext.Provider>
  )
}

// 4. Standardized Hooks
export function useAppStore<T>(selector: (store: AppState) => T): T
export function useAppStore(): AppState
export function useAppStore<T>(selector?: (store: AppState) => T): T | AppState {
  const context = useContext(AppStoreContext)
  if (!context) throw new Error('useAppStore must be used within StoreProvider')
  return useStore(context, selector as (store: AppState) => T)
}

export function useUserStore<T>(selector: (store: UserState) => T): T
export function useUserStore(): UserState
export function useUserStore<T>(selector?: (store: UserState) => T): T | UserState {
  const context = useContext(UserStoreContext)
  if (!context) throw new Error('useUserStore must be used within StoreProvider')
  return useStore(context, selector as (store: UserState) => T)
}

export function useMarketStore<T>(selector: (store: MarketState) => T): T
export function useMarketStore(): MarketState
export function useMarketStore<T>(selector?: (store: MarketState) => T): T | MarketState {
  const context = useContext(MarketStoreContext)
  if (!context) throw new Error('useMarketStore must be used within StoreProvider')
  return useStore(context, selector as (store: MarketState) => T)
}

export function useUIStore<T>(selector: (store: UIState) => T): T
export function useUIStore(): UIState
export function useUIStore<T>(selector?: (store: UIState) => T): T | UIState {
  const context = useContext(UIStoreContext)
  if (!context) throw new Error('useUIStore must be used within StoreProvider')
  return useStore(context, selector as (store: UIState) => T)
}
