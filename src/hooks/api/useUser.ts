'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { User } from '@/types'
import { useUserStore } from '@/store/useUserStore'
import { useEffect } from 'react'

export const useMeQuery = () => {
  const setMe = useUserStore((state) => state.setMe)
  const authToken = useUserStore((state) => state.authToken)

  const query = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<User>('users/me'),
    // Only fetch if a token exists in the store
    enabled: !!authToken,
    staleTime: 5 * 60 * 1000,
  })

  // Sync with store
  useEffect(() => {
    if (query.data) {
      setMe(query.data)
    } else if (query.isError) {
      setMe(null)
    }
  }, [query.data, query.isError, setMe])

  return query
}
