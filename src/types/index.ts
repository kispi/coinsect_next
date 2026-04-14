export interface UpbitNews {
  id: number
  title: string
  url: string
  created_at: string
  is_best?: boolean
}

export type RealTimePosition = {
  $$unrealized: number
  $$value: number
  contract: string
  editable: boolean
  entryPrice: number
  id: string
  image: string
  lastUpdate: string
  link: string
  markPrice: number
  liqPrice?: number
  name: string
  onAir: boolean
  size: number
  tracking: boolean
  [key: string]: any
}

export interface WhaleAlert {
  amount: string
  amountUsd: string
  blockchain: string
  fromAddress: string
  fromOwner: string
  fromOwnerType: string
  hash: string
  symbol: string
  timestamp: number
  toAddress: string
  toOwner: string
  toOwnerType: string
  transactionCount: number
  transactionType: string
}
export interface Profile {
  image: string
  nickname: string
  sentiment?: {
    expireAt?: string
    type?: string
  }
}

export interface User {
  id?: number
  profile: Profile
  token: string
}

export interface Reaction {
  id?: string | number
  type: string
  userId?: number
  ip?: string
  nickname?: string
  isActive?: boolean
  count?: number
}

export interface Message {
  id: number
  user: User
  text: string
  type: 'text' | 'image' | 'alert' | 'auth' | string
  ts: number
  isMine?: boolean
  meta?: any
  reactions?: Reaction[]
  $$hide?: boolean
}

export interface ChatStats {
  onlineUsers: number
  [key: string]: any
}
