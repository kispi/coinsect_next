'use client'

import React from 'react'
import dayjs from 'dayjs'
import { Message } from '@/types'

interface DailySeparatorProps {
  message: Message
  prevMessage?: Message
}

export default function DailySeparator({ message, prevMessage }: DailySeparatorProps) {
  const d = (ts: number) => dayjs(ts).format('YYYY-MM-DD')

  const show = !prevMessage || d(prevMessage.ts) !== d(message.ts)

  if (!show) return null

  return (
    <div className="daily-separator flex items-center gap-3 my-4 px-2">
      <div className="h-px flex-1 bg-border-light/30" />
      <span className="text-[10px] text-text-light font-medium bg-background-light px-2 py-0.5 rounded-full border border-border-light/50">
        {dayjs(message.ts).format('YYYY년 MM월 DD일')}
      </span>
      <div className="h-px flex-1 bg-border-light/30" />
    </div>
  )
}
