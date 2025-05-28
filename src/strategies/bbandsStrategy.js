export default function bbandsStrategy(closes, bbandsValues, includeShort) {
  const offset = closes.length - bbandsValues.length;
  const positions = Array(closes.length).fill(0);
  for (let i = offset; i < closes.length; i++) {
    if (includeShort) {
      if (closes[i] < bbandsValues[i - offset].lower) positions[i] = 1;
      else if (closes[i] > bbandsValues[i - offset].upper) positions[i] = -1;
      else positions[i] = positions[i - 1] || 0;
    } else {
      if (closes[i] < bbandsValues[i - offset].lower) positions[i] = 1;
      else if (closes[i] > bbandsValues[i - offset].upper) positions[i] = 0;
      else positions[i] = positions[i - 1] || 0;
    }
  }
  return positions;
} 