import React, { useMemo } from 'react';
import type { RealTimePosition } from '@/types';
import { useMarketStore } from '@/store/useMarketStore';

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
    <div className={`
      flex items-stretch bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 
      rounded overflow-hidden text-xs select-none transition-colors min-w-[280px] w-full hover:border-zinc-400
      ${isDanger ? 'animate-pulse border-red-500' : ''}
    `}>
      {/* Image Container */}
      <div className="relative w-20 flex-shrink-0 cursor-pointer hover:opacity-50 transition-opacity bg-black">
         <img src={initialPos.image || '/images/default-avatar.png'} alt={initialPos.name} className="absolute inset-0 w-full h-full object-cover object-top opacity-50" />
         <div className="absolute top-0 left-0 right-0 p-1 bg-gradient-to-b from-black/80 to-transparent text-white flex justify-between items-start text-[10px]">
           <div className="flex items-center bg-black/50 border border-white/10 rounded-full px-1">
             <div className={`w-1.5 h-1.5 rounded-full mr-1 ${initialPos.onAir ? 'bg-green-500' : 'bg-red-500'}`} />
             {initialPos.onAir ? 'ON' : 'OFF'}
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
             <div className="text-zinc-500 mb-0.5">{initialPos.contract?.toLocaleString() || 'N/A'}</div>
             <div className={`
               px-1 rounded text-[10px] font-medium
               ${isLong ? 'bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#1B5E20]/30 dark:text-[#4CAF50]' : ''}
               ${isShort ? 'bg-[#FFEBEE] text-[#C62828] dark:bg-[#B71C1C]/30 dark:text-[#F44336]' : ''}
               ${!isLong && !isShort ? 'bg-zinc-200 text-zinc-600' : ''}
             `}>
               {badgeText}
             </div>
          </div>
          <div className="flex-1 flex flex-col items-start">
             <div className="text-zinc-500 mb-0.5">SIZE</div>
             <div className={`font-mono font-medium ${isLong ? 'text-[#2E7D32] dark:text-[#4CAF50]' : isShort ? 'text-[#C62828] dark:text-[#F44336]' : 'text-zinc-900 dark:text-zinc-100'}`}>
               {display(initialPos.size, 'size')}
             </div>
          </div>
          <div className="flex-1 flex flex-col items-end">
             <div className="text-zinc-500 mb-0.5">UNREALIZED PNL</div>
             <div className={`font-mono font-medium ${unrealizedPnl > 0 ? 'text-[#2E7D32] dark:text-[#4CAF50]' : unrealizedPnl < 0 ? 'text-[#C62828] dark:text-[#F44336]' : 'text-zinc-900 dark:text-zinc-100'}`}>
               {display(unrealizedPnl, '$$unrealized')}
             </div>
          </div>
        </div>

        <div className="flex gap-2 text-[11px]">
          <div className="flex-1 flex flex-col items-start">
             <div className="text-zinc-500 mb-0.5">ENTRY PRICE</div>
             <div className="font-mono text-zinc-800 dark:text-zinc-200">{display(initialPos.entryPrice)}</div>
          </div>
          <div className="flex-1 flex flex-col items-start">
             <div className="text-zinc-500 mb-0.5">MARK PRICE</div>
             <div className={`font-mono text-zinc-800 dark:text-zinc-200 transition-colors duration-100 ${isDanger ? 'text-red-500' : ''}`}>
               {display(currentMarkPrice)}
             </div>
          </div>
          <div className="flex-1 flex flex-col items-end">
             <div className="text-zinc-500 mb-0.5">LIQ PRICE</div>
             <div className="font-mono text-orange-500">{display(initialPos.liqPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
