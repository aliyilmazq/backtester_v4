import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PortfolioStats, Trade } from '../types';
import portfolioService from '../services/portfolioService';

interface PortfolioState {
  stats: PortfolioStats | null;
  recentTrades: Trade[];
  performanceData: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  stats: null,
  recentTrades: [],
  performanceData: [],
  loading: false,
  error: null,
};

export const fetchPortfolioStats = createAsyncThunk(
  'portfolio/fetchStats',
  async () => {
    const response = await portfolioService.getPortfolioStats();
    return response;
  }
);

export const fetchRecentTrades = createAsyncThunk(
  'portfolio/fetchTrades',
  async (limit: number = 10) => {
    const response = await portfolioService.getRecentTrades(limit);
    return response;
  }
);

export const fetchPerformanceData = createAsyncThunk(
  'portfolio/fetchPerformance',
  async (period: '1D' | '1W' | '1M' | 'YTD') => {
    const response = await portfolioService.getPerformanceData(period);
    return response;
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<Partial<PortfolioStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
    addTrade: (state, action: PayloadAction<Trade>) => {
      state.recentTrades.unshift(action.payload);
      if (state.recentTrades.length > 50) {
        state.recentTrades.pop();
      }
    },
    updateTradeStatus: (state, action: PayloadAction<{ id: string; status: Trade['status'] }>) => {
      const trade = state.recentTrades.find(t => t.id === action.payload.id);
      if (trade) {
        trade.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch portfolio stats
      .addCase(fetchPortfolioStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPortfolioStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch portfolio stats';
      })
      // Fetch recent trades
      .addCase(fetchRecentTrades.fulfilled, (state, action) => {
        state.recentTrades = action.payload;
      })
      // Fetch performance data
      .addCase(fetchPerformanceData.fulfilled, (state, action) => {
        state.performanceData = action.payload;
      });
  },
});

export const { updateStats, addTrade, updateTradeStatus } = portfolioSlice.actions;
export default portfolioSlice.reducer;