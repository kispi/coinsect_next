'use client';

import React, { useMemo } from 'react';
import { useAppStore, CoinsectSetting } from '@/store/useAppStore';

interface Props {
  indices?: number[];
  className?: string;
  onClose?: () => void;
}

export default function SettingsPanel({ indices = [], className = '', onClose }: Props) {
  const { settings, setSettings } = useAppStore();

  const settingItems = useMemo(() => {
    const list = [
      {
        key: 'LOCALE',
        settingsKey: 'locale' as keyof CoinsectSetting,
        values: [
          { title: 'KR', value: 'ko' },  // Use 'ko' for vue 'kr' equivalent
          { title: 'EN', value: 'en' },
        ],
      },
      {
        key: 'CURRENCY',
        settingsKey: 'currency' as keyof CoinsectSetting,
        values: [
          { title: 'KRW', value: 'krw' },
          { title: 'USD', value: 'usd' },
        ],
      },
      {
        key: 'THEME',
        settingsKey: 'theme' as keyof CoinsectSetting,
        values: [
          { title: '☀️', value: 'light' },
          { title: '🌙', value: 'dark' },
        ],
      },
      {
        key: 'CHART_FULL_WIDTH',
        settingsKey: 'chartFullWidth' as keyof CoinsectSetting,
        values: [
          { title: 'ON', value: true },
          { title: 'OFF', value: false },
        ],
      },
      {
        key: 'CHART_TOOL',
        settingsKey: 'chartTool' as keyof CoinsectSetting,
        values: [
          { title: 'ON', value: true },
          { title: 'OFF', value: false },
        ],
      },
      {
        key: 'FILTER',
        settingsKey: 'filter' as keyof CoinsectSetting,
        values: [
          { title: 'ALL', value: 'all' },
          { title: 'FAVORITES', value: 'favorites' },
        ],
      },
      {
        key: 'SORT_INTERVAL',
        settingsKey: 'sortInterval' as keyof CoinsectSetting,
        values: [
          { title: 'REAL_TIME', value: 50 },
          { title: '5 SECONDS', value: 5000 }, // Assuming raw text without i18n lookup for demo
        ],
      },
    ];

    if (indices.length > 0) {
      return list.filter((_, idx) => indices.includes(idx));
    }
    return list;
  }, [indices]);

  const handleInitSettings = () => {
    // In actual implementation, we would use a custom confirmation modal
    if (window.confirm('초기화 하시겠습니까? (Reset settings?)')) {
      // Logic for init settings (removing meta from storage & reloading)
      localStorage.removeItem(`ag_meta_settings`); // metaStorage key
      window.location.reload();
    }
  };

  return (
    <div className={`w-[320px] p-4 text-sm text-zinc-900 dark:text-zinc-100 ${className}`}>
      <div className="flex flex-col gap-2">
        {settingItems.map((item) => (
          <div key={item.key} className="flex flex-row items-center justify-between py-1 px-3">
            <div className="w-[120px] font-medium opacity-80">{item.key}</div>
            <div className="flex flex-1 gap-2">
              {item.values.map((opt) => {
                const isActive = settings[item.settingsKey] === opt.value;
                return (
                  <div
                    key={String(opt.value)}
                    onClick={() => setSettings({ [item.settingsKey]: opt.value })}
                    className={`
                      flex-1 flex items-center justify-center py-1 px-2 rounded cursor-pointer select-none text-xs
                      ${isActive ? 'bg-zinc-200 dark:bg-zinc-700 font-bold' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}
                    `}
                  >
                    {opt.title}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleInitSettings}
        className="w-full mt-4 py-2 text-center rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        INIT_SETTINGS
      </button>
    </div>
  );
}
