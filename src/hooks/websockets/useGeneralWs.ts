'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useGeneralWs() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_API_BASE?.replace('https', 'wss') || 'wss://api.coinsect.io';
    const socket = new WebSocket(`${endpoint}/webchat`);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle real-time position updates
        if (message.type === 'alert' && message.meta?.$$alertType === 'realTimePosition') {
          const newPos = message.meta;
          
          queryClient.setQueryData(['dashboards', 'main'], (old: any) => {
            if (!old) return old;
            
            const positionData = old.realTimePositions?.data || [];
            let newData = [...positionData];
            
            if (newPos.$$deleted) {
              newData = newData.filter(p => p.name !== newPos.name);
            } else {
              const idx = newData.findIndex(p => p.name === newPos.name);
              if (idx > -1) {
                newData[idx] = { ...newData[idx], ...newPos };
              } else {
                newData.push(newPos);
              }
            }
            
            return {
              ...old,
              realTimePositions: {
                ...old.realTimePositions,
                data: newData,
                lastUpdate: new Date().toISOString()
              }
            };
          });
        }
      } catch (e) {
        console.error('Error parsing general ws message', e);
      }
    };

    socket.onopen = () => {
      // Vue code pings every 30s
      const pingId = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping', user: { path: window.location.pathname } }));
        }
      }, 30000);
      
      socket.onclose = () => clearInterval(pingId);
    };

    return () => {
      socket.close();
    };
  }, [queryClient]);
}
