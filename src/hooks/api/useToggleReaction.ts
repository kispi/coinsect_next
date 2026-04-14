'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ui } from '@/lib/ui'

interface ToggleReactionParams {
  messageId: string | number
  type: string
  nickname: string
}

export const useToggleReaction = () => {
  return useMutation({
    mutationFn: ({ messageId, type, nickname }: ToggleReactionParams) =>
      api.post('reactions/messages', { messageId, type, nickname }),
    onError: (error: any) => {
      ui.toast.error(error.message || 'Failed to update reaction')
    },
  })
}
