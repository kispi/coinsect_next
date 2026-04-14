'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export interface MetaData {
  image: string | null
  title: string | null
  description: string | null
}

export const useSeo = () => {
  const router = useRouter()
  const [numTrial, setNumTrial] = useState(0)
  const [meta, setMeta] = useState<MetaData>({
    image: null,
    title: null,
    description: null,
  })

  const reset = () => {
    setMeta({
      image: null,
      title: null,
      description: null,
    })
  }

  const onClickMetaCard = (link: string) => {
    if (!link) return

    if (link.startsWith('https://coinsect.io')) {
      const path = link.split('https://coinsect.io')[1]
      router.push(path || '/')
      return
    }

    const openable = link.startsWith('http') ? link : `https://${link}`
    window.open(openable, '_blank', 'noreferrer')
  }

  const tryMetaTags = async (link: string) => {
    if (!link || numTrial >= 3) {
      setNumTrial(0)
      return Promise.reject()
    }

    // Check if it's already an image URL
    if (/\.(jpeg|jpg|gif|png|webp|svg)$/.test(link.toLowerCase())) {
      setMeta({
        image: link,
        title: null,
        description: null,
      })
      return
    }

    try {
      const data = await api.post<any>('helpers/crawled_websites', { url: link })
      if (data.status === 'crawling') {
        setNumTrial((prev) => prev + 1)
        setTimeout(() => tryMetaTags(link), 2000)
        return
      }
      setMeta(data.meta)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    meta,
    reset,
    tryMetaTags,
    onClickMetaCard,
  }
}

export default useSeo
