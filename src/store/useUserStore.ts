'use client'

import { createStore } from 'zustand'
import { User } from '@/types'
import { deleteCookie } from '@/lib/cookie'
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
    return {
      me: null,
      authToken: null,
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
