'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export default function ThemeHandler() {
  const theme = useAppStore((state) => state.settings.theme)

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return null
}
