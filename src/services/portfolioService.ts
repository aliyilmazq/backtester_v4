import api from './api';
import { PortfolioStats, Trade } from '../types';

class PortfolioService {
  async getPortfolioStats(): Promise<PortfolioStats> {
    return await api.get<PortfolioStats>('/portfolio/stats');
  }

  async getRecentTrades(limit = 10): Promise<Trade[]> {
    return await api.get<Trade[]>(`/portfolio/trades?limit=${limit}`);
  }

  async getPerformanceData(period: '1D' | '1W' | '1M' | 'YTD'): Promise<any[]> {
    return await api.get(`/portfolio/performance?period=${period}`);
  }

  async getPortfolioAllocation(): Promise<any> {
    return await api.get('/portfolio/allocation');
  }

  async getPositions(): Promise<any[]> {
    return await api.get('/portfolio/positions');
  }

  async getRiskMetrics(): Promise<any> {
    return await api.get('/portfolio/risk-metrics');
  }

  async executeTrade(trade: Omit<Trade, 'id' | 'time' | 'status'>): Promise<Trade> {
    return await api.post<Trade>('/portfolio/execute-trade', trade);
  }

  async cancelTrade(tradeId: string): Promise<void> {
    await api.post(`/portfolio/trades/${tradeId}/cancel`);
  }

  async getTradeHistory(filters?: {
    startDate?: string;
    endDate?: string;
    strategyId?: number;
    asset?: string;
    action?: 'BUY' | 'SELL';
  }): Promise<Trade[]> {
    const params = new URLSearchParams(filters as any).toString();
    return await api.get<Trade[]>(`/portfolio/trade-history?${params}`);
  }

  async generateReport(type: 'performance' | 'risk' | 'compliance' | 'tax', period: string): Promise<any> {
    return await api.post('/portfolio/generate-report', { type, period });
  }

  async getReports(): Promise<any[]> {
    return await api.get('/portfolio/reports');
  }

  async downloadReport(reportId: string): Promise<Blob> {
    const response = await api.get(`/portfolio/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  }
}

export default new PortfolioService();