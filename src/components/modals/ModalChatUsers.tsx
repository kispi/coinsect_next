'use client'

import React, { useState, useEffect, useMemo } from 'react'
import ModalHeader from '@/components/common/modal/ModalHeader'
import { useChatStore, useT } from '@/store/StoreProvider'
import AppChatProfile from '@/components/applications/chat/AppChatProfile'
import { User } from '@/types'

export default function ModalChatUsers({ onClose }: { onClose: () => void }) {
  const { t } = useT()
  const chatUsers = useChatStore((s) => s.chatUsers)
  const numConnections = useChatStore((s) => s.numConnections)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const chatUser = useChatStore((s) => s.chatUser)
  const blockedUsers = useChatStore((s) => s.settings.blockedUsers)
  const setSettings = useChatStore((s) => s.setSettings)

  const [selectedTab, setSelectedTab] = useState<'NON_BLOCKED' | 'BLOCKED'>('NON_BLOCKED')

  // Refresh users every 60s
  useEffect(() => {
    const load = () => {
      if (chatUser?.token) {
        // Match legacy payload exactly
        sendMessage('', 'users', { token: chatUser.token })
      }
    }
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [sendMessage, chatUser?.token])

  const sortedUsers = useMemo(() => {
    const arr = JSON.parse(JSON.stringify(chatUsers))
    return arr.sort((a: User, b: User) => {
      // Prioritize users with images
      if (a.profile?.image && b.profile?.image) {
        return (a.profile.nickname || '').localeCompare(b.profile.nickname || '')
      }
      if (a.profile?.image) return -1
      if (b.profile?.image) return 1
      return (a.profile?.nickname || '').localeCompare(b.profile?.nickname || '')
    })
  }, [chatUsers])

  const tabs = useMemo(() => {
    const nonBlocked: User[] = []
    const blocked: User[] = []

    sortedUsers.forEach((u: User) => {
      if (blockedUsers[u.token || '']) blocked.push(u)
      else nonBlocked.push(u)
    })

    return {
      NON_BLOCKED: nonBlocked,
      BLOCKED: blocked,
    }
  }, [sortedUsers, blockedUsers])

  const unblockAll = () => {
    setSettings({ blockedUsers: {} })
  }

  return (
    <div className="modal-chat-users w-[640px] max-w-[calc(100vw-32px)] max-h-[80vh] bg-background-base rounded-lg shadow-2xl flex flex-col overflow-hidden border border-border-base animate-modal-in">
      <ModalHeader
        title={`${t('COMMON.MODAL_CHAT_USERS')} (${numConnections || 0})`}
        onClose={onClose}
      />

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex border-b border-border-base p-2 gap-2">
          {(['NON_BLOCKED', 'BLOCKED'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`
                flex-1 py-2 text-xs font-bold rounded transition-all cursor-pointer
                ${
                  selectedTab === key
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-text-base hover:bg-brand-primary-hover-bg uppercase'
                }
              `}
            >
              {t(`COMMON.${key}`)} ({tabs[key].length})
            </button>
          ))}
        </div>

        {selectedTab === 'BLOCKED' && tabs.BLOCKED.length > 0 && (
          <div className="p-4 border-b border-border-base">
            <button onClick={unblockAll} className="btn-primary w-full py-2 text-sm">
              {t('COMMON.UNBLOCK_ALL')}
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {tabs[selectedTab].length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3">
              {tabs[selectedTab].map((user, idx) => (
                <div key={`${user.token}-${idx}`} className="flex items-center min-w-0 h-6">
                  <AppChatProfile user={user} useBan={true} useSentiment={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-text-light">
              <span className="text-xl font-bold opacity-50">{t('COMMON.NO_USERS')}</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-base);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--gs-66);
        }
      `}</style>
    </div>
  )
}
