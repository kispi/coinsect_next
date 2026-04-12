/**
 * Core i18n utility for custom translation system.
 * Inspired by Vue's $t but designed for Next.js/Zustand.
 */

/**
 * Resolves a nested key (e.g., "SETTINGS.VALUES.ON") from an object.
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined

  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    current = current[part]
  }

  return current
}

/**
 * Translates a path based on a messages object and replaces parameters.
 * Example: translate(messages, 'SETTINGS.VALUES.SECONDS', { count: 5 })
 */
export function translate(messages: any, path: string, params?: Record<string, any>): string {
  const value = getNestedValue(messages, path)

  if (value === undefined || value === null) {
    return path // Fallback to raw key if translation is missing
  }

  if (typeof value !== 'string') {
    return path
  }

  let result = value

  if (params) {
    Object.keys(params).forEach((key) => {
      // Supporting both {key} and :key patterns for flexibility
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]))
    })
  }

  return result
}
