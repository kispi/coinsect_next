export interface UpbitNews {
  id: number;
  title: string;
  url: string;
  created_at: string;
  is_best?: boolean;
}

export interface RealTimePosition {
  name: string;
  // add more properties based on actual API response
  [key: string]: any;
}

export interface WhaleAlert {
  amount: string;
  amountUsd: string;
  blockchain: string;
  fromAddress: string;
  fromOwner: string;
  fromOwnerType: string;
  hash: string;
  symbol: string;
  timestamp: number;
  toAddress: string;
  toOwner: string;
  toOwnerType: string;
  transactionCount: number;
  transactionType: string;
}

