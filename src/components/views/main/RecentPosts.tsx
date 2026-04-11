import React from 'react';
import { useI18n } from '@/hooks/useI18n';

export default function RecentPosts({ postItems, board }: { postItems?: any[]; board?: any }) {
  const { i18n } = useI18n();

  if (!postItems || postItems.length === 0) {
    return <div className="text-zinc-500 text-center py-4 text-sm">{i18n('NO_SEARCH_RESULT')}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {postItems.slice(0, 10).map((post) => (
        <div key={post.id} className="text-sm truncate hover:underline cursor-pointer transition-colors p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <span className="text-zinc-500 mr-2">[{i18n(board?.name || 'FREE')}]</span>
          {post.title}
        </div>
      ))}
    </div>
  );
}
