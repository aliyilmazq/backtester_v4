import api from './api';
import { PortfolioStats, Trade } from '../types';

class PortfolioService {
  async getPortfolioStats(): Promise<PortfolioStats> {
    // Mock portfolio stats
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalAUM: 7470000,
      dayChange: 42350,
      dayChangePercent: 0.57,
      activeStrategies: 3,
      ytdReturn: 12.8,
      sharpeRatio: 1.87,
      winRate: 68.4,
      monthlyReturn: 4.2
    };
  }

  async getRecentTrades(limit = 10): Promise<Trade[]> {
    // Mock recent trades
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        strategyId: 1,
        strategy: 'Momentum',
        action: 'BUY' as const,
        asset: 'AAPL',
        quantity: 100,
        price: 178.50,
        total: 17850,
        time: new Date().toISOString(),
        status: 'executed' as const
      },
      {
        id: '2',
        strategyId: 2,
        strategy: 'Mean Reversion',
        action: 'SELL' as const,
        asset: 'MSFT',
        quantity: 50,
        price: 415.20,
        total: 20760,
        time: new Date(Date.now() - 3600000).toISOString(),
        status: 'executed' as const
      }
    ].slice(0, limit);
  }

  async getPerformanceData(period: '1D' | '1W' | '1M' | 'YTD'): Promise<any[]> {
    // Mock performance data
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = {
      '1D': [
        { date: '2025-01-25 09:00', value: 0, benchmark: 0 },
        { date: '2025-01-25 10:00', value: 0.2, benchmark: 0.1 },
        { date: '2025-01-25 11:00', value: 0.5, benchmark: 0.3 },
        { date: '2025-01-25 12:00', value: 0.8, benchmark: 0.5 },
        { date: '2025-01-25 13:00', value: 0.7, benchmark: 0.4 },
        { date: '2025-01-25 14:00', value: 1.2, benchmark: 0.7 },
        { date: '2025-01-25 15:00', value: 1.5, benchmark: 0.9 },
      ],
      '1W': [
        { date: '2025-01-19', value: 0, benchmark: 0 },
        { date: '2025-01-20', value: 0.8, benchmark: 0.5 },
        { date: '2025-01-21', value: 1.2, benchmark: 0.8 },
        { date: '2025-01-22', value: 2.1, benchmark: 1.2 },
        { date: '2025-01-23', value: 1.8, benchmark: 1.0 },
        { date: '2025-01-24', value: 2.5, benchmark: 1.5 },
        { date: '2025-01-25', value: 3.2, benchmark: 1.8 },
      ],
      '1M': [
        { date: '2024-12-25', value: 0, benchmark: 0 },
        { date: '2025-01-01', value: 2.1, benchmark: 1.5 },
        { date: '2025-01-08', value: 3.5, benchmark: 2.2 },
        { date: '2025-01-15', value: 5.2, benchmark: 3.1 },
        { date: '2025-01-22', value: 6.8, benchmark: 4.2 },
        { date: '2025-01-25', value: 7.5, benchmark: 4.8 },
      ],
      'YTD': [
        { date: '2025-01-01', value: 0, benchmark: 0 },
        { date: '2025-01-05', value: 1.5, benchmark: 0.8 },
        { date: '2025-01-10', value: 3.2, benchmark: 2.1 },
        { date: '2025-01-15', value: 5.8, benchmark: 3.5 },
        { date: '2025-01-20', value: 8.2, benchmark: 5.2 },
        { date: '2025-01-25', value: 12.8, benchmark: 7.5 },
      ]
    };
    return data[period] || data['1W'];
  }

  async getPortfolioAllocation(): Promise<any> {
    // Mock allocation data
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      allocations: [
        { name: 'US Equities', value: 35, color: '#0066ff' },
        { name: 'International Equities', value: 20, color: '#00c853' },
        { name: 'Fixed Income', value: 25, color: '#ffd700' },
        { name: 'Commodities', value: 10, color: '#ff3b30' },
        { name: 'Cash & Equivalents', value: 10, color: '#718096' },
      ]
    };
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