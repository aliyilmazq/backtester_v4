export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  trades: Trade[];
  equity: number[];
  dates: string[];
}

export interface Trade {
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  type: 'long' | 'short';
  profit: number;
  profitPercent: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: StrategyParameter[];
}

export interface StrategyParameter {
  name: string;
  type: 'number' | 'string' | 'boolean';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
}

export interface Symbol {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface BacktestConfig {
  symbol: Symbol;
  timeRange: TimeRange;
  strategy: Strategy;
  parameters: Record<string, any>;
  initialCapital: number;
  commission: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  yAxisID?: string;
}