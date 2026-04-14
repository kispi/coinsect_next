'use client'

import React from 'react'
import { useConfigStore } from '@/store/StoreProvider'
import { Reaction } from '@/types'

interface ReactedUsersProps {
  summarizedReactions: Record<string, Reaction[]>
}

export default function ReactedUsers({ summarizedReactions }: ReactedUsersProps) {
  const emojis = useConfigStore((s) => s.config?.emojis || {})

  return (
    <div className="reacted-users absolute bottom-full mb-1 left-0 bg-zinc-800/95 border border-white/10 p-2.5 rounded-lg shadow-2xl z-[300] grid gap-2.5 min-w-[120px] backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      {Object.keys(summarizedReactions).map((key) => (
        <div key={key} className="reaction-group flex items-start gap-2.5">
          <div className="reaction text-xl leading-none pt-0.5">{emojis[key]?.emoji || '❓'}</div>
          <div className="nicknames flex-1 min-w-0">
            <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
              :{key}:
            </div>
            <div className="text-zinc-100 text-xs leading-relaxed break-words">
              {summarizedReactions[key].map((r) => r.nickname).join(', ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
