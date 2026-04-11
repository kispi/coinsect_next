'use client';

import { useMemo } from 'react';
import { useAppStore, CoinsectSetting } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { ui } from '@/lib/ui';

interface Props {
  indices?: number[];
  className?: string;
  onClose?: () => void;
}

export default function SettingsPanel({ indices = [], className = '', onClose }: Props) {
  const { settings, setSettings } = useAppStore();
  const { t } = useI18n();

  const settingItems = useMemo(() => {
    const list = [
      {
        key: 'SETTINGS.LOCALE',
        settingsKey: 'locale' as keyof CoinsectSetting,
        values: [
          { title: 'SETTINGS.VALUES.KO', value: 'ko' },
          { title: 'SETTINGS.VALUES.EN', value: 'en' },
        ],
      },
      {
        key: 'SETTINGS.CURRENCY',
        settingsKey: 'currency' as keyof CoinsectSetting,
        values: [
          { title: 'SETTINGS.VALUES.KRW', value: 'krw' },
          { title: 'SETTINGS.VALUES.USD', value: 'usd' },
        ],
      },
      {
        key: 'SETTINGS.THEME',
        settingsKey: 'theme' as keyof CoinsectSetting,
        values: [
          { title: '☀️', value: 'light' },
          { title: '🌙', value: 'dark' },
        ],
      },
      {
        key: 'SETTINGS.CHART_FULL_WIDTH',
        settingsKey: 'chartFullWidth' as keyof CoinsectSetting,
        values: [
          { title: 'SETTINGS.VALUES.ON', value: true },
          { title: 'SETTINGS.VALUES.OFF', value: false },
        ],
      },
      {
        key: 'SETTINGS.CHART_TOOL',
        settingsKey: 'chartTool' as keyof CoinsectSetting,
        values: [
          { title: 'SETTINGS.VALUES.ON', value: true },
          { title: 'SETTINGS.VALUES.OFF', value: false },
        ],
      },
      {
        key: 'SETTINGS.FILTER',
        settingsKey: 'filter' as keyof CoinsectSetting,
        values: [
          { title: 'SETTINGS.VALUES.ALL', value: 'all' },
          { title: 'SETTINGS.VALUES.FAVORITES', value: 'favorites' },
        ],
      },
      {
        key: 'SETTINGS.SORT_INTERVAL',
        settingsKey: 'sortInterval' as keyof CoinsectSetting,
        values: [
          { title: 'SETTINGS.VALUES.REAL_TIME', value: 50 },
          { title: 'SETTINGS.VALUES.SECONDS', value: 5000, params: { count: 5 } },
        ],
      },
    ];

    if (indices.length > 0) {
      return list.filter((_, idx) => indices.includes(idx));
    }
    return list;
  }, [indices]);

  const handleInitSettings = async () => {
    const confirmed = await ui.modal.confirm({
      body: t('SETTINGS.MODAL_INIT_SETTINGS')
    });
    
    if (confirmed) {
      localStorage.removeItem(`coinsect_settings`);
      window.location.reload();
    }
  };

  return (
    <div className={`w-[320px] p-4 text-sm text-zinc-900 dark:text-zinc-100 ${className}`}>
      <div className="flex flex-col gap-2">
        {settingItems.map((item) => (
          <div key={item.key} className="flex flex-row items-center justify-between py-1 px-3">
            <div className="w-[120px] font-medium opacity-80">{t(item.key)}</div>
            <div className="flex flex-1 gap-2">
              {item.values.map((opt) => {
                const isActive = settings[item.settingsKey] === opt.value;
                return (
                  <div
                    key={String(opt.value)}
                    onClick={() => {
                      setSettings({ [item.settingsKey]: opt.value });
                      // Note: Theme change is now immediately applied via ThemeHandler
                    }}
                    className={`
                      flex-1 flex items-center justify-center py-1 px-2 rounded cursor-pointer select-none text-xs
                      ${isActive ? 'bg-background-light font-bold' : 'hover:bg-background-light'}
                      border border-border-base transition-colors
                    `}
                  >
                    {t(opt.title as any)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleInitSettings}
        className="w-full mt-4 py-2 text-center rounded border border-border-base hover:bg-background-light transition-colors text-text-stress font-medium"
      >
        {t('SETTINGS.INIT_SETTINGS')}
      </button>
    </div>
  );
}
