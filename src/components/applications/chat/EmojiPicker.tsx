'use client'

import React, { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { useConfigStore, useT } from '@/store/StoreProvider'

interface EmojiPickerProps {
  onPick: (type: string, emoji: string) => void
  onClose: () => void
  className?: string
  style?: React.CSSProperties
}

export default function EmojiPicker({ onPick, onClose, className, style }: EmojiPickerProps) {
  const { t } = useT()
  const config = useConfigStore((s) => s.config)
  const [keyword, setKeyword] = useState('')

  const emojis = useMemo(() => {
    if (!config?.emojis) return []
    const arr = Object.keys(config.emojis)
    return keyword.trim()
      ? arr.filter((name) => name.toLowerCase().includes(keyword.toLowerCase().trim()))
      : arr
  }, [config, keyword])

  if (!config) return null

  return (
    <div
      className={`emoji-picker bg-zinc-800/95 backdrop-blur-md border border-border-base rounded-xl shadow-2xl p-3 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${className || ''}`}
      style={style}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="이모지 검색"
          className="flex-1 bg-background-light border border-border-base rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors"
          autoFocus
        />
        <button
          onClick={onClose}
          className="ml-2 p-1.5 hover:bg-background-light rounded-lg text-text-light hover:text-text-base transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="emoji-list grid grid-cols-6 gap-1 max-h-48 overflow-y-auto no-scrollbar">
        {emojis.map((name) => (
          <div
            key={name}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onPick(name, config.emojis[name].emoji)
            }}
            className="emoji flex items-center justify-center p-1.5 text-xl cursor-pointer hover:bg-background-light rounded-lg transition-all hover:scale-110 active:scale-95"
            title={name}
          >
            {config.emojis[name].emoji}
          </div>
        ))}
        {keyword && emojis.length === 0 && (
          <div className="col-span-6 py-8 text-center text-xs text-text-light">
            {t('NO_SEARCH_RESULT')}
          </div>
        )}
      </div>
    </div>
  )
}
