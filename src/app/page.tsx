import { Suspense } from 'react'
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getDashboards } from '@/hooks/api/useDashboards'
import { getBoardPosts } from '@/hooks/api/useBoardPosts'
import DashboardsMain from '@/components/views/main/DashboardsMain'

export default function Home() {
  const queryClient = new QueryClient()

  Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['dashboards', 'main'],
      queryFn: getDashboards,
    }),
    queryClient.prefetchQuery({
      queryKey: ['posts', { boardId: 1, limit: 10 }],
      queryFn: () => getBoardPosts(1, 10),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="page-home overflow-hidden">
        <Suspense fallback={null}>
          <DashboardsMain />
        </Suspense>
      </div>
    </HydrationBoundary>
  )
}
