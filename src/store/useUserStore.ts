'use client'

import { createStore } from 'zustand'
import { User } from '@/types'
import { deleteCookie, getCookie } from '@/lib/cookie'
import { setAuthToken as setAuthTokenApi } from '@/lib/api'

export interface UserState {
  me: User | null
  authToken: string | null
  setMe: (user: User | null) => void
  setAuthToken: (token: string | null) => void
  logout: () => void
}

export type UserStore = ReturnType<typeof createUserStore>

export const createUserStore = () => {
  return createStore<UserState>((set) => {
    // Initial token load for memory sync
    const initialToken = typeof window !== 'undefined' ? getCookie('token') || null : null
    if (initialToken) setAuthTokenApi(initialToken)

    return {
      me: null,
      authToken: initialToken,
      setMe: (me) => set({ me }),
      setAuthToken: (token) => {
        setAuthTokenApi(token)
        set({ authToken: token })
      },
      logout: () => {
        deleteCookie('token')
        setAuthTokenApi(null)
        set({ me: null, authToken: null })
        window.location.reload()
      },
    }
  })
}
