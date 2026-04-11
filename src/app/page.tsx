'use client';

import { useI18n } from '@/hooks/useI18n';
import DashboardsMain from '@/components/views/main/DashboardsMain';

export default function Home() {
  const { i18n } = useI18n();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* 
        In Vue app, ViewMain wrapped DashboardsMain.
        Here we directly render DashboardsMain in the Home page.
      */}
      <DashboardsMain />
    </main>
  );
}
