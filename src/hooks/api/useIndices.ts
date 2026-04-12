import { useQuery } from '@tanstack/react-query'

export type MarketIndices = {
  basePrice: number // USD/KRW
  btcDominance: number
  totalMarketCap: number
}

export const useIndices = () => {
  return useQuery({
    queryKey: ['market-info', 'indices'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/market_info/indices`)
      if (!response.ok) {
        throw new Error('Failed to fetch indices')
      }
      return response.json() as Promise<MarketIndices>
    },
    refetchInterval: 300000, // 5 minutes
  })
}
