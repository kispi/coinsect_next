'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useKakaoSignInMutation } from '../api/useAuthMutation'
import { dom } from '@/lib/dom'
import { setCookie } from '@/lib/cookie'
import { useUserStore } from '@/store/StoreProvider'

declare global {
  interface Window {
    Kakao: any
  }
}

export const useKakao = () => {
  const setAuthToken = useUserStore((state) => state.setAuthToken)
  const { mutateAsync } = useKakaoSignInMutation()
  const queryClient = useQueryClient()
  const isInitialized = useRef<Promise<void> | null>(null)

  const init = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (isInitialized.current) return isInitialized.current

    isInitialized.current = (async () => {
      await dom.loadScript({ url: 'https://developers.kakao.com/sdk/js/kakao.js' })

      if (window.Kakao && !window.Kakao.isInitialized()) {
        const apiKey = process.env.NEXT_PUBLIC_OAUTH_KAKAO
        if (apiKey) {
          window.Kakao.init(apiKey)
        } else {
          console.warn('NEXT_PUBLIC_OAUTH_KAKAO is not defined')
        }
      }
    })()

    return isInitialized.current
  }, [])

  useEffect(() => {
    init()
  }, [init])

  const loadKakaoMe = () =>
    new Promise<any>((resolve, reject) => {
      if (!window.Kakao || !window.Kakao.API) {
        return reject(new Error('Kakao API module not ready'))
      }
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: resolve,
        fail: reject,
      })
    })

  const signIn = useCallback(async () => {
    // Ensure SDK is ready before trying to use it
    await init()

    return new Promise<void>((resolve, reject) => {
      if (!window.Kakao || !window.Kakao.Auth) {
        reject(new Error('Kakao Auth module not ready. Check if NEXT_PUBLIC_OAUTH_KAKAO is valid.'))
        return
      }

      window.Kakao.Auth.login({
        success: async () => {
          try {
            const user = await loadKakaoMe()
            const { token } = await mutateAsync({
              kakaoId: String(user.id),
              email: user.kakao_account.email,
            })
            if (token) {
              setCookie('token', token)
              setAuthToken(token)
              await queryClient.invalidateQueries({ queryKey: ['me'] })
            }
            resolve()
          } catch (e) {
            reject(e)
          }
        },
        fail: reject,
      })
    })
  }, [init, mutateAsync, queryClient, setAuthToken])

  return { signIn }
}
