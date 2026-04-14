'use client'

import { createStore } from 'zustand'
import { Message, User, ChatStats, Profile } from '@/types'
import { metaStorage } from '@/lib/storage'
import { api } from '@/lib/api'

export interface ChatSettings {
  blockedUsers: Record<string, boolean>
  chatFolded: boolean
  chatSizeMax: boolean
  chatDing: boolean
  chatTransparent: boolean
  chatOverlayNewMessage: boolean
  chatSkin: string
}

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  blockedUsers: {},
  chatFolded: false,
  chatSizeMax: false,
  chatDing: false,
  chatTransparent: false,
  chatOverlayNewMessage: true,
  chatSkin: 'basic',
}

export interface ChatState {
  messages: Message[]
  connected: boolean
  chatUser: User | null
  chatStats: ChatStats
  writingReplyTo: Message | null
  lastReadMessage: Message | null
  autoScrollable: boolean
  incomingMessage: Message | null
  numConnections: number
  settings: ChatSettings
  chatUsers: User[]
  numUnreads: number
  sendMessage: (text: string, type?: string, meta?: any) => void

  // Actions
  setMessages: (messages: Message[]) => void
  prependMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setConnected: (connected: boolean) => void
  setNumConnections: (num: number) => void
  setChatUser: (user: User | null) => void
  setChatUsers: (users: User[]) => void
  setChatStats: (stats: ChatStats) => void
  setWritingReplyTo: (message: Message | null) => void
  setLastReadMessage: (message: Message | null) => void
  setAutoScrollable: (scrollable: boolean) => void
  setIncomingMessage: (message: Message | null) => void
  setSendMessage: (fn: (text: string, type?: string, meta?: any) => void) => void
  setSettings: (settings: Partial<ChatSettings>) => void
  toggleBlockUser: (token: string) => void
  clearMessages: () => void
  updateProfile: (profile: Profile) => Promise<void>
}

export type ChatStore = ReturnType<typeof createChatStore>

export const createChatStore = () => {
  return createStore<ChatState>((set, get) => ({
    messages: [],
    connected: false,
    chatUser: null,
    chatStats: { onlineUsers: 0 },
    writingReplyTo: null,
    lastReadMessage: null,
    autoScrollable: true,
    incomingMessage: null,
    numConnections: 0,
    settings: DEFAULT_CHAT_SETTINGS,
    chatUsers: [],
    numUnreads: 0,
    sendMessage: () => {},

    setMessages: (messages) => set({ messages }),
    prependMessages: (newMessages) =>
      set((state) => ({
        messages: [...newMessages, ...state.messages],
      })),
    addMessage: (message) =>
      set((state) => {
        // Avoid duplicate messages by ID
        if (state.messages.some((m) => m.id === message.id)) return state

        const newMessages = [...state.messages, message]

        // Update unreads if folded
        let newNumUnreads = state.numUnreads
        if (state.settings.chatFolded) {
          newNumUnreads += 1
        }

        // Keep only last 500 messages
        if (newMessages.length > 500) {
          return { messages: newMessages.slice(-100), numUnreads: newNumUnreads }
        }
        return { messages: newMessages, numUnreads: newNumUnreads }
      }),
    setConnected: (connected) => set({ connected }),
    setNumConnections: (numConnections) => set({ numConnections }),
    setChatUser: (user) => {
      if (user) metaStorage.setItem('user', user)
      set({ chatUser: user })
    },
    setChatUsers: (chatUsers) => set({ chatUsers }),
    setChatStats: (stats) => set({ chatStats: stats }),
    setWritingReplyTo: (message) => set({ writingReplyTo: message }),
    setLastReadMessage: (message) => set({ lastReadMessage: message, numUnreads: 0 }),
    setAutoScrollable: (scrollable) => set({ autoScrollable: scrollable }),
    setIncomingMessage: (message) => set({ incomingMessage: message }),
    setSendMessage: (fn) => set({ sendMessage: fn }),
    setSettings: (newSettings) =>
      set((state) => {
        const updated = { ...state.settings, ...newSettings }
        metaStorage.setItem('chatSettings', updated)

        // If unfolding, reset unreads
        let newNumUnreads = state.numUnreads
        if (state.settings.chatFolded && updated.chatFolded === false) {
          newNumUnreads = 0
        }

        return { settings: updated, numUnreads: newNumUnreads }
      }),
    toggleBlockUser: (token) =>
      set((state) => {
        const blocked = { ...state.settings.blockedUsers }
        if (blocked[token]) {
          delete blocked[token]
        } else {
          blocked[token] = true
        }
        const updated = { ...state.settings, blockedUsers: blocked }
        metaStorage.setItem('chatSettings', updated)
        return { settings: updated }
      }),
    clearMessages: () => set({ messages: [], numUnreads: 0 }),
    updateProfile: async (profile) => {
      const state = get()
      const token = state.chatUser?.token
      if (!token) return

      try {
        const updatedUser = await api.put<User>(`webchat/users/${token}`, { profile })
        set({ chatUser: updatedUser })
        metaStorage.setItem('user', updatedUser)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  }))
}
