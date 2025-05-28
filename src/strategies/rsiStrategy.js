export default function rsiStrategy(rsiValues, includeShort) {
  const offset = rsiValues.length;
  const positions = Array(offset).fill(0);
  for (let i = 0; i < offset; i++) {
    if (includeShort) {
      if (rsiValues[i] < 30) positions[i] = 1;
      else if (rsiValues[i] > 70) positions[i] = -1;
      else positions[i] = positions[i - 1] || 0;
    } else {
      if (rsiValues[i] < 30) positions[i] = 1;
      else if (rsiValues[i] > 70) positions[i] = 0;
      else positions[i] = positions[i - 1] || 0;
    }
  }
  return positions;
} 