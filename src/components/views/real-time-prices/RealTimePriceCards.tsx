'use client'

import React from 'react'
import RealTimePriceCard from './RealTimePriceCard'
import { useBinanceWs } from '@/hooks/websockets/useBinanceWs'
import { useUpbitWs } from '@/hooks/websockets/useUpbitWs'

interface Props {
  symbols: string[]
}

export default function RealTimePriceCards({ symbols }: Props) {
  useBinanceWs(symbols)
  useUpbitWs(symbols)

  return (
    <div className="real-time-price-cards grid grid-cols-2 gap-1">
      {symbols.map((symbol, index) => (
        <div key={symbol} className={index === 0 ? 'col-span-2' : 'col-span-1'}>
          <RealTimePriceCard symbol={symbol} />
        </div>
      ))}
    </div>
  )
}
