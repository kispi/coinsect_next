import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface PositionRequestPayload {
  id: number
  name: string
  entryPrice: number
  liqPrice: number
  size: number
  contract: string
  onAir: boolean
  token: string | null
}

export const usePositionChangeMutation = () => {
  return useMutation({
    mutationFn: (payload: PositionRequestPayload) =>
      api.post('contents/real_time_positions/change_notifications', payload),
  })
}
