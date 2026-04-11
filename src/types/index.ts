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
  hash: string;
  // add more properties based on actual API response
  [key: string]: any;
}
