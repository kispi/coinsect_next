import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Default to 'ko' for SSR as requested. 
  // Client-side DynamicI18nProvider will handle localStorage overrides after hydration.
  const locale = 'ko';

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default
  };
});

