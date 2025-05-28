import sharpe from "./sharpe";

describe("sharpe", () => {
  it("örnek günlük getiriler için doğru hesaplar", () => {
    const daily = [0.01, 0.02, -0.01, 0.03, 0.01];
    const mean = daily.reduce((a, b) => a + b, 0) / daily.length;
    const std = Math.sqrt(daily.reduce((a, b) => a + (b - mean) ** 2, 0) / daily.length);
    const expected = std !== 0 ? (mean / std) * Math.sqrt(252) : null;
    expect(sharpe(daily)).toBeCloseTo(expected, 4);
  });
  it("boş diziye null döner", () => {
    expect(sharpe([])).toBeNull();
  });
}); 