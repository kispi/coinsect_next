'use client'

import { useQuery } from '@tanstack/react-query'
import { Message } from '@/types'

export const getChatMessages = async (firstMessageId?: string): Promise<Message[]> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/webchat/messages`)
  if (firstMessageId) url.searchParams.append('firstMessageId', firstMessageId)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Failed to fetch chat messages')
  }

  return response.json()
}

export const useChatMessages = (firstMessageId?: string) => {
  return useQuery({
    queryKey: ['chat', 'messages', firstMessageId],
    queryFn: () => getChatMessages(firstMessageId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
