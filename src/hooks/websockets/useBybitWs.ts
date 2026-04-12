import { useEffect, useRef } from 'react'
import { useMarketStore } from '@/store/useMarketStore'

export const useBybitWs = (markets: string[]) => {
  const setBybitTicker = useMarketStore((state) => state.setBybitTicker)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!markets || markets.length === 0) return

    const ws = new WebSocket('wss://stream.bybit.com/v5/public/linear')
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          op: 'subscribe',
          args: markets.map((m) => `tickers.${m}`),
        })
      )
    }

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data)
        if (json && json.data && json.topic && json.topic.startsWith('tickers.')) {
          const market = json.data.symbol
          const markPrice = json.data.markPrice

          if (market && markPrice !== undefined) {
            setBybitTicker(market, parseFloat(markPrice))
          }
        }
      } catch (e) {}
    }

    wsRef.current = ws

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
    }
  }, [markets.join(',')])
}
