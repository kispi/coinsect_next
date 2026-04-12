'use client'

import { create } from 'zustand'
import { User } from '@/types'
import { deleteCookie, getCookie } from '@/lib/cookie'
import { setAuthToken as setAuthTokenApi } from '@/lib/api'

interface UserState {
  me: User | null
  authToken: string | null
  setMe: (user: User | null) => void
  setAuthToken: (token: string | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => {
  // Initial token load for memory sync
  const initialToken = typeof window !== 'undefined' ? getCookie('token') || null : null
  if (initialToken) setAuthTokenApi(initialToken)

  return {
    me: null,
    authToken: initialToken,
    setMe: (me) => set({ me }),
    setAuthToken: (token) => {
      setAuthTokenApi(token) // Import as setAuthTokenApi to avoid name collision
      set({ authToken: token })
    },
    logout: () => {
      deleteCookie('token')
      setAuthTokenApi(null)
      set({ me: null, authToken: null })
      // Use window.location.reload() for a clean state reset if needed
      window.location.reload()
    },
  }
})
