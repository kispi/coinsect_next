import React, { useMemo, useEffect } from 'react'
import { Message } from '@/types'
import MetaCard from '@/components/common/MetaCard'
import { useSeo } from '@/hooks/useSeo'

interface AppChatMessageMetaTagsProps {
  message: Message
}

export default function AppChatMessageMetaTags({ message }: AppChatMessageMetaTagsProps) {
  const { meta: crawledMeta, tryMetaTags } = useSeo()

  const link = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const match = message.text?.match(urlRegex)
    return match ? match[0] : null
  }, [message.text])

  const meta = useMemo(() => {
    // 1. Check if metadata was included in the message from server
    if (message.meta) {
      try {
        const parsed = typeof message.meta === 'string' ? JSON.parse(message.meta) : message.meta
        if (parsed.og) return parsed.og
      } catch (e) {}
    }

    // 2. Return crawled metadata if exists
    if (crawledMeta.image || crawledMeta.title) return crawledMeta

    return null
  }, [message.meta, crawledMeta])

  // Try crawling if link exists but no meta
  useEffect(() => {
    if (link && !meta && !message.meta) {
      tryMetaTags(link).catch(() => {})
    }
  }, [link, meta, message.meta, tryMetaTags])

  if (!link || !meta) return null

  return (
    <div className="mt-2 mb-1 w-full max-w-[280px]">
      <MetaCard link={link} meta={meta} small={true} />
    </div>
  )
}
