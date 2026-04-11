import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/useMarketStore';

export const useBinanceWs = (symbols: string[]) => {
  const setBinanceTicker = useMarketStore(state => state.setBinanceTicker);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    const ws = new WebSocket('wss://stream.binance.com:9443/ws');
    ws.onopen = () => {
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: symbols.map(s => `${s.toLowerCase()}usdt@miniTicker`),
        id: 1,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        if (json.s && json.c) {
          // json.s e.g. BTCUSDT, json.c e.g. "60000.5"
          setBinanceTicker(json.s, parseFloat(json.c));
        }
      } catch (e) {}
    };

    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [symbols.join(',')]);
};
