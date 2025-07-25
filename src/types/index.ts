export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'portfolio_manager' | 'trader' | 'viewer';
  permissions: string[];
}

export interface Strategy {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'stopped';
  aum: number;
  performance: number;
  sharpe: number;
  maxDrawdown: number;
  risk: 'Conservative' | 'Moderate' | 'Aggressive';
  lastRebalance: string;
  positions: number;
  userId: string;
}

export interface Trade {
  id: string;
  strategyId: number;
  strategy: string;
  action: 'BUY' | 'SELL';
  asset: string;
  quantity: number;
  price: number;
  total: number;
  time: string;
  status: 'pending' | 'executed' | 'failed';
}

export interface PortfolioStats {
  totalAUM: number;
  dayChange: number;
  dayChangePercent: number;
  activeStrategies: number;
  ytdReturn: number;
  monthlyReturn: number;
  winRate: number;
  sharpeRatio: number;
}

export interface BacktestConfig {
  strategyId: number;
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
  dataSource: string;
  assets: string[];
  frequency: 'daily' | 'hourly' | '5min';
}

export interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  trades: number;
  profitableTrades: number;
  averageReturn: number;
  volatility: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export interface WebSocketMessage {
  type: 'price_update' | 'trade_execution' | 'strategy_update' | 'alert';
  data: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}