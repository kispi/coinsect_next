'use client'

import React from 'react'
import { useChatStore, useAppStore } from '@/store/StoreProvider'
import { MessageCircle } from 'lucide-react'
import BadgeUnreads from './BadgeUnreads'

export default function AppChatToggler() {
  const settings = useChatStore((s) => s.settings)
  const setSettings = useChatStore((s) => s.setSettings)
  const numUnreads = useChatStore((s) => s.numUnreads)
  const messages = useChatStore((s) => s.messages)
  const setLastReadMessage = useChatStore((s) => s.setLastReadMessage)
  const isMobile = useAppStore((s) => s.isMobile)
  const setShowNavigation = useAppStore((s) => s.setShowNavigation)

  const toggleChatFolded = () => {
    const nextFolded = !settings.chatFolded
    setSettings({ chatFolded: nextFolded })

    // If opening, mark the last message as read
    if (!nextFolded && messages.length > 0) {
      setLastReadMessage(messages[messages.length - 1])
    }

    if (isMobile && !nextFolded) {
      setShowNavigation(false)
    }
  }

  if (!settings.chatFolded) return null

  return (
    <div
      onClick={toggleChatFolded}
      className={`
        app-chat-toggler fixed bottom-4 right-4 z-[150] cursor-pointer
        w-14 h-14 rounded-full flex items-center justify-center
        bg-brand-primary-hover shadow-xl
        hover:scale-105 active:scale-95 transition-all duration-200
        group
      `}
    >
      <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-200" />

      <div className="absolute -top-1 -right-1">
        <BadgeUnreads numUnreads={numUnreads} />
      </div>
    </div>
  )
}
