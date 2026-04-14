'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface MetaCardProps {
  link: string
  meta: {
    title?: string
    image?: string
    description?: string
  }
  small?: boolean
  useBlankGuide?: boolean
}

export default function MetaCard({
  link,
  meta,
  small = false,
  useBlankGuide = false,
}: MetaCardProps) {
  const router = useRouter()

  const onClickMetaCard = (url: string) => {
    if (!url) return

    // Handle internal routing for coinsect.io links
    if (url.startsWith('https://coinsect.io')) {
      const path = url.split('https://coinsect.io')[1]
      router.push(path || '/')
      return
    }

    // External links
    const openable = url.startsWith('http') ? url : `https://${url}`
    window.open(openable, '_blank', 'noreferrer')
  }

  const hasMeta = meta.title || meta.image || meta.description

  if (!useBlankGuide && !hasMeta) return null

  return (
    <div
      onClick={() => onClickMetaCard(link)}
      className={`
        meta-card border border-border-base rounded-lg overflow-hidden cursor-pointer transition-all hover:border-text-light/30
        ${small ? 'max-w-[200px]' : 'w-full'}
      `}
    >
      {!hasMeta ? (
        <div className="empty-meta flex items-center justify-center p-4 text-[10px] text-text-light text-center">
          웹사이트 {link}에서 유의미한 메타 정보(타이틀, 설명, 이미지)를 찾지 못했습니다 😥
        </div>
      ) : (
        <>
          <div
            className={`meta-image relative pt-[56.25%] bg-background-light ${meta.image ? 'has-image' : ''}`}
          >
            {meta.image ? (
              <img
                src={meta.image}
                className="absolute inset-0 w-full h-full object-cover"
                alt={meta.title || 'meta-image'}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4 text-[10px] text-text-light text-center">
                웹사이트 {link}에서 메타 이미지를 찾지 못했습니다 😥
              </div>
            )}
          </div>

          {(meta.title || meta.description) && (
            <div className="meta-info bg-white dark:bg-zinc-100 p-2 md:p-3 flex flex-col gap-1">
              {meta.title && (
                <div
                  className={`meta-title text-zinc-900 text-xs font-bold ${small ? 'line-clamp-1' : 'line-clamp-2'}`}
                  dangerouslySetInnerHTML={{ __html: meta.title }}
                />
              )}
              {meta.description && (
                <div
                  className={`meta-description text-zinc-600 text-[10px] ${small ? 'line-clamp-2' : 'line-clamp-3'}`}
                  dangerouslySetInnerHTML={{ __html: meta.description }}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
