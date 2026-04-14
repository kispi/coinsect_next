'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useChatStore, useUserStore, useT } from '@/store/StoreProvider'
import ModalHeader from '@/components/common/modal/ModalHeader'
import AppToggler from '@/components/common/AppToggler'
import { Profile } from '@/types'
import { X, Edit2, ShieldCheck, Save, Image as ImageIcon } from 'lucide-react'
import { ui } from '@/lib/ui'

interface ModalChatSettingsProps {
  onClose: () => void
}

export default function ModalChatSettings({ onClose }: ModalChatSettingsProps) {
  const { t } = useT()
  const settings = useChatStore((s) => s.settings)
  const setSettings = useChatStore((s) => s.setSettings)
  const chatUser = useChatStore((s) => s.chatUser)
  const updateProfile = useChatStore((s) => s.updateProfile)
  const me = useUserStore((s) => s.me)

  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    nickname: chatUser?.profile?.nickname || '',
    image: chatUser?.profile?.image || '',
  })

  const inputNicknameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputNicknameRef.current) {
      inputNicknameRef.current.focus()
      inputNicknameRef.current.select()
    }
  }, [editing])

  const handleUpdate = async () => {
    if (!profile.nickname.trim()) {
      ui.toast.error('닉네임을 입력해주세요.')
      return
    }

    try {
      await updateProfile(profile)
      setEditing(false)
      ui.toast.success('프로필이 업데이트되었습니다.')
    } catch (e: any) {
      const error = e as any
      ui.toast.error(error?.data?.message || '업데이트에 실패했습니다.')
    }
  }

  const toggleEditProfile = () => {
    if (editing) {
      handleUpdate()
    } else {
      setEditing(true)
    }
  }

  const handleImageUpload = () => {
    // legacy used ModalUploadImage, for now we will stub it or use a simple prompt if needed
    // In a real scenario, this would trigger a file picker or another modal
    const url = window.prompt('이미지 URL을 입력해주세요 (임시)')
    if (url) {
      const newProfile = { ...profile, image: url }
      setProfile(newProfile)
      updateProfile(newProfile)
    }
  }

  const handleImageDelete = async () => {
    const result = await ui.modal.confirm({
      body: t('APP_CHAT.MODAL_CONFIRM_DELETE_IMAGE'),
    })

    if (result) {
      const newProfile = { ...profile, image: '' }
      setProfile(newProfile)
      updateProfile(newProfile)
    }
  }

  return (
    <div className="modal-chat-settings bg-background-base rounded-lg shadow-2xl w-[360px] overflow-hidden border border-border-base animate-in zoom-in-95 duration-200">
      <ModalHeader title={t('APP_CHAT.MODAL_CHAT_SETTINGS')} onClose={onClose} />

      <div className="p-5 max-h-[80vh] overflow-y-auto">
        {/* Profile Section */}
        <section className="pb-6 border-b border-border-base">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative group cursor-pointer w-24 h-24 mb-4">
              {profile.image ? (
                <>
                  <img
                    src={profile.image}
                    className="w-full h-full rounded-full object-cover border-2 border-border-base group-hover:border-primary transition-colors"
                    onClick={handleImageUpload}
                    alt={profile.nickname}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleImageDelete()
                    }}
                    className="absolute -top-1 -right-1 bg-zinc-800 text-white rounded-full p-1 border border-white/20 hover:text-rose-500 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div
                  onClick={handleImageUpload}
                  className="w-full h-full rounded-full bg-zinc-800 border-2 border-dashed border-border-base flex items-center justify-center group-hover:border-primary transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-text-muted" />
                </div>
              )}
            </div>

            {/* Nickname Input */}
            <div
              className={`relative flex items-center border-b transition-colors w-44 ${editing ? 'border-primary' : 'border-transparent'}`}
            >
              <input
                ref={inputNicknameRef}
                value={profile.nickname}
                onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                readOnly={!editing}
                placeholder="닉네임"
                className="bg-transparent text-center w-full py-1 text-sm font-bold focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && toggleEditProfile()}
              />

              {me && <ShieldCheck className="absolute left-0 w-4 h-4 text-primary-light" />}

              <button
                onClick={toggleEditProfile}
                className="absolute right-0 p-1 hover:text-primary transition-colors cursor-pointer"
              >
                {editing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </section>

        {/* Chat Settings Section */}
        <section className="py-6 border-b border-border-base space-y-4">
          <h3 className="text-xs font-black text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            * {t('COMMON.ACCOUNT_SETTINGS')}
          </h3>

          <SettingItem
            label={t('APP_CHAT.CHAT_TRANSPARENT')}
            value={settings.chatTransparent}
            onChange={(v) => setSettings({ chatTransparent: v })}
          />

          <SettingItem
            label={t('APP_CHAT.CHAT_DING')}
            value={settings.chatDing}
            onChange={(v) => setSettings({ chatDing: v })}
          />

          <SettingItem
            label={t('APP_CHAT.CHAT_OVERLAY_NEW_MESSAGE')}
            value={settings.chatOverlayNewMessage}
            onChange={(v) => setSettings({ chatOverlayNewMessage: v })}
          />

          <SettingItem
            label={t('APP_CHAT.CHAT_SIZE_MAX')}
            value={settings.chatSizeMax}
            onChange={(v) => setSettings({ chatSizeMax: v })}
          />

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-text-stress">{t('APP_CHAT.CHAT_SKIN')}</span>
            <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5">
              {['basic', 'kakao'].map((skin) => (
                <button
                  key={skin}
                  onClick={() => setSettings({ chatSkin: skin as any })}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                    settings.chatSkin === skin
                      ? 'bg-brand-primary text-white shadow-lg'
                      : 'text-text-muted hover:text-text-base'
                  }`}
                >
                  {t(`APP_CHAT.SKIN_${skin}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Push Notification Section (Stub) */}
        <section className="pt-6">
          <h3 className="text-xs font-black text-text-muted uppercase tracking-wider mb-4">
            * {t('APP_CHAT.PUSH_POSITION_CHANGE').split(' ')[0]}
          </h3>
          <SettingItem
            label={t('APP_CHAT.PUSH_POSITION_CHANGE')}
            value={false} // Stub for now
            onChange={() => ui.toast.info('준비 중인 기능입니다.')}
          />
        </section>
      </div>
    </div>
  )
}

function SettingItem({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-text-stress leading-tight">{label}</span>
      <AppToggler value={value} onChange={onChange} />
    </div>
  )
}
