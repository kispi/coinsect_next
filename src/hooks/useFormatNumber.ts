'use client'

'use client'

import { useAppStore } from '@/store/StoreProvider'
import { useMarketStore } from '@/store/StoreProvider'
import { useCallback } from 'react'

export interface FormatPriceOptions {
  price: number
  baseCurrency: string
  fracs?: number
  noConversion?: boolean
}

export interface FormatCapOptions {
  cap: number
  baseCurrency: string
  numKorUnits?: number
}

/**
 * Ported from legacy Vue helpers/number.ts.
 * Refactored as a React hook to handle reactive dependencies (settings, exchange rates).
 */
export function useFormatNumber() {
  const settings = useAppStore((state) => state.settings)
  const usdKrw = useMarketStore((state) => state.usdKrw)

  const getConversionRatio = useCallback(
    ({ baseCurrency, noConversion }: { baseCurrency: string; noConversion?: boolean }) => {
      if (
        noConversion ||
        baseCurrency === settings.currency ||
        settings.baseExchangeMarket === 'btc'
      )
        return 1

      // Use current global usdKrw rate for conversions
      if (baseCurrency === 'krw' && settings.currency === 'usd') return 1 / usdKrw
      if (baseCurrency === 'usd' && settings.currency === 'krw') return usdKrw

      return 1
    },
    [settings.currency, settings.baseExchangeMarket, usdKrw]
  )

  const formatPrice = useCallback(
    ({ price, baseCurrency, fracs, noConversion }: FormatPriceOptions) => {
      const ratio = getConversionRatio({ baseCurrency, noConversion })
      const converted = price * ratio

      let numFracs = 0
      if (settings.baseExchangeMarket === 'btc') {
        numFracs = 8
      } else {
        const abs = Math.abs(converted)
        if (abs < 1000) numFracs = 1
        if (abs < 100) numFracs = 2
        if (abs < 10) numFracs = 3
        if (abs < 1) numFracs = 4
        if (abs < 0.1) numFracs = 5
        if (abs < 0.01) numFracs = 6
      }

      if (converted === 0) numFracs = 2

      return converted.toLocaleString(undefined, {
        maximumFractionDigits: fracs ?? numFracs,
        minimumFractionDigits: fracs ?? numFracs,
      })
    },
    [getConversionRatio, settings.baseExchangeMarket]
  )

  const formatKorean = useCallback((value: number, numKorUnits = 2) => {
    const units = [
      { key: '조', val: Math.pow(10, 12) },
      { key: '억', val: Math.pow(10, 8) },
      { key: '만', val: Math.pow(10, 4) },
      { key: '', val: Math.pow(10, 0) },
    ]

    const result: string[] = []
    let current = value

    units.forEach((unit) => {
      const numbers = Math.floor(current / unit.val)
      if (numbers >= 1) {
        current -= numbers * unit.val
        result.push(`${numbers.toLocaleString()}${unit.key}`)
      }
    })

    return result.slice(0, numKorUnits).join(' ') || '0'
  }, [])

  const formatCap = useCallback(
    ({ cap, baseCurrency, numKorUnits = 2 }: FormatCapOptions) => {
      const ratio = getConversionRatio({ baseCurrency })
      const converted = cap * ratio

      if (baseCurrency === 'btc') {
        return converted.toLocaleString(undefined, {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        })
      }

      if (settings.locale === 'en') {
        const absConverted = Math.abs(converted)
        if (absConverted / Math.pow(10, 12) >= 1)
          return `${Math.round((converted / Math.pow(10, 12)) * 10000) / 10000}T`
        if (absConverted / Math.pow(10, 9) >= 1)
          return `${Math.round((converted / Math.pow(10, 9)) * 10000) / 10000}B`
        if (absConverted / Math.pow(10, 6) >= 1)
          return `${Math.round((converted / Math.pow(10, 6)) * 10000) / 10000}M`
        if (absConverted / Math.pow(10, 3) >= 1)
          return `${Math.round((converted / Math.pow(10, 3)) * 10000) / 10000}K`
        return String(Math.round(converted * 10000) / 10000)
      }

      // Default to Korean numbering system (조, 억, 만)
      return formatKorean(converted, numKorUnits)
    },
    [getConversionRatio, settings.locale, formatKorean]
  )

  const formatPercent = useCallback((val: number) => {
    return val.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  }, [])

  return {
    formatPrice,
    formatCap,
    formatKorean,
    formatPercent,
  }
}
