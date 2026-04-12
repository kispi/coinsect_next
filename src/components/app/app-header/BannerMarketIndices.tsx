'use client'

import React from 'react'
import { useIndices } from '@/hooks/api/useIndices'
import { useI18n } from '@/hooks/useI18n'
import { useFormatNumber } from '@/hooks/useFormatNumber'
import { useMarketStore } from '@/store/useMarketStore'

export default function BannerMarketIndices() {
  const { data: indices } = useIndices()
  const { i18n } = useI18n()
  const { formatCap } = useFormatNumber()
  const usdKrw = useMarketStore((state) => state.usdKrw)
  const setUsdKrw = useMarketStore((state) => state.setUsdKrw)

  // Sync latest USD/KRW rate from indices API
  React.useEffect(() => {
    if (indices?.basePrice) {
      const rounded = Math.round(indices.basePrice * 10) / 10
      setUsdKrw(rounded)
    }
  }, [indices?.basePrice, setUsdKrw])

  const items = [
    {
      key: 'COMMON.USD/KRW',
      link: 'https://www.tradingview.com/chart/tKmOIPae/?symbol=USDKRW',
      value: usdKrw ? usdKrw.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '-',
    },
    {
      key: 'COMMON.BTC_DOMINANCE',
      link: 'https://www.tradingview.com/chart/tKmOIPae/?symbol=CRYPTOCAP%3ABTC.D',
      value: indices ? `${indices.btcDominance}%` : '-',
    },
    {
      key: 'COMMON.TOTAL_MARKET_CAP',
      link: 'https://www.tradingview.com/chart/tKmOIPae/?symbol=CRYPTOCAP%3ATOTAL',
      value: indices ? formatCap({ cap: indices.totalMarketCap, baseCurrency: 'usd' }) : '-',
    },
  ]

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
      {items.map((item) => (
        <a
          key={item.key}
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 whitespace-nowrap text-[11px] md:text-xs hover:opacity-70 transition-opacity"
        >
          <span className="text-text-base opacity-70">{i18n(item.key)}</span>
          <span className="text-text-stress font-mono font-medium">{item.value}</span>
        </a>
      ))}
    </div>
  )
}
