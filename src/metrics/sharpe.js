export default function sharpe(dailyReturns, annualizationFactor = 252) {
  if (!dailyReturns.length) return null;
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const std = Math.sqrt(dailyReturns.reduce((a, b) => a + (b - mean) ** 2, 0) / dailyReturns.length);
  return std !== 0 ? (mean / std) * Math.sqrt(annualizationFactor) : null;
} 