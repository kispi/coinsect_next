'use client'

import { createStore } from 'zustand'

export type CoinsectConfig = {
  emojis: Record<string, { emoji: string }>
  ip: string
  maxlength: {
    nickname: number
    postTitle: number
    profileImageUrl: number
    replyContent: number
  }
  version: { frontend: string | null; backend: string | null }
}

export interface ConfigState {
  config: CoinsectConfig | null
  setConfig: (config: CoinsectConfig) => void
}

export type ConfigStore = ReturnType<typeof createConfigStore>

export const createConfigStore = () => {
  return createStore<ConfigState>((set) => ({
    config: null,
    setConfig: (config) => set({ config }),
  }))
}
