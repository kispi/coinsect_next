import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface KakaoSignInPayload {
  email: string
  kakaoId: string
}

interface SignInResponse {
  token: string
}

export const useKakaoSignInMutation = () => {
  return useMutation({
    mutationFn: (payload: KakaoSignInPayload) =>
      api.post<SignInResponse>('users/sign_in_kakao', payload),
  })
}
