'use client'

import { useRef, useState } from 'react'
import { Share2, Settings, Bell, User, Menu, X, Users } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { ui } from '@/lib/ui'
import Dropdown from '@/components/common/Dropdown'
import SettingsPanel from './SettingsPanel'
import BannerMarketIndices from './BannerMarketIndices'
import Link from 'next/link'

// Placeholder components if they don't exist yet
const AppLogo = () => (
  <Link href="/">
    <div className="font-bold text-xl ml-2 text-text-stress">COINSECT</div>
  </Link>
)
const AppNotifications = () => <div className="p-4 w-60 text-sm">No new notifications</div>

export default function AppHeader() {
  const { t } = useI18n()
  const [showNavigation, setShowNavigation] = useState(false)

  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMenuAccount, setShowMenuAccount] = useState(false)

  const refIconSettings = useRef<HTMLDivElement>(null)
  const refIconNotifications = useRef<HTMLDivElement>(null)
  const refIconMenuAccount = useRef<HTMLDivElement>(null)

  // Example placeholder for user
  const me = null

  const onClickShare = () => {
    const url = window.location.origin + window.location.pathname
    navigator.clipboard.writeText(url).then(() => {
      ui.toast.success(t('COMMON.URL_COPIED'))
    })
  }

  const onClickMenuAccount = () => {
    if (me) {
      setShowMenuAccount((prev) => !prev)
    } else {
      // Show login modal logic
      ui.modal.alert(t('COMMON.SIGN_IN'))
    }
  }

  return (
    <header className="w-full px-4 bg-background-base border-b border-border-base">
      <div className="flex justify-between items-center py-2">
        <BannerMarketIndices />
        {/* Chat users logic (stub) */}
        <div className="flex items-center text-[11px] md:text-xs font-mono cursor-pointer text-text-light hover:text-text-base transition-colors shrink-0 ml-4">
          <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span>0</span>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center select-none">
          {/* Mobile Menu Icon */}
          <div
            className="w-8 h-8 flex items-center justify-center cursor-pointer mr-2 lg:hidden text-text-stress hover:bg-background-light rounded-full transition-colors"
            onClick={() => setShowNavigation(!showNavigation)}
          >
            {showNavigation ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </div>
          <AppLogo />
        </div>

        <div className="flex items-center gap-2 relative">
          <div
            onClick={onClickShare}
            className="w-8 h-8 flex items-center justify-center cursor-pointer text-text-stress hover:bg-background-light rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </div>

          <div className="relative">
            <div
              ref={refIconSettings}
              onClick={() => setShowSettings((prev) => !prev)}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors rounded-full text-text-stress ${showSettings ? 'bg-background-light' : 'hover:bg-background-light'}`}
            >
              <Settings className="w-5 h-5" />
            </div>
            <Dropdown
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              triggerRef={refIconSettings}
            >
              <SettingsPanel indices={[0, 1, 2, 3, 4]} onClose={() => setShowSettings(false)} />
            </Dropdown>
          </div>

          <div className="relative">
            <div
              ref={refIconNotifications}
              onClick={() => setShowNotifications((prev) => !prev)}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors rounded-full text-text-stress ${showNotifications ? 'bg-background-light' : 'hover:bg-background-light'}`}
            >
              <Bell className="w-5 h-5" />
            </div>
            <Dropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              triggerRef={refIconNotifications}
            >
              <AppNotifications />
            </Dropdown>
          </div>

          <div className="relative">
            <div
              ref={refIconMenuAccount}
              onClick={onClickMenuAccount}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors rounded-full text-text-stress ${showMenuAccount ? 'bg-background-light' : 'hover:bg-background-light'}`}
            >
              {me ? (
                <User className="w-5 h-5" />
              ) : (
                <div className="text-[10px] font-medium leading-tight text-center">
                  {t('COMMON.SIGN_IN')}
                </div>
              )}
            </div>
            {me && (
              <Dropdown
                isOpen={showMenuAccount}
                onClose={() => setShowMenuAccount(false)}
                triggerRef={refIconMenuAccount}
              >
                <ul className="min-w-[150px] py-1 text-sm text-zinc-700 dark:text-zinc-300">
                  <li
                    className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    onClick={() => setShowMenuAccount(false)}
                  >
                    {t('COMMON.MY_ACTIVITY')}
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    onClick={() => setShowMenuAccount(false)}
                  >
                    {t('COMMON.ACCOUNT_SETTINGS')}
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer border-t border-zinc-200 dark:border-zinc-800"
                    onClick={() => setShowMenuAccount(false)}
                  >
                    {t('COMMON.LOGOUT')}
                  </li>
                </ul>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
