import type { RealTimePosition } from '@/types';
import React, { useMemo } from 'react';
import { useMarketStore } from '@/store/useMarketStore';
import { useI18n } from '@/hooks/useI18n';
import CPositionContextMenu from './CPositionContextMenu';

interface Props {
  position: RealTimePosition;
}

const display = (v?: number | null, key?: string) => {
  if (v === null || v === undefined || isNaN(v)) return '-';
  const frac = (key === 'size' || key === '$$unrealized' || Math.abs(v) >= 100) ? 2 : 4;
  return v.toLocaleString(undefined, {
    maximumFractionDigits: frac,
    minimumFractionDigits: frac,
  });
};

const elapsedTime = (timeStr?: string) => {
  if (!timeStr) return '';
  // Simple approximation matching vue code logic
  const diff = Date.now() - new Date(timeStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function CPosition({ position: initialPos }: Props) {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const bybitTicker = useMarketStore(state => state.bybitTickers[initialPos.contract || '']);

  const currentMarkPrice = bybitTicker?.price || initialPos.markPrice;

  // Calculate realtime unrealized pnl locally
  const unrealizedPnl = useMemo(() => {
    if (isNaN(initialPos.entryPrice) || !currentMarkPrice) return initialPos.$$unrealized || 0;
    return Math.floor(100 * initialPos.size * (currentMarkPrice - initialPos.entryPrice)) / 100;
  }, [initialPos.size, initialPos.entryPrice, currentMarkPrice, initialPos.$$unrealized]);

  const isShort = initialPos.size < 0;
  const isLong = initialPos.size > 0;
  const isDanger = initialPos.liqPrice && unrealizedPnl < 0 && (Math.abs(initialPos.liqPrice - currentMarkPrice) / currentMarkPrice) < 0.005;

  const badgeText = isLong ? 'Long' : isShort ? 'Short' : '-';

  return (
    <div
      ref={containerRef}
      className={`
      flex items-stretch bg-background-base border border-border-base 
      rounded overflow-hidden text-xs select-none transition-colors min-w-[280px] w-full hover:border-text-light
      ${isDanger ? 'animate-pulse border-amber-500' : ''}
    `}>
      {/* Context Menu Hook */}
      <CPositionContextMenu position={initialPos} triggerRef={containerRef} />

      {/* Image Container */}
      <div className="relative w-20 flex-shrink-0 cursor-pointer hover:opacity-50 transition-opacity bg-black">
        <img src={initialPos.image || '/images/default-avatar.png'} alt={initialPos.name} className="absolute inset-0 w-full h-full object-cover object-top opacity-50" />
        <div className="absolute top-0 left-0 right-0 p-1 bg-gradient-to-b from-black/80 to-transparent text-white flex justify-between items-start text-[10px]">
          <div className="flex items-center bg-black/50 border border-white/10 rounded-full px-1">
            <div className={`w-1.5 h-1.5 rounded-full mr-1 ${initialPos.onAir ? 'bg-green-500' : 'bg-red-500'}`} />
            {initialPos.onAir ? t('COMMON.ON') : t('COMMON.OFF')}
          </div>
        </div>
        {initialPos.editable && initialPos.lastUpdate && (
          <div className="absolute top-5 left-1 text-[9px] text-white/80">
            {elapsedTime(initialPos.lastUpdate)}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] truncate">
          <span dangerouslySetInnerHTML={{ __html: initialPos.name || '' }} />
        </div>
      </div>

      {/* Info Container */}
      <div className="flex-1 p-2 flex flex-col gap-2">
        <div className="flex gap-2 text-[11px]">
          <div className="flex-1 flex flex-col items-start">
            <div className="text-text-light mb-0.5">{initialPos.contract?.toLocaleString() || 'N/A'}</div>
            <div className={`
               px-1 rounded text-[10px] font-medium
               ${isLong ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
               ${isShort ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : ''}
               ${!isLong && !isShort ? 'bg-background-light text-text-light' : ''}
             `}>
              {badgeText}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-start">
            <div className="text-text-light mb-0.5">{t('COMMON.SIZE')}</div>
            <div className={`font-mono font-medium ${isLong ? 'text-emerald-600 dark:text-emerald-400' : isShort ? 'text-rose-600 dark:text-rose-400' : 'text-text-base'}`}>
              {display(initialPos.size, 'size')}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end">
            <div className="text-text-light mb-0.5">{t('COMMON.UNREALIZED_PNL')}</div>
            <div className={`font-mono font-medium ${unrealizedPnl > 0 ? 'text-emerald-600 dark:text-emerald-400' : unrealizedPnl < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-text-base'}`}>
              {display(unrealizedPnl, '$$unrealized')}
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-[11px]">
          <div className="flex-1 flex flex-col items-start">
            <div className="text-text-light mb-0.5">{t('COMMON.ENTRY_PRICE')}</div>
            <div className="font-mono text-text-base">{display(initialPos.entryPrice)}</div>
          </div>
          <div className="flex-1 flex flex-col items-start">
            <div className="text-text-light mb-0.5">{t('COMMON.MARK_PRICE')}</div>
            <div className={`font-mono text-text-base transition-colors duration-100 ${isDanger ? 'text-rose-500' : ''}`}>
              {display(currentMarkPrice)}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end">
            <div className="text-text-light mb-0.5">{t('COMMON.LIQ_PRICE')}</div>
            <div className="font-mono text-bitcoin">{display(initialPos.liqPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
