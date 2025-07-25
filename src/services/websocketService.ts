import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { 
  updateMarketData, 
  setConnectionStatus,
  updateMultipleMarketData 
} from '../store/marketDataSlice';
import { addTrade, updateTradeStatus } from '../store/portfolioSlice';
import { updateStrategyLocally } from '../store/strategiesSlice';
import { WebSocketMessage, MarketData, Trade } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect() {
    const token = store.getState().auth.token;
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    const wsUrl = process.env['REACT_APP_WS_URL'] || 'http://localhost:3001';

    this.socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      store.dispatch(setConnectionStatus(true));
      this.reconnectAttempts = 0;
      
      // Subscribe to previously subscribed symbols
      const subscribedSymbols = store.getState().marketData.subscribedSymbols;
      if (subscribedSymbols.length > 0) {
        this.subscribeToSymbols(subscribedSymbols);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      store.dispatch(setConnectionStatus(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    // Market data updates
    this.socket.on('market_data', (data: MarketData) => {
      store.dispatch(updateMarketData(data));
    });

    this.socket.on('market_data_batch', (data: MarketData[]) => {
      store.dispatch(updateMultipleMarketData(data));
    });

    // Trade updates
    this.socket.on('trade_executed', (trade: Trade) => {
      store.dispatch(addTrade(trade));
      store.dispatch(updateTradeStatus({ id: trade.id, status: 'executed' }));
    });

    this.socket.on('trade_failed', (data: { tradeId: string; reason: string }) => {
      store.dispatch(updateTradeStatus({ id: data.tradeId, status: 'failed' }));
    });

    // Strategy updates
    this.socket.on('strategy_update', (data: { id: number; updates: any }) => {
      store.dispatch(updateStrategyLocally(data));
    });

    // General messages
    this.socket.on('message', (message: WebSocketMessage) => {
      this.handleMessage(message);
    });

    // Error handling
    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'price_update':
        store.dispatch(updateMarketData(message.data));
        break;
      case 'trade_execution':
        store.dispatch(addTrade(message.data));
        break;
      case 'strategy_update':
        store.dispatch(updateStrategyLocally(message.data));
        break;
      case 'alert':
        // Handle alerts (could dispatch to a notifications slice)
        console.log('Alert received:', message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  subscribeToSymbols(symbols: string[]) {
    if (!this.socket || !this.socket.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe', { symbols });
  }

  unsubscribeFromSymbols(symbols: string[]) {
    if (!this.socket || !this.socket.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('unsubscribe', { symbols });
  }

  executeTrade(trade: Omit<Trade, 'id' | 'time' | 'status'>) {
    if (!this.socket || !this.socket.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('execute_trade', trade);
  }

  requestStrategyUpdate(strategyId: number) {
    if (!this.socket || !this.socket.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('request_strategy_update', { strategyId });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();