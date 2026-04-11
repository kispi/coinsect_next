import React from 'react';
import type { RealTimePosition } from '@/types';

export default function CPosition({ position }: { position: RealTimePosition }) {
  return (
    <div className="p-3 border border-zinc-200 dark:border-zinc-700 rounded flex-1 min-w-[200px] bg-zinc-50 dark:bg-zinc-800/50">
      <div className="font-bold mb-1">{position.name || 'Unknown'}</div>
      <div className="text-sm text-zinc-500">Position data loading...</div>
    </div>
  );
}
