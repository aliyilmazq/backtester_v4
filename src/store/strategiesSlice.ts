import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Strategy } from '../types';
import strategyService from '../services/strategyService';

interface StrategiesState {
  strategies: Strategy[];
  selectedStrategy: Strategy | null;
  loading: boolean;
  error: string | null;
}

const initialState: StrategiesState = {
  strategies: [],
  selectedStrategy: null,
  loading: false,
  error: null,
};

export const fetchStrategies = createAsyncThunk(
  'strategies/fetchAll',
  async () => {
    const response = await strategyService.getAllStrategies();
    return response;
  }
);

export const createStrategy = createAsyncThunk(
  'strategies/create',
  async (strategy: Omit<Strategy, 'id'>) => {
    const response = await strategyService.createStrategy(strategy);
    return response;
  }
);

export const updateStrategy = createAsyncThunk(
  'strategies/update',
  async ({ id, updates }: { id: number; updates: Partial<Strategy> }) => {
    const response = await strategyService.updateStrategy(id, updates);
    return response;
  }
);

export const deleteStrategy = createAsyncThunk(
  'strategies/delete',
  async (id: number) => {
    await strategyService.deleteStrategy(id);
    return id;
  }
);

export const toggleStrategyStatus = createAsyncThunk(
  'strategies/toggleStatus',
  async (id: number) => {
    const response = await strategyService.toggleStatus(id);
    return response;
  }
);

const strategiesSlice = createSlice({
  name: 'strategies',
  initialState,
  reducers: {
    selectStrategy: (state, action: PayloadAction<Strategy | null>) => {
      state.selectedStrategy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStrategyLocally: (state, action: PayloadAction<{ id: number; updates: Partial<Strategy> }>) => {
      const strategy = state.strategies.find(s => s.id === action.payload.id);
      if (strategy) {
        Object.assign(strategy, action.payload.updates);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch strategies
      .addCase(fetchStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStrategies.fulfilled, (state, action) => {
        state.loading = false;
        state.strategies = action.payload;
      })
      .addCase(fetchStrategies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch strategies';
      })
      // Create strategy
      .addCase(createStrategy.fulfilled, (state, action) => {
        state.strategies.push(action.payload);
      })
      // Update strategy
      .addCase(updateStrategy.fulfilled, (state, action) => {
        const index = state.strategies.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.strategies[index] = action.payload;
        }
      })
      // Delete strategy
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.strategies = state.strategies.filter(s => s.id !== action.payload);
      })
      // Toggle status
      .addCase(toggleStrategyStatus.fulfilled, (state, action) => {
        const index = state.strategies.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.strategies[index] = action.payload;
        }
      });
  },
});

export const { selectStrategy, clearError, updateStrategyLocally } = strategiesSlice.actions;
export default strategiesSlice.reducer;