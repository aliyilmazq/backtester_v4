import api from './api';
import { Strategy, BacktestConfig, BacktestResult } from '../types';

class StrategyService {
  async getAllStrategies(): Promise<Strategy[]> {
    return await api.get<Strategy[]>('/strategies');
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

  async getStrategyTrades(id: number, limit: number = 50): Promise<any[]> {
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