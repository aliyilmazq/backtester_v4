export default function maxDrawdown(equityCurve) {
  let peak = equityCurve[0];
  let maxDrawdown = 0;
  for (let v of equityCurve) {
    if (v > peak) peak = v;
    const dd = (peak - v) / peak;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }
  return maxDrawdown;
} 