import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useBoardPosts = (boardId: number, limit: number = 10) => {
  return useQuery({
    queryKey: ['posts', { boardId, limit }],
    queryFn: async () => {
      return api.get<any>('posts', {
        params: {
          where: `board_id=${boardId}`,
          limit,
          sort: 'id',
          order: 'desc',
        },
      })
    },
    // Refetch every 5 minutes (300000 ms) matching the main dashboard's behavior
    refetchInterval: 300000,
  })
}
