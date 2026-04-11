'use client';

import { useCounterStore } from '@/store/useCounterStore';
import { useI18n } from '@/hooks/useI18n';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export default function Home() {
  const { i18n } = useI18n();
  const { count, inc, dec, reset } = useCounterStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-primary">
          {i18n('hello')}
        </h1>
      </div>

      <div className="flex flex-col items-center space-y-4 p-8 border border-border-base rounded-2xl bg-white dark:bg-zinc-900 shadow-xl">
        <h2 className="text-2xl font-semibold">
          {i18n('counter', { count })}
        </h2>
        
        <div className="flex space-x-4">
          <button
            onClick={dec}
            className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label={i18n('decrement')}
          >
            <Minus className="w-6 h-6" />
          </button>
          
          <button
            onClick={reset}
            className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Reset"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={inc}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            aria-label={i18n('increment')}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="text-text-muted text-sm">
        Next.js 16 + React 19 + Zustand + TanStack Query + Tailwind CSS
      </div>
    </main>
  );
}
