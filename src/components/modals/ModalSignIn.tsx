import ModalHeader from '@/components/common/modal/ModalHeader'
import { useT } from '@/store/StoreProvider'
import { useKakao } from '@/hooks/oauth/useKakao'
import { ui } from '@/lib/ui'

interface Props {
  onClose: () => void
}

export default function ModalSignIn({ onClose }: Props) {
  const { t } = useT()
  const { signIn: kakaoSignIn } = useKakao()

  const handleSignIn = async (signInFn: () => Promise<void>) => {
    try {
      await signInFn()
      onClose()
    } catch (e: any) {
      ui.toast.error(e.data?.message || e.message)
    }
  }

  const waysToLogin = [
    {
      id: 'kakao',
      title: t('MODAL.LOG_IN_WITH').replace('{provider}', '카카오'),
      handler: () => handleSignIn(kakaoSignIn),
      img: 'https://play-lh.googleusercontent.com/Ob9Ys8yKMeyKzZvl3cB9JNSTui1lJwjSKD60IVYnlvU2DsahysGENJE-txiRIW9_72Vd=w240-h480-rw',
      bgColor: 'bg-[#FEE500]',
      textColor: 'text-zinc-900',
    },
  ]

  return (
    <div className="modal-sign-in w-[420px] max-w-[calc(100vw-32px)] bg-background-base border border-border-base rounded-2xl shadow-2xl overflow-hidden">
      <ModalHeader title={t('MODAL.SIGN_IN')} onClose={onClose} />

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
            {t('MODAL.SIGN_IN_DESC')}
          </p>
        </div>
      </div>
    </div>
  )
}
