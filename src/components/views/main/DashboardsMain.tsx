'use client';

import React from 'react';
import { useDashboards } from '@/hooks/api/useDashboards';
import { useBoardPosts } from '@/hooks/api/useBoardPosts';
import SectionNews from './SectionNews';
import MainSection from './MainSection';
import RecentPosts from './RecentPosts';
import RealTimePriceCards from '../real-time-prices/RealTimePriceCards';
import CPosition from './CPosition';
import WhaleAlertItem from './WhaleAlertItem';
import { useBybitWs } from '@/hooks/websockets/useBybitWs';

export default function DashboardsMain() {
  const { data: dashboards, isLoading } = useDashboards();

  // Board 1 Posts
  const { data: board1Posts } = useBoardPosts(1, 10);
  // Board 2 Posts 
  // const { data: board2Posts } = useBoardPosts(2, 10);

  const bybitMarkets = React.useMemo(() => {
    if (!dashboards?.realTimePositions?.data) return [];
    const set = new Set<string>();
    dashboards.realTimePositions.data.forEach(pos => {
      if (pos.contract) set.add(pos.contract);
    });
    return Array.from(set);
  }, [dashboards?.realTimePositions?.data]);

  useBybitWs(bybitMarkets);

  if (isLoading) {
    return (
      <div className="w-full flex-1 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[360px] bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SectionNews news={dashboards?.news || []} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 자유게시판 */}
        <MainSection
          title="COMMUNITY_FREE_GUEST"
          link="/community"
          image="https://cdn-icons-png.flaticon.com/512/1946/1946355.png"
        >
          <RecentPosts postItems={board1Posts?.data || []} board={{ name: 'FREE' }} />
        </MainSection>

        {/* KIMP */}
        <MainSection
          title="KIMP"
          link="/prices"
          image="/images/binance.svg" // Note: adjust path if needed, usually kept in public/images
        >
          <RealTimePriceCards symbols={['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'TRX', 'ADA', 'SUI']} />
        </MainSection>

        {/* REAL_TIME_POSITIONS */}
        <MainSection
          title="REAL_TIME_POSITIONS"
          link="/indicators/positions"
          image="https://d1085v6s0hknp1.cloudfront.net/assets/icon-jg.jpg"
          tooltip="TOOLTIP_REAL_TIME_POSITIONS"
        >
          <div className="flex gap-4 overflow-x-auto pretty-scrollbar pb-2">
            {dashboards?.realTimePositions?.data?.map((position) => (
              <CPosition key={position.name} position={position} />
            ))}
          </div>
        </MainSection>

        {/* WHALE_ALERT */}
        <MainSection
          title="WHALE_ALERT"
          link="/indicators/whale-alert"
          image="https://d1085v6s0hknp1.cloudfront.net/assets/icon-whalealert.jpg"
        >
          <div className="flex flex-col gap-4">
            {dashboards?.whaleAlerts?.data?.slice(0, 10).map((whaleAlert) => (
              <WhaleAlertItem key={whaleAlert.hash} whaleAlert={whaleAlert} />
            ))}
          </div>
        </MainSection>
      </div>
    </div>
  );
}
