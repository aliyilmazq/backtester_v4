import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketData } from '../types';

interface MarketDataState {
  data: { [symbol: string]: MarketData };
  subscribedSymbols: string[];
  connected: boolean;
}

const initialState: MarketDataState = {
  data: {},
  subscribedSymbols: [],
  connected: false,
};

const marketDataSlice = createSlice({
  name: 'marketData',
  initialState,
  reducers: {
    updateMarketData: (state, action: PayloadAction<MarketData>) => {
      state.data[action.payload.symbol] = action.payload;
    },
    updateMultipleMarketData: (state, action: PayloadAction<MarketData[]>) => {
      action.payload.forEach(data => {
        state.data[data.symbol] = data;
      });
    },
    subscribe: (state, action: PayloadAction<string[]>) => {
      state.subscribedSymbols = [...new Set([...state.subscribedSymbols, ...action.payload])];
    },
    unsubscribe: (state, action: PayloadAction<string[]>) => {
      state.subscribedSymbols = state.subscribedSymbols.filter(
        symbol => !action.payload.includes(symbol)
      );
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    clearMarketData: (state) => {
      state.data = {};
    },
  },
});

export const {
  updateMarketData,
  updateMultipleMarketData,
  subscribe,
  unsubscribe,
  setConnectionStatus,
  clearMarketData,
} = marketDataSlice.actions;

export default marketDataSlice.reducer;