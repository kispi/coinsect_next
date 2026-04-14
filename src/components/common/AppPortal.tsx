'use client'

import { ReactNode, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

interface AppPortalProps {
  children: ReactNode
}

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * AppPortal
 * Renders children into document.body to prevent parent clipping (overflow: hidden).
 */
export default function AppPortal({ children }: AppPortalProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!mounted) return null

  return createPortal(<div className="app-portal">{children}</div>, document.body)
}
