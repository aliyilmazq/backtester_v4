import { format } from 'date-fns';

export class ReportGenerator {
  static generateBacktestReport(results, config) {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      },
      configuration: this.formatConfiguration(config),
      performance: this.formatPerformanceMetrics(results.metrics),
      riskMetrics: this.formatRiskMetrics(results.metrics),
      tradeAnalysis: this.formatTradeAnalysis(results.portfolio.trades),
      summary: this.generateSummary(results, config)
    };
    
    return report;
  }

  static formatConfiguration(config) {
    return {
      symbol: config.symbol,
      dateRange: {
        start: format(new Date(config.startDate), 'yyyy-MM-dd'),
        end: format(new Date(config.endDate), 'yyyy-MM-dd')
      },
      strategy: {
        type: config.strategy.type,
        parameters: config.strategy.params
      },
      portfolio: {
        initialCapital: this.formatCurrency(config.parameters.initialCapital),
        positionSize: `${(config.parameters.positionSize * 100).toFixed(0)}%`,
        commission: `${(config.parameters.commission * 100).toFixed(2)}%`
      }
    };
  }

  static formatPerformanceMetrics(metrics) {
    return {
      totalReturn: this.formatPercentage(metrics.totalReturn),
      annualizedReturn: this.formatPercentage(metrics.annualizedReturn),
      sharpeRatio: this.formatNumber(metrics.sharpeRatio, 2),
      sortinoRatio: this.formatNumber(metrics.sortinoRatio, 2),
      winRate: this.formatPercentage(metrics.tradeStats?.winRate || 0)
    };
  }

  static formatRiskMetrics(metrics) {
    return {
      maxDrawdown: this.formatPercentage(metrics.maxDrawdown),
      volatility: this.formatPercentage(metrics.volatility),
      downsideDeviation: this.formatPercentage(metrics.downsideDeviation),
      beta: this.formatNumber(metrics.beta, 2),
      alpha: this.formatPercentage(metrics.alpha)
    };
  }

  static formatTradeAnalysis(trades) {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        avgWin: 'N/A',
        avgLoss: 'N/A',
        avgDuration: 'N/A',
        bestTrade: 'N/A',
        worstTrade: 'N/A'
      };
    }

    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgWin: winningTrades.length > 0 
        ? this.formatCurrency(winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length)
        : 'N/A',
      avgLoss: losingTrades.length > 0
        ? this.formatCurrency(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length)
        : 'N/A',
      avgDuration: `${Math.round(trades.reduce((sum, t) => sum + t.duration, 0) / trades.length)} days`,
      bestTrade: this.formatCurrency(Math.max(...trades.map(t => t.pnl))),
      worstTrade: this.formatCurrency(Math.min(...trades.map(t => t.pnl)))
    };
  }

  static generateSummary(results, config) {
    const finalCapital = results.portfolio.equity[results.portfolio.equity.length - 1];
    const totalReturn = ((finalCapital - config.parameters.initialCapital) / config.parameters.initialCapital) * 100;
    const isPositive = totalReturn > 0;
    
    return {
      verdict: isPositive ? 'Profitable' : 'Loss',
      finalCapital: this.formatCurrency(finalCapital),
      totalReturn: this.formatPercentage(totalReturn / 100),
      recommendation: this.generateRecommendation(results.metrics, totalReturn)
    };
  }

  static generateRecommendation(metrics, totalReturn) {
    const recommendations = [];
    
    if (metrics.sharpeRatio < 0.5) {
      recommendations.push('Low risk-adjusted returns. Consider optimizing strategy parameters.');
    }
    
    if (metrics.maxDrawdown > 0.2) {
      recommendations.push('High maximum drawdown. Consider implementing risk management rules.');
    }
    
    if (metrics.tradeStats?.winRate < 0.4) {
      recommendations.push('Low win rate. Review entry and exit conditions.');
    }
    
    if (totalReturn < 0) {
      recommendations.push('Strategy resulted in losses. Consider different market conditions or parameters.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Strategy shows good performance. Consider forward testing with live data.');
    }
    
    return recommendations;
  }

  static exportToCSV(report) {
    const rows = [];
    
    // Header
    rows.push(['Backtest Report']);
    rows.push(['Generated', new Date().toISOString()]);
    rows.push([]);
    
    // Configuration
    rows.push(['Configuration']);
    rows.push(['Symbol', report.configuration.symbol]);
    rows.push(['Start Date', report.configuration.dateRange.start]);
    rows.push(['End Date', report.configuration.dateRange.end]);
    rows.push(['Strategy', report.configuration.strategy.type]);
    rows.push([]);
    
    // Performance
    rows.push(['Performance Metrics']);
    Object.entries(report.performance).forEach(([key, value]) => {
      rows.push([this.camelToTitle(key), value]);
    });
    rows.push([]);
    
    // Risk
    rows.push(['Risk Metrics']);
    Object.entries(report.riskMetrics).forEach(([key, value]) => {
      rows.push([this.camelToTitle(key), value]);
    });
    
    return rows.map(row => row.join(',')).join('\n');
  }

  static exportToJSON(report) {
    return JSON.stringify(report, null, 2);
  }

  // Utility functions
  static formatCurrency(value) {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  static formatPercentage(value) {
    if (typeof value !== 'number') return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  }

  static formatNumber(value, decimals = 2) {
    if (typeof value !== 'number') return 'N/A';
    return value.toFixed(decimals);
  }

  static camelToTitle(camelCase) {
    return camelCase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

export function downloadReport(report, format = 'json', filename = 'backtest-report') {
  let content;
  let mimeType;
  
  switch (format) {
    case 'csv':
      content = ReportGenerator.exportToCSV(report);
      mimeType = 'text/csv';
      break;
    case 'json':
    default:
      content = ReportGenerator.exportToJSON(report);
      mimeType = 'application/json';
      break;
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${format(new Date(), 'yyyyMMdd-HHmmss')}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}