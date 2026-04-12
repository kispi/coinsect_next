'use client'

import { useAppStore } from '@/store/useAppStore'
import { translate } from '@/lib/i18n'

/**
 * Custom i18n hook that provides a global t() function.
 * Does not use namespaces; always uses full nested paths.
 */
export function useI18n() {
  const messages = useAppStore((state) => state.messages)

  const t = (path: string, params?: Record<string, any>) => {
    return translate(messages, path, params)
  }

  return {
    t,
    i18n: t,
  }
}
