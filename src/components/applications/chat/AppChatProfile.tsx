'use client'

import { User } from '@/types'
import { useUIStore, useChatStore, useT } from '@/store/StoreProvider'
import { Ban, ShieldCheck } from 'lucide-react'

interface AppChatProfileProps {
  user: User
  useBan?: boolean
  useSentiment?: boolean
}

export default function AppChatProfile({ user, useBan, useSentiment }: AppChatProfileProps) {
  const toggleBlockUser = useChatStore((s) => s.toggleBlockUser)
  const blockedUsers = useChatStore((s) => s.settings.blockedUsers)
  const confirm = useUIStore((s) => s.confirm)
  const { t } = useT()

  if (!user) return null

  const sentiment = user.profile.sentiment?.type
  const tokenColor = `#${(user.token || '').slice(0, 6)}`
  const tokenBadge = (user.token || '').substring(0, 3).toUpperCase()

  const toggleBlock = async () => {
    if (!user.token) return

    // Show confirmation if blocking
    if (!blockedUsers[user.token]) {
      const res = await confirm({
        body: t('APP_CHAT.CONFIRM_BLOCK_USER', { nickname: user.profile.nickname }),
      })
      if (res !== 1) return // 1 is CONFIRM button index in ModalBasic
    }

    toggleBlockUser(user.token)
  }

  return (
    <div className={`app-chat-profile flex items-center gap-1.5 ${user.id ? 'font-bold' : ''}`}>
      {user.profile.image ? (
        <img
          src={user.profile.image}
          alt={user.profile.nickname}
          className="w-6 h-6 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
        />
      ) : (
        <div className="flex items-center cursor-pointer">
          {!user.id ? (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: tokenColor }} />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-1" style={{ color: tokenColor }} />
          )}
        </div>
      )}

      <span
        onClick={() => {
          /* user.id && showModal('ModalUserStats', { user }) */
        }}
        className={`
          nickname text-xs cursor-pointer hover:underline text-text-base truncate
          ${useSentiment && sentiment === 'long' ? 'text-green-500' : ''}
          ${useSentiment && sentiment === 'short' ? 'text-red-500' : ''}
        `}
      >
        {user.profile.nickname}
      </span>

      {!user.id && user.token && (
        <div className="badge-token text-[10px] font-light border border-white/20 px-1 rounded-md bg-background-light text-text-light">
          {tokenBadge}
        </div>
      )}

      {user.token && useBan && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleBlock()
          }}
          className="p-1 hover:text-red-500 transition-colors cursor-pointer"
          title={blockedUsers[user.token] ? 'Unblock' : 'Block'}
        >
          <Ban
            className={`w-3 h-3 ${blockedUsers[user.token] ? 'text-red-500' : 'text-text-light'}`}
          />
        </button>
      )}
    </div>
  )
}
