'use client'

import React from 'react'
import { X } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { useKakao } from '@/hooks/oauth/useKakao'
import { ui } from '@/lib/ui'

interface Props {
  onClose: () => void
}

/**
 * ModalSignIn: Migrated from ModalSignIn.vue
 * Handles social login (Kakao) with premium UI and i18n support.
 */
export default function ModalSignIn({ onClose }: Props) {
  const { i18n } = useI18n()
  const { signIn: kakaoSignIn } = useKakao()

  const handleSignIn = async (signInFn: () => Promise<void>) => {
    try {
      await signInFn()
      onClose()
    } catch (e: any) {
      console.error('Sign in error:', e)
      ui.toast.error(
        '소셜 로그인 과정에서 문제가 발생했습니다. 아마도 연동 계정에서 이메일 정보를 가져올 수 없는 것 같습니다 😢'
      )
    }
  }

  const waysToLogin = [
    {
      id: 'kakao',
      title: i18n('MODAL.LOG_IN_WITH').replace('{provider}', '카카오'),
      handler: () => handleSignIn(kakaoSignIn),
      img: 'https://play-lh.googleusercontent.com/Ob9Ys8yKMeyKzZvl3cB9JNSTui1lJwjSKD60IVYnlvU2DsahysGENJE-txiRIW9_72Vd=w240-h480-rw',
      bgColor: 'bg-[#FEE500]',
      textColor: 'text-zinc-900',
    },
  ]

  return (
    <div className="modal-sign-in w-full max-w-[400px] bg-background-base border border-border-base rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-border-base bg-background-light/20 backdrop-blur-sm">
        <h3 className="font-bold text-text-stress text-lg tracking-tight">
          {i18n('MODAL.SIGN_IN')}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-background-light rounded-full transition-all text-text-muted hover:text-text-stress"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-8 flex flex-col gap-8">
        <div className="ways-to-login flex flex-col gap-4">
          {waysToLogin.map((way) => (
            <button
              key={way.id}
              onClick={way.handler}
              className={`
                flex items-center justify-center gap-3 w-full py-3.5 px-6
                ${way.bgColor} ${way.textColor}
                font-bold rounded-xl shadow-sm
                transition-all duration-200
                hover:shadow-md hover:brightness-95
                active:scale-[0.97]
              `}
            >
              <img src={way.img} alt="" className="w-6 h-6 object-contain rounded-md" />
              <span className="text-base">{way.title}</span>
            </button>
          ))}
        </div>

        <div className="description">
          <p className="text-xs text-text-muted leading-relaxed text-center whitespace-pre-line opacity-80">
            {i18n('MODAL.SIGN_IN_DESC')}
          </p>
        </div>
      </div>
    </div>
  )
}
