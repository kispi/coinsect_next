import React from 'react'
import { useT } from '@/hooks/useT'

export default function RecentPosts({ postItems, board }: { postItems?: any[]; board?: any }) {
  const { t } = useT()

  if (!postItems || postItems.length === 0) {
    return (
      <div className="recent-posts text-zinc-500 text-center py-4 text-sm">
        {t('NO_SEARCH_RESULT')}
      </div>
    )
  }

  return (
    <div className="recent-posts flex flex-col gap-2">
      {postItems.slice(0, 10).map((post) => (
        <div
          key={post.id}
          className="text-sm truncate hover:underline cursor-pointer transition-colors p-1 rounded hover:bg-background-light"
        >
          <span className="text-zinc-500 mr-2">[{t(board?.name || 'FREE')}]</span>
          {post.title}
        </div>
      ))}
    </div>
  )
}
