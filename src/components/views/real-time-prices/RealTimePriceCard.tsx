import React, { useMemo } from 'react'
import { useMarketStore } from '@/store/useMarketStore'
import { useAppStore } from '@/store/useAppStore'
import { useFormatNumber } from '@/hooks/useFormatNumber'
import { ui } from '@/lib/ui'
import { useI18n } from '@/hooks/useI18n'

interface Props {
  symbol: string
}

export default function RealTimePriceCard({ symbol }: Props) {
  const { setSettings } = useAppStore()
  const documentTitleTicker = useAppStore((state) => state.settings.documentTitleTicker)

  const { t } = useI18n()

  const { formatPrice } = useFormatNumber()

  const binanceSymbol = `${symbol}USDT`
  const upbitSymbol = `KRW-${symbol}`

  const tickerBinance = useMarketStore((state) => state.binanceTickers[binanceSymbol])
  const tickerUpbit = useMarketStore((state) => state.upbitTickers[upbitSymbol])
  const usdKrw = useMarketStore((state) => state.usdKrw)

  const premiumUpbit = useMemo(() => {
    if (tickerUpbit?.price && tickerBinance?.price && usdKrw) {
      return ((tickerUpbit.price / usdKrw / tickerBinance.price - 1) * 100).toFixed(2)
    }
    return null
  }, [tickerUpbit?.price, tickerBinance?.price, usdKrw])

  // Set document title if selected
  React.useEffect(() => {
    if (documentTitleTicker === symbol && tickerBinance?.price) {
      const formattedPrice = formatPrice({
        price: tickerBinance.price,
        baseCurrency: 'usd',
        noConversion: true,
      })
      document.title = `${formattedPrice} ${symbol}/USDT`
    }
  }, [documentTitleTicker, symbol, tickerBinance?.price, formatPrice])

  const handleSelectTicker = () => {
    if (tickerBinance?.price) {
      setSettings({ documentTitleTicker: symbol })
      // Usually there's a toast here, omitting for simplicity or add later

      ui.toast.success(t('TOAST.REAL_TIME_TICKER_SELECTED', { symbol }))
    }
  }

  const isUp = tickerBinance?.direction === 'up'
  const isDown = tickerBinance?.direction === 'down'

  const containerClass = `
    flex flex-col gap-1 p-2 rounded items-center justify-center text-xs cursor-pointer transition-colors duration-300
    ${isUp ? 'bg-price-up-bg hover:bg-price-up-bg' : ''}
    ${isDown ? 'bg-price-down-bg hover:bg-price-down-bg' : ''}
    ${!isUp && !isDown ? 'bg-background-light hover:bg-border-base' : ''}
  `

  const priceClass = `
    font-bold text-sm tracking-tight transition-colors duration-100
    ${isUp ? 'text-price-up' : ''}
    ${isDown ? 'text-price-down' : ''}
    ${!isUp && !isDown ? 'text-text-base' : ''}
  `

  return (
    <div onClick={handleSelectTicker} className={containerClass}>
      <div className="flex items-center gap-2">
        <div className="flex items-center font-bold">
          {tickerBinance ? (
            <img
              src={`https://static.upbit.com/logos/${symbol}.png`}
              alt={symbol}
              className="w-4 h-4 mr-2 object-contain"
            />
          ) : (
            <div className="w-4 h-4 mr-2 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse" />
          )}
          {symbol}
        </div>
        <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-600" />
        <div className={priceClass}>
          {tickerBinance
            ? formatPrice({ price: tickerBinance.price, baseCurrency: 'usd', noConversion: true })
            : '-'}
        </div>
      </div>

      {premiumUpbit && (
        <div className="flex items-center text-[11px] text-text-base mt-0.5">
          <img src="/images/upbit.svg" alt="Upbit" className="w-3 h-3 mr-1 grayscale opacity-70" />
          {tickerUpbit?.price
            ? formatPrice({ price: tickerUpbit.price, baseCurrency: 'krw' })
            : '-'}
          <span className="opacity-80 ml-1">({premiumUpbit}%)</span>
        </div>
      )}
    </div>
  )
}
