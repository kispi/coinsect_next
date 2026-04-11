import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cryptoUtils } from '@/lib/crypto';
import type { UpbitNews, RealTimePosition, WhaleAlert } from '@/types';

type ResponseDashboard = {
  news: UpbitNews[];
  realTimePositions: {
    data: RealTimePosition[];
    lastUpdate: string;
  };
  whaleAlerts: {
    data: WhaleAlert[];
    total: number;
  };
};

export const useDashboards = () => {
  return useQuery({
    queryKey: ['dashboards', 'main'],
    queryFn: async () => {
      // The API returns an encrypted string or text, so we might need a custom api fetch here
      // if `api.get` auto-parses JSON. Let's make sure it can handle text.
      // Assuming api wrapper is typed, we might need a raw fetch or adjust api wrapper if it fails.
      // For now, let's assume the api layer can fetch raw if needed, or we fetch directly.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/dashboards/main`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dashboards main');
      }
      const rawText = await response.text();
      // Only decrypt if it's not starting with { (since sometimes APIs send unencrypted on dev)
      if (rawText.startsWith('{') || rawText.startsWith('[')) {
        return JSON.parse(rawText) as ResponseDashboard;
      }

      const decrypted = cryptoUtils.decryptAPIResponse(rawText);
      return decrypted as ResponseDashboard;
    },
    // Refetch every 5 minutes (300000 ms)
    refetchInterval: 300000,
  });
};
