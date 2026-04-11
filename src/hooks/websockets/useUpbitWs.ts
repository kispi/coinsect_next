import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/useMarketStore';

export const useUpbitWs = (symbols: string[]) => {
  const setUpbitTicker = useMarketStore(state => state.setUpbitTicker);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_BASE?.replace('https', 'wss')}/upbit`);
    ws.onopen = () => {
      ws.send(JSON.stringify([{
        ticket: crypto.randomUUID(),
      }, {
        type: 'ticker',
        codes: symbols.map(s => `KRW-${s}`),
      }, {
        format: 'SIMPLE',
      }]));
    };

    ws.onmessage = async (event) => {
      try {
        let text = event.data;
        if (event.data instanceof Blob) {
          text = await event.data.text();
        } else if (event.data instanceof ArrayBuffer) {
          text = new TextDecoder().decode(event.data);
        }

        const jsonOrArray = JSON.parse(text);
        const items = Array.isArray(jsonOrArray) ? jsonOrArray : [jsonOrArray];

        items.forEach(json => {
          if (json && json.cd && json.tp) {
            setUpbitTicker(json.cd, parseFloat(json.tp));
          }
        });
      } catch (e) { }
    };

    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [symbols.join(',')]);
};
