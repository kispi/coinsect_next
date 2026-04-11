import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getDashboards } from '@/hooks/api/useDashboards';
import DashboardsMain from '@/components/views/main/DashboardsMain';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['dashboards', 'main'],
    queryFn: getDashboards,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardsMain />
    </HydrationBoundary>
  );
}
