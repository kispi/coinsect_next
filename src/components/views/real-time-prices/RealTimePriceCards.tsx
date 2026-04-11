import React from 'react';

export default function RealTimePriceCards({ symbols }: { symbols: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      {symbols.map(symbol => (
        <div key={symbol} className="flex justify-between p-2 border border-zinc-200 dark:border-zinc-700 rounded items-center bg-zinc-50 dark:bg-zinc-800/50">
          <div className="font-bold flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-300 rounded-full dark:bg-zinc-600"></div>
            {symbol}
          </div>
          <div className="text-zinc-500 text-sm italic">Loading prices...</div>
        </div>
      ))}
    </div>
  );
}
