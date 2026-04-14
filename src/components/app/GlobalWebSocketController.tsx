'use client'

import { useDashboards } from '@/hooks/api/useDashboards'
import { useBybitWs } from '@/hooks/websockets/useBybitWs'
import { useChatWs } from '@/hooks/websockets/useChatWs'
import { useMemo } from 'react'

/**
 * GlobalWebSocketController
 * Manages app-wide WebSocket connections.
 * This component does not render any UI.
 */
export default function GlobalWebSocketController() {
  const { data: dashboards } = useDashboards()

  // 1. Chat & General Socket
  useChatWs()

  // 2. Bybit Socket (Dynamic based on positions)
  const bybitMarkets = useMemo(() => {
    if (!dashboards?.realTimePositions?.data) return []
    const set = new Set<string>()
    dashboards.realTimePositions.data.forEach((pos) => {
      if (pos.contract) set.add(pos.contract)
    })
    return Array.from(set)
  }, [dashboards])

  useBybitWs(bybitMarkets)

  return null
}
