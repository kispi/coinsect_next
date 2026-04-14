'use client'

import { useEffect, useRef } from 'react'
import { getCookie } from '@/lib/cookie'
import { useUserStore, useConfigStore } from '@/store/StoreProvider'
import { api } from '@/lib/api'
import { CoinsectConfig } from '@/store/useConfigStore'

/**
 * AppInitializer component handles the initial bootstrap logic for the application.
 * It is responsible for loading the auth token from cookies and initializing essential state.
 * This should be rendered at the root level (e.g., in UIRoot).
 */
export default function AppInitializer() {
  const isStarted = useRef(false)
  const setAuthToken = useUserStore((state) => state.setAuthToken)
  const setConfig = useConfigStore((state) => state.setConfig)

  useEffect(() => {
    if (isStarted.current) return
    isStarted.current = true

    // 1. Initial Auth Token Load from Cookie
    const token = getCookie('token')
    if (token) setAuthToken(token)

    // 2. Initial Environment Setup
    // Fetch global config (emojis, etc.)
    api
      .get<CoinsectConfig>('config')
      .then((data) => {
        setConfig(data)
      })
      .catch((e) => console.error('Failed to load config', e))
  }, [setAuthToken, setConfig])

  return null
}
