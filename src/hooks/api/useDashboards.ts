import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { cryptoUtils } from '@/lib/crypto'
import type { UpbitNews, RealTimePosition, WhaleAlert } from '@/types'

export type ResponseDashboard = {
  news: UpbitNews[]
  realTimePositions: {
    data: RealTimePosition[]
    lastUpdate: string
  }
  whaleAlerts: {
    data: WhaleAlert[]
    total: number
  }
}

export const getDashboards = async (): Promise<ResponseDashboard> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/dashboards/main`

  const response = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch dashboards main')
  }

  const rawText = await response.text()

  if (rawText.startsWith('{') || rawText.startsWith('[')) {
    return JSON.parse(rawText) as ResponseDashboard
  }

  return cryptoUtils.decryptAPIResponse(rawText) as ResponseDashboard
}

export const useDashboards = () => {
  return useQuery({
    queryKey: ['dashboards', 'main'],
    queryFn: getDashboards,
  })
}

export const useSuspenseDashboards = () => {
  return useSuspenseQuery({
    queryKey: ['dashboards', 'main'],
    queryFn: getDashboards,
  })
}
