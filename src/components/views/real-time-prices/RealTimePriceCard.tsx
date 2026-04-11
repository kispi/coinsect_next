import React, { useMemo } from 'react';
import { useMarketStore } from '@/store/useMarketStore';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  symbol: string;
}

const mustUSD = (price?: number) => {
  if (!price) return '-';
  return price.toLocaleString(undefined, {
    minimumFractionDigits: price < 1 ? 4 : 2,
    maximumFractionDigits: 4,
  });
};

export default function RealTimePriceCard({ symbol }: Props) {
  const { setSettings } = useAppStore();
  const documentTitleTicker = useAppStore(state => state.settings.documentTitleTicker);
  
  const binanceSymbol = `${symbol}USDT`;
  const upbitSymbol = `KRW-${symbol}`;

  const tickerBinance = useMarketStore(state => state.binanceTickers[binanceSymbol]);
  const tickerUpbit = useMarketStore(state => state.upbitTickers[upbitSymbol]);
  const usdKrw = useMarketStore(state => state.usdKrw);

  const premiumUpbit = useMemo(() => {
    if (tickerUpbit?.price && tickerBinance?.price && usdKrw) {
      return (((tickerUpbit.price / usdKrw) / tickerBinance.price - 1) * 100).toFixed(2);
    }
    return null;
  }, [tickerUpbit?.price, tickerBinance?.price, usdKrw]);

  // Set document title if selected
  React.useEffect(() => {
    if (documentTitleTicker === symbol && tickerBinance?.price) {
      document.title = `${mustUSD(tickerBinance.price)} ${symbol}/USDT`;
    }
  }, [documentTitleTicker, symbol, tickerBinance?.price]);

  const handleSelectTicker = () => {
    if (tickerBinance?.price) {
      setSettings({ documentTitleTicker: symbol });
      // Usually there's a toast here, omitting for simplicity or add later
    }
  };

  const isUp = tickerBinance?.direction === 'up';
  const isDown = tickerBinance?.direction === 'down';

  const containerClass = `
    flex flex-col gap-1 p-2 rounded items-center justify-center text-xs cursor-pointer transition-colors duration-300
    ${isUp ? 'bg-rose-500/10 dark:bg-rose-500/20 hover:bg-rose-500/20' : ''}
    ${isDown ? 'bg-blue-500/10 dark:bg-blue-500/20 hover:bg-blue-500/20' : ''}
    ${!isUp && !isDown ? 'bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700' : ''}
  `;

  const priceClass = `
    font-bold text-sm tracking-tight transition-colors duration-100
    ${isUp ? 'text-rose-600 dark:text-rose-400' : ''}
    ${isDown ? 'text-blue-600 dark:text-blue-400' : ''}
    ${!isUp && !isDown ? 'text-zinc-900 dark:text-zinc-100' : ''}
  `;

  return (
    <div onClick={handleSelectTicker} className={containerClass}>
      <div className="flex items-center gap-2">
        <div className="flex items-center font-bold">
          {tickerBinance ? (
            <img src={`https://static.upbit.com/logos/${symbol}.png`} alt={symbol} className="w-4 h-4 mr-2 object-contain" />
          ) : (
            <div className="w-4 h-4 mr-2 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse" />
          )}
          {symbol}
        </div>
        <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-600" />
        <div className={priceClass}>
          {mustUSD(tickerBinance?.price)}
        </div>
      </div>
      
      {premiumUpbit && (
        <div className="flex items-center text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
          <img src="/images/upbit.svg" alt="Upbit" className="w-3 h-3 mr-1 grayscale opacity-70" />
          {tickerUpbit?.price?.toLocaleString()} <span className="opacity-80 ml-1">({premiumUpbit}%)</span>
        </div>
      )}
    </div>
  );
}
