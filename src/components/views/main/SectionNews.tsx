import React from 'react'
import type { UpbitNews } from '@/types'
import dayjs from 'dayjs'

export default function SectionNews({ news }: { news: UpbitNews[] }) {
  if (!news || news.length === 0) return null

  return (
    <div className="section-news mb-4 overflow-hidden relative w-full h-8 flex items-center bg-transparent">
      <div className="flex gap-2 w-max animate-ticker">
        {/* We double the news to create an infinite loop effect */}
        {[...news, ...news].map((item, index) => (
          <a
            key={`${item.id}-${index}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className={`
              p-2 rounded flex text-xs shrink-0 w-[320px] transition-colors
              bg-background-light dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700
              ${item.is_best ? 'text-orange-500' : 'text-text-stress'}
            `}
          >
            <div
              className={`
              border rounded-full px-2 whitespace-nowrap
              ${item.is_best ? 'border-orange-500 bg-orange-500 text-white' : 'border-zinc-200 dark:border-zinc-700'}
            `}
            >
              {dayjs(item.created_at).format('HH:mm')}
            </div>
            <div className="font-bold ml-2 truncate">{item.title}</div>
          </a>
        ))}
      </div>
      <style>{`
        @keyframes ticker-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker-slide 40s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
