'use client'

import { createStore } from 'zustand'

export interface TickerData {
  price: number
  direction: 'up' | 'down' | null
  timestamp: number
}

export interface MarketState {
  binanceTickers: Record<string, TickerData>
  upbitTickers: Record<string, TickerData>
  bybitTickers: Record<string, TickerData>
  usdKrw: number
  setBinanceTicker: (symbol: string, price: number) => void
  setUpbitTicker: (symbol: string, price: number) => void
  setBybitTicker: (symbol: string, price: number) => void
  setUsdKrw: (rate: number) => void
}

export type MarketStore = ReturnType<typeof createMarketStore>

export const createMarketStore = () => {
  return createStore<MarketState>((set) => ({
    binanceTickers: {},
    upbitTickers: {},
    bybitTickers: {},
    usdKrw: 1400,
    setBinanceTicker: (symbol, price) =>
      set((state) => {
        const prevEntry = state.binanceTickers[symbol]
        const prevPrice = prevEntry?.price
        let newDirection = prevEntry?.direction || null

        if (prevPrice !== undefined) {
          if (price > prevPrice) newDirection = 'up'
          else if (price < prevPrice) newDirection = 'down'
        }

        return {
          binanceTickers: {
            ...state.binanceTickers,
            [symbol]: { price, direction: newDirection, timestamp: Date.now() },
          },
        }
      }),
    setUpbitTicker: (symbol, price) =>
      set((state) => {
        const prevEntry = state.upbitTickers[symbol]
        const prevPrice = prevEntry?.price
        let newDirection = prevEntry?.direction || null

        if (prevPrice !== undefined) {
          if (price > prevPrice) newDirection = 'up'
          else if (price < prevPrice) newDirection = 'down'
        }

        return {
          upbitTickers: {
            ...state.upbitTickers,
            [symbol]: { price, direction: newDirection, timestamp: Date.now() },
          },
        }
      }),
    setBybitTicker: (symbol, price) =>
      set((state) => {
        const prevEntry = state.bybitTickers[symbol]
        const prevPrice = prevEntry?.price
        let newDirection = prevEntry?.direction || null

        if (prevPrice !== undefined) {
          if (price > prevPrice) newDirection = 'up'
          else if (price < prevPrice) newDirection = 'down'
        }

        return {
          bybitTickers: {
            ...state.bybitTickers,
            [symbol]: { price, direction: newDirection, timestamp: Date.now() },
          },
        }
      }),
    setUsdKrw: (rate) => set({ usdKrw: rate }),
  }))
}
