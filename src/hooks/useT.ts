'use client'

import { useAppStore } from '@/store/StoreProvider'
import { translate } from '@/lib/i18n'

/**
 * Custom i18n hook that provides a global t() function.
 * Uses the context-based store for stable SSR and Hydration.
 */
export function useT() {
  const messages = useAppStore((state) => state.messages)
  const locale = useAppStore((state) => state.settings.locale)

  const t = (path: string, params?: Record<string, any>) => {
    return translate(messages, path, params)
  }

  return {
    t,
    locale,
  }
}
