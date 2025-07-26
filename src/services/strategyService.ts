import api from './api';
import { Strategy, BacktestConfig, BacktestResult } from '../types';

class StrategyService {
  async getAllStrategies(): Promise<Strategy[]> {
    // Mock strategies
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        name: 'Momentum Strategy',
        status: 'active' as const,
        aum: 2500000,
        performance: 24.5,
        sharpe: 1.82,
        maxDrawdown: -12.8,
        risk: 'Moderate' as const,
        lastRebalance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        positions: 15,
        userId: '1'
      },
      {
        id: 2,
        name: 'Mean Reversion',
        status: 'active' as const,
        aum: 1800000,
        performance: 18.2,
        sharpe: 2.15,
        maxDrawdown: -8.5,
        risk: 'Conservative' as const,
        lastRebalance: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        positions: 8,
        userId: '1'
      },
      {
        id: 3,
        name: 'Arbitrage Bot',
        status: 'paused' as const,
        aum: 1200000,
        performance: 15.7,
        sharpe: 3.21,
        maxDrawdown: -4.2,
        risk: 'Aggressive' as const,
        lastRebalance: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        positions: 25,
        userId: '1'
      }
    ];
  }

  async getStrategy(id: number): Promise<Strategy> {
    return await api.get<Strategy>(`/strategies/${id}`);
  }

  async createStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy> {
    return await api.post<Strategy>('/strategies', strategy);
  }

  async updateStrategy(id: number, updates: Partial<Strategy>): Promise<Strategy> {
    return await api.patch<Strategy>(`/strategies/${id}`, updates);
  }

  async deleteStrategy(id: number): Promise<void> {
    await api.delete(`/strategies/${id}`);
  }

  async toggleStatus(id: number): Promise<Strategy> {
    return await api.post<Strategy>(`/strategies/${id}/toggle-status`);
  }

  async cloneStrategy(id: number, name: string): Promise<Strategy> {
    return await api.post<Strategy>(`/strategies/${id}/clone`, { name });
  }

  async getStrategyPerformance(id: number, period: string): Promise<any> {
    return await api.get(`/strategies/${id}/performance?period=${period}`);
  }

  async getStrategyPositions(id: number): Promise<any[]> {
    return await api.get(`/strategies/${id}/positions`);
  }

  async getStrategyTrades(id: number, limit = 50): Promise<any[]> {
    return await api.get(`/strategies/${id}/trades?limit=${limit}`);
  }

  async runBacktest(config: BacktestConfig): Promise<BacktestResult> {
    return await api.post<BacktestResult>('/strategies/backtest', config);
  }

  async getBacktestHistory(strategyId: number): Promise<BacktestResult[]> {
    return await api.get<BacktestResult[]>(`/strategies/${strategyId}/backtest-history`);
  }

  async optimizeStrategy(id: number, params: any): Promise<any> {
    return await api.post(`/strategies/${id}/optimize`, params);
  }

  async exportStrategy(id: number, format: 'json' | 'pdf' | 'csv'): Promise<Blob> {
    const response = await api.get(`/strategies/${id}/export?format=${format}`, {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  }
}

export default new StrategyService();