'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSuspenseDashboards } from '@/hooks/api/useDashboards'
import { useSuspenseBoardPosts } from '@/hooks/api/useBoardPosts'
import SectionNews from './SectionNews'
import MainSection from './MainSection'
import RecentPosts from './RecentPosts'
import RealTimePriceCards from '../real-time-prices/RealTimePriceCards'
import CPosition from './CPosition'
import WhaleAlertItem from './WhaleAlertItem'
import AppSkeleton from '@/components/common/AppSkeleton'

function NewsSection() {
  const { data: dashboards } = useSuspenseDashboards()
  return <SectionNews news={dashboards?.news || []} />
}

function BoardFreeSection() {
  const { data: board1Posts } = useSuspenseBoardPosts(1, 10)
  return (
    <MainSection
      title="COMMON.COMMUNITY_FREE_GUEST"
      link="/community"
      image="https://cdn-icons-png.flaticon.com/512/1946/1946355.png"
    >
      <RecentPosts postItems={board1Posts?.data || []} board={{ name: 'FREE' }} />
    </MainSection>
  )
}

function PositionsSection() {
  const { data: dashboards } = useSuspenseDashboards()
  return (
    <MainSection
      title="COMMON.REAL_TIME_POSITIONS"
      link="/indicators/positions"
      image="https://d1085v6s0hknp1.cloudfront.net/assets/icon-jg.jpg"
      tooltip="COMMON.TOOLTIP_REAL_TIME_POSITIONS"
    >
      <div className="flex flex-col gap-2">
        {dashboards?.realTimePositions?.data?.map((position) => (
          <CPosition key={position.name} position={position} />
        ))}
      </div>
    </MainSection>
  )
}

function WhaleAlertSection() {
  const { data: dashboards } = useSuspenseDashboards()
  return (
    <MainSection
      title="COMMON.WHALE_ALERT"
      link="/indicators/whale-alert"
      image="https://d1085v6s0hknp1.cloudfront.net/assets/icon-whalealert.jpg"
    >
      <div className="flex flex-col gap-4">
        {dashboards?.whaleAlerts?.data?.slice(0, 10).map((whaleAlert) => (
          <WhaleAlertItem key={whaleAlert.hash} whaleAlert={whaleAlert} />
        ))}
      </div>
    </MainSection>
  )
}

function SectionSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 bg-background-light/30 rounded-lg border border-border-light/50 h-[360px]">
      <div className="flex items-center gap-2 mb-2">
        <AppSkeleton width={24} height={24} circle />
        <AppSkeleton width={120} height={20} />
      </div>
      <AppSkeleton height={200} className="w-full" />
    </div>
  )
}

export default function DashboardsMain() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="w-full flex flex-col items-center justify-center p-12 bg-background-light rounded-lg border border-red-500/20">
          <div className="text-red-500 font-bold mb-2">Failed to load dashboard data</div>
          <p className="text-text-light text-sm mb-4">{(error as any)?.message}</p>
          <button onClick={resetErrorBoundary} className="btn-primary btn-md">
            Retry
          </button>
        </div>
      )}
    >
      <div className="dashboards-main w-full">
        <Suspense fallback={<AppSkeleton height={32} className="mb-4 w-full max-w-[600px]" />}>
          <NewsSection />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Suspense fallback={<SectionSkeleton />}>
            <BoardFreeSection />
          </Suspense>

          <MainSection title="COMMON.KIMP" link="/prices" image="/images/binance.svg">
            <RealTimePriceCards
              symbols={['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'TRX', 'ADA', 'SUI']}
            />
          </MainSection>

          <Suspense fallback={<SectionSkeleton />}>
            <PositionsSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <WhaleAlertSection />
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  )
}
