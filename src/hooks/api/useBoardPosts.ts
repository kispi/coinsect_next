import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const getBoardPosts = async (boardId: number, limit: number = 10) => {
  return api.get<any>('posts', {
    params: {
      where: `board_id=${boardId}`,
      limit,
      sort: 'id',
      order: 'desc',
    },
  })
}

export const useBoardPosts = (boardId: number, limit: number = 10) => {
  return useQuery({
    queryKey: ['posts', { boardId, limit }],
    queryFn: () => getBoardPosts(boardId, limit),
    // Refetch every 5 minutes (300000 ms) matching the main dashboard's behavior
    refetchInterval: 300000,
  })
}

export const useSuspenseBoardPosts = (boardId: number, limit: number = 10) => {
  return useSuspenseQuery({
    queryKey: ['posts', { boardId, limit }],
    queryFn: () => getBoardPosts(boardId, limit),
    // Refetch every 5 minutes (300000 ms) matching the main dashboard's behavior
    refetchInterval: 300000,
  })
}
