import React from 'react';
import type { WhaleAlert } from '@/types';

export default function WhaleAlertItem({ whaleAlert }: { whaleAlert: WhaleAlert }) {
  return (
    <div className="p-3 border border-zinc-200 dark:border-zinc-700 rounded flex-1 min-w-[250px] bg-zinc-50 dark:bg-zinc-800/50">
      <div className="font-bold mb-1 truncate" title={whaleAlert.hash}>{whaleAlert.hash || 'Alert Hash'}</div>
      <div className="text-sm text-zinc-500">Details loading...</div>
    </div>
  );
}
