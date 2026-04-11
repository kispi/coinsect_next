'use client';

import { useTranslations } from 'next-intl';

/**
 * A custom hook that provides a simple i18n function.
 * Matches the requested i18n('key') pattern.
 */
export function useI18n(namespace: string = 'common') {
  const t = useTranslations(namespace);
  
  return {
    t: (key: string, values?: any) => t(key, values),
    i18n: (key: string, values?: any) => t(key, values),
  };
}
