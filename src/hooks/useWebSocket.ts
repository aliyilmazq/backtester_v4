import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import websocketService from '../services/websocketService';

export const useWebSocket = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const connected = useSelector((state: RootState) => state.marketData.connected);

  useEffect(() => {
    if (isAuthenticated && !connected) {
      websocketService.connect();
    }

    return () => {
      if (connected) {
        websocketService.disconnect();
      }
    };
  }, [isAuthenticated, connected]);

  return {
    connected,
    subscribe: websocketService.subscribeToSymbols.bind(websocketService),
    unsubscribe: websocketService.unsubscribeFromSymbols.bind(websocketService),
    executeTrade: websocketService.executeTrade.bind(websocketService),
  };
};