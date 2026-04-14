'use client'

import React, { useEffect, useRef } from 'react'
import { useChatStore, useT } from '@/store/StoreProvider'
import { ChevronDown } from 'lucide-react'
import { withCdn } from '@/lib/cdn'

interface AppChatIncomingMessageOverlayProps {
  onScrollToBottom: () => void
  isOutside?: boolean
}

export default function AppChatIncomingMessageOverlay({
  onScrollToBottom,
  isOutside = false,
}: AppChatIncomingMessageOverlayProps) {
  const { t } = useT()
  const incomingMessage = useChatStore((s) => s.incomingMessage)
  const setIncomingMessage = useChatStore((s) => s.setIncomingMessage)
  const settings = useChatStore((s) => s.settings)
  const setSettings = useChatStore((s) => s.setSettings)
  const autoScrollable = useChatStore((s) => s.autoScrollable)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-remove message if folded for UX
  useEffect(() => {
    if (incomingMessage && settings.chatFolded) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setIncomingMessage(null)
      }, 20000) // Increased to 20s for folded state
    }
  }, [incomingMessage, settings.chatFolded, setIncomingMessage])

  // Play ding sound
  useEffect(() => {
    if (incomingMessage && settings.chatDing && typeof Audio !== 'undefined') {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio(`${withCdn('files/ding.mp3')}`)
          audioRef.current.volume = 0.2
        }
        audioRef.current.play().catch(() => {})
      } catch (e) {}
    }
  }, [incomingMessage, settings.chatDing])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutside) {
      setSettings({ chatFolded: false })
    }
    setIncomingMessage(null)
    onScrollToBottom()
  }

  if (!incomingMessage) return null

  // Don't show inside overlay if already auto-scrolling (at bottom)
  if (!isOutside && !settings.chatFolded && autoScrollable) return null

  // Only show outside overlay if chat is actually folded and option is ON
  if (isOutside && (!settings.chatFolded || !settings.chatOverlayNewMessage)) return null

  return (
    <div
      onClick={handleClick}
      className={`
        app-chat-incoming-message-overlay flex items-center gap-3 px-3 rounded-lg cursor-pointer shadow-xl backdrop-blur-md transition-all duration-300 h-[36px] border border-white/20
        text-white animate-in fade-in slide-in-from-bottom-4
        ${isOutside ? 'fixed top-6 right-4 left-4 md:left-auto md:w-[320px] z-[1000] border-brand-primary-hover ring-2 ring-brand-primary/20 bg-brand-primary-hover' : 'absolute bottom-[88px] left-3 right-3 z-[200] bg-zinc-800/95'}
      `}
    >
      <div className="flex-1 flex items-center gap-2 overflow-hidden min-w-0 pointer-events-none">
        {incomingMessage.user?.profile?.image ? (
          <img
            src={incomingMessage.user.profile.image}
            className="w-6 h-6 rounded-full object-cover flex-shrink-0 border border-white/10"
            alt=""
          />
        ) : (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: `#${(incomingMessage.user?.token || '').slice(0, 6)}` }}
          />
        )}
        <div className="flex items-center gap-1 overflow-hidden">
          <span className="text-xs font-bold whitespace-nowrap text-primary-light">
            {incomingMessage.user?.profile?.nickname}
          </span>
          {incomingMessage.user?.token && (
            <span className="text-[9px] opacity-40 border border-white/20 px-0.5 rounded uppercase flex-shrink-0">
              {incomingMessage.user.token.substring(0, 3)}
            </span>
          )}
          <span className="text-xs opacity-60 flex-shrink-0">:</span>
          <span className="text-[11px] truncate opacity-90 font-medium ml-1">
            {incomingMessage.type === 'image' ? t('IMAGE') : incomingMessage.text}
          </span>
        </div>
      </div>
      <ChevronDown className="w-4 h-4 flex-shrink-0 animate-bounce" />
    </div>
  )
}
