export default function sortino(dailyReturns, annualizationFactor = 252) {
  if (!dailyReturns.length) return null;
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const downsideStd = Math.sqrt(
    dailyReturns.filter(r => r < 0).reduce((a, b) => a + (b - mean) ** 2, 0) / dailyReturns.length
  );
  return downsideStd !== 0 ? (mean / downsideStd) * Math.sqrt(annualizationFactor) : null;
} 