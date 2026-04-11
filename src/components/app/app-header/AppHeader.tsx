'use client';

import React, { useRef, useState } from 'react';
import { Share2, Settings, Bell, User, Menu, X } from 'lucide-react';
import Dropdown from '@/components/common/Dropdown';
import SettingsPanel from './SettingsPanel';

// Placeholder components if they don't exist yet
const AppLogo = () => <div className="font-bold text-xl ml-2">COINSECT</div>;
const BannerMarketIndices = () => <div className="h-4"></div>;
const AppNotifications = () => <div className="p-4 w-60 text-sm">No new notifications</div>;

export default function AppHeader() {
  const [showNavigation, setShowNavigation] = useState(false);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenuAccount, setShowMenuAccount] = useState(false);

  const refIconSettings = useRef<HTMLDivElement>(null);
  const refIconNotifications = useRef<HTMLDivElement>(null);
  const refIconMenuAccount = useRef<HTMLDivElement>(null);

  // Example placeholder for user
  const me = null;

  const onClickShare = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url).then(() => {
      alert('현재 페이지 주소가 복사되었습니다.');
    });
  };

  const onClickMenuAccount = () => {
    if (me) {
      setShowMenuAccount((prev) => !prev);
    } else {
      // Show login modal logic
      alert('MODAL_SIGN_IN');
    }
  };

  return (
    <header className="w-full px-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between py-2">
        <BannerMarketIndices />
        {/* Chat users logic (stub) */}
        <div className="flex items-center text-xs font-mono cursor-pointer text-zinc-500">
          <User className="w-3 h-3 mr-1" />
          <span>---</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between py-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center select-none">
          {/* Mobile Menu Icon */}
          <div 
            className="w-8 h-8 flex items-center justify-center cursor-pointer mr-2 lg:hidden text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            onClick={() => setShowNavigation(!showNavigation)}
          >
            {showNavigation ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </div>
          <AppLogo />
        </div>

        <div className="flex items-center gap-2 relative">
          <div 
            onClick={onClickShare}
            className="w-8 h-8 flex items-center justify-center cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </div>

          <div className="relative">
            <div 
              ref={refIconSettings}
              onClick={() => setShowSettings((prev) => !prev)}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors ${showSettings ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'}`}
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
              className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors ${showNotifications ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'}`}
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
              className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors ${showMenuAccount ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'}`}
            >
              {me ? <User className="w-5 h-5" /> : <div className="text-[10px] font-medium leading-tight text-center">SIGN IN</div>}
            </div>
            {me && (
              <Dropdown 
                isOpen={showMenuAccount} 
                onClose={() => setShowMenuAccount(false)} 
                triggerRef={refIconMenuAccount}
              >
                <ul className="min-w-[150px] py-1 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" onClick={() => setShowMenuAccount(false)}>내 활동</li>
                  <li className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" onClick={() => setShowMenuAccount(false)}>계정 설정</li>
                  <li className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer border-t border-zinc-200 dark:border-zinc-800" onClick={() => setShowMenuAccount(false)}>로그아웃</li>
                </ul>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
