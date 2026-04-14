'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useChatStore, useUserStore } from '@/store/StoreProvider'
import AppChatHeader from './AppChatHeader'
import AppChatMessage from './AppChatMessage'
import AppChatInput from './AppChatInput'
import DailySeparator from './DailySeparator'
import { useDraggable } from '@/hooks/useDraggable'
import { useChatMessages, getChatMessages } from '@/hooks/api/useChatMessages'
import { processChatMessage } from '@/lib/chat'
import { flushSync } from 'react-dom'
import AppChatIncomingMessageOverlay from './AppChatIncomingMessageOverlay'
import { Message } from '@/types'

export default function AppChat() {
  const messages = useChatStore((s) => s.messages)
  const autoScrollable = useChatStore((s) => s.autoScrollable)
  const incomingMessage = useChatStore((s) => s.incomingMessage)
  const setMessages = useChatStore((s) => s.setMessages)
  const prependMessages = useChatStore((s) => s.prependMessages)
  const setAutoScrollable = useChatStore((s) => s.setAutoScrollable)
  const setIncomingMessage = useChatStore((s) => s.setIncomingMessage)
  const chatUser = useChatStore((s) => s.chatUser)
  const settings = useChatStore((s) => s.settings)
  const numConnections = useChatStore((s) => s.numConnections)
  const setLastReadMessage = useChatStore((s) => s.setLastReadMessage)

  const me = useUserStore((s) => s.me)
  const [loadingMore, setLoadingMore] = useState(false)
  const [fullyLoaded, setFullyLoaded] = useState(false)

  const messagesRef = useRef(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const chatBodyRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { dragRef, setPosition, dragStyle, onMouseDown } = useDraggable({
    toGrabSelector: '.app-chat-header',
  })

  const resetPosition = useCallback(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const padding = 16
    const isMobile = window.innerWidth < 480

    setPosition({
      x: isMobile ? padding : window.innerWidth - rect.width - padding,
      y: window.innerHeight - rect.height - padding,
    })
  }, [setPosition])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('resize', resetPosition)
    return () => window.removeEventListener('resize', resetPosition)
  }, [resetPosition])

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior,
        })

        // Update last read message
        const msgs = messagesRef.current
        if (msgs.length > 0) {
          setLastReadMessage(msgs[msgs.length - 1])
        }
      }
    },
    [setLastReadMessage]
  )

  const { data: initialMessages } = useChatMessages()

  const prepareMessages = useCallback(
    (msgs: Message[]) => msgs.map((m) => processChatMessage(m, me?.id, chatUser)).reverse(),
    [me?.id, chatUser]
  )

  useEffect(() => {
    if (initialMessages && messages.length === 0) {
      setMessages(prepareMessages(initialMessages))
    }
  }, [initialMessages, messages.length, setMessages, prepareMessages])

  const loadMore = useCallback(
    async (_limit = 50, forcedBeforeId?: string | number) => {
      if (loadingMore || fullyLoaded || (messages.length === 0 && !forcedBeforeId)) return []

      const firstMessageId = forcedBeforeId || messages[0].id
      setLoadingMore(true)

      try {
        const olderMessages = await getChatMessages(String(firstMessageId))
        if (olderMessages.length === 0) {
          setFullyLoaded(true)
          return []
        } else {
          const prepared = prepareMessages(olderMessages)

          const previousScrollHeight = chatBodyRef.current?.scrollHeight || 0

          flushSync(() => {
            prependMessages(prepared)
          })

          if (chatBodyRef.current) {
            // Exactly restore scroll position by calculating the height of appended content
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight - previousScrollHeight
          }
          return prepared
        }
      } catch (e) {
        console.error('Failed to load more messages', e)
        return []
      } finally {
        setLoadingMore(false)
      }
    },
    [loadingMore, fullyLoaded, messages, prependMessages, prepareMessages]
  )

  const onClickRepliedMessage = useCallback(
    async (msg: any) => {
      // 1. Find in current messages
      let found = messages.find((m) => m.id === msg.id)

      // 2. If not found, load more (up to 4 times)
      if (!found) {
        let currentTopId = messages[0]?.id
        for (let i = 0; i < 4; i++) {
          if (!currentTopId) break
          const newMsgs = await loadMore(50, currentTopId)
          if (newMsgs && newMsgs.length > 0) {
            currentTopId = newMsgs[0].id
            found = newMsgs.find((m) => m.id === msg.id)
            if (found) break
          } else {
            break
          }
        }
      }

      if (!found) {
        // toast.error('너무 오래된 메시지인 것 같아요 😥')
        return
      }

      // Give react some time to render
      setTimeout(() => {
        const dom = chatBodyRef.current?.querySelector(`.mid-${msg.id}`)
        if (dom) {
          dom.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    },
    [messages, loadMore]
  )

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const dom = e.currentTarget
    const isAtBottom = dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 30
    setAutoScrollable(isAtBottom)

    if (isAtBottom && incomingMessage) {
      setIncomingMessage(null)
    }

    if (dom.scrollTop < 20 && !loadingMore && !fullyLoaded && messages.length > 0) {
      setAutoScrollable(false)
      loadMore()
    }
  }

  const filteredMessages = messages.filter((m) => !settings.blockedUsers[m.user?.token || ''])

  // document.title Ticker for online users
  useEffect(() => {
    if (typeof document === 'undefined') return
    const originalTitle = 'Coinsect'
    const online = chatUser?.profile?.nickname ? `(${chatUser.profile.nickname}) ` : ''
    document.title = `${online}Coinsect - ${numConnections || 0} online`

    return () => {
      document.title = originalTitle
    }
  }, [chatUser?.profile?.nickname, numConnections])

  // Scroll to bottom only when NEW messages arrive at the end
  const lastMessageId = messages[messages.length - 1]?.id
  useEffect(() => {
    if (autoScrollable && lastMessageId) {
      scrollToBottom('auto')
    }
  }, [lastMessageId, autoScrollable, scrollToBottom])

  // Scroll to bottom and Reset position when opening chat
  useEffect(() => {
    if (!settings.chatFolded) {
      setAutoScrollable(true)
      scrollToBottom('auto')
      resetPosition()
    }
  }, [settings.chatFolded, scrollToBottom, setAutoScrollable, resetPosition])

  // Reset position when window size or chat size max changes
  useEffect(() => {
    resetPosition()
  }, [resetPosition, settings.chatSizeMax])

  // Set initial position to bottom-right on mount
  useEffect(() => {
    resetPosition()
  }, [resetPosition])

  if (settings.chatFolded) {
    return (
      <AppChatIncomingMessageOverlay isOutside onScrollToBottom={() => scrollToBottom('auto')} />
    )
  }

  return (
    <div
      className={`app-chat transition-opacity duration-300 ${settings.chatTransparent ? 'opacity-50' : ''} ${settings.chatSkin}`}
    >
      <div
        ref={(el) => {
          dragRef.current = el
          containerRef.current = el
        }}
        className="app-chat-container fixed z-[100] bg-background-base border border-text-stress rounded-lg shadow-2xl flex flex-col overflow-x-hidden overflow-y-hidden"
        style={{
          ...dragStyle,
          width: '320px',
          height: settings.chatSizeMax ? 'calc(100% - 64px)' : '480px',
          top: settings.chatSizeMax ? '56px' : dragStyle.top,
          resize: settings.chatSizeMax ? 'none' : 'both',
          minWidth: '240px',
          minHeight: '320px',
        }}
        onMouseDown={onMouseDown}
      >
        <AppChatHeader />

        <div
          ref={chatBodyRef}
          onScroll={onScroll}
          className="app-chat-body flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative flex flex-col gap-1 p-3"
          style={{ overflowAnchor: 'none' }}
        >
          {loadingMore && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 animate-pulse z-10" />
          )}

          {filteredMessages.map((message, idx) => (
            <React.Fragment key={message.id}>
              <DailySeparator message={message} prevMessage={filteredMessages[idx - 1]} />
              <AppChatMessage
                message={message}
                prevMessage={filteredMessages[idx - 1]}
                nextMessage={filteredMessages[idx + 1]}
                onClickRepliedMessage={onClickRepliedMessage}
              />
            </React.Fragment>
          ))}
        </div>

        {!autoScrollable && incomingMessage && (
          <AppChatIncomingMessageOverlay onScrollToBottom={() => scrollToBottom('auto')} />
        )}

        <AppChatInput />

        {/* Custom Resize Handle (Visual Only, Native Resize does the work) */}
        {!settings.chatSizeMax && (
          <div className="absolute bottom-1 right-1 pointer-events-none opacity-30">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 19l-2-2 2-2M19 15l-2-2 2-2M23 11l-2-2 2-2" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
