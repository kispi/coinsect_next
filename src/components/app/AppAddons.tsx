'use client'

import React from 'react'
import AppInitializer from '@/components/app/AppInitializer'
import GlobalWebSocketController from '@/components/app/GlobalWebSocketController'
import AppChat from '@/components/applications/chat/AppChat'
import AppChatToggler from '@/components/applications/chat/AppChatToggler'

/**
 * AppAddons
 * Container for non-UI logic, background controllers, and global UI additions.
 * This component is used to keep UIRoot focused on core presentation.
 */
export default function AppAddons() {
  return (
    <>
      {/* Core Initializer & Controllers */}
      <AppInitializer />
      <GlobalWebSocketController />

      {/* Global UI Addons */}
      <AppChat />
      <AppChatToggler />
    </>
  )
}
