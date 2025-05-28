export default function smaStrategy(closes, smaValues, includeShort) {
  const offset = closes.length - smaValues.length;
  const positions = Array(closes.length).fill(0);
  for (let i = offset; i < closes.length; i++) {
    if (includeShort) {
      positions[i] = closes[i] > smaValues[i - offset] ? 1 : closes[i] < smaValues[i - offset] ? -1 : 0;
    } else {
      positions[i] = closes[i] > smaValues[i - offset] ? 1 : 0;
    }
  }
  return positions;
} 