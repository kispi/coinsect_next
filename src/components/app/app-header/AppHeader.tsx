'use client'

import { useRef, useState } from 'react'
import { Share2, Settings, Bell, User, Menu, X, Users } from 'lucide-react'
import { useT } from '@/hooks/useT'
import { ui } from '@/lib/ui'
import WrapperDropdown from '@/components/common/WrapperDropdown'
import SettingsPanel from './SettingsPanel'
import BannerMarketIndices from './BannerMarketIndices'
import Link from 'next/link'
import { useUserStore } from '@/store/StoreProvider'
import { useMeQuery } from '@/hooks/api/useUser'
import ModalSignIn from '@/components/modals/ModalSignIn'

// Placeholder components if they don't exist yet
const AppLogo = () => (
  <Link href="/" className="app-logo">
    <div className="font-bold text-xl ml-2 text-text-stress">COINSECT</div>
  </Link>
)
const AppNotifications = () => (
  <div className="app-notifications p-4 w-60 text-sm">No new notifications</div>
)
export default function AppHeader() {
  const { t } = useT()
  const [showNavigation, setShowNavigation] = useState(false)

  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMenuAccount, setShowMenuAccount] = useState(false)

  const refIconSettings = useRef<HTMLDivElement>(null)
  const refIconNotifications = useRef<HTMLDivElement>(null)
  const refIconMenuAccount = useRef<HTMLDivElement>(null)

  // Fetch user data if token exists
  useMeQuery()
  const { me, logout } = useUserStore()

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
      ui.modal.custom(ModalSignIn)
    }
  }

  const handleLogout = () => {
    ui.modal.confirm({
      body: 'MODAL.LOGOUT_CONFIRM',
      buttons: [
        { text: 'COMMON.CANCEL', class: 'btn-default' },
        { text: 'COMMON.LOGOUT', class: 'btn-primary', onClick: logout },
      ],
    })
    setShowMenuAccount(false)
  }

  return (
    <header className="app-header w-full bg-background-base">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="header-top flex justify-between items-center py-2 gap-4">
          <BannerMarketIndices />
          {/* Chat users logic (stub) */}
          <div className="chat-users flex items-center text-[11px] md:text-xs font-mono cursor-pointer text-text-stress hover:text-text-base transition-colors shrink-0">
            <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            <span>0</span>
          </div>
        </div>

        <div className="header-bottom flex items-center justify-between py-3 border-y border-border-base">
          <div className="header-left flex items-center select-none">
            {/* Mobile Menu Icon */}
            <div
              className="mobile-menu-icon w-8 h-8 flex items-center justify-center cursor-pointer mr-2 lg:hidden text-text-stress hover:bg-background-light rounded-full transition-colors"
              onClick={() => setShowNavigation(!showNavigation)}
            >
              {showNavigation ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </div>
            <AppLogo />
          </div>

          <div className="header-right flex items-center gap-2 relative">
            <div
              onClick={onClickShare}
              className="share-button w-8 h-8 flex items-center justify-center cursor-pointer text-text-stress hover:bg-background-light rounded-full transition-colors"
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
              <WrapperDropdown
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                triggerRef={refIconSettings}
              >
                <SettingsPanel indices={[0, 1, 2, 3, 4]} onClose={() => setShowSettings(false)} />
              </WrapperDropdown>
            </div>

            <div className="relative">
              <div
                ref={refIconNotifications}
                onClick={() => setShowNotifications((prev) => !prev)}
                className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors rounded-full text-text-stress ${showNotifications ? 'bg-background-light' : 'hover:bg-background-light'}`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <WrapperDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                triggerRef={refIconNotifications}
              >
                <AppNotifications />
              </WrapperDropdown>
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
                <WrapperDropdown
                  isOpen={showMenuAccount}
                  onClose={() => setShowMenuAccount(false)}
                  triggerRef={refIconMenuAccount}
                >
                  <ul className="min-w-[160px] py-1 text-sm text-text-base bg-background-base border border-border-base rounded-lg shadow-2xl overflow-hidden">
                    <li
                      className="px-4 py-2 hover:bg-background-light cursor-pointer transition-colors"
                      onClick={() => setShowMenuAccount(false)}
                    >
                      {t('COMMON.MY_ACTIVITY')}
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-background-light cursor-pointer transition-colors"
                      onClick={() => setShowMenuAccount(false)}
                    >
                      {t('COMMON.ACCOUNT_SETTINGS')}
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-background-light cursor-pointer transition-colors border-t border-border-base text-rose-500 font-medium"
                      onClick={handleLogout}
                    >
                      {t('COMMON.LOGOUT')}
                    </li>
                  </ul>
                </WrapperDropdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
