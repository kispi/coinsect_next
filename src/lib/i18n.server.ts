import fs from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { translate } from '@/lib/i18n'

/**
 * Server-side translation utility for Server Components.
 * Does not use React hooks.
 */
export async function getT() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ko'

  let messages = {}
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`)
    const content = fs.readFileSync(filePath, 'utf8')
    messages = JSON.parse(content)
  } catch (e) {
    console.error(`Failed to load server messages for ${locale}`, e)
  }

  return {
    t: (path: string, params?: Record<string, any>) => translate(messages, path, params),
    locale,
  }
}
