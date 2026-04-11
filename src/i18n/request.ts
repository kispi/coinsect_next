import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Locale defaults to 'ko' unless a previously saved cookie specifies otherwise
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ko';

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default
  };
});

