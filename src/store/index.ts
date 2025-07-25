import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import strategiesReducer from './strategiesSlice';
import portfolioReducer from './portfolioSlice';
import marketDataReducer from './marketDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    strategies: strategiesReducer,
    portfolio: portfolioReducer,
    marketData: marketDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;