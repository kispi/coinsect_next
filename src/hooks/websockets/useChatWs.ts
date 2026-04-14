'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useUserStore, ChatStoreContext } from '@/store/StoreProvider'
import { User } from '@/types'
import { metaStorage } from '@/lib/storage'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { processChatMessage } from '@/lib/chat'

export function useChatWs() {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  const chatStoreContext = useContext(ChatStoreContext)
  if (!chatStoreContext) throw new Error('useChatWs must be used within StoreProvider')

  const authToken = useUserStore((s) => s.authToken)
  const meId = useUserStore((s) => s.me?.id)

  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const preventAutoReconnectRef = useRef(false)
  const isConnectingRef = useRef(false)

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return

    const endpoint = process.env.NEXT_PUBLIC_API_BASE?.replace('http', 'ws')
    const savedUser = metaStorage.getItem<User>('user')
    const token = savedUser?.token ? `?token=${savedUser.token}` : ''
    const url = `${endpoint}/webchat${token}`

    if (
      socketRef.current?.readyState === WebSocket.OPEN ||
      socketRef.current?.readyState === WebSocket.CONNECTING
    ) {
      // If URL has changed (token updated), we SHOULD reconnect
      if (socketRef.current.url === url) {
        return
      }
      socketRef.current.close()
    }

    if (isConnectingRef.current) return

    isConnectingRef.current = true

    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => {
      isConnectingRef.current = false
      chatStoreContext.getState().setConnected(true)
      preventAutoReconnectRef.current = false

      pingIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: 'ping',
              user: { path: pathnameRef.current },
            })
          )
        }
      }, 30000)
    }

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        const store = chatStoreContext.getState()

        if (message.numConnections) {
          store.setNumConnections(message.numConnections)
        }
        if (message.stats) {
          store.setChatStats(message.stats)
        }

        switch (message.type) {
          case 'auth':
            metaStorage.setItem('user', message.user)
            store.setChatUser(message.user)
            break

          case 'text':
          case 'image':
          case 'alert': {
            if (message.type === 'alert' && message.meta?.$$alertType === 'realTimePosition') {
              handlePositionUpdate(message.meta, queryClient)
            }

            const processedMessage = processChatMessage(message, meId, store.chatUser)

            if (processedMessage.text || processedMessage.type === 'image') {
              store.addMessage(processedMessage)

              // Show overlay if folded OR if not at the bottom
              if (store.settings.chatFolded || !store.autoScrollable) {
                store.setIncomingMessage(processedMessage)
              }
            }
            break
          }

          case 'hideMessage': {
            const targetId = message.meta?.messageId
            if (targetId) {
              store.setMessages(
                store.messages.map((m) => (m.id === targetId ? { ...m, $$hide: true } : m))
              )
            }
            break
          }

          case 'updateReaction': {
            const targetId = message.meta?.messageId
            const newReactions = message.meta?.updatedReactions
            if (targetId) {
              store.setMessages(
                store.messages.map((m) =>
                  m.id === targetId ? { ...m, reactions: newReactions } : m
                )
              )
            }
            break
          }

          case 'users':
            store.setChatUsers(message.meta || [])
            break

          case 'forceRefresh':
            window.location.reload()
            break
        }
      } catch (e) {
        console.error('Error parsing chat ws message', e)
      }
    }

    socket.onerror = (error) => {
      console.error('Chat WebSocket error', error)
    }
  }, [chatStoreContext, queryClient, meId])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    socket.onclose = () => {
      isConnectingRef.current = false
      chatStoreContext.getState().setConnected(false)
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)

      if (!preventAutoReconnectRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, 5000)
      }
    }
  }, [connect, chatStoreContext])

  useEffect(() => {
    connect()
    return () => {
      // Only close socket on full unmount, not on every re-trigger
      // But if we want to change identity, we handle it inside connect() URL comparison
    }
  }, [connect])

  const sendMessage = useCallback(
    (text: string, type: string = 'text', meta?: any) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const store = chatStoreContext.getState()
        const payload: any = {
          type,
          user: { token: store.chatUser?.token },
        }

        // Only include text if it's actually provided or if it's a standard text message
        if (text || type === 'text') payload.text = text

        if (authToken) payload.user.jwt = authToken
        if (meta) payload.meta = typeof meta === 'string' ? meta : JSON.stringify(meta)

        socketRef.current.send(JSON.stringify(payload))
      }
    },
    [chatStoreContext, authToken]
  )

  useEffect(() => {
    chatStoreContext.getState().setSendMessage(sendMessage)
  }, [sendMessage, chatStoreContext])

  return { sendMessage }
}

function handlePositionUpdate(newPos: any, queryClient: any) {
  queryClient.setQueryData(['dashboards', 'main'], (old: any) => {
    if (!old) return old
    const positionData = old.realTimePositions?.data || []
    let newData = [...positionData]

    if (newPos.$$deleted) {
      newData = newData.filter((p: any) => p.name !== newPos.name)
    } else {
      const idx = newData.findIndex((p: any) => p.name === newPos.name)
      if (idx > -1) {
        newData[idx] = { ...newData[idx], ...newPos }
      } else {
        newData.push(newPos)
      }
    }

    return {
      ...old,
      realTimePositions: {
        ...old.realTimePositions,
        data: newData,
        lastUpdate: new Date().toISOString(),
      },
    }
  })
}
