'use client'

import React from 'react'
import { useChatStore, useUIStore } from '@/store/StoreProvider'
import { Settings, Heart, Minus, Square, Copy } from 'lucide-react'
import AppSkeleton from '@/components/common/AppSkeleton'
import ModalChatSettings from '@/components/modals/ModalChatSettings'

export default function AppChatHeader() {
  const [mounted, setMounted] = React.useState(false)
  const settings = useChatStore((s) => s.settings)
  const setChatSettings = useChatStore((s) => s.setSettings)
  const currentUser = useChatStore((s) => s.chatUser)

  const addModal = useUIStore((s) => s.addModal)

  const openSettingsModal = () => {
    addModal({ component: ModalChatSettings })
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleChatSizeMax = () => {
    setChatSettings({ chatSizeMax: !settings.chatSizeMax })
  }

  return (
    <div className="app-chat-header flex justify-between items-center p-3 select-none relative cursor-grab bg-background-light border-b border-border-light">
      <div className="chat-settings flex items-center gap-2">
        <button
          onClick={openSettingsModal}
          className="p-1 hover:bg-zinc-700/50 rounded-md transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-text-light" />
        </button>
        <button
          onClick={() => {
            /* showModal('ModalDonation') */
          }}
          className="p-1 hover:bg-zinc-700/50 rounded-md transition-colors cursor-pointer"
        >
          <Heart className="w-4 h-4 text-rose-500" />
        </button>
      </div>

      <div className="profile flex items-center absolute left-1/2 -translate-x-1/2">
        {mounted && currentUser ? (
          <div className="flex items-center gap-2">
            {currentUser.profile.image && (
              <img
                src={currentUser.profile.image}
                alt={currentUser.profile.nickname}
                className="w-5 h-5 rounded-full object-cover"
              />
            )}
            <span
              onClick={openSettingsModal}
              className="text-xs font-bold text-text-base underline cursor-pointer hover:text-primary transition-colors"
            >
              {currentUser.profile.nickname}
            </span>
          </div>
        ) : (
          <AppSkeleton width={80} height={16} />
        )}
      </div>

      <div className="chat-settings flex items-center gap-2">
        <button
          onClick={() => setChatSettings({ chatFolded: true })}
          className="p-1 hover:bg-zinc-700/50 rounded-md transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4 text-text-light" />
        </button>
        <button
          onClick={toggleChatSizeMax}
          className="p-1 hover:bg-zinc-700/50 rounded-md transition-colors cursor-pointer"
        >
          {settings.chatSizeMax ? (
            <Copy className="w-3.5 h-3.5 text-text-light" />
          ) : (
            <Square className="w-3.5 h-3.5 text-text-light" />
          )}
        </button>
      </div>
    </div>
  )
}
