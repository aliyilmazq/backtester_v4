export default function tradeStats(trades, data2) {
  const tradeCount = trades.length;
  const avgTradeDuration = tradeCount ? (trades.reduce((a, t) => a + t.duration, 0) / tradeCount) : null;
  const avgTradeReturn = tradeCount ? (trades.reduce((a, t) => a + t.return, 0) / tradeCount) : null;
  const daysInMarket = tradeCount ? trades.reduce((a, t) => a + t.duration, 0) : 0;
  const months = (data2.length > 1)
    ? ((new Date(data2[data2.length - 1].t) - new Date(data2[0].t)) / (1000 * 60 * 60 * 24 * 30.44))
    : 1;
  const avgTradesPerMonth = tradeCount && months > 0 ? (tradeCount / months) : null;
  return { tradeCount, avgTradeDuration, avgTradeReturn, avgTradesPerMonth, daysInMarket };
} 