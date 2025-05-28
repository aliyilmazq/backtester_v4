export default function macdStrategy(macdValues, includeShort) {
  const offset = macdValues.length;
  const positions = Array(offset).fill(0);
  for (let i = 0; i < offset; i++) {
    if (includeShort) {
      positions[i] = macdValues[i].MACD > macdValues[i].signal ? 1 : macdValues[i].MACD < macdValues[i].signal ? -1 : 0;
    } else {
      positions[i] = macdValues[i].MACD > macdValues[i].signal ? 1 : 0;
    }
  }
  return positions;
} 