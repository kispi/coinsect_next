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
import { createChatStore, ChatStore, ChatState } from '@/store/useChatStore'
import { createConfigStore, ConfigStore, ConfigState } from '@/store/useConfigStore'

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
  ChatStore,
  ChatState,
  ConfigStore,
  ConfigState,
}

export { useT } from '@/hooks/useT'

import { metaStorage } from '@/lib/storage'
import { setUIStore } from '@/lib/ui'

// 1. Contexts
export const AppStoreContext = createContext<AppStore | undefined>(undefined)
export const UserStoreContext = createContext<UserStore | undefined>(undefined)
export const MarketStoreContext = createContext<MarketStore | undefined>(undefined)
export const UIStoreContext = createContext<UIStore | undefined>(undefined)
export const ChatStoreContext = createContext<ChatStore | undefined>(undefined)
export const ConfigStoreContext = createContext<ConfigStore | undefined>(undefined)

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
    return createAppStore({
      messages: initialMessages || {},
      settings: {
        ...DEFAULT_SETTINGS,
        ...(initialLocale ? { locale: initialLocale } : {}),
        ...(initialTheme ? { theme: initialTheme } : {}),
      },
    })
  })

  const [userStore] = useState(() => createUserStore())
  const [marketStore] = useState(() => createMarketStore())
  const [uiStore] = useState(() => createUIStore())
  const [chatStore] = useState(() => createChatStore())
  const [configStore] = useState(() => createConfigStore())

  // Track hydration state to prevent double-runs or racing
  const isHydrated = useRef(false)
  const lastSync = useRef({
    locale: initialLocale,
    msgLen: initialMessages ? Object.keys(initialMessages).length : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Initial Client-Side Hydration (Runs once on mount)
    if (!isHydrated.current) {
      // Hydrate AppStore Settings
      const savedAppSettings = metaStorage.getItem<any>('settings')
      if (savedAppSettings) {
        appStore.setState((state) => ({
          settings: {
            ...state.settings,
            ...savedAppSettings,
            // Prioritize SSR-driven initial props if they differ
            locale: initialLocale || savedAppSettings.locale,
            theme: initialTheme || savedAppSettings.theme,
          },
        }))
      }

      // Hydrate UserStore (Profile & Token)
      const savedUser = metaStorage.getItem<any>('user')
      const savedToken = metaStorage.getItem<string>('token') // Or getCookie('token')
      if (savedUser || savedToken) {
        userStore.setState((state) => ({
          ...state,
          me: savedUser || state.me,
          authToken: savedToken || state.authToken,
        }))
        if (savedToken) {
          userStore.getState().setAuthToken(savedToken)
        }
      }

      // Hydrate ChatStore Settings
      const savedChatSettings = metaStorage.getItem<any>('chatSettings')
      if (savedChatSettings) {
        chatStore.setState((state) => ({
          ...state,
          settings: { ...state.settings, ...savedChatSettings },
        }))
      }

      isHydrated.current = true
    }

    // 2. Attach UI store to the static bridge
    setUIStore(uiStore)

    // 3. Sync Dynamic SSR Props (Locale/Messages) on navigation
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
  }, [initialLocale, initialMessages, appStore, uiStore, userStore, chatStore])

  return (
    <AppStoreContext.Provider value={appStore}>
      <UserStoreContext.Provider value={userStore}>
        <MarketStoreContext.Provider value={marketStore}>
          <UIStoreContext.Provider value={uiStore}>
            <ChatStoreContext.Provider value={chatStore}>
              <ConfigStoreContext.Provider value={configStore}>
                {children}
              </ConfigStoreContext.Provider>
            </ChatStoreContext.Provider>
          </UIStoreContext.Provider>
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

export function useUIStore<T>(selector?: (store: UIState) => T): T | UIState {
  const context = useContext(UIStoreContext)
  if (!context) throw new Error('useUIStore must be used within StoreProvider')

  return useStore(context, selector || ((s: UIState) => s as any))
}

export function useChatStore<T>(selector?: (store: ChatState) => T): T | ChatState {
  const context = useContext(ChatStoreContext)
  if (!context) throw new Error('useChatStore must be used within StoreProvider')

  return useStore(context, selector || ((s: ChatState) => s as any))
}

export function useConfigStore<T>(selector?: (store: ConfigState) => T): T | ConfigState {
  const context = useContext(ConfigStoreContext)
  if (!context) throw new Error('useConfigStore must be used within StoreProvider')

  return useStore(context, selector || ((s: ConfigState) => s as any))
}
