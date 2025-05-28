import sortino from "./sortino";

describe("sortino", () => {
  it("örnek günlük getiriler için doğru hesaplar", () => {
    const daily = [0.01, 0.02, -0.01, 0.03, 0.01];
    const mean = daily.reduce((a, b) => a + b, 0) / daily.length;
    const downside = Math.sqrt(daily.filter(r => r < 0).reduce((a, b) => a + (b - mean) ** 2, 0) / daily.length);
    const expected = downside !== 0 ? (mean / downside) * Math.sqrt(252) : null;
    expect(sortino(daily)).toBeCloseTo(expected, 4);
  });
  it("boş diziye null döner", () => {
    expect(sortino([])).toBeNull();
  });
}); 