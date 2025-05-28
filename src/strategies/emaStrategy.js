export default function emaStrategy(closes, emaValues, includeShort) {
  const offset = closes.length - emaValues.length;
  const positions = Array(closes.length).fill(0);
  for (let i = offset; i < closes.length; i++) {
    if (includeShort) {
      positions[i] = closes[i] > emaValues[i - offset] ? 1 : closes[i] < emaValues[i - offset] ? -1 : 0;
    } else {
      positions[i] = closes[i] > emaValues[i - offset] ? 1 : 0;
    }
  }
  return positions;
} 