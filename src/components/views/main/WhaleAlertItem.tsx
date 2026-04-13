'use client'

import type { WhaleAlert } from '@/types'
import { STABLE_COINS } from '@/lib/constants'
import { useFormatNumber } from '@/hooks/useFormatNumber'
import { ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/StoreProvider'

interface Props {
  whaleAlert: WhaleAlert
}

const getExplorerUrl = (transaction: WhaleAlert) => {
  const urls: Record<string, string> = {
    bitcoin: 'https://www.blockchain.com/btc/tx/',
    ethereum: 'https://etherscan.io/tx/0x',
    tron: 'https://tronscan.org/#/transaction/',
    ripple: 'https://xrpscan.com/tx/',
  }

  const baseUrl = urls[transaction.blockchain.toLowerCase()]
  if (!baseUrl) return null

  return baseUrl + transaction.hash
}

const getSentiment = (whaleAlert: WhaleAlert) => {
  const isStable = STABLE_COINS.includes(whaleAlert.symbol.toLowerCase())
  const { fromOwnerType, toOwnerType } = whaleAlert

  if (fromOwnerType === 'exchange' && toOwnerType === 'unknown') {
    return isStable ? 'bear' : 'bull'
  }
  if (fromOwnerType === 'unknown' && toOwnerType === 'exchange') {
    return isStable ? 'bull' : 'bear'
  }
  return null
}

const displayAddressName = (transaction: WhaleAlert, target: 'from' | 'to') => {
  const owner = target === 'from' ? transaction.fromOwner : transaction.toOwner
  const ownerType = target === 'from' ? transaction.fromOwnerType : transaction.toOwnerType

  return owner || (ownerType === 'unknown' ? '?' : ownerType)
}

const elapsedTime = (timestamp: number) => {
  const diff = Date.now() - timestamp * 1000
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function WhaleAlertItem({ whaleAlert }: Props) {
  const { formatPrice } = useFormatNumber()
  const sentiment = getSentiment(whaleAlert)
  const url = getExplorerUrl(whaleAlert)

  const currency = useAppStore((state) => state.settings.currency)

  const displayAmount = () => {
    const parsed = parseFloat(whaleAlert.amount) || 0
    if (!parsed) return '?'

    const isStable = STABLE_COINS.includes(whaleAlert.symbol.toLowerCase())
    return isStable
      ? Math.round(parsed).toLocaleString()
      : parsed.toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
  }

  const sentimentClass =
    sentiment === 'bull'
      ? 'bg-price-up-bg text-text-stress'
      : sentiment === 'bear'
        ? 'bg-price-down-bg text-text-stress'
        : 'bg-background-light text-text-stress'

  const onClick = () => {
    if (url) window.open(url, '_blank')
  }

  return (
    <div
      onClick={onClick}
      className={`
        whale-alert-item flex flex-col gap-2 p-3 rounded text-[11px] font-mono transition-shadow
        ${sentimentClass} 
        ${url ? 'cursor-pointer hover:shadow-md border border-border-base' : 'border border-transparent'}
        min-w-[280px]
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          <img
            src={`https://static.upbit.com/logos/${whaleAlert.symbol.toUpperCase()}.png`}
            alt={whaleAlert.symbol}
            className="w-4 h-4 object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <span className="font-bold uppercase whitespace-nowrap">
            {displayAmount()} {whaleAlert.symbol}
          </span>
          <span className="opacity-70 whitespace-nowrap uppercase">
            ({currency}{' '}
            {formatPrice({
              price: parseFloat(whaleAlert.amountUsd),
              baseCurrency: 'usd',
              fracs: 0,
            })}
            )
          </span>
        </div>
        <div className="h-4 w-px bg-border-base mx-1 hidden sm:block" />
        <span className="opacity-60 whitespace-nowrap">{elapsedTime(whaleAlert.timestamp)}</span>
      </div>

      {/* From/To */}
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 flex items-center justify-center p-1.5 rounded-full border border-border-base truncate uppercase bg-background-base/50">
          {whaleAlert.fromOwnerType !== 'unknown' && (
            <img
              src={`/images/exchanges/${whaleAlert.fromOwner.toUpperCase().replace(/[ .]/g, '_')}.png`}
              alt=""
              className="w-3.5 h-3.5 mr-1 object-contain"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <span className="truncate">{displayAddressName(whaleAlert, 'from')}</span>
        </div>
        <ChevronRight className="w-3 h-3 opacity-50 flex-shrink-0" />
        <div className="flex-1 flex items-center justify-center p-1.5 rounded-full border border-border-base truncate uppercase bg-background-base/50">
          {whaleAlert.toOwnerType !== 'unknown' && (
            <img
              src={`/images/exchanges/${whaleAlert.toOwner.toUpperCase().replace(/[ .]/g, '_')}.png`}
              alt=""
              className="w-3.5 h-3.5 mr-1 object-contain"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <span className="truncate">{displayAddressName(whaleAlert, 'to')}</span>
        </div>
      </div>
    </div>
  )
}
