'use client'

import React, { useMemo, useState, useRef } from 'react'
import { Message, Reaction } from '@/types'
import AppChatProfile from './AppChatProfile'
import AppChatMessageMetaTags from './AppChatMessageMetaTags'
import AppPortal from '@/components/common/AppPortal'
import dayjs from 'dayjs'
import { Reply, Plus, CircleHelp } from 'lucide-react'
import { useChatStore, useConfigStore } from '@/store/StoreProvider'
import { useToggleReaction } from '@/hooks/api/useToggleReaction'
import EmojiPicker from './EmojiPicker'
import ReactedUsers from './ReactedUsers'

interface AppChatMessageProps {
  message: Message
  prevMessage?: Message
  nextMessage?: Message
  onClickRepliedMessage?: (msg: any) => void
}

export default function AppChatMessage({
  message,
  prevMessage,
  nextMessage,
  onClickRepliedMessage,
}: AppChatMessageProps) {
  const setWritingReplyTo = useChatStore((s) => s.setWritingReplyTo)
  const chatUser = useChatStore((s) => s.chatUser)
  const config = useConfigStore((s) => s.config)
  const { mutate: toggleReaction } = useToggleReaction()

  const [showEmojiSelector, setShowEmojiSelector] = useState(false)
  const [showReactedUsers, setShowReactedUsers] = useState(false)
  const emojiAnchorRef = useRef<HTMLButtonElement>(null)

  const meta = useMemo(() => {
    if (!message.meta) return null
    try {
      return typeof message.meta === 'string' ? JSON.parse(message.meta) : message.meta
    } catch (e) {
      return null
    }
  }, [message.meta])

  const summarizedReactions = useMemo(() => {
    if (!message.reactions) return {}
    const o: Record<string, Reaction[]> = {}
    message.reactions.forEach((reaction) => {
      if (!o[reaction.type]) o[reaction.type] = [reaction]
      else o[reaction.type].push(reaction)
    })
    return o
  }, [message.reactions])

  const isReactionActivated = (type: string) => {
    return (summarizedReactions[type] || []).some(
      (r) => (chatUser?.id && r.userId === chatUser.id) || r.ip === config?.ip
    )
  }

  const onPickEmoji = (type: string) => {
    setShowEmojiSelector(false)
    if (!chatUser?.profile?.nickname) return
    toggleReaction({
      messageId: message.id,
      type,
      nickname: chatUser.profile.nickname,
    })
  }

  const d = (ts: number | string) => dayjs(ts).format('YYYY-MM-DD HH:mm')

  const showProfile = useMemo(() => {
    if (message.isMine) return false
    if (!message.user?.profile) return false
    if (!prevMessage) return true

    return prevMessage.user?.token !== message.user?.token || d(prevMessage.ts) !== d(message.ts)
  }, [message, prevMessage])

  const showTimestamp = useMemo(() => {
    if (!nextMessage) return true
    if (nextMessage.user?.token !== message.user?.token) return true
    return d(nextMessage.ts) !== d(message.ts)
  }, [message, nextMessage])

  const linkify = (text: string) => {
    if (!text) return ''
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.split(urlRegex).map((part, i) => {
      if (typeof part === 'string' && part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  const [pickerPosition, setPickerPosition] = useState<React.CSSProperties>({})

  React.useLayoutEffect(() => {
    if (showEmojiSelector && emojiAnchorRef.current) {
      const rect = emojiAnchorRef.current.getBoundingClientRect()
      setPickerPosition({
        left: rect.right - 256,
        top: rect.top - 280,
      })
    }
  }, [showEmojiSelector])

  return (
    <div
      className={`app-chat-message mid-${message.id} group flex w-full relative ${message.isMine ? 'mine justify-end' : 'justify-start'}`}
    >
      {showEmojiSelector && (
        <AppPortal>
          <EmojiPicker
            className="fixed z-[999] w-64 h-[280px]"
            style={pickerPosition}
            onPick={onPickEmoji}
            onClose={() => setShowEmojiSelector(false)}
          />
        </AppPortal>
      )}

      <div className={`content max-w-[85%] ${message.isMine ? 'flex flex-col items-end' : ''}`}>
        {showProfile && (
          <div className="mt-2 mb-1">
            <AppChatProfile user={message.user} useBan={true} />
          </div>
        )}

        <div
          className={`text-and-timestamp flex items-end gap-1.5 ${message.isMine ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {!message.$$hide ? (
            <div
              className={`
              text px-2 py-1 rounded bg-background-light text-text-stress text-xs break-words whitespace-pre-line relative
              ${message.isMine ? 'rounded-tr-none' : 'rounded-tl-none'}
            `}
            >
              {meta?.replyTo && (
                <div
                  className="meta-reply-to border-b border-border-base mb-1 pb-1 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
                  onClick={() => onClickRepliedMessage?.(meta.replyTo)}
                >
                  <div className="text-[10px] text-text-light font-bold">
                    To: {meta.replyTo.nickname}
                  </div>
                  <div className="text-[10px] truncate max-w-[150px]">{meta.replyTo.text}</div>
                </div>
              )}
              {message.type === 'image' ? (
                <img
                  src={message.text}
                  alt="chat-img"
                  className="w-40 h-40 object-cover rounded-lg border border-border-base cursor-pointer"
                  onClick={() => window.open(message.text, '_blank')}
                />
              ) : (
                <div className="select-text cursor-default">{linkify(message.text)}</div>
              )}

              <AppChatMessageMetaTags message={message} />
            </div>
          ) : (
            <div className="text px-2 py-1 rounded bg-rose-900/30 text-rose-400 text-xs italic">
              Deleted by admin
            </div>
          )}

          <div
            className={`additional flex items-end gap-1 text-[10px] text-text-light opacity-80 min-w-fit mb-0.5 ${message.isMine ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {showTimestamp && (
              <span className="font-mono">{dayjs(message.ts).format('HH:mm')}</span>
            )}

            {message.type !== 'alert' && !message.$$hide && (
              <div className="functions invisible opacity-0 group-hover:visible group-hover:opacity-100 flex items-center bg-background-light border border-border-base rounded shadow-sm transition-all duration-200 min-w-[50px] justify-center">
                <button
                  onClick={() => setWritingReplyTo(message)}
                  className="p-1 hover:text-blue-400 transition-colors border-r border-border-base cursor-pointer"
                  title="Reply"
                >
                  <Reply className="w-3 h-3 scale-x-[-1]" />
                </button>
                <button
                  ref={emojiAnchorRef}
                  onClick={() => setShowEmojiSelector(!showEmojiSelector)}
                  className="p-1 hover:text-yellow-400 transition-colors cursor-pointer"
                  title="React"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {Object.keys(summarizedReactions).length > 0 && (
          <div
            className={`message-reactions flex flex-wrap gap-1 mt-1 relative ${message.isMine ? 'justify-end' : 'justify-start'}`}
          >
            {showReactedUsers && <ReactedUsers summarizedReactions={summarizedReactions} />}

            {Object.keys(summarizedReactions).map((type) => (
              <div
                key={type}
                onClick={() => onPickEmoji(type)}
                className={`
                  message-reaction h-6 flex items-center gap-1.5 px-2 rounded-full text-[11px] cursor-pointer transition-colors
                  ${isReactionActivated(type) ? 'bg-brand-primary-hover text-white' : 'bg-background-light'}
                `}
              >
                <span>{config?.emojis?.[type]?.emoji || type}</span>
                <span className="font-mono">{summarizedReactions[type].length}</span>
              </div>
            ))}
            <div
              onMouseEnter={() => setShowReactedUsers(true)}
              onMouseLeave={() => setShowReactedUsers(false)}
              className="message-reaction h-5 w-5 flex items-center justify-center rounded-full text-[10px] cursor-default border bg-background-light border-border-base opacity-40 hover:opacity-100 transition-opacity"
            >
              <CircleHelp className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
